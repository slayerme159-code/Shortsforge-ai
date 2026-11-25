export async function onRequestPost({ request, env }) {
  try {
    if (!env.ELEVENLABS_API_KEY) return Response.json({ error: "ElevenLabs API key is not configured in Cloudflare Pages environment variables." }, { status: 503 });
    const { text } = await request.json();
    if (typeof text !== "string" || !text.trim() || text.length > 5000) return Response.json({ error: "Enter a script under 5,000 characters." }, { status: 400 });
    const voiceId = env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, {
      method: "POST", headers: { "xi-api-key": env.ELEVENLABS_API_KEY, "Content-Type": "application/json", "Accept": "audio/mpeg" },
      body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.45, similarity_boost: 0.75 } })
    });
    if (!response.ok) { const msg = await response.text(); return Response.json({ error: "ElevenLabs: " + msg.slice(0, 400) }, { status: response.status }); }
    return new Response(response.body, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" } });
  } catch (error) { return Response.json({ error: error.message || "Voice generation failed." }, { status: 500 }); }
}
