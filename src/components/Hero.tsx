import React from "react";
import type { TabKey } from "../pages/Home";
import headshot from "../assets/Dennis.jpeg";
import stickyTape from "../assets/Stickytape.png";
import linkedinPng from "../assets/LinkedInlogo.png";
import NavBuddy from "./NavBuddy";

type Tone = "orange" | "green" | "blue" | "pink";

function DcCard({
  className = "",
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={`dc-card ${className}`} data-animate>
      {children}
    </div>
  );
}

function Pill({
  children,
  tone = "blue",
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  tone?: Tone;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={`dc-btn tone-${tone} ${active ? "dc-btn-active" : ""}`}
      onClick={onClick}
    >
      <span className="nav-big">{children}</span>
    </button>
  );
}

function Avatar({
  size = "clamp(120px, 36vw, 200px)",
  name,
}: {
  size?: number | string;
  name: string;
}) {
  const dim = typeof size === "number" ? `${size}px` : size;
  return (
    <div className="flex items-center gap-4">
      <div className="avatar-wrap relative" style={{ width: dim, height: dim }}>
        <img
          className="w-full h-full object-cover object-[50%_20%] rounded-[22px]"
          src={headshot}
          alt={name}
          loading="lazy"
          decoding="async"
        />
        <img className="tape tr" src={stickyTape} alt="" aria-hidden="true" />
        <img className="tape bl" src={stickyTape} alt="" aria-hidden="true" />
      </div>
    </div>
  );
}

export default function Hero({
  active,
  onGo,
}: {
  active: TabKey;
  onGo: (t: TabKey) => void;
}) {
  const LINKEDIN_URL =
    "https://www.linkedin.com/in/dennis-kalongonda-083651193/";

  return (
    // Isolated stacking so NavBuddy overlays content below when open.
    <div className="relative z-30 isolate">
      <DcCard className="relative overflow-visible p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: avatar + name */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-6" id="content">
            <Avatar name="Dennis Kalongonda" />
            <div>
              <h1
                data-nav="name"
                className="text-2xl sm:text-3xl font-bold tracking-tight"
              >
                Dennis Kalongonda
              </h1>
              <div
                data-nav="tagline"
                className="text-[13px] sm:text-sm opacity-80"
              >
                Software Engineer · AI/ML · DevSecOps · Cloud · FullStack (.NET) · Security · Support
              </div>
            </div>
          </div>

          {/* Right: pills + NavBuddy + LinkedIn */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Pill
              tone="orange"
              active={active === "about"}
              onClick={() => onGo("about")}
            >
              About
            </Pill>
            <Pill
              tone="green"
              active={active === "projects"}
              onClick={() => onGo("projects")}
            >
              Projects
            </Pill>

            {/* Inline NavBuddy (panel overlays below when open). */}
            <NavBuddy onGo={onGo} variant="inline" />

            {/* LinkedIn (filled icon button) */}
            <a
              className="dc-btn tone-pink icon-btn"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open LinkedIn profile"
              title="LinkedIn"
            >
              <img src={linkedinPng} alt="" width={22} height={22} loading="lazy" decoding="async" />
            </a>
          </div>
        </div>
      </DcCard>
    </div>
  );
}
