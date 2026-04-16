"use client";

import { MessageType } from "@/types";

export default function Message({
  msg,
  onRegenerate,
}: {
  msg: MessageType;
  onRegenerate?: (text: string) => void;
}) {
  const isUser = msg.role === "user";

  const copyText = () => {
    navigator.clipboard.writeText(msg.content);
  };

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } animate-fadeIn`}
    >
      <div
        className={`px-4 py-3 rounded-2xl max-w-[75%] text-sm
        backdrop-blur-md transition-all duration-300
        ${
          isUser
            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-[0_4px_20px_rgba(59,130,246,0.4)] rounded-br-none"
            : "bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-bl-none"
        }`}
      >
        {/* TEXT */}
        <p className="leading-relaxed whitespace-pre-wrap">
          {msg.content}
        </p>

        {/* SOURCES */}
        {msg.sources?.length ? (
          <div className="mt-2 text-xs space-y-1">
            {msg.sources.map((s, i) => (
              <a
                key={i}
                href={s.link}
                target="_blank"
                className="block text-blue-500 hover:underline"
              >
                🔗 {s.title}
              </a>
            ))}
          </div>
        ) : null}

        {/* 🔥 ACTION ROW (BOTTOM LIKE CHATGPT) */}
        <div
          className={`flex items-center justify-between mt-2 ${
            isUser ? "text-white/70" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {/* TIME */}
          <span className="text-[10px]">
            {msg.timestamp}
          </span>

          {/* BUTTONS */}
          <div className="flex gap-2 text-xs">

            {/* COPY */}
            <button
              onClick={copyText}
              className="px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition"
            >
              📋
            </button>

            {/* REGENERATE */}
            {!isUser && onRegenerate && (
              <button
                onClick={() => onRegenerate(msg.content)}
                className="px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition"
              >
                🔄
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}