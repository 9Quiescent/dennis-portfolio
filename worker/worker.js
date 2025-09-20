export default {
  async fetch(req, env) {
    if (req.method !== "POST") return new Response("POST only", { status: 405 });
    const { query, context } = await req.json();
    const sys =
      'You are a concise portfolio site assistant. Return STRICT JSON: {"say":"..","chips":["..",".."]}. Keep "say" ≤ 2 sentences. Chips are short actions a recruiter can click.';
    const messages = [
      { role: "system", content: sys },
      { role: "user", content: `Query: ${query}\nContext:\n${context}` },
    ];
    const { response } = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", { messages });
    let out;
    try {
      out = JSON.parse(response);
    } catch {
      out = { say: response.trim(), chips: [] };
    }
    return new Response(JSON.stringify(out), { headers: { "content-type": "application/json" } });
  },
};
