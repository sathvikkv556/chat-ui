export interface MessageType {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;

  // ✅ NEW (for web search)
  sources?: {
    title: string;
    link: string;
  }[];
}