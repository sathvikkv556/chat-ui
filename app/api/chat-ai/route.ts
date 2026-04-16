import { webSearch } from "@/lib/webSearch";
import { shouldUseSearch } from "@/lib/shouldSearch";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { message, useSearch } = await req.json();

    let searchText = "";
    let sources: { title: string; link: string }[] = [];

    if (useSearch || shouldUseSearch(message)) {
      const result = await webSearch(message);
      searchText = result?.text || "";
      sources = result?.sources || [];
    }

    const prompt = `
User Question:
${message}

Web Data:
${searchText}

Answer clearly:
`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        stream: true,
      }),
    });

    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = res.body!.getReader();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value);

          const lines = buffer.split("\n");

          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();

            if (!line.startsWith("data:")) continue;

            const jsonStr = line.replace("data:", "").trim();

            if (jsonStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(jsonStr);
              const text = parsed.choices?.[0]?.delta?.content;

              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            } catch {}
          }

          buffer = lines[lines.length - 1];
        }

        controller.enqueue(
          encoder.encode(`__SOURCES__${JSON.stringify(sources)}`)
        );

        controller.close();
      },
    });

    return new Response(stream);
  } catch {
    return new Response("Error", { status: 500 });
  }
}