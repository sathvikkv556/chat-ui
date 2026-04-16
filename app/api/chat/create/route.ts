import { getServerSession } from "next-auth";
import Chat from "@/models/Chat";
import { connectDB } from "@/lib/mongodb";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chatId, title } = await req.json();

  // 🧠 IF chatId exists → update
  if (chatId) {
    const updated = await Chat.findByIdAndUpdate(
      chatId,
      { title },
      { new: true }
    );

    return Response.json(updated);
  }

  // 🆕 ELSE create new
  const chat = await Chat.create({
    title: title || "New Chat",
    userId: session.user?.email,
  });

  return Response.json(chat);
}