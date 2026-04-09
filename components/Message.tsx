import { MessageType } from "@/types";

export default function Message({ msg }: { msg: MessageType }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-xl max-w-[70%] text-sm shadow-sm ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-white border text-gray-800 rounded-bl-none dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
        }`}
      >
        <p>{msg.content}</p>
        <span className="text-[10px] opacity-60 block mt-1 dark:text-gray-400">
          {msg.timestamp}
        </span>
      </div>
    </div>
  );
}