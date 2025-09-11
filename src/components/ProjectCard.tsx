import React from "react";

type ProjectCardProps = {
  title: string;
  blurb?: string;          // old name
  description?: string;    // your current data uses this
  link?: string;
  badges?: string[];
};

export default function ProjectCard({
  title,
  blurb,
  description,
  link,
  badges = [],
}: ProjectCardProps) {
  const text = blurb ?? description ?? "";

  const CardInner = (
    <div className="dc-card p-5 hover:-translate-y-px transition will-change-transform">
      <h3 className="text-lg font-extrabold">{title}</h3>
      <p className="mt-2 text-sm opacity-90">{text}</p>
      {!!badges.length && (
        <div className="mt-3 flex flex-wrap gap-2">
          {badges.map((b) => (
            <span key={b} className="pill">{b}</span>
          ))}
        </div>
      )}
      {link && (
        <div className="mt-4">
          <span className="dc-btn tone-blue">View Project →</span>
        </div>
      )}
    </div>
  );

  return link ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block" data-animate>
      {CardInner}
    </a>
  ) : (
    <article data-animate>{CardInner}</article>
  );
}
