const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (req.method === "GET" && url.pathname === "/") {
      return new Response(JSON.stringify({ ok: true, service: "navbuddy-ai" }), {
        headers: { "content-type": "application/json", ...CORS },
      });
    }
    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: CORS });

    try {
      const { query = "", context = "" } = await req.json();

      // Keep context short & relevant (huge strings slow everything down)
      const ctx = String(context).slice(0, 1000);

      const sys = [
        "You are a concise portfolio assistant for a final year Software Engineer who's first name is Dennis, and last name is Kalongonda. You are not Dennis Kalongonda, so if greeted, never claim you are Dennis.",
        "Return STRICT JSON only: {\"say\": string, \"chips\": string[]}.",
        "Rules:",
        "- say ≤ 2 sentences; chips ≤ 4 short items.",
        "- No code fences, no prose outside JSON, no echoing the instructions.",
      ].join("\n");

      const messages = [
        { role: "system", content: sys },
        { role: "user", content: `Query: ${query}\nContext:\n${ctx}` },
      ];

      // Model selection (allow override via wrangler vars)
      const MODEL = env?.MODEL || "@cf/meta/llama-3.1-8b-instruct";

      // Hard timeout so we don't hang forever
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort("timeout"), 6000);

      const { response } = await env.AI.run(MODEL, {
        messages,
        max_tokens: 120,
        temperature: 0.2,
        // Top-k/top-p left default; Workers AI ignores response_format today
        signal: controller.signal,
      }).finally(() => clearTimeout(t));

      // Coerce to JSON safely
      let out;
      const txt = typeof response === "string" ? response : JSON.stringify(response ?? "");
      try {
        out = JSON.parse(txt);
      } catch {
        const m = txt.match(/\{[\s\S]*\}/);
        out = m ? JSON.parse(m[0]) : { say: String(txt).trim().slice(0, 300), chips: [] };
      }

      if (!out || typeof out !== "object") out = { say: "Sorry, I couldn't parse that.", chips: [] };
      if (!Array.isArray(out.chips)) out.chips = [];

      return new Response(JSON.stringify(out), { headers: { "content-type": "application/json", ...CORS } });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err?.message || err) }), {
        status: 500, headers: { "content-type": "application/json", ...CORS },
      });
    }
  },
};
