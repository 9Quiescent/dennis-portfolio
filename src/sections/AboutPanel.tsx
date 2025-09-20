import unisaLogo from "../assets/unisa_logo.png";
import { ABOUT_SUMMARY, TOOLING, EXPERIENCE_POINTS, EDUCATION, EDU_JOINER, FUN_LINKS } from "../data/site";

export const ABOUT_ANCHORS = {
  summary: "about-summary",
  education: "about-education",
  tooling: "about-tooling",
  experience: "about-experience",
  links: "about-links",
} as const;

function DcCard({ className = "", children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={`dc-card ${className}`} data-animate>
      {children}
    </div>
  );
}

function ToolGroup({ title, items }: { title: string; items: string[] }) {
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
        <h2 className="text-2xl font-extrabold">A bit about me (& This Portfolio)</h2>
        <div className="mt-2 opacity-90 space-y-3">
            {ABOUT_SUMMARY.split(/\n{2,}/).map((para, i) => (
            <p key={i}>{para}</p>
            ))}
        </div>
        </DcCard>
      </div>

      {/* Education */}
      <div className="span-12" id={ABOUT_ANCHORS.education} style={{ scrollMarginTop: "120px" }}>
        <DcCard className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="inline-block overflow-hidden rounded-md sm:item">
            <img
                src={unisaLogo}
                alt="University of South Australia"
                className="block h-8 sm:h-10 w-auto object-contain"
                loading="lazy"
                decoding="async"
            />
            </div>
            <div>
            <h3 className="text-base sm:text-lg font-extrabold">Education</h3>
            {EDUCATION.map((e) => (
              <p key={e.degree} className="opacity-90 text-[13px] sm:text-sm mt-1">
                <b>{e.degree}</b>
                <span className="opacity-80">
                  {" "}
                  {EDU_JOINER}
                  {e.url ? (
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-dotted underline-offset-2"
                    >
                      {e.school}
                    </a>
                  ) : (
                    e.school
                  )}
                </span>
                {e.years && <span className="opacity-60"> • {e.years}</span>}
              </p>
            ))}
          </div>
        </DcCard>
      </div>

      {/* Tooling */}
      <div className="span-12" id={ABOUT_ANCHORS.tooling} style={{ scrollMarginTop: "120px" }}>
        <DcCard className="p-4">
          <h3 className="text-base sm:text-lg font-extrabold">The Tooling &amp; Technologies I am familiar with</h3>
          <ul className="mt-2 text-[13px] leading-snug md:columns-2 xl:columns-3 [column-gap:1.25rem]">
            {TOOLING.map((g) => (
              <ToolGroup key={g.title} title={g.title} items={g.items} />
            ))}
          </ul>
        </DcCard>
      </div>

      {/* Experience */}
      <div className="span-12" id={ABOUT_ANCHORS.experience} style={{ scrollMarginTop: "120px" }}>
        <DcCard className="p-4 sm:p-5">
          <h3 className="text-base sm:text-lg font-extrabold">My Recent Experience Highlights</h3>
          <ul className="mt-2 list-disc pl-5 leading-relaxed text-[13px] sm:text-sm">
            {EXPERIENCE_POINTS.map((line, i) => (
              <li key={i} className="opacity-90">{line}</li>
            ))}
          </ul>
        </DcCard>
      </div>

      {/* Fun Links */}
      <div className="span-12" id={ABOUT_ANCHORS.links} style={{ scrollMarginTop: "120px" }}>
        <DcCard className="p-4">
          <h3 className="text-base sm:text-lg font-extrabold">Links I find amusing</h3>
          <ul className="mt-2 text-[13px] leading-snug space-y-1 md:columns-2 [column-gap:1.25rem]">
            {FUN_LINKS.map((l) => (
              <li key={l.href} className="break-inside-avoid mb-1">
                <a
                  className="underline decoration-dotted underline-offset-2 hover:decoration-solid"
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.title}
                </a>
                <span className="opacity-80"> · {l.blurb}</span>
              </li>
            ))}
          </ul>
        </DcCard>
      </div>
    </div>
  );
}
