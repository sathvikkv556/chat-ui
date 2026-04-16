import { webSearch } from "@/lib/webSearch";
import { shouldUseSearch } from "@/lib/shouldSearch";
import { getUser } from "@/lib/getUser";

export async function POST(req: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { message, useSearch } = await req.json();

    if (!message) {
      return new Response("No message", { status: 400 });
    }

    let searchText = "";
    let sources: { title: string; link: string }[] = [];

    // ✅ WEB SEARCH
    if (useSearch || shouldUseSearch(message)) {
      try {
        const result = await webSearch(message);
        searchText = result?.text || "";
        sources = result?.sources || [];
      } catch (err) {
        console.log("SEARCH ERROR:", err);
      }
    }

    const prompt = `
You are a smart AI assistant.

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

    if (!res.body) {
      return new Response("Stream failed", { status: 500 });
    }

    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = res.body!.getReader();

        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");

          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();

            if (!line.startsWith("data:")) continue;

            const jsonStr = line.replace("data:", "").trim();

            if (jsonStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(jsonStr);
              const text =
                parsed.choices?.[0]?.delta?.content || "";

              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            } catch (err) {
              console.log("PARSE ERROR:", err);
            }
          }

          buffer = lines[lines.length - 1];
        }

        // ✅ send sources safely at end
        controller.enqueue(
          encoder.encode(
            `__SOURCES__${JSON.stringify(sources)}`
          )
        );

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (err) {
    console.log("API ERROR:", err);
    return new Response("Error", { status: 500 });
  }
}