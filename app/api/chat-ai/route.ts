import { webSearch } from "@/lib/webSearch";
import { shouldUseSearch } from "@/lib/shouldSearch";

export async function POST(req: Request) {
  try {
    const { message, useSearch } = await req.json();

    if (!message) {
      return Response.json({
        reply: "⚠️ No message provided",
        sources: [],
      });
    }

    let searchText = "";
    let sources: { title: string; link: string }[] = [];

    // 🌐 Decide if web search is needed
    if (useSearch || shouldUseSearch(message)) {
      try {
        const result = await webSearch(message);

        searchText = result?.text || "";
        sources = result?.sources || [];
      } catch (err) {
        console.log("SEARCH ERROR:", err);
      }
    }

    // 🧠 PROMPT
    const prompt = `
You are a smart AI assistant.

- If web data is available, use it.
- If not, answer normally.
- Keep answers clear and helpful.

User Question:
${message}

Web Data:
${searchText}

Answer:
`;

    // 🤖 GROQ API
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      console.log("GROQ ERROR STATUS:", res.status);
      return Response.json({
        reply: "⚠️ AI service error",
        sources,
      });
    }

    const data = await res.json();

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "⚠️ No response from AI";

    return Response.json({
      reply,
      sources,
    });

  } catch (err) {
    console.log("API ERROR:", err);

    return Response.json({
      reply: "⚠️ Server error",
      sources: [],
    });
  }
}