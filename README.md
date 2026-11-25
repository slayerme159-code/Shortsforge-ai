# ShortsForge AI — starter implementation

A mobile-friendly browser app that:
1. Uses Google Gemini to select a compelling topic and write a short script.
2. Uses ElevenLabs to generate narration.
3. Animates a vertical 9:16 motion-graphics template in Canvas.
4. Adds timed caption phrases and records the canvas plus narration as a WebM video.

## Run it

Because browsers restrict API requests from `file://`, run a tiny local web server:

### Windows
1. Install Python 3 if needed.
2. Open Command Prompt in this folder.
3. Run: `py -m http.server 8000`
4. Open `http://localhost:8000`

### macOS / Linux
1. Open Terminal in this folder.
2. Run: `python3 -m http.server 8000`
3. Open `http://localhost:8000`

You can also deploy the folder as a static site on Netlify, Cloudflare Pages, or GitHub Pages.

## API keys

- Gemini: create a key in Google AI Studio: https://aistudio.google.com/app/apikey
- ElevenLabs: create a key in your ElevenLabs account: https://elevenlabs.io/

Paste keys into the app when it opens. The app calls both providers directly from your browser. Keys are not stored by the app, but they are visible to the browser session and should only be used on a trusted device. For a public multi-user deployment, move API calls to a backend and store keys as server environment variables.

The default ElevenLabs voice ID is a sample voice ID (`EXAVITQu4vr4xnSDxMaL`). If it is unavailable for your account, replace `voiceId` in `index.html` with a voice ID from your account.

## Export format

The browser records a **WebM** file (video + narration). It is not MP4. To convert to MP4, install FFmpeg and run:

```bash
ffmpeg -i shortsforge-video.webm -c:v libx264 -pix_fmt yuv420p -c:a aac shortsforge-video.mp4
```

## Important limitations / next upgrades

- The topic selection is AI-curated, not a verified live ranking of current viral trends. To rank truly trending topics, connect a trends/news data provider through a backend.
- Motion graphics are generated from a reusable animated template, not bespoke AI video footage. Change the `drawScene()` function to add new scene layouts and visual elements.
- Caption timing is evenly distributed across the voiceover, not word-level forced alignment. For accurate word-by-word timing, add a speech alignment service.
- Review all factual claims before publishing. Avoid copyrighted music or visuals unless you have permission.
- This is a working starter app, not a production-hardened service. Do not publish API keys in a public repository.
