import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import Chat from "@/models/Chat";

export async function POST(req: Request) {
  await connectDB();

  const data = await req.json();

  // SAVE MESSAGE
  const message = await Message.create(data);

  // 🔥 AUTO TITLE FIX (robust)
  if (data.role === "user") {
    const chat = await Chat.findById(data.chatId);

    if (chat) {
      // normalize check (important)
      const isDefaultTitle =
        !chat.title || chat.title.trim().toLowerCase() === "new chat";

      if (isDefaultTitle) {
        chat.title = data.content
          .slice(0, 40)        // limit length
          .replace(/\n/g, " ") // remove new lines
          .trim();

        await chat.save();

        console.log("✅ Title updated:", chat.title);
      }
    }
  }

  return Response.json(message);
}