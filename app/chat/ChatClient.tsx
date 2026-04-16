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
    <div className="flex h-screen relative">

      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? "block" : "hidden"
        } md:block absolute md:relative z-20`}
      >
        <Sidebar onSelect={setChatId} />
      </div>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Chat */}
      <div className="flex-1">
        <ChatWindow
          chatId={chatId}
          toggleSidebar={toggleSidebar} // ✅ FIX
        />
      </div>
    </div>
  );
}