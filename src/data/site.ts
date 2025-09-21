import proposalDemo from "../assets/secure-research-demo.mp4";
import atbxDemo from "../assets/attack-the-box.mp4";
/* ---------- Types shared site-wide ---------- */
export type TabKey = "about" | "projects";
export type Tone = "orange" | "green" | "blue" | "pink";

export type Project = {
  title: string;
  blurb: string;
  badges: string[];
  links?: { label: string; href?: string }[];
  highlight?: boolean;
  videoSrc?: string;   // can be a public URL path
  posterSrc?: string;  // optional poster image if i feel like it
};

export type AIItem = {
  id: string;
  title: string;
  text: string;
  kind: "about" | "skill" | "project" | "tooling";
};

/* ---------- Routes & anchors used across the app ---------- */
export const ABOUT_ANCHORS = {
  summary: "about-summary",
  education: "about-education",
  tooling: "about-tooling",
  experience: "about-experience",
} as const;

/* ---------- Static content ---------- */
export const LINKEDIN_URL =
  "https://www.linkedin.com/in/dennis-kalongonda-083651193/";

export type Education = {
  degree: string;
  school: string;
  url?: string;
  years?: string;
};

export const EDU_JOINER = " at ";

export const EDUCATION: Education[] = [
  {
    degree: "Bachelor of Information Technology (Software Development)",
    school: "University of South Australia (UniSA)",
    url: "https://www.unisa.edu.au/",
    years: "2023–2025",
  },
];

export const ABOUT_SUMMARY = `I love being a developer, and I love playing video games. Very big on mascot platformers like Mario, Sonic, Banjo Kazooie, Zelda, Donkey Kong and Metroid to name a few. I absolutely adore free days outdoors by Henley (or most beaches for that matter), and aspire to become a Corgi or Shiba Inu dad in the hopefully near future. One of these days, I'll also be good at playing the guitar, so keep your ears open for that! :)

Anyhow, I've built this portfolio for you guys (recruitment staff I assume) to be able find anything you'd possibly need to know about me as a prospective employee. 


If you're ever lost, you're always welcome to tap on the trusty bubble man in the blue box. He's been designed to be quite useful for navigation, and answering questions based on the content of this site. Naturally, if that's not your thing, this site is also designed to be an intuitive manual experience :D`;

export const TOOLING: Array<{ title: string; items: string[] }> = [
  { title: "Languages", items: ["C#", "Python", "Java", "TypeScript/JavaScript", "SQL", "C++", "Bash", "PowerShell"] },
  { title: "Frameworks", items: ["ASP.NET Core MVC", "Razor", "Entity Framework", "Web API (REST)", "React", "xUnit", "Tailwind CSS", "Vite"] },
  { title: "Cloud, Orchestration & Infra", items: ["AWS", "Azure", "Docker", "Kubernetes (AKS)", "Terraform", "Linux"] },
  { title: "Virtualisation & Lab", items: ["VMware Workstation/ESXi", "VirtualBox", "UTM (Apple Silicon)", "WSL2", "Docker Desktop", "Ubuntu"] },
  { title: "DevOps", items: ["GitHub Actions", "Azure DevOps Pipelines", "CI/CD", "Release Notes", "Rollback Plans", "SemVer", "Docker Compose", "Cloudflare Pages/Workers"] },
  { title: "Networking & Security", items: ["OWASP ASVS", "OWASP Top 10", "AuthN/AuthZ", "Nmap", "Wireshark/PCAP", "Metasploit (lab)", "Threat-modeling"] },
  { title: "Data", items: ["ETL", "XQuery/BaseX", "XML/JSON", "Oracle XE", "Data Modeling", "Joins/Indexes"] },
  { title: "Observability & QA", items: ["Health checks", "SLIs/SLOs", "Structured logging", "Integration tests"] },
  { title: "Project & Docs", items: ["Jira", "Confluence", "ADRs", "Markdown"] },
  {
    title: "AI/ML",
    items: [
      "Python (pandas, numpy, Jupyter, Pytorch)",
      "scikit-learn",
      "matplotlib",
      "Hugging Face Transformers",
      "RAG (LangChain/LangGraph)",
      "Embeddings & vector DBs (pgvector/Pinecone)",
      "Evaluation (Ragas)",
      "FastAPI for model APIs",
    ],
  },
];

