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
  const sendMessage = async (text: string) => {
    if (!chatId) return;

    const newMsg: MessageType = {
      id: Date.now().toString(),
      content: text,
      role: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setLoading(true);

    await fetch("/api/chat/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...newMsg, chatId }),
    });

    window.dispatchEvent(new Event("chat-updated"));

    try {
      const res = await fetch("/api/chat-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      const botMsg: MessageType = {
        id: Date.now().toString(),
        content: data.reply,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMsg]);

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

          {/* LEFT SIDE (UPDATED) */}
          <div className="flex items-center gap-3">

            {/* ☰ MOBILE MENU */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
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

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {/* DARK MODE */}
            <button
              onClick={() => setDark(!dark)}
              className="relative px-4 py-1.5 text-xs font-semibold rounded-full
              bg-white/60 dark:bg-gray-800/60
              backdrop-blur-md
              border border-white/30 dark:border-gray-700
              text-gray-800 dark:text-gray-200
              shadow-[0_4px_20px_rgba(0,0,0,0.1)]
              hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)]
              hover:scale-[1.03]
              active:scale-[0.97]
              transition-all duration-300 ease-out"
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {/* CLEAR */}
            <button
              onClick={clearChat}
              className="relative px-4 py-1.5 text-xs font-semibold rounded-full
              bg-gradient-to-r from-red-500/90 to-pink-500/90
              text-white
              shadow-[0_4px_20px_rgba(255,0,0,0.25)]
              hover:shadow-[0_6px_30px_rgba(255,0,0,0.35)]
              hover:scale-[1.05]
              active:scale-[0.95]
              transition-all duration-300 ease-out"
            >
              🗑
            </button>

          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50 dark:bg-gray-800">
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