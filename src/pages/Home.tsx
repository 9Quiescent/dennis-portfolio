import Hero from "../components/Hero";
import ProjectCard from "../components/ProjectCard";
import { projects as defaultProjects } from "../data/projects";

type SimpleProject = {
  title: string;
  blurb: string;
  link?: string;
  badges?: string[];
};

export default function Home({
  projects = defaultProjects,
  contactEmail = "your.email@example.com",
}: {
  projects?: SimpleProject[];
  contactEmail?: string;
}) {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center py-12">
        <Hero />

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {projects.map((p) => (
            <ProjectCard
              key={p.title}
              title={p.title}
              blurb={p.blurb}
              link={p.link}
              badges={p.badges}
            />
          ))}
        </div>

        <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:underline">
          Contact
        </a>
      </div>
    </main>
  );
}
