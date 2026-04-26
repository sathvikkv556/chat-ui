"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Sidebar({ onSelect }: any) {
  const { data: session } = useSession(); // ✅ FIXED
  const [chats, setChats] = useState<any[]>([]);
  const [active, setActive] = useState<string | null>(null);

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  // 🔄 FETCH CHATS
  const fetchChats = async () => {
    const res = await fetch("/api/chat/all");
    const data = await res.json();
    setChats(data);
  };

  // ➕ CREATE CHAT
  const createChat = async () => {
    const res = await fetch("/api/chat/create", {
      method: "POST",
      body: JSON.stringify({ title: "New Conversation" }),
    });

    const chat = await res.json();
    fetchChats();
    setActive(chat._id);
    onSelect(chat._id);
  };

  // ✏️ RENAME
  const handleRename = async (chatId: string, title: string) => {
    if (!title.trim()) return;

    await fetch("/api/chat/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId, title }),
    });

    setEditingId(null);
    fetchChats();
  };

  // 🗑 DELETE
  const handleDelete = async (chatId: string) => {
    await fetch("/api/chat/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId }),
    });

    fetchChats();

    if (active === chatId) {
      setActive(null);
      onSelect(null);
    }
  };

  // 🔥 CLICK OUTSIDE HANDLER
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchChats();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = chats.filter((chat) =>
    (chat.title || "New Chat").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="w-72 h-screen 
      bg-[#fcfcfd] dark:bg-[#0d1117]
      text-slate-900 dark:text-slate-100
      flex flex-col border-r border-slate-200 dark:border-slate-800 transition-colors duration-300"
    >
      {/* HEADER */}
      <div className="p-6 flex items-center justify-between pb-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Metawurks
        </h1>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
      </div>

      {/* SEARCH */}
      <div className="px-4 mb-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-xl py-2 pl-8 pr-4 text-xs focus:ring-1 focus:ring-blue-500/30 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* NEW CHAT */}
      <div className="px-4 mb-4">
        <button
          onClick={createChat}
          className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 
          hover:opacity-90 transition-all duration-300 rounded-xl py-2.5 text-sm font-semibold shadow-lg active:scale-[0.98]"
        >
          + New Chat
        </button>
      </div>

      {/* CHAT LIST */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1.5 custom-scroll">
        <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-2">
          {searchTerm ? "Search Results" : "Recent Conversations"}
        </div>
        {filteredChats.map((chat) => {
          const isEditing = editingId === chat._id;
          const isActive = active === chat._id;

          return (
            <div
              key={chat._id}
              className={`relative group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200
                ${
                  isActive
                    ? "bg-slate-200/50 dark:bg-slate-800/60 ring-1 ring-slate-300 dark:ring-slate-700"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800/30"
                }
              `}
              onClick={() => {
                setActive(chat._id);
                onSelect(chat._id);
              }}
            >
              <div className="flex items-center gap-3 truncate">
                 <span className="text-lg opacity-60">
                   {isActive ? "💬" : "🗨️"}
                 </span>
                
                {/* TITLE / INPUT */}
                {isEditing ? (
                  <input
                    autoFocus
                    defaultValue={chat.title}
                    className="bg-transparent outline-none text-sm w-full font-medium"
                    onBlur={(e) =>
                      handleRename(chat._id, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRename(
                          chat._id,
                          (e.target as HTMLInputElement).value
                        );
                      }
                    }}
                  />
                ) : (
                  <div className={`truncate text-sm font-medium ${isActive ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                    {chat.title || "New Chat"}
                  </div>
                )}
              </div>

              {/* THREE DOTS */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId(
                    menuOpenId === chat._id ? null : chat._id
                  );
                }}
                className="ml-2 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-300/40 dark:hover:bg-slate-700/50 opacity-0 group-hover:opacity-100 transition-all"
              >
                ⋯
              </button>

              {/* DROPDOWN */}
              {menuOpenId === chat._id && (
                <div
                  ref={menuRef}
                  className="absolute right-2 top-10 z-50 
                  bg-white dark:bg-[#1a1f26] 
                  border border-slate-200 dark:border-slate-800 
                  rounded-xl shadow-2xl overflow-hidden 
                  text-sm w-40 py-1.5 animate-fade-in"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(chat._id);
                      setMenuOpenId(null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 
                    hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <span>✏️</span> Rename
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(chat._id);
                      setMenuOpenId(null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 
                    text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
                  >
                    <span>🗑</span> Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* USER PROFILE */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-3 cursor-pointer 
          hover:bg-slate-100 dark:hover:bg-slate-800/40 
          rounded-xl px-3 py-2.5 transition-all duration-200 relative"
        >
          {/* AVATAR */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
            {session?.user?.name?.[0]?.toUpperCase() || "U"}
          </div>

          {/* USERNAME */}
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-bold truncate">
              {session?.user?.name|| "User"}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-tight">
              Premium Account
            </div>
          </div>
          
          <div className="text-slate-400">
            {showMenu ? "↓" : "↑"}
          </div>

          {/* DROPDOWN */}
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute bottom-full left-0 right-0 mb-2
              bg-white dark:bg-[#1a1f26] 
              border border-slate-200 dark:border-slate-800 
              rounded-xl shadow-2xl overflow-hidden animate-fade-in"
            >
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold
                text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
              >
                Logout Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}