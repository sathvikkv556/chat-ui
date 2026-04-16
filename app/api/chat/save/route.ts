import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Message from "@/models/Message";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { chatId, content, role } = await req.json();

    await Message.create({
      chatId,
      userId: session.user.id, // ✅ FIX
      content,
      role,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.log(err);
    return new Response("Error", { status: 500 });
  }
}