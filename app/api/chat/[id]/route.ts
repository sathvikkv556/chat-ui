import { getServerSession } from "next-auth";
import Message from "@/models/Message";
import {connectDB} from "@/lib/mongodb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const session = await getServerSession();
  const { id } = await params;

  if (!session) {
    return Response.json([], { status: 401 });
  }

  const messages = await Message.find({
    chatId: id,
    userId: session.user?.email, // ✅ FILTER USER
  });

  return Response.json(messages);
}