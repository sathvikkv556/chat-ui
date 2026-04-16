import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ChatClient from "./ChatClient";

export default async function ChatPage() {
  const session = await getServerSession();

  // ❌ Not logged in → go to login
  if (!session) {
    redirect("/login");
  }

  // ✅ Logged in → show chat
  return <ChatClient />;
}