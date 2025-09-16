import React from "react";
import DcCard from "../components/DcCard";
import ProjectCard from "../components/ProjectCard";
import type { Project } from "../data/site";

export default function MyProjects({
  projects,
  onOpenWriteup,
}: {
  projects: Project[];
  onOpenWriteup?: () => void;
}) {
  return (
    <div className="grid-chan" data-animate>
      <div className="span-12" data-ai-id="projects-top">
        <DcCard className="p-5">
          <h2 className="text-2xl font-extrabold">Some Stuff I've Built...</h2>
          <p className="mt-1 text-sm opacity-90">(And a video demo or two in glorious Zoom screen capture quality!)</p>
        </DcCard>
      </div>

      {projects.map((p, idx) => (
        <div className="span-4" key={p.title}>
          <ProjectCard {...p} animateDelay={`${idx * 80}ms`} onOpenWriteup={onOpenWriteup} />
        </div>
      ))}
    </div>
  );
}
