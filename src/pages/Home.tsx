import ProjectCard from "../components/ProjectCard";

export default function Home() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-extrabold mb-2">Dennis Kalongonda</h1>
        <p className="text-lg text-gray-600 mb-8">
          Software Engineer | Networking | Hardware | Research
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <ProjectCard
            title="MANET Simulator"
            description="A Python-based Mobile Ad-hoc Network visualizer and simulation tool."
            link="https://github.com/9Quiescent/manet-sim"
          />
          <ProjectCard
            title="Proposal Management System"
            description="Ver 1.0 of a continuously improving, full-stack project management application for a government partner using C#, ASP.NET, Razor Pages, and SQL as a backend. includes a Bash- based automation script for efficient developer onboarding. Deployed using Electron Deployment tools."
            link="github.com/ICTCapstoneProject/ICT-Capstone"
          />
        </div>

        <a href="mailto:your.email@example.com" className="text-blue-600 hover:underline">
          Contact
        </a>
      </div>
    </div>
  );
}
