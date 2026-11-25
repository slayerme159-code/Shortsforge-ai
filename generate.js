export async function onRequestPost({ request, env }) {
  try {
    if (!env.GEMINI_API_KEY) return Response.json({ error: "Gemini API key is not configured in Cloudflare Pages environment variables." }, { status: 503 });
    const { category = "Surprise me", duration = "45", style = "neon cinematic" } = await request.json();
    const prompt = `Choose one compelling, surprising short-form video topic in category "${category}". If possible choose a topic with broad current social appeal, but do not claim live trend data. Write a factual, engaging narration for about ${duration} seconds. Style: ${style}. Return ONLY valid JSON with keys title, script, scenes. scenes must be an array of 5 objects, each with short on-screen text (text) and a visual direction (visual). Avoid unsupported facts, clickbait lies, and copyrighted character/story imitation.`;
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + encodeURIComponent(env.GEMINI_API_KEY), {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.9 } })
    });
    const payload = await response.json();
    if (!response.ok) return Response.json({ error: payload.error?.message || "Gemini request failed." }, { status: response.status });
    const raw = payload.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "";
    const data = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ""));
    if (!data.title || !data.script || !Array.isArray(data.scenes)) throw new Error("Gemini returned an incomplete script.");
    return Response.json(data);
  } catch (error) { return Response.json({ error: error.message || "Could not generate script." }, { status: 500 }); }
}