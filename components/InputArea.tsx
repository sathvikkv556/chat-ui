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
    <div className="p-4 border-t bg-white dark:bg-gray-900 flex items-center gap-2 dark:border-gray-700">

      <input
        className="flex-1 px-4 py-2 rounded-full border 
        bg-white text-black 
        dark:bg-gray-800 dark:text-white dark:border-gray-600
        focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm 
        hover:bg-blue-600 disabled:bg-gray-300 
        dark:disabled:bg-gray-700
        transition"
      >
        Send
      </button>
    </div>
  );
}