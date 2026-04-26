"use client";

import ChatWindow from "@/components/ChatWindow";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function ChatClient() {
  const [chatId, setChatId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  return (
    <div className="flex h-screen relative bg-white dark:bg-[#0d1117] overflow-hidden font-sans">

      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? "translate-x-0" : "-translate-x-full md:-translate-x-full"
        } fixed md:relative z-30 transition-transform duration-300 ease-in-out h-full w-[280px] shrink-0`}
      >
        <Sidebar onSelect={(id: string) => { setChatId(id); if(window.innerWidth < 768) toggleSidebar(); }} />
      </div>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Chat */}
      <div className="flex-1 h-full overflow-hidden w-full relative">
        <ChatWindow
          chatId={chatId}
          toggleSidebar={toggleSidebar}
        />
      </div>
    </div>
  );
}