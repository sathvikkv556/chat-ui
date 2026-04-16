import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return Response.json({ error: "Invalid password" }, { status: 400 });
    }

    // ✅ CREATE TOKEN
    const token = signToken(user);

    // ✅ RETURN RESPONSE
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      }),
      {
        headers: {
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (err) {
    console.log(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}