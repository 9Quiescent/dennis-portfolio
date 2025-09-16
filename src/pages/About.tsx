import React from "react";
import DcCard from "../components/DcCard";
import unisaLogo from "../assets/unisa_logo.png";
import { ABOUT_SUMMARY, EXPERIENCE_POINTS, FUN_LINKS, TOOLING } from "../data/site";

function ToolGroup({ idAttr, title, items }: { idAttr: string; title: string; items: string[] }) {
  return (
    <li className="mb-1 break-inside-avoid" data-ai-id={idAttr}>
      <span className="font-semibold">{title}:</span> <span className="opacity-90">{items.join(", ")}</span>
    </li>
  );
}

export default function AboutPage() {
  return (
    <div className="grid-chan" data-animate>
      {/* A bit about me */}
      <div className="span-12" data-ai-id="about-summary">
        <DcCard className="p-5">
          <h2 className="text-2xl font-extrabold">A bit about me</h2>
          <p className="mt-2 opacity-90">{ABOUT_SUMMARY}</p>
        </DcCard>
      </div>

      {/* Education */}
      <div className="span-12" data-ai-id="education">
        <DcCard className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <img src={unisaLogo} alt="University of South Australia" className="h-10 w-auto object-contain" loading="lazy" />
          <div>
            <h3 className="font-extrabold">Education</h3>
            <p className="opacity-90 text-sm mt-1">
              <b>Bachelor of Information Technology (Software Development)</b> - University of South Australia (UniSA)
            </p>
          </div>
        </DcCard>
      </div>

      {/* Tooling */}
      <div className="span-12" data-ai-id="tooling-top">
        <DcCard className="p-4">
          <h3 className="text-lg font-extrabold">My Tooling &amp; Technologies of Choice</h3>
          <ul className="mt-2 text-[13px] leading-snug md:columns-2 xl:columns-3 [column-gap:1.25rem]">
            {TOOLING.map((group) => (
              <ToolGroup
                key={group.title}
                idAttr={`tooling-${group.title.toLowerCase().replace(/\s+/g, "-")}`}
                title={group.title}
                items={group.items}
              />
            ))}
          </ul>
        </DcCard>
      </div>

      {/* Experience */}
      <div className="span-12" data-ai-id="experience-highlights">
        <DcCard className="p-5">
          <h3 className="text-lg font-extrabold">My Recent Experience Highlights</h3>
          <ul className="mt-2 list-disc pl-5 leading-relaxed text-sm">
            {EXPERIENCE_POINTS.map((line, i) => (
              <li key={i} className="opacity-90">
                {line}
              </li>
            ))}
          </ul>
        </DcCard>
      </div>

      {/* Links */}
      <div className="span-12" data-ai-id="links-amusing">
        <DcCard className="p-4">
          <h3 className="text-lg font-extrabold">Links I find amusing</h3>
          <ul className="mt-2 text-[13px] leading-snug space-y-1 md:columns-2 [column-gap:1.25rem]">
            {FUN_LINKS.map((l) => (
              <li key={l.href} className="break-inside-avoid mb-1">
                <a className="underline decoration-dotted underline-offset-2 hover:decoration-solid" href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.title}
                </a>
                <span className="opacity-80"> - {l.blurb}</span>
              </li>
            ))}
          </ul>
        </DcCard>
      </div>
    </div>
  );
}
