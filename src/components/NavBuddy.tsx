import React, { useEffect, useRef, useState } from "react";
import type { TabKey, Project } from "../data/site";
import { ABOUT_SUMMARY, TOOLING, PROJECTS } from "../data/site";
import navBuddyPng from "../assets/BubbleBud.png";
import { ABOUT_ANCHORS } from "../sections/AboutPanel";

/* ---------- constants ---------- */

export type Variant = "inline" | "fab";
type Props = { onGo: (t: TabKey) => void; variant?: Variant; linkedinUrl?: string };

const PERSON_FULL = "Dennis Kalongonda";
const PERSON_FIRST = "Dennis";
const PROJECTS_TOP_ID = "projects-top";

const WORKER_ENDPOINT: string | undefined =
  (import.meta as any).env?.VITE_NAVBUDDY_ENDPOINT ?? (globalThis as any).__NAVBUDDY_ENDPOINT;

/* ---------- generic helpers ---------- */

function scrollToIdWhenReady(id: string, tries = 24) {
  const el = document.getElementById(id);
  if (el) return void (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
  if (tries > 0) requestAnimationFrame(() => scrollToIdWhenReady(id, tries - 1));
}

type Target = { tab: TabKey; id?: string };

function resolveTarget(q: string): Target {
  const t = q.toLowerCase();

  if (/(education|degree|unisa|university)/.test(t))
    return { tab: "about", id: ABOUT_ANCHORS.education };

  if (/(tool(ing)?s?|skills?|tech(\s*stack)?)/.test(t))
    return { tab: "about", id: ABOUT_ANCHORS.tooling };

  if (/(experience|highlights|recent)/.test(t))
    return { tab: "about", id: ABOUT_ANCHORS.experience };

  if (/\babout\b|bio|summary|profile/.test(t))
    return { tab: "about", id: ABOUT_ANCHORS.summary };

  if (/project|portfolio|work|built|builds?/.test(t))
    return { tab: "projects", id: PROJECTS_TOP_ID };

  return { tab: "projects", id: PROJECTS_TOP_ID };
}

// explicit nav intent only (avoid jumping on plain Q&A)
function isNavIntent(q: string): boolean {
  const t = q.trim().toLowerCase();
  if (["projects", "project", "about", "linkedin", "education"].includes(t)) return true;
  if (
    /\b(go|open|show|take|jump|scroll|navigate|view|see)\b/.test(t) ||
    /\b(go|take)\s+me\s+(to|into)\b/.test(t) ||
    /\bshow\s+me\b/.test(t)
  )
    return true;
  if (/^(who|what|where|when|why|how)\b/.test(t)) return false;
  return false;
}

function cleanSay(s: string) {
  return s.replace(/```[\s\S]*?```/g, "").replace(/^[`'"]+|[`'"]+$/g, "").trim();
}

function coerceReply(raw: unknown): { say?: string; chips?: string[]; error?: string } {
  const sniffObj = (txt: string) => {
    const m = txt.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try {
      return JSON.parse(m[0]);
    } catch {
      return null;
    }
  };

  try {
    if (typeof raw === "string") {
      const parsed = sniffObj(raw);
      if (parsed) return coerceReply(parsed);
      return { say: cleanSay(raw), chips: [] };
    }
    const r: any = raw ?? {};
    let say: any = r.say;
    if (typeof say === "string") {
      const inner = sniffObj(say);
      if (inner && typeof inner === "object") {
        say = inner.say ?? say;
        if (!Array.isArray(r.chips) && Array.isArray(inner.chips)) r.chips = inner.chips;
      }
    }
    if (typeof say === "string") say = cleanSay(say);
    const chips = Array.isArray(r.chips) ? r.chips : [];
    return { say, chips };
  } catch {
    return { say: cleanSay(String(raw ?? "")), chips: [] };
  }
}

async function askRemote(query: string, context: string) {
  if (!WORKER_ENDPOINT) return null;
  const res = await fetch(WORKER_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, context }),
  });
  if (!res.ok) throw new Error(`Remote LLM error: ${res.status}`);
  return (await res.json()) as { say?: string; chips?: string[]; error?: string };
}