export const FUN_LINKS: Array<{ title: string; href: string; blurb: string }> = [
  { title: "Choose Boring Technology (Dan McKinley)", href: "https://mcfunley.com/choose-boring-technology", blurb: "Winning by picking tools you can actually operate on-call." },
  {
    title: "The Log: Unifying Abstraction (Jay Kreps)",
    href: "https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying",
    blurb: "Why logs simplify data pipelines, stream processing, and CDC.",
  },
  { title: "Simple Made Easy (Rich Hickey) - talk", href: "https://youtu.be/SxdOUGdseq4", blurb: "‘Easy’ isn’t ‘simple’. Designing for essential complexity." },
  { title: "How Complex Systems Fail (Richard Cook)", href: "https://how.complexsystems.fail/", blurb: "Short field notes every SRE/engineer should carry around." },
  { title: "Data Looks Better Naked (Darkhorse Analytics)", href: "https://www.darkhorseanalytics.com/blog/data-looks-better-naked", blurb: "Remove-to-improve basics for readable charts." },
  { title: "Write Code That’s Easy to Delete", href: "https://www.youtube.com/watch?v=8bZh5LMaSmE", blurb: "Great 10-minute principle: deletion-friendly code ages best." },
  { title: "The Law of Leaky Abstractions (Joel Spolsky)", href: "https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/", blurb: "Abstractions leak, so design ops and UX accordingly." },
  { title: "Friends Don't Let Friends Make Bad Graphs", href: "https://github.com/cxli233/FriendsDontLetFriends", blurb: "Why certain types of data visualisations are bad." },
];

export const EXPERIENCE_POINTS: string[] = [
  "Lead Developer, Scrum Master, and Product Owner for a government partner (FSSA) R&D proposal management system. Shipped MVP to production and iterated in sprints.",
  "Owned architecture end-to-end: normalized SQL schema & migrations, C# REST APIs (ASP.NET Core Web API), Razor/Bootstrap UI, and Azure infrastructure provisioned with Terraform.",
  "Process & delivery: ran sprint ceremonies, backlog grooming, and release planning; wrote epics/user stories/acceptance criteria; managed change control, release notes, and stakeholder demos in Jira/Confluence.",
  "Quality & reliability: CI/CD via GitHub Actions/Azure DevOps with xUnit integration tests, schema checks, and static-analysis gates; one line deploys with documented rollback plans.",
  "Security by default: AuthN/AuthZ with role-based access, input validation, and OWASP ASVS-aligned practices; least-privilege identities and secrets management.",
  "Performance & DX: tuned EF Core queries and indexes, server-side pagination, and caching on read paths; structured logging and health checks kept the app responsive under realistic data volumes.",
  "Operational excellence: SLIs/SLOs, dashboards, and on-call-friendly docs; install/upgrade guides and onboarding scripts (Bash/PowerShell) for smooth handoffs.",
  "Collaboration & impact: partnered with research and IT to turn ambiguous requirements into shippable increments; delivered a maintainable codebase for final handoff.",
];
/* ---------- Projects (with media) ----------*/
const ATBX_DEMO_URL = "../assets/attack-the-box-demo.mp4";
const MVC_DEMO_URL  = "../assets/secure-research-demo.mp4";

