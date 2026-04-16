"use client";

import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import InputArea from "./InputArea";
import TypingDots from "./TypingDots";
import { MessageType } from "@/types";
import { useSession } from "next-auth/react";
export default function ChatWindow({
  chatId,
  toggleSidebar,
}: {
  chatId: string | null;
  toggleSidebar: () => void;
}) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const clearChat = () => setMessages([]);
  const generateId = () =>
  Math.random().toString(36).substring(2) + Date.now();
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
  const regenerateResponse = async () => {
  const lastUserMsg = [...messages]
    .reverse()
    .find((m) => m.role === "user");

  if (!lastUserMsg) return;

  sendMessage(lastUserMsg.content);
};
  // SEND MESSAGE
 const sendMessage = async (text: string) => {
  if (!chatId) return;

  const userMsg: MessageType = {
    id: crypto.randomUUID(),
    content: text,
    role: "user",
    timestamp: new Date().toLocaleTimeString(),
  };

  setMessages((prev) => [...prev, userMsg]);

  await fetch("/api/chat/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...userMsg, chatId }),
  });

  setLoading(true);

  try {
    const res = await fetch("/api/chat-ai", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ message: text }),
});

if (!res.body) throw new Error("No response body");

const reader = res.body.getReader();
const decoder = new TextDecoder();

let fullText = "";
let sources: any[] = [];

const botMsg: MessageType = {
  id: Date.now().toString(),
  content: "",
  role: "assistant",
  timestamp: new Date().toLocaleTimeString(),
};

setMessages((prev) => [...prev, botMsg]);

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);

  // ✅ detect sources safely
  if (chunk.includes("__SOURCES__")) {
    const parts = chunk.split("__SOURCES__");

    fullText += parts[0];

    try {
      sources = JSON.parse(parts[1] || "[]");
    } catch {
      sources = [];
    }

    continue;
  }

  fullText += chunk;

  setMessages((prev) =>
    prev.map((m) =>
      m.id === botMsg.id
        ? { ...m, content: fullText }
        : m
    )
  );
}

// ✅ final update
setMessages((prev) =>
  prev.map((m) =>
    m.id === botMsg.id
      ? { ...m, content: fullText, sources }
      : m
  )
);

  } catch {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        content: "⚠️ Error",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }

  setLoading(false);
};
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 dark:from-gray-900 dark:to-black">
      
      {/* MAIN CONTAINER */}
      <div className="w-full max-w-3xl h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex flex-col overflow-hidden">

          <button
  onClick={toggleSidebar}
  className="md:hidden mr-2 text-lg"
>
  ☰
</button>
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

          {messages.map((msg) => (
  <Message
    key={msg.id}
    msg={msg}
    onRegenerate={regenerateResponse}
  />
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