function isNavChip(c: string, projectTitles: string[]) {
  const t = c.toLowerCase();
  return (
    isNavIntent(t) ||
    /\b(about|projects|education|linkedin)\b/.test(t) ||
    projectTitles.some((pt) => t.includes(pt.toLowerCase()))
  );
}

function targetFromText(text: string): Target {
  if (/\blinked\s*in\b|\blinkedin\b/i.test(text)) return { tab: "about" };
  return resolveTarget(text);
}

function toThirdPerson(s: string, name = PERSON_FIRST) {
  return s
    .replace(/\bI’m\b/gi, `${name} is`)
    .replace(/\bI’ve\b/gi, `${name} has`)
    .replace(/\bI’d\b/gi, `${name} would`)
    .replace(/\bI’ll\b/gi, `${name} will`)
    .replace(/\bI ship\b/gi, `${name} ships`)
    .replace(/\bI build\b/gi, `${name} builds`)
    .replace(/\bI design\b/gi, `${name} designs`)
    .replace(/\bI run\b/gi, `${name} runs`)
    .replace(/\bI own\b/gi, `${name} owns`)
    .replace(/\bmy\b/gi, "his")
    .replace(/\bmine\b/gi, "his")
    .replace(/\bme\b/gi, "him")
    .replace(/\bI\b/g, name);
}

/* ---------- tooling-aware local QA (kept) ---------- */

const TOOLING_MAP: Record<string, string[]> = Object.fromEntries(
  TOOLING.map((g) => [g.title.toLowerCase(), g.items])
);

