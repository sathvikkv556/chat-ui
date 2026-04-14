"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  const [chatId, setChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* 🔥 SIDEBAR */}
      <div
        className={`
          fixed md:static z-50
          top-0 left-0 h-full
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar
          onSelect={(id: string) => {
            setChatId(id);
            setSidebarOpen(false); // close on mobile
          }}
        />
      </div>

      {/* OVERLAY (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🔥 MAIN CHAT */}
      <div className="flex-1 relative">
        <ChatWindow chatId={chatId} toggleSidebar={() => setSidebarOpen(true)} />
      </div>
    </div>
  );
}