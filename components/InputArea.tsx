"use client";

import { useState } from "react";

export default function InputArea({
  onSend,
}: {
  onSend: (text: string, fileText?: string) => void;
}) {
  const [text, setText] = useState("");
  const [fileText, setFileText] = useState("");
  const [fileName, setFileName] = useState("");

  const handleSend = () => {
    if (!text.trim() && !fileText) return;

    onSend(text, fileText);

    setText("");
    setFileText("");
    setFileName("");
  };

  // 📄 HANDLE FILE UPLOAD
  const handleFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setFileText(data.text);
    setFileName(file.name);
  };

  return (
    <div className="p-4 border-t bg-white dark:bg-gray-900 flex flex-col gap-2 dark:border-gray-700">

      {/* FILE PREVIEW */}
      {fileName && (
        <div className="text-xs text-blue-500">
          📄 {fileName}
        </div>
      )}

      <div className="flex items-center gap-2">

        {/* FILE BUTTON */}
        <label className="cursor-pointer px-3 py-2 rounded-full border bg-gray-100 dark:bg-gray-800 text-sm">
          📎
          <input
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>

        {/* INPUT */}
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

        {/* SEND */}
        <button
          onClick={handleSend}
          disabled={!text.trim() && !fileText}
          className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm 
          hover:bg-blue-600 
          disabled:bg-gray-300 dark:disabled:bg-gray-700
          transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}