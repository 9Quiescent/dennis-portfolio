import React, { useEffect, useRef, useState } from "react";
import type { TabKey } from "../data/site";
import navBuddyPng from "../assets/BubbleBud.png";
import { ABOUT_ANCHORS } from "../sections/AboutPanel";
import {
  ABOUT_SUMMARY,
  EDUCATION,
  TOOLING,
  EXPERIENCE_POINTS,
  PROJECTS,
} from "../data/site";

export type Variant = "inline" | "fab";
type Props = { onGo: (t: TabKey) => void; variant?: Variant; linkedinUrl?: string };

const WORKER_ENDPOINT: string | undefined =
  (import.meta as any).env?.VITE_NAVBUDDY_ENDPOINT ??
  (globalThis as any).__NAVBUDDY_ENDPOINT;

const PROJECTS_TOP_ID = "projects-top";
type Target = { tab: TabKey; id?: string };

function scrollToIdWhenReady(id: string, tries = 24) {
  const el = document.getElementById(id);
  if (el) return void (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
  if (tries > 0) requestAnimationFrame(() => scrollToIdWhenReady(id, tries - 1));
}

function resolveTarget(q: string): Target {
  const t = q.toLowerCase();
  if (/(education|degree|unisa|university)/.test(t)) return { tab: "about", id: ABOUT_ANCHORS.education };
  if (/(tool(ing)?s?|skills?|tech(\s*stack)?)/.test(t)) return { tab: "about", id: ABOUT_ANCHORS.tooling };
  if (/(experience|highlights|recent)/.test(t)) return { tab: "about", id: ABOUT_ANCHORS.experience };
  if (/\babout\b|bio|summary|profile/.test(t)) return { tab: "about", id: ABOUT_ANCHORS.summary };
  if (/project|portfolio|work|built|builds?/.test(t)) return { tab: "projects", id: PROJECTS_TOP_ID };
  return { tab: "projects", id: PROJECTS_TOP_ID };
}

function isNavIntent(q: string): boolean {
  const t = q.trim().toLowerCase();
  if (["projects", "project", "about", "linkedin", "education"].includes(t)) return true;
  if (/\b(go|open|show|take|jump|scroll|navigate|view|see)\b/.test(t)) return true;
  if (/\b(go|take)\s+me\s+(to|into)\b/.test(t)) return true;
  if (/\bshow\s+me\b/.test(t)) return true;
  if (/^(who|what|where|when|why|how)\b/.test(t)) return false;
  return false;
}

function isNavChip(c: string) { return /\b(about|projects|education|linkedin)\b/.test(c.toLowerCase()); }

type WorkerReply = { say?: string; chips?: string[]; error?: string };

async function askWorker(query: string, context: string): Promise<WorkerReply | null> {
  if (!WORKER_ENDPOINT) return null;
  const res = await fetch(WORKER_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, context }),
  });
  if (!res.ok) throw new Error(`LLM error: ${res.status}`);
  return (await res.json()) as WorkerReply;
}

