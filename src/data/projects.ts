export type Project = {
  title: string;
  description: string;
  link: string;
};

export const projects: Project[] = [
  {
    title: "MANET Simulator",
    description:
      "A Python-based Mobile Ad-hoc Network visualizer and simulation tool.",
    link: "https://github.com/9Quiescent/manet-sim",
  },
  {
    title: "Proposal Management System",
    description:
      "Ver 1.0 of a continuously improving, full-stack project management application for a government partner using C#, ASP.NET, Razor Pages, and SQL as a backend. Includes a Bash-based automation script for efficient developer onboarding. Deployed using Electron Deployment tools.",
    link: "https://github.com/ICTCapstoneProject/ICT-Capstone",
  },
];
