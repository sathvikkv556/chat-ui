import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // ✅ FIX
) {
  await connectDB();

  const { id } = await context.params; // ✅ IMPORTANT

  const messages = await Message.find({ chatId: id });

  return Response.json(messages);
}