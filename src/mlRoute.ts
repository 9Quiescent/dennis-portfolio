// Lightweight ranking used by NavBuddy. 
export type Rankable = { id: string; title: string; text: string; kind?: "about" | "skill" | "project" | "tooling" };
export type RankedHit = { id: string; score: number };

const deburr = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "");
const tokenize = (s: string) =>
  deburr(s)
    .toLowerCase()
    .replace(/\bcsharp\b/g, "c#")
    .replace(/\bdotnet\b/g, ".net")
    .replace(/\bnodejs\b/g, "node")
    .replace(/[^a-z0-9\.\+#]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

const STOP = new Set([
  "a","an","the","and","or","of","to","in","for","on","with","by","at","from",
  "as","is","are","be","this","that","it","its","you","your","about","my"
]);

function terms(s: string) {
  return tokenize(s).filter((t) => !STOP.has(t) && t.length >= 2);
}

type DocVec = { id: string; tf: Map<string, number>; norm: number };

function buildVectors(items: Rankable[]) {
  const docs: DocVec[] = [];
  const df = new Map<string, number>();

  for (const it of items) {
    const tTitle = terms(it.title);
    const tText = terms(it.text);
    const tf = new Map<string, number>();
    for (const w of tTitle) tf.set(w, (tf.get(w) || 0) + 2.0);
    for (const w of tText) tf.set(w, (tf.get(w) || 0) + 1.0);
    if (it.kind) tf.set(it.kind, (tf.get(it.kind) || 0) + 0.25);
    for (const w of new Set(tf.keys())) df.set(w, (df.get(w) || 0) + 1);
    docs.push({ id: it.id, tf, norm: 0 });
  }

  const N = items.length;
  const idf = new Map<string, number>();
  for (const [w, dfi] of df.entries()) idf.set(w, Math.log((N + 1) / (dfi + 1)) + 1);

  for (const d of docs) {
    let sum = 0;
    for (const [w, f] of d.tf.entries()) {
      const wgt = (1 + Math.log(f)) * (idf.get(w) || 0);
      d.tf.set(w, wgt);
      sum += wgt * wgt;
    }
    d.norm = Math.sqrt(Math.max(sum, 1e-12));
  }
  return { docs, idf };
}

let cacheKey = "";
let cached: ReturnType<typeof buildVectors> | null = null;

function getIndex(items: Rankable[]) {
  const key = `${items.length}:${items[0]?.id || ""}`;
  if (key !== cacheKey) {
    cached = buildVectors(items);
    cacheKey = key;
  }
  return cached!;
}

export async function rankTopN(q: string, items: Rankable[], n = 6): Promise<RankedHit[]> {
  const query = terms(q);
  if (!query.length) return [];
  const { docs, idf } = getIndex(items);

  const qtf = new Map<string, number>();
  for (const w of query) qtf.set(w, (qtf.get(w) || 0) + 1);
  let qsum = 0;
  for (const [w, f] of qtf.entries()) {
    const wgt = (1 + Math.log(f)) * (idf.get(w) || 0);
    qtf.set(w, wgt);
    qsum += wgt * wgt;
  }
  const qnorm = Math.sqrt(Math.max(qsum, 1e-12));

  const hits: RankedHit[] = [];
  for (const d of docs) {
    let dot = 0;
    for (const [w, qv] of qtf.entries()) {
      const dv = d.tf.get(w);
      if (dv) dot += qv * dv;
    }
    let score = dot / (d.norm * qnorm || 1e-12);
    hits.push({ id: d.id, score });
  }
  const max = Math.max(...hits.map((h) => h.score), 1e-9);
  hits.forEach((h) => (h.score = Math.max(0, h.score / max)));
  return hits.sort((a, b) => b.score - a.score).slice(0, n);
}
