export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ text: "" });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let text = "";

    // 🔥 DYNAMIC IMPORT (FIXES ERROR)
    if (file.type === "application/pdf") {
      const pdf = (await import("pdf-parse")).default;
      const data = await pdf(buffer);
      text = data.text;
    } else {
      text = buffer.toString("utf-8");
    }

    return Response.json({
      text: text.slice(0, 3000),
    });

  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    return Response.json({ text: "" });
  }
}