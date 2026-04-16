"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Sidebar({ onSelect }: any) {
  const { data: session } = useSession();

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
      body: JSON.stringify({ title: "New Chat" }),
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

  return (
    <div
      className="w-72 h-screen 
      bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      text-gray-900 dark:text-white 
      flex flex-col border-r border-gray-200 dark:border-gray-700"
    >
      {/* HEADER */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-semibold">💬 Chats</h1>
      </div>

      {/* NEW CHAT */}
      <div className="p-4">
        <button
          onClick={createChat}
          className="w-full bg-blue-500 hover:bg-blue-600 transition rounded-lg py-2 text-sm font-medium shadow-md"
        >
          + New Chat
        </button>
      </div>

      {/* CHAT LIST */}
      <div className="flex-1 overflow-y-auto px-3 space-y-2">
        {chats.map((chat) => {
          const isEditing = editingId === chat._id;

          return (
            <div
              key={chat._id}
              className={`relative group flex items-center justify-between p-3 rounded-lg cursor-pointer transition text-sm
                ${
                  active === chat._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
              onClick={() => {
                setActive(chat._id);
                onSelect(chat._id);
              }}
            >
              {/* TITLE / INPUT */}
              {isEditing ? (
                <input
                  autoFocus
                  defaultValue={chat.title}
                  className="bg-transparent outline-none text-sm w-full"
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
                <div className="truncate flex-1">
                  {chat.title || "New Chat"}
                </div>
              )}

              {/* THREE DOTS */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId(
                    menuOpenId === chat._id ? null : chat._id
                  );
                }}
                className="ml-2 text-lg opacity-0 group-hover:opacity-100"
              >
                ⋯
              </button>

              {/* DROPDOWN */}
              {menuOpenId === chat._id && (
                <div
                  ref={menuRef}
                  className="absolute right-2 top-10 z-50 
                  bg-white dark:bg-gray-800 
                  border border-gray-200 dark:border-gray-700 
                  rounded-xl shadow-xl overflow-hidden 
                  text-sm w-36 py-1"
                >
                  {/* RENAME */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(chat._id);
                      setMenuOpenId(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    ✏️ Rename
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(chat._id);
                      setMenuOpenId(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 
                    text-red-500 hover:bg-red-500 hover:text-white transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* USER PROFILE */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 relative">
        <div
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-3 cursor-pointer 
          bg-gray-100 dark:bg-gray-800 
          hover:bg-gray-200 dark:hover:bg-gray-700 
          rounded-lg px-3 py-2 transition"
        >
          {/* AVATAR */}
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white">
            {session?.user?.name?.[0]?.toUpperCase() || "U"}
          </div>

          {/* USERNAME */}
          <div className="text-sm truncate">
            {session?.user?.name || "User"}
          </div>
        </div>

        {/* DROPDOWN */}
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute bottom-14 left-4 right-4 
            bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700 
            rounded-lg shadow-lg overflow-hidden"
          >
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full text-center px-4 py-2 text-sm 
              hover:bg-red-500 hover:text-white transition"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}