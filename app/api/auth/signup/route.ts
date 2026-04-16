import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      passwordHash,
    });

    return Response.json({ success: true });

  } catch (err) {
    console.log(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}