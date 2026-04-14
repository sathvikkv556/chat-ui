import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";

export async function POST(req: Request) {
  await connectDB();

  const { title } = await req.json();

  const chat = await Chat.create({
    title: title || "New Chat",
  });

  return Response.json(chat);
}