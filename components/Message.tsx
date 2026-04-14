import { MessageType } from "@/types";

export default function Message({ msg }: { msg: MessageType }) {
  const isUser = msg.role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } animate-fadeIn`}
    >
      <div
        className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm
        backdrop-blur-md border
        transition-all duration-300
        ${
          isUser
            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent shadow-[0_4px_20px_rgba(59,130,246,0.4)] rounded-br-none"
            : "bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-bl-none"
        }`}
      >
        {/* MESSAGE TEXT */}
        <p className="leading-relaxed whitespace-pre-wrap">
          {msg.content}
        </p>

        {/* 🔗 SOURCES (IMPROVED UI) */}
        {(msg.sources ?? []).length > 0 && (
          <div className="mt-3 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-2">
            
            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Sources
            </p>

            {msg.sources?.map((s: any, i: number) => (
              <a
                key={i}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs px-2 py-1 rounded-md 
                bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600
                transition-all duration-200 truncate"
              >
                <span>🔗</span>
                <span className="truncate">{s.title}</span>
              </a>
            ))}
          </div>
        )}

        {/* TIMESTAMP */}
        <span
          className={`text-[10px] mt-1 block ${
            isUser
              ? "text-white/70"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {msg.timestamp}
        </span>
      </div>
    </div>
  );
}