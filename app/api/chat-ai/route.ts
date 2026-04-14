import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI assistant. Keep answers short and clear.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    const reply =
      completion.choices[0]?.message?.content || "No response";

    return Response.json({ reply });

  } catch (error) {
    console.error(error);
    return Response.json({
      reply: "⚠️ AI error",
    });
  }
}