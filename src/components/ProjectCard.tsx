export type ProjectCardProps = { title: string; description: string; link: string };

export default function ProjectCard({ title, description, link }: ProjectCardProps) {
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
