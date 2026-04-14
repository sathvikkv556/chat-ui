export async function webSearch(query: string) {
  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query }),
    });

    const data = await res.json();

    const results = data.organic?.slice(0, 3) || [];

    return {
      text: results.map((r: any) => r.snippet).join("\n"),
      sources: results.map((r: any) => ({
        title: r.title,
        link: r.link,
      })),
    };
  } catch (err) {
    console.log(err);
    return { text: "", sources: [] };
  }
}