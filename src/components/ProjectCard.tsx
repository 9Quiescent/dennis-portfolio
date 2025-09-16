import React from "react";
export type LinkBtn = { label: string; href?: string };
export type ProjectCardProps = {
  title: string;
  blurb: string;
  badges?: string[];
  links?: LinkBtn[];
  videoSrc?: string;
  posterSrc?: string;
  highlight?: boolean;
  animateDelay?: string; // for staggered fade like the old app
  onOpenWriteup?: () => void;
};

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

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="pill">{children}</span>;
}

function DcLink({
  href,
  children,
  tone = "blue",
}: {
  href?: string;
  children: React.ReactNode;
  tone?: "blue" | "pink" | "green" | "orange";
}) {
  return href ? (
    <a className={`dc-btn tone-${tone}`} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <span className="dc-btn tone-blue opacity-60 pointer-events-none">{children}</span>
  );
}

export default function ProjectCard({
  title,
  blurb,
  badges = [],
  links = [],
  videoSrc,
  posterSrc,
  highlight,
  animateDelay,
  onOpenWriteup,
}: ProjectCardProps) {
  return (
    <article data-animate style={{ transitionDelay: animateDelay }}>
      <DcCard className="relative p-5">
        <h3 className="text-lg font-extrabold">{title}</h3>
        <p className="mt-2 text-sm opacity-90">{blurb}</p>

        {videoSrc && (
          <div className="mt-3 rounded-xl overflow-hidden border border-[var(--edge)] bg-black/5">
            <video
              className="w-full h-auto"
              style={{ aspectRatio: "16 / 9" }}
              src={videoSrc}
              poster={posterSrc}
              controls
              playsInline
              preload="metadata"
              controlsList="nodownload noplaybackrate"
              aria-label={`${title} video`}
            />
          </div>
        )}

        {!!badges.length && (
          <div className="mt-3 flex flex-wrap gap-2">
            {badges.map((b) => (
              <Pill key={b}>{b}</Pill>
            ))}
          </div>
        )}

        {!!links.length && (
          <div className="mt-4 flex flex-wrap gap-2">
            {links.map((l, i) => {
              const isWriteup =
                l.label.toLowerCase().includes("write-up") ||
                l.label.toLowerCase().includes("writeup");
              if (isWriteup && onOpenWriteup) {
                return (
                  <button
                    key={i}
                    className="dc-btn tone-blue"
                    onClick={() => onOpenWriteup()}
                  >
                    {l.label}
                  </button>
                );
              }
              return (
                <DcLink key={i} href={l.href} tone="blue">
                  {l.label}
                </DcLink>
              );
            })}
          </div>
        )}

        {highlight && <div className="highlight-ring" />}
      </DcCard>
    </article>
  );
}
