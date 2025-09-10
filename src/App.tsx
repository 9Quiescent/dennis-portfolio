type ProjectCardProps = { title: string; description: string; link: string };

function ProjectCard({ title, description, link }: ProjectCardProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-2xl shadow p-4 w-72 text-left hover:shadow-lg transition"
    >
      <h2 className="font-bold text-xl mb-1">{title}</h2>
      <p className="text-gray-500 text-sm mb-2">{description}</p>
      <span className="text-sm text-blue-500">View Project →</span>
    </a>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
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