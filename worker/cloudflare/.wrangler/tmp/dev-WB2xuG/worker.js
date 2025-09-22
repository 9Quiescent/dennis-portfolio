var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-CVhuRN/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// ../../src/ai/matcher.ts
function normBase(s) {
  return (s || "").toLowerCase().replace(/c#/g, "csharp").replace(/\.net/g, "dotnet").replace(/\bjs\b/g, "javascript").replace(/\bts\b/g, "typescript").replace(/[–—]/g, "-").trim();
}
__name(normBase, "normBase");
function stripPunct(s) {
  return s.replace(/[^a-z0-9\s\-+]/g, " ").replace(/\s+/g, " ").trim();
}
__name(stripPunct, "stripPunct");
function tokensForBadge(s) {
  const t = stripPunct(normBase(s));
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length > 1) parts.push(parts.join(""));
  return Array.from(new Set(parts));
}
__name(tokensForBadge, "tokensForBadge");
function tokensForQuery(s) {
  const t = stripPunct(normBase(s));
  return t.split(/\s+/).filter(Boolean);
}
__name(tokensForQuery, "tokensForQuery");
function singularize(t) {
  if (t.endsWith("ies") && t.length > 4) return t.slice(0, -3) + "y";
  if (t.endsWith("sses") && t.length > 4) return t.slice(0, -2);
  if (t.endsWith("s") && t.length > 3) return t.slice(0, -1);
  return t;
}
__name(singularize, "singularize");
function editDistance(a, b) {
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
__name(editDistance, "editDistance");
function expandBadge(badge) {
  const b = normBase(badge);
  const out = /* @__PURE__ */ new Set();
  out.add(b);
  out.add(stripPunct(b));
  for (const t of tokensForBadge(b)) out.add(t);
  if (/\bcsharp\b/.test(b)) out.add("c#");
  if (/\bdotnet\b/.test(b)) {
    out.add(".net");
    out.add("aspnet");
    out.add("aspnetcore");
  }
  if (/\bjavascript\b/.test(b)) out.add("js");
  if (/\btypescript\b/.test(b)) out.add("ts");
  return Array.from(out).filter(Boolean);
}
__name(expandBadge, "expandBadge");
function buildBadgeIndex(projects) {
  const index = /* @__PURE__ */ Object.create(null);
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
__name(buildBadgeIndex, "buildBadgeIndex");
var TOOL_INTENT_RE = /\b(use|uses|using|used|with|built(?:\s+(?:with|on))?|leverage|leverages|leveraged|stack|tech|tools?)\b/i;
function extractToolClause(q) {
  const nq = normBase(q);
  const toolVerb = "(?:use|uses|using|used|with|built(?:\\s+(?:with|on))?|leverage|leverages|leveraged|stack|tech|tools?)";
  const mWhere = nq.match(new RegExp(`projects?\\s+where\\s+.*?\\b${toolVerb}\\b(.*)$`));
  if (mWhere && mWhere[1]) return mWhere[1];
  const mTail = nq.match(new RegExp(`\\b${toolVerb}\\b(.*)$`));
  if (mTail && mTail[1]) return mTail[1];
  return nq;
}
__name(extractToolClause, "extractToolClause");
function queryToTools(q) {
  const nq = normBase(q);
  const hasIntent = TOOL_INTENT_RE.test(nq) || /\bprojects?\b/.test(nq) || /\b(stack|tech|tools?)\b/.test(nq);
  if (!hasIntent) return [];
  let s = extractToolClause(nq);
  const segments = s.split(/[,/&]| and |\bor\b|\+| plus /gi).map((x) => x.trim()).filter(Boolean);
  const STOP = /* @__PURE__ */ new Set([
    "which",
    "of",
    "his",
    "her",
    "their",
    "this",
    "that",
    "these",
    "those",
    "in",
    "on",
    "to",
    "for",
    "by",
    "and",
    "or",
    "plus",
    "me",
    "them",
    "it",
    "the",
    "use",
    "uses",
    "using",
    "used",
    "with",
    "has",
    "have",
    "feature",
    "features",
    "include",
    "includes",
    "involve",
    "involves",
    "built",
    "build",
    "builds",
    "stack",
    "tech",
    "tools",
    "tool",
    "them",
    "there",
    "who",
    "are",
    "you",
    "what",
    "is"
    // prevents identity Qs from leaking in
  ]);
  const out = [];
  for (const seg of segments) {
    for (const t of tokensForQuery(seg)) if (!STOP.has(t)) out.push(t);
  }
  return Array.from(new Set(out));
}
__name(queryToTools, "queryToTools");
function vocabFromIndex(index) {
  return Object.keys(index);
}
__name(vocabFromIndex, "vocabFromIndex");
var AI_UMBRELLA = [
  "ai",
  "ml",
  "llm",
  "llms",
  "nlp",
  "transformer",
  "transformers",
  "hugging",
  "huggingface",
  "pytorch",
  "scikit",
  "rag",
  "embedding",
  "embeddings",
  "vector",
  "vectordb",
  "vector-db",
  "langchain",
  "langgraph"
].map(normBase);
function expandToolsWithFuzz(index, tools) {
  const vocab = vocabFromIndex(index);
  const into = /* @__PURE__ */ new Set();
  for (const raw of tools) {
    const base = stripPunct(normBase(raw));
    const sing = singularize(base);
    if (index[base]) into.add(base);
    if (index[sing]) into.add(sing);
    if (base === "ai" || base === "ml") {
      for (const k of AI_UMBRELLA) if (index[k]) into.add(k);
      continue;
    }
    if (base.length <= 2) continue;
    const variants = /* @__PURE__ */ new Set([
      base,
      sing,
      base.replace(/\s+/g, ""),
      base.replace(/-/g, " "),
      base.replace(/[ -]/g, "")
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
__name(expandToolsWithFuzz, "expandToolsWithFuzz");
function resolveByTools(index, tools, mode = "all") {
  const buckets = tools.map((t) => index[t] || []);
  if (!buckets.length) return [];
  const uniq2 = /* @__PURE__ */ __name((arr) => Array.from(new Set(arr)), "uniq");
  if (mode === "any") return uniq2(buckets.flat());
  let acc = new Set(buckets[0]);
  for (let i = 1; i < buckets.length; i++) {
    const s = new Set(buckets[i]);
    acc = new Set([...acc].filter((x) => s.has(x)));
  }
  const out = Array.from(acc);
  return out.length ? out : uniq2(buckets.flat());
}
__name(resolveByTools, "resolveByTools");

// worker.js
var CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "content-type"
};
var uniq = /* @__PURE__ */ __name((arr) => Array.from(new Set((arr || []).filter(Boolean))), "uniq");
function getBlock(text, startTag, endTag) {
  const s = text.indexOf(startTag);
  if (s < 0) return "";
  const e = text.indexOf(endTag, s + startTag.length);
  return text.slice(s + startTag.length, e > s ? e : void 0).trim();
}
__name(getBlock, "getBlock");
function extractProjectsFromFacts(ctx) {
  const raw = getBlock(ctx, "[PROJECTS_JSON]", "[END_PROJECTS_JSON]");
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
__name(extractProjectsFromFacts, "extractProjectsFromFacts");
function scrubBannedPhrases(say) {
  const bannedRx = /\b(you(?:'re| are)?\s+(?:already\s+)?(?:currently\s+)?on\s+(?:the\s+)?(?:site|page)[^.!?]*[.!?]?)/gi;
  return say.replace(bannedRx, "").replace(/\s{2,}/g, " ").trim();
}
__name(scrubBannedPhrases, "scrubBannedPhrases");
function limitSay(say, MAX_CHARS = 300, MAX_SENTENCES = 2) {
  if (!say) return "";
  let s = String(say).replace(/\s+/g, " ").replace(/“|”/g, '"').replace(/‘|’/g, "'").trim();
  const parts = s.split(/(?<=[.!?…])\s+/).filter(Boolean);
  s = parts.slice(0, MAX_SENTENCES).join(" ").trim();
  if (s.length > MAX_CHARS) {
    s = s.slice(0, MAX_CHARS).replace(/\s+\S*$/, "").replace(/[.!?…]*$/, "") + "\u2026";
  }
  return s;
}
__name(limitSay, "limitSay");
function coerceModelJSON(response) {
  const txt = typeof response === "string" ? response : JSON.stringify(response ?? "");
  let out;
  try {
    out = JSON.parse(txt);
  } catch {
    const m = txt.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        out = JSON.parse(m[0]);
      } catch {
      }
    }
    if (!out || typeof out !== "object") {
      out = { say: String(txt).trim(), chips: [] };
    }
  }
  if (!out || typeof out !== "object") out = { say: "Sorry, I couldn't parse that.", chips: [] };
  if (!Array.isArray(out.chips)) out.chips = [];
  if (typeof out.say !== "string") out.say = "Sorry, I couldn't parse that.";
  out.say = limitSay(scrubBannedPhrases(out.say));
  out.chips = uniq(out.chips).slice(0, 4);
  return out;
}
__name(coerceModelJSON, "coerceModelJSON");
var TOOL_QUERY_HINT = /\b(use|uses|using|used|with|leverage|leverages|built\s+(with|on)|stack|tech|tools?)\b/i;
function needsAllFromQuery(q) {
  return /\band\b|\+/i.test(q);
}
__name(needsAllFromQuery, "needsAllFromQuery");
function answerFromBadges(query, projects) {
  if (!projects?.length) return null;
  const index = buildBadgeIndex(
    projects.map((p) => ({ title: p.title, blurb: p.blurb, badges: p.badges }))
  );
  const q = String(query || "");
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
  if (/\b(list|name|show)\b.*\bprojects?\b/i.test(q)) {
    const titles = projects.map((p) => p.title);
    const say = titles.length ? `Projects: ${titles.join(", ")}.` : "Not provided on the portfolio site.";
    return { say: limitSay(say), chips: titles.slice(0, 4) };
  }
  return null;
}
__name(answerFromBadges, "answerFromBadges");
var worker_default = {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    const url = new URL(req.url);
    if (req.method === "GET" && url.pathname === "/") {
      return new Response(JSON.stringify({ ok: true, service: "navbuddy-ai" }), {
        headers: { "content-type": "application/json", ...CORS }
      });
    }
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: CORS });
    }
    try {
      const body = await req.json().catch(() => ({}));
      if (body?.mode === "polish" || body?.draft) {
        const draft = String(body.draft || "").slice(0, 500);
        if (!draft) {
          return new Response(JSON.stringify({ say: "", chips: [] }), {
            headers: { "content-type": "application/json", ...CORS }
          });
        }
        const sys2 = [
          "You rewrite very briefly and keep original meaning.",
          'Return STRICT JSON ONLY: {"say": string}.',
          "Rules:",
          "- Keep third person if present; do not switch person.",
          "- 1 concise sentence (\u2264 160 chars). No extra facts.",
          "- Fix grammar and awkward phrasing."
        ].join("\n");
        const messages2 = [
          { role: "system", content: sys2 },
          { role: "user", content: draft }
        ];
        const MODEL2 = env?.POLISH_MODEL || "@cf/meta/llama-3.2-1b-instruct";
        const controller2 = new AbortController();
        const t2 = setTimeout(() => controller2.abort("timeout"), 900);
        try {
          const { response: response2 } = await env.AI.run(MODEL2, {
            messages: messages2,
            max_tokens: 80,
            temperature: 0.1,
            signal: controller2.signal
          }).finally(() => clearTimeout(t2));
          const out2 = coerceModelJSON(response2);
          return new Response(JSON.stringify({ say: out2.say, chips: [] }), {
            headers: { "content-type": "application/json", ...CORS }
          });
        } catch {
          return new Response(JSON.stringify({ say: limitSay(draft), chips: [] }), {
            headers: { "content-type": "application/json", ...CORS }
          });
        }
      }
      const { query = "", context = "" } = body || {};
      const ctx = String(context).slice(0, 20100);
      const projects = extractProjectsFromFacts(ctx);
      const det = answerFromBadges(query, projects);
      if (det) {
        return new Response(JSON.stringify({ say: det.say, chips: det.chips || [] }), {
          headers: { "content-type": "application/json", ...CORS }
        });
      }
      const sys = [
        "If asked if Dennis has a linkedin, politely say that it can be accessed by tapping on the linkedin logo",
        "You are a concise portfolio assistant for software engineer Dennis Kalongonda.",
        "If asked who you are (e.g., 'who are you?'), say you're The Trusty Bubbleman (NavBuddy).",
        "Only refer to Dennis' Portfolio as 'this site'. Do not talk about what page the user is on.",
        "You are NOT Dennis; never speak as Dennis.",
        "If asked who Dennis is, briefly introduce Dennis in third person.",
        'Return STRICT JSON ONLY: {"say": string, "chips": string[]}.',
        "Rules: the entire answer must fit in 2 short sentences, under 300 characters total. No bullet lists.",
        "If asked to show code for any project, do not elaborate beyond your first summarised sentence. Always suggest checking out the projects page for code. e.g, 'Please look through the projects page for code'",
        "GROUNDING: Use only the 'PAGE FACTS' system message; do not invent details.",
        "If a detail is missing, answer: 'Not provided on the portfolio site.'",
        "- If a project title is mentioned, answer \u201CDennis\u2019s \u201C{Title}\u201D: {a one-sentence summary}\u201D.",
        "- For tooling, keep answers grounded in project badges and [TOOLING_JSON].",
        "Be polite. Never tell the user which page they're currently on.",
        "Never leak raw model text. E.g 'PAGE FACTS', is not allowed, especially when information is missing.",
        "When asked for visual descriptions, like the colour of a logo, gracefully answer the question by stating you do not have computer vision."
      ].join("\n");
      const messages = [
        { role: "system", content: sys },
        { role: "system", content: `(do not quote):
${ctx}` },
        { role: "user", content: String(query) }
      ];
      const MODEL = env?.MODEL || "@cf/meta/llama-3.1-8b-instruct";
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort("timeout"), 6e3);
      const { response } = await env.AI.run(MODEL, {
        messages,
        max_tokens: 160,
        temperature: 0.2,
        signal: controller.signal
      }).finally(() => clearTimeout(t));
      const out = coerceModelJSON(response);
      return new Response(JSON.stringify(out), {
        headers: { "content-type": "application/json", ...CORS }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err?.message || err) }), {
        status: 500,
        headers: { "content-type": "application/json", ...CORS }
      });
    }
  }
};

// ../../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-CVhuRN/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../../node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-CVhuRN/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  answerFromBadges,
  middleware_loader_entry_default as default,
  extractProjectsFromFacts
};
//# sourceMappingURL=worker.js.map
