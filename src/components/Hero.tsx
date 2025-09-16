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
    <div {...rest} className={`dc-card p-5 ${className}`} data-animate>
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
  size = 200,
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
    // Create an isolated, high z-index stacking context so NavBuddy can overlay sections below.
    <div className="relative z-30 isolate">
      <DcCard className="relative overflow-visible">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: avatar + name */}
          <div className="flex items-center gap-6" id="content">
            <Avatar name="Dennis Kalongonda" size={200} />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Dennis Kalongonda
              </h1>
              <div className="text-sm opacity-80">
                Software Engineer · AI/ML · DevSecOps · Cloud · SRE · FullStack
                (.NET) · Security · Support
              </div>
            </div>
          </div>

          {/* Right: pills + NavBuddy + LinkedIn */}
          <div className="flex flex-wrap items-center gap-3">
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

            {/* Inline NavBuddy. Panel will overlay content below. */}
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
              <img src={linkedinPng} alt="" width={22} height={22} />
            </a>
          </div>
        </div>
      </DcCard>
    </div>
  );
}
