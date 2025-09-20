export type ProjectLite = {
  title: string;
  blurb: string;
  badges: string[];
};

/* ---------------- normalization helpers ---------------- */

function normBase(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/c#/g, "csharp")
    .replace(/\.net/g, "dotnet")
    .replace(/\bjs\b/g, "javascript")
    .replace(/\bts\b/g, "typescript")
    .replace(/[–—]/g, "-")
    .trim();
}

function stripPunct(s: string): string {
  return s.replace(/[^a-z0-9\s\-+]/g, " ").replace(/\s+/g, " ").trim();
}

/** Tokenizer for badges – includes joined variant for multi-word badges. */
function tokensForBadge(s: string): string[] {
  const t = stripPunct(normBase(s));
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length > 1) parts.push(parts.join(""));
  return Array.from(new Set(parts));
}

/** Tokenizer for queries – no sentence-wide joining. */
function tokensForQuery(s: string): string[] {
  const t = stripPunct(normBase(s));
  return t.split(/\s+/).filter(Boolean);
}

function singularize(t: string): string {
  if (t.endsWith("ies") && t.length > 4) return t.slice(0, -3) + "y";
  if (t.endsWith("sses") && t.length > 4) return t.slice(0, -2);
  if (t.endsWith("s") && t.length > 3) return t.slice(0, -1);
  return t;
}

function editDistance(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

/* ---------------- index building ---------------- */

function expandBadge(badge: string): string[] {
  const b = normBase(badge);
  const out = new Set<string>();
  out.add(b);
  out.add(stripPunct(b));
  for (const t of tokensForBadge(b)) out.add(t);

  // small, targeted normalizations
  if (/\bcsharp\b/.test(b)) out.add("c#");
  if (/\bdotnet\b/.test(b)) { out.add(".net"); out.add("aspnet"); out.add("aspnetcore"); }
  if (/\bjavascript\b/.test(b)) out.add("js");
  if (/\btypescript\b/.test(b)) out.add("ts");

  return Array.from(out).filter(Boolean);
}

export function buildBadgeIndex(projects: ProjectLite[]) {
  const index: Record<string, string[]> = Object.create(null);
  for (const p of projects) {
    const title = p.title;
    for (const badge of p.badges || []) {
      for (const v of expandBadge(badge)) (index[v] ||= []).push(title);
      const whole = stripPunct(normBase(badge));
      if (whole) (index[whole] ||= []).push(title);
    }
  }
  for (const k of Object.keys(index)) index[k] = Array.from(new Set(index[k]));
  return index;
}

/* ---------------- query → tool tokens ---------------- */

// shared intent regex
const TOOL_INTENT_RE =
  /\b(use|uses|using|used|with|built(?:\s+(?:with|on))?|leverage|leverages|leveraged|stack|tech|tools?)\b/i;

/** Extract only the clause that actually lists tools. */
function extractToolClause(q: string): string {
  const nq = normBase(q);
  const toolVerb =
    "(?:use|uses|using|used|with|built(?:\\s+(?:with|on))?|leverage|leverages|leveraged|stack|tech|tools?)";

  const mWhere = nq.match(new RegExp(`projects?\\s+where\\s+.*?\\b${toolVerb}\\b(.*)$`));
  if (mWhere && mWhere[1]) return mWhere[1];

  const mTail = nq.match(new RegExp(`\\b${toolVerb}\\b(.*)$`));
  if (mTail && mTail[1]) return mTail[1];

  return nq;
}

export function queryToTools(q: string): string[] {
  const nq = normBase(q);

  // Hard guard: only attempt when it's a tools/projects question.
  const hasIntent =
    TOOL_INTENT_RE.test(nq) ||
    /\bprojects?\b/.test(nq) ||
    /\b(stack|tech|tools?)\b/.test(nq);

  if (!hasIntent) return [];

  let s = extractToolClause(nq);

  const segments = s.split(/[,/&]| and |\bor\b|\+| plus /gi).map(x => x.trim()).filter(Boolean);

  // Minimal stop words; do NOT include "where" (we slice clause instead).
  const STOP = new Set([
    "which","of","his","her","their","this","that","these","those",
    "in","on","to","for","by","and","or","plus","me","them","it","the",
    "use","uses","using","used","with","has","have","feature","features",
    "include","includes","involve","involves","built","build","builds",
    "stack","tech","tools","tool","them","there",
    "who","are","you","what","is" // prevents identity Qs from leaking in
  ]);

  const out: string[] = [];
  for (const seg of segments) {
    for (const t of tokensForQuery(seg)) if (!STOP.has(t)) out.push(t);
  }
  return Array.from(new Set(out));
}

/* ---------------- matching engine ---------------- */

function vocabFromIndex(index: Record<string, string[]>) {
  return Object.keys(index);
}

const AI_UMBRELLA = [
  "ai","ml","llm","llms","nlp","transformer","transformers",
  "hugging","huggingface","pytorch","scikit","rag","embedding","embeddings",
  "vector","vectordb","vector-db","langchain","langgraph"
].map(normBase);

export function expandToolsWithFuzz(
  index: Record<string, string[]>,
  tools: string[]
): string[] {
  const vocab = vocabFromIndex(index);
  const into = new Set<string>();

  for (const raw of tools) {
    const base = stripPunct(normBase(raw));
    const sing = singularize(base);

    if (index[base]) into.add(base);
    if (index[sing]) into.add(sing);

    if (base === "ai" || base === "ml") {
      for (const k of AI_UMBRELLA) if (index[k]) into.add(k);
      continue; // never fuzzy short tokens
    }

    if (base.length <= 2) continue;

    const variants = new Set<string>([
      base,
      sing,
      base.replace(/\s+/g, ""),
      base.replace(/-/g, " "),
      base.replace(/[ -]/g, ""),
    ]);

    for (const v of variants) {
      const first = v[0];
      for (const key of vocab) {
        if (key[0] !== first) continue;
        const dist = editDistance(v, key);
        const len = Math.max(v.length, key.length);
        if (dist <= (len <= 6 ? 1 : 2)) into.add(key);
      }
    }
  }

  return Array.from(into);
}

export function resolveByTools(
  index: Record<string, string[]>,
  tools: string[],
  mode: "all" | "any" = "all"
): string[] {
  const buckets = tools.map(t => index[t] || []);
  if (!buckets.length) return [];

  const uniq = (arr: string[]) => Array.from(new Set(arr));
  if (mode === "any") return uniq(buckets.flat());

  let acc = new Set(buckets[0]);
  for (let i = 1; i < buckets.length; i++) {
    const s = new Set(buckets[i]);
    acc = new Set([...acc].filter(x => s.has(x)));
  }
  const out = Array.from(acc);
  return out.length ? out : uniq(buckets.flat());
}
