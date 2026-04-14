import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";
import Message from "@/models/Message";

export async function DELETE(req: Request) {
  await connectDB();

  const { chatId } = await req.json();

  // delete chat
  await Chat.findByIdAndDelete(chatId);

  // delete all messages of that chat
  await Message.deleteMany({ chatId });

  return Response.json({ success: true });
}