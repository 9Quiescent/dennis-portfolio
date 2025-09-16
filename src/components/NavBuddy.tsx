import React, { useEffect, useRef, useState } from "react";
import type { TabKey } from "../pages/Home";
import navBuddyPng from "../assets/BubbleBud.png";

export type Variant = "inline" | "fab";

type Props = {
  onGo: (t: TabKey) => void;
  variant?: Variant;
  linkedinUrl?: string;
};

export default function NavBuddy({ onGo, variant = "inline", linkedinUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [q, setQ] = useState("");
  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Close on outside click
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
    }, 170);
  }

  function handleSend() {
    const text = q.trim().toLowerCase();
    if (!text) return;

    // simple intent routing
    if (/\blinked\s*in\b|\blinkedin\b/.test(text)) {
      if (linkedinUrl) window.open(linkedinUrl, "_blank", "noopener,noreferrer");
      closePanel();
      return;
    }
    if (/project|portfolio|demo/.test(text)) {
      onGo("projects");
      closePanel();
      return;
    }
    if (/about|bio|profile|summary/.test(text)) {
      onGo("about");
      closePanel();
      return;
    }
    // Default: try to be helpful — send to projects.
    onGo("projects");
    closePanel();
  }

  const Panel = (
    <div className="dc-card p-4 rounded-[14px]">
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
          placeholder="e.g. projects, about, LinkedIn"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
            if (e.key === "Escape") closePanel();
          }}
        />
        <button className="dc-btn tone-blue font-extrabold" onClick={handleSend}>
          Send
        </button>
      </div>
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
            if (open) {
              closePanel();
            } else {
              setOpen(true);
              // focus after paint
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

  // Minimal FAB variant (currently unused, kept for parity)
  return (
    <div className="fixed bottom-5 right-5 z-50 hidden">
      {open && (
        <div
          ref={panelRef}
          className={`mb-3 navbuddy-panel ${closing ? "closing" : ""} z-[80] w-[360px]`}
        >
          {Panel}
        </div>
      )}
      <button
        className="dc-btn tone-blue icon-btn"
        aria-label="Open Nav Buddy"
        aria-expanded={open}
        onClick={() => (open ? closePanel() : setOpen(true))}
        title="Nav Buddy"
      >
        <img className="buddy-img" src={navBuddyPng} alt="" />
      </button>
    </div>
  );
}
