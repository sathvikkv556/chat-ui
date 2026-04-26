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
      } animate-fade-in`}
    >
      <div
        className={`relative group max-w-[85%] sm:max-w-[75%] transition-all duration-300`}
      >
        <div
          className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
          ${
            isUser
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-tr-none shadow-indigo-500/10"
              : "bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-700/50 shadow-slate-200/50 dark:shadow-none"
          }`}
        >
          {/* TEXT */}
          <p className="whitespace-pre-wrap font-medium">
            {msg.content}
          </p>

          {/* 🌐 SOURCES */}
          {msg.sources && msg.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sources</p>
              <div className="flex flex-wrap gap-2">
                {msg.sources.map((s, i) => (
                  <a
                    key={s.link || `src-${i}`}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-blue-600 dark:text-blue-400 hover:border-blue-400 transition-colors"
                  >
                    <span className="text-[10px]">🔗</span> {s.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 🔥 ACTION ROW */}
        <div
          className={`flex items-center gap-3 mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
            isUser ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            {msg.timestamp}
          </span>
          
          <div className="flex gap-1">
            <button
              onClick={copyText}
              title="Copy message"
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            </button>

            {!isUser && onRegenerate && (
              <button
                onClick={() => onRegenerate(msg.content)}
                title="Regenerate response"
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}