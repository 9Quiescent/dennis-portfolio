import React from "react";
import stickyTape from "../assets/stickytape.png";
import linkedinPng from "../assets/LinkedInlogo.png";
import headshot from "../assets/Dennis.jpeg";
const headshotSrc = headshot;

function Avatar({ name, src = headshot, size = 200 }: { name: string; src?: string; size?: number }) {
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  const dim = typeof size === "number" ? `${size}px` : size;
  return (
    <div className="flex items-center gap-4">
     <div className="avatar-wrap" style={{ width: dim, height: dim }}>
  <img
    className="block w-full h-full object-cover object-[50%_20%] rounded-[22px]"
    src={headshotSrc}
    alt={name}
  />
  <img className="tape tr" src={stickyTape} alt="" aria-hidden="true" />
  <img className="tape bl" src={stickyTape} alt="" aria-hidden="true" />
</div>
    </div>
  );
}

export default function Hero({
  name = "Dennis Kalongonda",
  tagline = "Software Engineer · AI/ML · DevSecOps · Cloud · SRE · FullStack (.NET) · Security · Support",
  linkedinUrl = "https://www.linkedin.com/in/dennis-kalongonda-083651193/",
}: {
  name?: string;
  tagline?: string;
  linkedinUrl?: string;
}) {
  return (
    <header className="px-6 pt-8 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="dc-card p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-6" id="content">
              <Avatar name={name} />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
                <div className="text-sm opacity-80">{tagline}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* primary action */}
              <a
                className="dc-btn tone-pink icon-btn"
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open LinkedIn profile"
                title="LinkedIn"
              >
                <img src={linkedinPng} alt="" width={22} height={22} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
