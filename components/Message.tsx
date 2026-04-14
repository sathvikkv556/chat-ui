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
        className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm
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