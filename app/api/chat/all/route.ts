import { getServerSession } from "next-auth";
import Chat from "@/models/Chat";
import {connectDB} from "@/lib/mongodb";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json([], { status: 401 });
  }

  const chats = await Chat.find({
    userId: session.user?.email, // ✅ FILTER USER
  });

  return Response.json(chats);
}