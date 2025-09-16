import ProjectCard, { ProjectCardProps } from "../components/ProjectCard";

export type Project = {
  title: string;
  blurb: string;
  link?: string;
  badges?: string[];
  links?: { label: string; href?: string }[];
  videoSrc?: string;
  posterSrc?: string;
  highlight?: boolean;
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

export default function ProjectsPanel({
  projects,
}: {
  projects: Project[];
}) {
  return (
    <div className="grid-chan" data-animate>
      <div className="span-12">
        <DcCard className="p-5">
          <h2 className="text-2xl font-extrabold">Some Stuff I&apos;ve Built...</h2>
          <p className="mt-1 text-sm opacity-90">
            (And a video demo or two in glorious Zoom screen capture quality!)
          </p>
        </DcCard>
      </div>

      {projects.map((p, idx) => {
        const pc: ProjectCardProps = {
          title: p.title,
          blurb: p.blurb,
          badges: p.badges,
          links: p.links ?? (p.link ? [{ label: "View Project →", href: p.link }] : []),
          videoSrc: p.videoSrc,
          posterSrc: p.posterSrc,
          highlight: p.highlight,
          animateDelay: `${idx * 80}ms`,
        };
        return (
          <div key={p.title} className="span-4">
            <ProjectCard {...pc} />
          </div>
        );
      })}
    </div>
  );
}
