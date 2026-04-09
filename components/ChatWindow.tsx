"use client";

import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import InputArea from "./InputArea";
import TypingDots from "./TypingDots";
import { MessageType } from "@/types";

export default function ChatWindow() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const playSound = () => {
  const audio = new Audio("/notification.mp3");
  audio.play();
};

  const clearChat = () => setMessages([]);

  const sendMessage = async (text: string) => {
    const newMsg: MessageType = {
      id: Date.now().toString(),
      content: text,
      role: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      const botMsg: MessageType = {
        id: Date.now().toString(),
        content: data.reply || "No response",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "⚠️ Error getting response",
          role: "assistant",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
  if (dark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [dark]);

  return (
  
  <div className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 dark:from-gray-900 dark:to-black">
      {/* Main Chat Container */}
     <div className="w-full max-w-3xl h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
       <div className="px-6 py-4 border-b bg-white dark:bg-gray-900 flex items-center justify-between dark:border-gray-700">

  {/* LEFT SIDE */}
  <div>
    <h1 className="text-lg font-semibold dark:text-white">

      🤖 Metawurks AI Chatbot
    </h1>
    <p className="text-xs text-gray-500 dark:text-gray-400">
      Smart assistant for your queries
    </p>
  </div>

  {/* RIGHT SIDE (buttons) */}
 <div className="flex items-center gap-2">

  {/* Dark Toggle */}
  <button
    onClick={() => setDark(!dark)}
    className="flex items-center gap-1 text-xs border px-3 py-1 rounded-full 
    bg-white/70 hover:bg-gray-100 
    dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white 
    transition"
  >
    {dark ? "☀️ Light" : "🌙 Dark"}
  </button>

  {/* Clear Chat */}
  <button
    onClick={clearChat}
    className="flex items-center gap-1 text-xs border px-3 py-1 rounded-full 
    bg-red-50 text-red-600 hover:bg-red-100 
    dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-800 
    transition"
  >
    🗑 Clear
  </button>

</div>

</div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50 dark:bg-gray-800">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 text-sm mt-10">
              Start a conversation 👇
            </div>
          )}

          {messages.map((msg) => (
            <Message key={msg.id} msg={msg} />
          ))}

          {loading && <TypingDots />}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <InputArea onSend={sendMessage} />
      </div>
    </div>
    
  );
}