function buildFactsBlob() {
  const educationText = EDUCATION.map(
    (e) => `${e.degree}${e.school ? ` at ${e.school}` : ""}${e.years ? ` (${e.years})` : ""}`
  ).join(" • ");

  // Canonical, machine-readable projects
  const projectsJson = JSON.stringify(
    PROJECTS.map((p) => ({
      title: p.title,
      blurb: p.blurb,
      badges: p.badges,
      allText: [p.title, p.blurb, (p.badges || []).join(" ")].join(" "),
    }))
  );

  const toolingJson = JSON.stringify(TOOLING);

  // Human-readable backup
  const projectsLines = PROJECTS.map((p) => {
    const badges = p.badges?.length ? ` [${p.badges.join(", ")}]` : "";
    return `• ${p.title} — ${p.blurb}${badges}`;
  }).join("\n");

  const experienceFlat = EXPERIENCE_POINTS.join(" ");

  return [
    "[PROJECTS_JSON]", projectsJson, "[END_PROJECTS_JSON]",
    "[PROJECT_TITLES]", PROJECTS.map(p => p.title).join(" | "),
    "[TOOLING_JSON]", toolingJson,
    "[PROJECTS]", projectsLines || "—",
    "[SUMMARY]", ABOUT_SUMMARY,
    "[EDUCATION]", educationText || "—",
    "[EXPERIENCE]", experienceFlat || "—",
  ].join("\n");
}

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
  const replyEpoch = useRef(0);

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

    if (/\blinked\s*in\b|\blinkedin\b/i.test(text) && linkedinUrl) {
      try { window.open(linkedinUrl, "_blank", "noopener,noreferrer"); } catch {}
    }
    if (isNavIntent(text)) {
      const t = resolveTarget(text);
      onGo(t.tab);
      if (t.id) setTimeout(() => scrollToIdWhenReady(t.id!), 0);
    }

    replyEpoch.current += 1;
    const epoch = replyEpoch.current;

    setBusy(true); setErr(""); setSay(""); setChips([]);
    try {
      const context = buildFactsBlob();
      const out = await askWorker(text, context);
      if (epoch !== replyEpoch.current) return;
      if (!out) { setErr("No LLM endpoint configured."); return; }
      if (out.error) setErr(out.error);
      if (typeof out.say === "string") setSay(out.say);
      if (Array.isArray(out.chips)) setChips(Array.from(new Set(out.chips)).slice(0, 4));
    } catch (e: any) {
      if (epoch !== replyEpoch.current) return;
      setErr(e?.message || "Failed to reach assistant");
    } finally {
      if (epoch === replyEpoch.current) setBusy(false);
    }
  }

  const Panel = (
    <div className="p-4 rounded-[14px] border border-[var(--edge)] shadow-lg bg-white max-h-[60vh] overflow-y-auto">
      <div className="flex items-center gap-3">
        <img src={navBuddyPng} alt="" width={36} height={36} className="rounded-md" />
        <div className="text-sm">
          <div className="font-extrabold">The Trusty Bubbleman</div>
          <div className="opacity-80">Type what you want; I’ll jump there.</div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          ref={inputRef}
          className="dc-input"
          placeholder="Ask or command… e.g. 'show education', 'projects', 'linkedin'"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); if (e.key === "Escape") closePanel(); }}
        />
        <button className="dc-btn tone-blue font-extrabold" onClick={() => handleSend()} disabled={busy}>
          {busy ? "…" : "Send"}
        </button>
      </div>

      {(say || err || chips.length > 0) && (
        <div className="mt-3 space-y-2">
          {say && (
            <div
              data-testid="navbuddy-say"
              className="text-sm leading-snug whitespace-pre-wrap break-words"
            >
              {say}
            </div>
          )}
          {err && <div className="text-sm text-red-600">Error: {err}</div>}
          {!!chips.length && (
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={c}
                  className="dc-btn tone-blue"
                  onClick={() => {
                    if (isNavChip(c)) {
                      const t = resolveTarget(c);
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
            className={`absolute right-0 top-[calc(100%+10px)] navbuddy-panel ${closing ? "closing" : ""} z-[80] w-[min(560px,92vw)]`}
            style={{ overflow: "visible" }}   // hard override to prevent clipping
          >
            {Panel}
          </div>
        )}
        <button
          className="dc-btn tone-blue icon-btn"
          aria-label="Open Nav Buddy"
          aria-expanded={open}
          onClick={() => { if (open) closePanel(); else { setOpen(true); setTimeout(() => inputRef.current?.focus(), 0); } }}
          title="Nav Buddy"
        >
          <img className="buddy-img" src={navBuddyPng} alt="" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div
          ref={panelRef}
          className={`mb-3 navbuddy-panel ${closing ? "closing" : ""} z-[80] w-[min(560px,92vw)]`}
          style={{ overflow: "visible" }}   // hard override to prevent clipping
        >
          {Panel}
        </div>
      )}
      <button
        className="dc-btn tone-blue icon-btn"
        aria-label="Open Nav Buddy"
        aria-expanded={open}
        onClick={() => open ? closePanel() : (setOpen(true), setTimeout(() => inputRef.current?.focus(), 0))}
        title="Nav Buddy"
      >
        <img className="buddy-img" src={navBuddyPng} alt="" />
      </button>
    </div>
  );
}
