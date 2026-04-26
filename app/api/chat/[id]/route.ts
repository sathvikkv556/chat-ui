import { getServerSession } from "next-auth";
import Message from "@/models/Message";
import {connectDB} from "@/lib/mongodb";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return Response.json([], { status: 401 });
  }

  const messages = await Message.find({
    chatId: id,
    userId: session.user?.email, // ✅ FILTER USER
  }).sort({ createdAt: 1 });

  return Response.json(messages);
}