function toolingGroupForQuery(q: string): string | null {
  const t = q.toLowerCase();
  const tests: Array<[RegExp, string]> = [
    [/dev ?ops|ci\/?cd|pipelines?|github actions|azure devops|runbooks?|rollback|semver|compose|cloudflare/, "DevOps"],
    [/cloud|infr(a|o)|orchestr|docker|kubernetes|aks|aws|azure|terraform/, "Cloud, Orchestration & Infra"],
    [/observab|sli|slo|health|monitor|structured logging|qa|integration tests?/, "Observability & QA"],
    [/jira|confluence|adr|docs?|documentation|markdown|project\b.*docs?/, "Project & Docs"],
    [/ai|machine learning|ml|pytorch|scikit|transformers|rag|embedding|vector db|langchain|hugging face/, "AI/ML"],
    [/languages?|c#|python|java|typescript|javascript|sql|c\+\+|bash|powershell/, "Languages"],
    [/frameworks?|asp\.?net|react|xunit|tailwind|razor|entity framework|web api|rest/, "Frameworks"],
    [/security|owasp|auth|nmap|wireshark|burp|metasploit/, "Networking & Security"],
    [/data|etl|xquery|xml|oracle|joins?|indexes?/, "Data"],
    [/vmware|virtualbox|utm|wsl2|docker desktop|ubuntu|virtuali[sz]ation|lab/, "Virtualisation & Lab"],
  ];
  for (const [re, group] of tests) if (re.test(t)) return group;
  return null;
}

function listToText(items: string[], max = 8) {
  const picked = items.slice(0, max);
  if (picked.length <= 2) return picked.join(" and ");
  return `${picked.slice(0, -1).join(", ")}, and ${picked[picked.length - 1]}`;
}

/* ---------- project-aware local QA + nav ---------- */

// Build a tiny index once
type ProjIdx = { title: string; text: string; ref: Project };
const PROJ_INDEX: ProjIdx[] = PROJECTS.map((p) => ({
  title: p.title,
  text: `${p.title} ${p.blurb} ${(p.badges || []).join(" ")}`.toLowerCase(),
  ref: p,
}));

const PROJECT_TITLES = PROJECTS.map((p) => p.title);

// simple token scoring with a few boosts
function bestProjectMatch(q: string): { proj: ProjIdx; score: number } | null {
  const t = q.toLowerCase();
  const tokens = Array.from(new Set(t.split(/[^a-z0-9\+#]+/).filter(Boolean)));

  let best: { proj: ProjIdx; score: number } | null = null;
  for (const p of PROJ_INDEX) {
    let s = 0;
    for (const tok of tokens) {
      if (!tok) continue;
      if (p.text.includes(tok)) s += 1;
    }
    // boosts for common aliases
    if (t.includes("manet")) s += 3;
    if (t.includes("proposal") || t.includes("management")) s += 2;
    if (t.includes("simulator") || t.includes("visualiser") || t.includes("visualizer")) s += 2;

    if (!best || s > best.score) best = { proj: p, score: s };
  }
  // require a non-trivial score
  if (!best || best.score < 2) return null;
  return best;
}

function firstSentence(s: string) {
  const m = s.match(/^(.*?[\.\!\?])\s/);
  return m ? m[1] : s;
}

function scrollToProjectByTitle(title: string) {
  // Try to find the project's <h3> then its enclosing card/article
  const hs = Array.from(document.querySelectorAll("h3"));
  const h = hs.find(
    (el) => el.textContent && el.textContent.toLowerCase().includes(title.toLowerCase())
  ) as HTMLElement | undefined;

  const target = (h && (h.closest("article") || h.closest(".dc-card") || h)) as HTMLElement | null;
  (target ?? h)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- main component ---------- */

export default function NavBuddy({ onGo, variant = "inline", linkedinUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [say, setSay] = useState<string>("");
  const [chips, setChips] = useState<string[]>([]);
  const [err, setErr] = useState<string>("");

  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (panelRef.current?.contains(e.target as Node)) return;
      closePanel();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function closePanel() {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setQ("");
      setErr("");
      setSay("");
      setChips([]);
    }, 170);
  }

  async function handleSend(textRaw?: string) {
    const text = (textRaw ?? q).trim();
    if (!text) return;

    // LinkedIn quick path
    if (/\blinked\s*in\b|\blinkedin\b/i.test(text)) {
      if (linkedinUrl) window.open(linkedinUrl, "_blank", "noopener,noreferrer");
      setSay("Opening the LinkedIn profile…");
      setChips(["About", "Projects"]);
      return;
    }

    // 1) PROJECT-AWARE: detect a matching project (even without explicit nav)
    const projHit = bestProjectMatch(text);
    const wantsNav = isNavIntent(text) || /\b(show|open|view|see)\b/.test(text.toLowerCase());

    if (projHit) {
      const { title, ref } = projHit.proj;
      // navigate only if user expressed nav intent
      if (wantsNav) {
        onGo("projects");
        setTimeout(() => scrollToProjectByTitle(title), 0);
      }
      // local answer from project content
      setErr("");
      const sentence = firstSentence(ref.blurb || "");
      setSay(
        sentence
          ? `${PERSON_FIRST}’s “${title}”: ${sentence}`
          : `${PERSON_FIRST} worked on “${title}”.`
      );
      const badgeChips = (ref.badges || []).slice(0, 3);
      setChips([title, ...badgeChips]); // title chip = nav chip
      return;
    }

    // 2) TOOLING-AWARE (existing)
    const group = toolingGroupForQuery(text);
    if (group) {
      const items = TOOLING_MAP[group.toLowerCase()] ?? [];
      if (items.length) {
        setErr("");
        setSay(`${PERSON_FULL} has experience in ${group} with ${listToText(items)}.`);
        setChips(items.slice(0, 4));
        return;
      }
    }

    // 3) “Who is…” bio
    if (/(who\s+is\s+dennis\b|who\s+are\s+you\b|who\s+is\s+he\b|about\s+(him|you)|tell\s+me\s+about\s+dennis)/.test(
      text.toLowerCase()
    )) {
      setErr("");
      setSay(`${PERSON_FULL}: ${toThirdPerson(ABOUT_SUMMARY, PERSON_FIRST)}`);
      setChips(["Education", "Skills", "Experience"]);
      return;
    }

    // 4) Explicit navigation (About/Projects/etc.)
    if (wantsNav) {
      const t = targetFromText(text);
      onGo(t.tab);
      if (t.id) setTimeout(() => scrollToIdWhenReady(t.id!), 0);
      // keep going to fetch a short blurb for the landed section
    }

    // 5) Worker fallback
    setBusy(true);
    setErr("");
    setSay("");
    setChips([]);
    try {
      const context = (document.body.textContent || "").slice(0, 4000);
      const raw = await askRemote(text, context);
      const out = coerceReply(raw);
      if (out.error) setErr(out.error);
      else {
        if (out.say) setSay(out.say);
        if (Array.isArray(out.chips)) setChips(out.chips.slice(0, 4));
      }
    } catch (e: any) {
      setErr(e?.message || "Failed to fetch");
    } finally {
      setBusy(false);
    }
  }

  const Panel = (
     <div className="p-4 rounded-[14px] border border-[var(--edge)] shadow-lg bg-white">
      <div className="flex items-center gap-3">
        <img src={navBuddyPng} alt="" width={36} height={36} className="rounded-md" />
        <div className="text-sm">
          <div className="font-extrabold">Navigation Assistant</div>
          <div className="opacity-80">Type what you want; I’ll jump there.</div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          ref={inputRef}
          className="dc-input"
          placeholder="Ask or command… e.g. 'show manet project', 'devops tools', 'who is Dennis?'"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
            if (e.key === "Escape") closePanel();
          }}
        />
        <button className="dc-btn tone-blue font-extrabold" onClick={() => handleSend()} disabled={busy}>
          {busy ? "…" : "Send"}
        </button>
      </div>

      {(say || err || chips.length > 0) && (
        <div className="mt-3 space-y-2">
          {say && <div className="text-sm leading-snug">{say}</div>}
          {err && <div className="text-sm text-red-600">Error: {err}</div>}
          {!!chips.length && (
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={c}
                  className="dc-btn tone-blue"
                  onClick={() => {
                    if (isNavChip(c, PROJECT_TITLES)) {
                      // project title chips or explicit nav chips jump
                      const proj = PROJ_INDEX.find((p) =>
                        c.toLowerCase().includes(p.title.toLowerCase())
                      );
                      if (proj) {
                        // jump to project
                        onGo("projects");
                        setTimeout(() => scrollToProjectByTitle(proj.title), 0);
                        // and echo a blurb
                        setSay(
                          `${PERSON_FIRST}’s “${proj.title}”: ${firstSentence(proj.ref.blurb || "")}`
                        );
                        setChips((proj.ref.badges || []).slice(0, 3));
                        return;
                      }
                      const t = targetFromText(c);
                      onGo(t.tab);
                      if (t.id) setTimeout(() => scrollToIdWhenReady(t.id!), 0);
                    } else {
                      handleSend(c);
                    }
                  }}
                  title={c}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (variant === "inline") {
    return (
      <div className="relative">
        {open && (
          <div
            ref={panelRef}
            className={`absolute right-0 top-[calc(100%+10px)] navbuddy-panel ${
              closing ? "closing" : ""
            } z-[80] w-[min(560px,92vw)]`}
          >
            {Panel}
          </div>
        )}

        <button
          className="dc-btn tone-blue icon-btn"
          aria-label="Open Nav Buddy"
          aria-expanded={open}
          onClick={() => {
            if (open) closePanel();
            else {
              setOpen(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }}
          title="Nav Buddy"
        >
          <img className="buddy-img" src={navBuddyPng} alt="" />
        </button>
      </div>
    );
  }

  // FAB variant
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div
          ref={panelRef}
          className={`mb-3 navbuddy-panel ${closing ? "closing" : ""} z-[80] w-[min(560px,92vw)]`}
        >
          {Panel}
        </div>
      )}
      <button
        className="dc-btn tone-blue icon-btn"
        aria-label="Open Nav Buddy"
        aria-expanded={open}
        onClick={() => (open ? closePanel() : (setOpen(true), setTimeout(() => inputRef.current?.focus(), 0)))}
        title="Nav Buddy"
      >
        <img className="buddy-img" src={navBuddyPng} alt="" />
      </button>
    </div>
  );
}
