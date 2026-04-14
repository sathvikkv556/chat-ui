"use client";

import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import InputArea from "./InputArea";
import TypingDots from "./TypingDots";
import { MessageType } from "@/types";

export default function ChatWindow({
  chatId,
  toggleSidebar,
}: {
  chatId: string | null;
  toggleSidebar: () => void;
}) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const clearChat = () => setMessages([]);

  // LOAD MESSAGES
  useEffect(() => {
    if (!chatId) return;

    fetch(`/api/chat/${chatId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, [chatId]);

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // DARK MODE
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  // SEND MESSAGE
 const sendMessage = async (text: string, fileText?: string) => {
    if (!chatId) return;

    // ✅ USER MESSAGE
    const userMsg: MessageType = {
      id: Date.now().toString(),
      content: text,
      role: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // SAVE USER MESSAGE
    await fetch("/api/chat/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userMsg, chatId }),
    });

    window.dispatchEvent(new Event("chat-updated"));

    try {
      // 🤖 AI CALL
      const res = await fetch("/api/chat-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
  message: text,
  useSearch,
  fileText,
}),
      });

      const data = await res.json();

      // ✅ BOT MESSAGE (WITH SOURCES)
      const botMsg: MessageType = {
        id: Date.now().toString(),
        content: data.reply,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString(),
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, botMsg]);

      // SAVE BOT MESSAGE
      await fetch("/api/chat/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...botMsg, chatId }),
      });

    } catch {
      const errorMsg: MessageType = {
        id: Date.now().toString(),
        content: "⚠️ Error getting response",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    }

    setLoading(false);
  };

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 dark:from-gray-900 dark:to-black">
      
      {/* MAIN CONTAINER */}
      <div className="w-full max-w-3xl h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="px-6 py-4 border-b bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl flex items-center justify-between dark:border-gray-700">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              ☰
            </button>

            <div>
              <h1 className="text-lg font-semibold dark:text-white">
                🤖 Metawurks AI Chatbot
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Smart assistant for your queries
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">

            {/* 🌐 SEARCH TOGGLE */}
            <button
              onClick={() => setUseSearch(!useSearch)}
              className={`px-3 py-1 text-xs rounded-full border transition ${
                useSearch
                  ? "bg-green-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              }`}
            >
              🌐 {useSearch ? "ON" : "OFF"}
            </button>

            {/* DARK */}
            <button
              onClick={() => setDark(!dark)}
              className="px-3 py-1 text-xs rounded-full border bg-white/60 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {/* CLEAR */}
            <button
              onClick={clearChat}
              className="px-3 py-1 text-xs rounded-full bg-red-500 text-white"
            >
              🗑
            </button>

          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto custom-scroll px-6 py-4 space-y-4 bg-gray-50 dark:bg-gray-800">
          {!chatId && (
            <div className="text-center text-gray-400 text-sm mt-10">
              Select or create a chat 👈
            </div>
          )}

          {messages.map((msg: any, index) => (
            <Message key={msg._id || msg.id || index} msg={msg} />
          ))}

          {loading && <TypingDots />}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        {chatId && <InputArea onSend={sendMessage} />}
      </div>
    </div>
  );
}