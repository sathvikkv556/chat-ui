"use client";

import { useState } from "react";

export default function InputArea({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="p-4 border-t bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl flex items-center gap-3 dark:border-gray-700">

      {/* INPUT */}
      <input
        className="flex-1 px-5 py-2.5 rounded-full border
        bg-white/70 dark:bg-gray-800/70
        backdrop-blur-md
        text-gray-800 dark:text-white
        border-gray-200 dark:border-gray-700
        shadow-[0_4px_20px_rgba(0,0,0,0.08)]
        focus:outline-none focus:ring-2 focus:ring-blue-400
        focus:shadow-[0_6px_25px_rgba(59,130,246,0.25)]
        transition-all duration-300 text-sm placeholder:text-gray-400"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      {/* SEND BUTTON */}
      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className="px-5 py-2.5 rounded-full text-sm font-semibold
        bg-gradient-to-r from-blue-700 to-indigo-700
        text-white
        shadow-[0_4px_20px_rgba(59,130,246,0.35)]
        hover:shadow-[0_6px_30px_rgba(59,130,246,0.45)]
        hover:scale-[1.05]
        active:scale-[0.95]
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-300"
      >
        ➤
      </button>

    </div>
  );
}