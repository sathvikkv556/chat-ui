import { getServerSession } from "next-auth";
import Message from "@/models/Message";
import {connectDB} from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const msg = await Message.create({
    ...body,
    userId: session.user?.email, // ✅ ADD USER
  });

  return Response.json(msg);
}