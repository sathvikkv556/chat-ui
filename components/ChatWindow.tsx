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

  // ✅ LOAD MESSAGES
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    fetch(`/api/chat/${chatId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [chatId]);

  // ✅ AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ DARK MODE
  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  const clearChat = async () => {
    if (!chatId) return;

    // Optimistic UI update
    setMessages([]);

    try {
      await fetch("/api/chat/delete-messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId }),
      });
    } catch (err) {
      console.error("Failed to clear messages:", err);
    }
  };

  // 🚀 SEND MESSAGE (FINAL FIXED)
  const sendMessage = async (text: string) => {
    if (!chatId || !text.trim()) return;

    // Check if it's the first message to rename the thread
    const isFirstMessage = messages.length === 0;

    const userMsg: MessageType = {
      id: crypto.randomUUID(),
      content: text,
      role: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    // ✅ SAVE USER
    await fetch("/api/chat/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...userMsg, chatId }),
    });

    // Auto-rename chat title if it's the first message
    if (isFirstMessage) {
      const newTitle = text.length > 30 ? text.substring(0, 30) + "..." : text;
      fetch("/api/chat/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, title: newTitle }),
      }).catch(err => console.error("Failed to rename chat:", err));
    }

    setLoading(true);

    try {
      const res = await fetch("/api/chat-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify({
          message: text,
          useSearch,
        }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let fullText = "";
      let sources: any[] = [];

      const botId = crypto.randomUUID();

      const botMsg: MessageType = {
        id: botId,
        content: "",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        if (chunk.includes("__SOURCES__")) {
          const parts = chunk.split("__SOURCES__");
          fullText += parts[0];
          try { sources = JSON.parse(parts[1] || "[]"); } catch { sources = []; }
          continue;
        }

        fullText += chunk;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId
              ? { ...m, content: fullText }
              : m
          )
        );
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId
            ? { ...m, content: fullText, sources }
            : m
        )
      );

      await fetch("/api/chat/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          content: fullText,
          role: "assistant",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }),
      });
    } catch (err) {
      console.log("CHAT ERROR:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: "⚠️ Error generating response",
          role: "assistant",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-[#0d1117] transition-colors duration-300">
      
      {/* HEADER - Floating Glass Effect */}
      <header className="sticky top-0 z-10 w-full px-3 md:px-4 py-3 flex items-center justify-between glass border-b-0 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <span className="text-xl">≡</span>
          </button>
          
          <div className="truncate">
            <h1 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] shrink-0"></span>
              <span className="truncate">Groq Llama 3.1</span>
            </h1>
            <p className="text-[9px] md:text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider truncate">
              {loading ? "AI is processing..." : "Ready for instructions"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-3">
          <button
            onClick={() => setUseSearch(!useSearch)}
            className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 text-[10px] md:text-[11px] font-bold rounded-lg border transition-all duration-300 ${
              useSearch
                ? "bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                : "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
            }`}
          >
            <span className={`${useSearch ? "animate-pulse" : ""} text-xs md:text-sm`}>🌐</span>
            <span className="hidden sm:inline">WEB SEARCH</span> {useSearch ? "ON" : "OFF"}
          </button>

          <button
            onClick={() => setDark(!dark)}
            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          <button
            onClick={clearChat}
            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/50 dark:border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shrink-0"
          >
            🗑
          </button>
        </div>
      </header>

      {/* CHAT AREA */}
      <main className="flex-1 overflow-y-auto custom-scroll flex justify-center">
        <div className="w-full max-w-3xl px-4 py-8 space-y-8">
          {!chatId ? (
            <div className="h-[70vh] flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl shadow-2xl mb-6">
                🤖
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">How can I help you today?</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm">Select a conversation or start a new one to experience premium AI assistance.</p>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <Message
                  key={msg.id || `msg-${index}`}
                  msg={msg}
                />
              ))}
              {loading && (
                <div className="flex justify-start animate-fade-in">
                   <div className="px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                     <TypingDots />
                   </div>
                </div>
              )}
              <div ref={bottomRef} className="h-4" />
            </>
          )}
        </div>
      </main>

      {/* INPUT AREA */}
      <footer className="w-full flex justify-center pb-8 pt-2 px-4 bg-transparent pointer-events-none">
        <div className="w-full max-w-3xl pointer-events-auto animate-fade-in">
           {chatId && <InputArea onSend={sendMessage} />}
        </div>
      </footer>
    </div>
  );
}