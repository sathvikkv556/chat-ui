"use client";

import { useEffect, useState } from "react";

export default function Sidebar({ onSelect }: any) {
  const [chats, setChats] = useState<any[]>([]);
  const [active, setActive] = useState<string | null>(null);

  const fetchChats = async () => {
    const res = await fetch("/api/chat/all");
    const data = await res.json();
    setChats(data);
  };

  const createChat = async () => {
    const res = await fetch("/api/chat/create", {
      method: "POST",
      body: JSON.stringify({ title: "New Chat" }),
    });

    const chat = await res.json();
    fetchChats();
    setActive(chat._id);
    onSelect(chat._id);
  };

  useEffect(() => {
    fetchChats();

    const handler = () => fetchChats();
    window.addEventListener("chat-updated", handler);

    return () => window.removeEventListener("chat-updated", handler);
  }, []);

  return (
    <div
      className="
      w-[85vw] md:w-72 h-screen flex flex-col
      bg-white/70 dark:bg-gray-900/80
      backdrop-blur-xl
      border-r border-gray-200 dark:border-gray-700
      text-gray-800 dark:text-white
    "
    >
      {/* HEADER */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-semibold tracking-tight">
          💬 Chats
        </h1>
      </div>

      {/* NEW CHAT BUTTON */}
      <div className="p-4">
        <button
          onClick={createChat}
          className="
          w-full py-2 text-sm font-medium rounded-xl
          bg-gradient-to-r from-blue-500 to-indigo-500 text-white
          shadow-[0_4px_20px_rgba(59,130,246,0.3)]
          hover:scale-[1.03] hover:shadow-[0_6px_25px_rgba(59,130,246,0.4)]
          active:scale-[0.97]
          transition-all duration-300
          "
        >
          + New Chat
        </button>
      </div>

      {/* CHAT LIST */}
      <div className="flex-1 overflow-y-auto px-3 space-y-2">

        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`group flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-sm
              transition-all duration-200
              ${
                active === chat._id
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              }
            `}
            onClick={() => {
              setActive(chat._id);
              onSelect(chat._id);
            }}
          >
            {/* TITLE */}
            <div className="truncate">
              {chat.title || "New Chat"}
            </div>

            {/* DELETE */}
            <button
              onClick={async (e) => {
                e.stopPropagation();

                await fetch("/api/chat/delete", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ chatId: chat._id }),
                });

                fetchChats();

                if (active === chat._id) {
                  setActive(null);
                  onSelect(null);
                }
              }}
              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-xs transition"
            >
              ✖
            </button>
          </div>
        ))}

      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
        Metawurks AI ⚡
      </div>
    </div>
  );
}