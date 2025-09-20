// worker/worker.js
import {
  buildBadgeIndex,
  queryToTools,
  resolveByTools,
  expandToolsWithFuzz,
} from "../../src/ai/matcher";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

/* ---------------- helpers ---------------- */
const uniq = (arr) => Array.from(new Set((arr || []).filter(Boolean)));

function getBlock(text, startTag, endTag) {
  const s = text.indexOf(startTag);
  if (s < 0) return "";
  const e = text.indexOf(endTag, s + startTag.length);
  return text.slice(s + startTag.length, e > s ? e : undefined).trim();
}

export function extractProjectsFromFacts(ctx) {
  const raw = getBlock(ctx, "[PROJECTS_JSON]", "[END_PROJECTS_JSON]");
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/* ---------------- output guards ---------------- */

/** Remove sentences that mention the current page/site (model sometimes ignores rules). */
function scrubBannedPhrases(say) {
  const bannedRx = /\b(you(?:'re| are)?\s+(?:already\s+)?(?:currently\s+)?on\s+(?:the\s+)?(?:site|page)[^.!?]*[.!?]?)/gi;
  return say.replace(bannedRx, "").replace(/\s{2,}/g, " ").trim();
}

/** Keep ≤ 2 sentences, ≤ MAX_CHARS, cut on word boundary, end with one ellipsis if truncated. */
function limitSay(say, MAX_CHARS = 300, MAX_SENTENCES = 2) {
  if (!say) return "";
  // Normalize whitespace and quotes
  let s = String(say).replace(/\s+/g, " ").replace(/“|”/g, '"').replace(/‘|’/g, "'").trim();

  // Split into sentences
  const parts = s.split(/(?<=[.!?…])\s+/).filter(Boolean);
  s = parts.slice(0, MAX_SENTENCES).join(" ").trim();

  // Char limit with word-safe trim
  if (s.length > MAX_CHARS) {
    s = s.slice(0, MAX_CHARS).replace(/\s+\S*$/, "").replace(/[.!?…]*$/, "") + "…";
  }
  return s;
}

/** Parse or salvage JSON from the model, then apply scrub + limit. */
function coerceModelJSON(response) {
  const txt = typeof response === "string" ? response : JSON.stringify(response ?? "");
  let out;

  try {
    out = JSON.parse(txt);
  } catch {
    const m = txt.match(/\{[\s\S]*\}/);
    if (m) {
      try { out = JSON.parse(m[0]); } catch {}
    }
    if (!out || typeof out !== "object") {
      // Salvage raw text then constrain below
      out = { say: String(txt).trim(), chips: [] };
    }
  }

  if (!out || typeof out !== "object") out = { say: "Sorry, I couldn't parse that.", chips: [] };
  if (!Array.isArray(out.chips)) out.chips = [];
  if (typeof out.say !== "string") out.say = "Sorry, I couldn't parse that.";

  // Final, non-negotiable post-processing
  out.say = limitSay(scrubBannedPhrases(out.say));
  out.chips = uniq(out.chips).slice(0, 4);
  return out;
}

/* -------- deterministic badge-driven path -------- */

// include "used" as well
const TOOL_QUERY_HINT =
  /\b(use|uses|using|used|with|leverage|leverages|built\s+(with|on)|stack|tech|tools?)\b/i;

function needsAllFromQuery(q) {
  return /\band\b|\+/i.test(q);
}

export function answerFromBadges(query, projects) {
  if (!projects?.length) return null;

  const index = buildBadgeIndex(
    projects.map(p => ({ title: p.title, blurb: p.blurb, badges: p.badges }))
  );

  const q = String(query || "");

  // Tool/stack intent → map tools from free text → (safe) fuzzy → resolve via badges
  const tools = queryToTools(q);
  if (TOOL_QUERY_HINT.test(q) || tools.length) {
    const expanded = expandToolsWithFuzz(index, tools);
    if (expanded.length) {
      const mode = needsAllFromQuery(q) ? "all" : "any";
      const matches = resolveByTools(index, expanded, mode);
      if (matches.length) {
        const hint = tools.join(mode === "all" ? " + " : " | ");
        const say = `Matches for ${hint}: ${matches.join(", ")}.`;
        return { say: limitSay(say), chips: matches.slice(0, 4) };
      }
      return { say: "No matching projects found in the portfolio badges.", chips: [] };
    }
  }

  // Generic “list projects”
  if (/\b(list|name|show)\b.*\bprojects?\b/i.test(q)) {
    const titles = projects.map(p => p.title);
    const say = titles.length ? `Projects: ${titles.join(", ")}.` : "Not provided on the portfolio site.";
    return { say: limitSay(say), chips: titles.slice(0, 4) };
  }

  return null;
}

/* ---------------- worker handler ---------------- */
export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

    const url = new URL(req.url);
    if (req.method === "GET" && url.pathname === "/") {
      return new Response(JSON.stringify({ ok: true, service: "navbuddy-ai" }), {
        headers: { "content-type": "application/json", ...CORS },
      });
    }
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: CORS });
    }

    try {
      const body = await req.json().catch(() => ({}));

      /* ---------- POLISH MODE ---------- */
      if (body?.mode === "polish" || body?.draft) {
        const draft = String(body.draft || "").slice(0, 500);
        if (!draft) {
          return new Response(JSON.stringify({ say: "", chips: [] }), {
            headers: { "content-type": "application/json", ...CORS },
          });
        }

        const sys = [
          "You rewrite very briefly and keep original meaning.",
          "Return STRICT JSON ONLY: {\"say\": string}.",
          "Rules:",
          "- Keep third person if present; do not switch person.",
          "- 1 concise sentence (≤ 160 chars). No extra facts.",
          "- Fix grammar and awkward phrasing.",
        ].join("\n");

        const messages = [
          { role: "system", content: sys },
          { role: "user", content: draft },
        ];

        const MODEL = env?.POLISH_MODEL || "@cf/meta/llama-3.2-1b-instruct";
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort("timeout"), 900);

        try {
          const { response } = await env.AI.run(MODEL, {
            messages,
            max_tokens: 80,
            temperature: 0.1,
            signal: controller.signal,
          }).finally(() => clearTimeout(t));

          const out = coerceModelJSON(response);
          return new Response(JSON.stringify({ say: out.say, chips: [] }), {
            headers: { "content-type": "application/json", ...CORS },
          });
        } catch {
          // fall back to the user's draft, still trimmed
          return new Response(JSON.stringify({ say: limitSay(draft), chips: [] }), {
            headers: { "content-type": "application/json", ...CORS },
          });
        }
      }

      /* --------------- QA MODE --------------- */
      const { query = "", context = "" } = body || {};
      const ctx = String(context).slice(0, 20100);

      // Deterministic badge path first
      const projects = extractProjectsFromFacts(ctx);
      const det = answerFromBadges(query, projects);
      if (det) {
        // already limited in answerFromBadges
        return new Response(JSON.stringify({ say: det.say, chips: det.chips || [] }), {
          headers: { "content-type": "application/json", ...CORS },
        });
      }

      // Grounded LLM fallback — we still enforce hard limits after model returns.
      const sys = [
        "If asked if Dennis has a linkedin, politely say that it can be accessed by tapping on the linkedin logo",
        "You are a concise portfolio assistant for software engineer Dennis Kalongonda.",
        "If asked who you are (e.g., 'who are you?'), say you're The Trusty Bubbleman (NavBuddy).",
        "Only refer to Dennis' Portfolio as 'this site'. Do not talk about what page the user is on.",
        "You are NOT Dennis; never speak as Dennis.",
        "If asked who Dennis is, briefly introduce Dennis in third person.",
        "Return STRICT JSON ONLY: {\"say\": string, \"chips\": string[]}.",
        "Rules: the entire answer must fit in 2 short sentences, under 300 characters total. No bullet lists.",
        "If asked to show code for any project, do not elaborate beyond your first summarised sentence. Always suggest checking out the projects page for code. e.g, 'Please look through the projects page for code'",
        "GROUNDING: Use only the 'PAGE FACTS' system message; do not invent details.",
        "If a detail is missing, answer: 'Not provided on the portfolio site.'",
        "- If a project title is mentioned, answer “Dennis’s “{Title}”: {a one-sentence summary}”.",
        "- For tooling, keep answers grounded in project badges and [TOOLING_JSON].",
        "Be polite. Never tell the user which page they're currently on.",
        "Never leak raw model text. E.g 'PAGE FACTS', is not allowed, especially when information is missing.",
        "When asked for visual descriptions, like the colour of a logo, gracefully answer the question by stating you do not have computer vision."
      ].join("\n");

      const messages = [
        { role: "system", content: sys },
        { role: "system", content: `(do not quote):\n${ctx}` },
        { role: "user", content: String(query) },
      ];

      const MODEL = env?.MODEL || "@cf/meta/llama-3.1-8b-instruct";
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort("timeout"), 6000);

      const { response } = await env.AI.run(MODEL, {
        messages,
        max_tokens: 160,
        temperature: 0.2,
        signal: controller.signal,
      }).finally(() => clearTimeout(t));

      const out = coerceModelJSON(response);
      return new Response(JSON.stringify(out), {
        headers: { "content-type": "application/json", ...CORS },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err?.message || err) }), {
        status: 500,
        headers: { "content-type": "application/json", ...CORS },
      });
    }
  },
};
