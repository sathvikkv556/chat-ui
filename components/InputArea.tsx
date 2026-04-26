"use client";

import { useState, useRef, useEffect } from "react";

export default function InputArea({
  onSend,
}: {
  onSend: (text: string, fileText?: string) => void;
}) {
  const [text, setText] = useState("");
  const [fileText, setFileText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!text.trim() && !fileText) return;
    onSend(text, fileText);
    setText("");
    setFileText("");
    setFileName("");
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  return (
    <div className={`relative transition-all duration-500 rounded-[24px] md:rounded-[28px] p-1 md:p-1.5
      ${isFocused 
        ? "bg-slate-200/30 dark:bg-slate-800/60 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/10" 
        : "bg-slate-100/40 dark:bg-slate-800/20"
      }`}
    >
      {/* FILE PREVIEW */}
      {fileName && (
        <div className="absolute -top-12 left-2 animate-fade-in z-10">
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500 text-white text-[10px] md:text-[11px] font-bold shadow-lg">
             <span className="text-xs">📄</span>
             <span className="max-w-[120px] md:max-w-[150px] truncate">{fileName}</span>
             <button 
               onClick={() => {setFileName(""); setFileText("");}}
               className="ml-1 hover:text-red-200 transition-colors"
             >
               ✕
             </button>
           </div>
        </div>
      )}

      <div className="flex items-end gap-1 md:gap-2 pl-2 md:pl-3">
        {/* FILE BUTTON */}
        <label className="cursor-pointer p-2 md:p-2.5 mb-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 dark:text-slate-400 md:w-5 md:h-5"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
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
        <textarea
          ref={textareaRef}
          rows={1}
          className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 py-2.5 md:py-3 text-[14px] md:text-[15px] font-medium resize-none max-h-[150px] md:max-h-[200px] leading-relaxed custom-scroll"
          placeholder="Message Metawurks..."
          value={text}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        {/* SEND */}
        <button
          onClick={handleSend}
          disabled={!text.trim() && !fileText}
          className={`p-2 md:p-2.5 mb-0.5 rounded-full transition-all duration-300 active:scale-90 shrink-0
            ${!text.trim() && !fileText
              ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
              : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl hover:shadow-indigo-500/20"
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="md:w-5 md:h-5"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
        </button>
      </div>
    </div>
  );
}