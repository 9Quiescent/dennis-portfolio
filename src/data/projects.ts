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

export const projects: Project[] = [
  {
    title: "MANET Simulator",
    blurb:
      "A Python-based Mobile Ad-hoc Network visualizer and simulation tool.",
    link: "https://github.com/9Quiescent/manet-sim",
  },
  {
    title: "Proposal Management System",
    blurb:
      "Ver 1.0 of a continuously improving, full-stack project management application for a government partner using C#, ASP.NET, Razor Pages, and SQL as a backend. Includes a Bash-based automation script for efficient developer onboarding. Deployed using Electron Deployment tools.",
    link: "https://github.com/ICTCapstoneProject/ICT-Capstone",
  },
];
