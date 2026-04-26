import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { chatId } = await req.json();

    if (!chatId) {
      return new Response("Chat ID required", { status: 400 });
    }

    // Delete all messages for this chat belonging to the user
    await Message.deleteMany({ 
      chatId,
      userId: session.user.email 
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Delete messages error:", err);
    return new Response("Error", { status: 500 });
  }
}