import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  await new Promise((res) => setTimeout(res, 1000));

  const text = message.toLowerCase();
  let reply = "";

  if (text.includes("hello") || text.includes("hi")) {
    reply = "Hey! 👋 How can I help you today?";
  } else if (text.includes("react")) {
    reply = "React is a powerful library for building UI ⚛️";
  } else if (text.includes("node")) {
    reply = "Node.js lets you run JavaScript on the server 🚀";
  } else if (text.includes("project")) {
    reply = "You can build chat apps, dashboards, or AI tools!";
  } else {
    reply = `Interesting 🤔 Tell me more about "${message}"`;
  }

  return NextResponse.json({ reply });
}