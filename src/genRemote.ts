// Small helper used by NavBuddy; points to the Worker
export async function genReplyRemote(endpoint: string, query: string, context: string) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, context }),
  });
  if (!res.ok) throw new Error(`Remote LLM error: ${res.status}`);
  return (await res.json()) as { say: string; chips?: string[] };
}
