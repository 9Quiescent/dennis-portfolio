// src/sections/AboutPanel.tsx
import unisaLogo from "../assets/unisa_logo.png";
import { ABOUT_SUMMARY, TOOLING, EXPERIENCE_POINTS } from "../data/site";

export const ABOUT_ANCHORS = {
  summary: "about-summary",
  education: "about-education",
  tooling: "about-tooling",
  experience: "about-experience",
} as const;

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

function ToolGroup({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <li className="mb-1 break-inside-avoid">
      <span className="font-semibold">{title}:</span>{" "}
      <span className="opacity-90">{items.join(", ")}</span>
    </li>
  );
}

export default function AboutPanel() {
  return (
    <div className="grid-chan" data-animate>
      {/* A bit about me */}
      <div className="span-12" id={ABOUT_ANCHORS.summary} style={{ scrollMarginTop: "120px" }}>
        <DcCard className="p-5">
          <h2 className="text-2xl font-extrabold">A bit about me</h2>
          <p className="mt-2 opacity-90">{ABOUT_SUMMARY}</p>
        </DcCard>
      </div>

      {/* Education */}
      <div className="span-12" id={ABOUT_ANCHORS.education} style={{ scrollMarginTop: "120px" }}>
        <DcCard className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <img
            src={unisaLogo}
            alt="University of South Australia"
            className="h-10 w-auto object-contain"
            loading="lazy"
            decoding="async"
          />
          <div>
            <h3 className="font-extrabold">Education</h3>
            <p className="opacity-90 text-sm mt-1">
              <b>Bachelor of Information Technology (Software Development)</b> —{" "}
              University of South Australia (UniSA).
            </p>
          </div>
        </DcCard>
      </div>

      {/* Tooling */}
      <div className="span-12" id={ABOUT_ANCHORS.tooling} style={{ scrollMarginTop: "120px" }}>
        <DcCard className="p-4">
          <h3 className="text-lg font-extrabold">
            My Tooling &amp; Technologies of Choice
          </h3>
        <ul className="mt-2 text-[13px] leading-snug md:columns-2 xl:columns-3 [column-gap:1.25rem]">
            {TOOLING.map((g) => (
              <ToolGroup key={g.title} title={g.title} items={g.items} />
            ))}
          </ul>
        </DcCard>
      </div>

      {/* Experience */}
      <div className="span-12" id={ABOUT_ANCHORS.experience} style={{ scrollMarginTop: "120px" }}>
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
    </div>
  );
}