export const PROJECTS: Project[] = [
  // 1) Portfolio FIRST
  {
    title: "Dennis' Portfolio",
    blurb:
      "The site you’re using. Vite + React + TypeScript with Tailwind, teeny bit of JavaScript. Navigation assistant for local Q&A (Large Language Model) and section navigation (UI), plus Playwright E2E and Vitest component tests. Deployed with a Github Actions and CloudFlare CI/CD.",
    badges: [
      "Vite","React","TypeScript", "JavaScript","Tailwind CSS","Playwright","Vitest",
      "GitHub Actions", "CI/CD","Cloudflare Pages/Workers", "Cloud","Accessibility", "LLM/Large Language Model", "AI/Artifical Intelligence", "ML/Machine Learning", "NLP", "Transformers", "AI/ML"
    ],
    links: [{ label: "View Public Repo", href: "https://github.com/9Quiescent/dennis-portfolio" }],
  },

  // 2) Attack the Box (video)
  {
    title: "Attack the Box Demonstration",
    blurb:
      "Security training lab: recon, enumeration, validating a legacy vuln in a sandbox, gathering evidence, and producing a live demonstration for all technical proficiencies. Emphasis on safety, explainability, and defense practices. A super smooth live commentary for this video demo, and the most unfortunate zoom compression.",
    badges: [
      "TCP/IP","OSI Model","Subnetting (/24)","ICMP","ARP","PCAP","Wireshark Filters",
      "Linux CLI","Bash","Kali Linux","Nmap","Metasploitable 2","FTP",
      "msfvenom","Reverse TCP","Evidence & Reporting"
    ],
    videoSrc: atbxDemo,
    highlight: true,
  },

  // 3) Proposal management system (video)
  {
    title: "R&D Proposal Management System",
    blurb:
      "An internal research and development proposal manager built for a government partner. ASP.NET Core MVC with SQL and a Javascript + CSS BS5 UI. I owned schema design, REST APIs, Azure Cloud CI/CD, release notes, install/upgrade docs, and rollback. Microsoft SQL Server was the team's RDBMS of choice. Delivered through the Agile/Scrum methodology over 6 sprints.Enjoy the video demo!",
    badges: [
      "C#","ASP.NET Core MVC","Razor","Entity Framework","Web API","REST", "SQL", "Microsoft SQL Server",
      "AuthN/AuthZ","OWASP ASVS","CI/CD","xUnit","Terraform","Cloud",
      "PowerShell/Bash","Jira","Confluence", "Agile", "Scrum", "GitHub Actions / Azure DevOps"
    ],
    videoSrc: proposalDemo,
  },

  // 4) MANET Visualiser
  {
    title: "MANET Visualiser",
    blurb:
      "Educational visualiser/simulator for mobile ad hoc network rules and behaviour. Tkinter GUI with clean OOP and Dockerised dev for reproducible runs.",
    badges: ["Python3","OOP/Object Orientated Programming","Tkinter","Simulation","Instrumentation","Docker"],
    links: [{ label: "View Public Repo", href: "https://github.com/9Quiescent/manet-sim" }],
  },

  // 5) Deadman’s Draw (C++)
  {
    title: "Deadman’s Draw in C++",
    blurb:
      "C++ implementation of DMD with RAII/smart pointers and deterministic destruction. Focus on ownership, memory management profiling, and clean design; an academic sample assessed with automated unit tests (HD).",
    badges: ["C++","Memory Management","Design Patterns", "OOP/Object Orientated Programming", "RAII","Smart Pointers","Profiling","Game Logic", "TDD/Test Driven Development", "Heap Objects", "Stack Objects", "Code Performance"],
    links: [{ label: "View Public Repo", href: "https://github.com/9Quiescent/Kaldt001_COMP_3023_A1" }],
  },

  // 6) NASA DW
  {
    title: "NASA Software Release Data Warehouse",
    blurb:
      "XML → relational pipeline around NASA software releases: generate XML via Python, discover schema with Trang, validate, extract normalised CSVs with XQuery/BaseX, then load into Oracle XE for analytics.",
    badges: [
      "Python3","JSON→XML","XML","XQuery 3.1","BaseX 10","Schema Discovery (Trang)",
      "xmllint","CSV Normalization","Oracle XE (Docker)","SQL (Oracle)","Data Modeling",
      "PK/FK Constraints","Joins & Aggregations","Indexing","ETL Orchestration","Reproducible Runs"
    ],
    links: [{ label: "View Public Repo", href: "https://github.com/9Quiescent/json-xml-relational-pipeline" }],
  },

  // 7) Java Farm Simulator (toy)
  {
    title: "Java Farm Simulator",
    blurb:
      "Small simulation of fields, crops, and livestock with tick-based progression. Focus on domain modelling, collections, and clear object lifecycles. Assessed using automated unit tests, awarded an HD.",
    badges: ["Java","OOP/Object Orientated Programming","Data Structures", "Collections","Simulation Loop","JUnit","Maven/Gradle","CLI", "TDD/Test Driven Development", "Game Logic"],
    links: [{ label: "View Public Repo", href: "https://github.com/9Quiescent/A1.3-git-fix" }],
  },
];

/* ---------- AI Items (lightweight context for NavBuddy) ---------- */
const TOOLING_FLAT = TOOLING.map(g => `${g.title}: ${g.items.join(", ")}`).join(" | ");

export const AI_ITEMS: AIItem[] = [
  {
    id: ABOUT_ANCHORS.summary,
    title: "About me summary",
    text: ABOUT_SUMMARY,
    kind: "about",
  },
  {
    id: ABOUT_ANCHORS.education,
    title: "Education @ Bachelor of IT (Software Development), UniSA",
    text: "Bachelor of Information Technology (Software Development) @ University of South Australia (UniSA).",
    kind: "about",
  },
  {
    id: ABOUT_ANCHORS.tooling,
    title: "Tooling & Technologies",
    text: TOOLING_FLAT,
    kind: "tooling",
  },
  {
    id: ABOUT_ANCHORS.experience,
    title: "Recent experience highlights",
    text: EXPERIENCE_POINTS.join(" "),
    kind: "about",
  },
  ...PROJECTS.map<AIItem>((p, i) => ({
    id: `project-${i}`,
    title: p.title,
    text: `${p.blurb} ${p.badges.join(", ")}`,
    kind: "project",
  })),
];
