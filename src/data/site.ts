/* ---------- Types shared site-wide ---------- */
export type TabKey = "about" | "projects";
export type Tone = "orange" | "green" | "blue" | "pink";

export type Project = {
  title: string;
  blurb: string;
  badges: string[];
  links?: { label: string; href?: string }[];
  highlight?: boolean;
  videoSrc?: string;
  posterSrc?: string;
};

export type AIItem = { id: string; title: string; text: string; kind: "about" | "skill" | "project" | "tooling" };

/* ---------- Static content  ---------- */
export const LINKEDIN_URL = "https://www.linkedin.com/in/dennis-kalongonda-083651193/";

export const ABOUT_SUMMARY =
  "I ship calm reliability. Small, reversible changes. Tests that matter. Runbooks that save weekends. Platform work, clean frontends, and careful rollouts. If it breaks, fix it and write the play so it doesn’t repeat.";

export const TOOLING: Array<{ title: string; items: string[] }> = [
  { title: "Languages", items: ["C#", "Python", "Java", "TypeScript/JavaScript", "SQL", "C++", "Bash", "PowerShell"] },
  { title: "Frameworks", items: ["ASP.NET Core MVC", "Razor", "Entity Framework", "Web API (REST)", "React", "xUnit", "Tailwind CSS", "Vite"] },
  { title: "Cloud, Orchestration & Infra", items: ["AWS", "Azure", "Docker", "Kubernetes (AKS)", "Terraform", "Linux"] },
  { title: "Virtualisation & Lab", items: ["VMware Workstation/ESXi", "VirtualBox", "UTM (Apple Silicon)", "WSL2", "Docker Desktop", "Ubuntu"] },
  { title: "DevOps", items: ["GitHub Actions", "Azure DevOps Pipelines", "CI/CD", "Release Notes", "Runbooks", "Rollback Plans", "SemVer", "Docker Compose", "Cloudflare Pages/Workers"] },
  { title: "Networking & Security", items: ["OWASP ASVS", "OWASP Top 10", "AuthN/AuthZ", "Nmap", "Wireshark/PCAP", "Burp Suite (lab)", "Metasploit (lab)", "Threat-modeling"] },
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
  { title: "Missing Semester of CS", href: "https://missing.cs.mit.edu/", blurb: "Shell, git, editors, real-world glue every dev needs." },
];

export const EXPERIENCE_POINTS: string[] = [
  "Lead Developer, Scrum Master, and Product Owner for a government partner (FSSA) R&D proposal management system. Shipped MVP to production and iterated in sprints.",
  "Owned architecture end-to-end: normalized SQL schema & migrations, C# REST APIs (ASP.NET Core Web API), Razor/Bootstrap UI, and Azure infrastructure provisioned with Terraform.",
  "Process & delivery: ran sprint ceremonies, backlog grooming, and release planning; wrote epics/user stories/acceptance criteria; managed change control, release notes, and stakeholder demos in Jira/Confluence.",
  "Quality & reliability: CI/CD via GitHub Actions/Azure DevOps with xUnit integration tests, schema checks, and static-analysis gates; one-click deploys with documented rollback plans and runbooks.",
  "Security by default: AuthN/AuthZ with role-based access, input validation, and OWASP ASVS-aligned practices; least-privilege identities and secrets management.",
  "Performance & DX: tuned EF Core queries and indexes, server-side pagination, and caching on read paths; structured logging and health checks kept the app responsive under realistic data volumes.",
  "Operational excellence: SLIs/SLOs, dashboards, and on-call-friendly docs; install/upgrade guides and onboarding scripts (Bash/PowerShell) for smooth handoffs.",
  "Collaboration & impact: partnered with research and IT to turn ambiguous requirements into shippable increments; delivered a maintainable codebase for final handoff.",
];

/* ---------- Projects (with media) ---------- */
import atbxDemoMp4 from "../assets/attack-the-box-demo.mp4";
import mvcDemoMp4 from "../assets/secure-research-demo.mp4";

export const PROJECTS: Project[] = [
  {
    title: "Attack the Box Demonstration",
    blurb:
      "A self-contained security-focused training lab: from recon, to enumeration, to validating a legacy vulnerability in a sandbox, gathering evidence, and producing a mini-report. Emphasis on safety, explainability, and best defense practices.",
    badges: [
      "TCP/IP",
      "OSI Model",
      "Subnetting (/24)",
      "ICMP",
      "ARP",
      "Packet Capture",
      "PCAP Analysis",
      "Wireshark Filters",
      "Linux CLI",
      "Bash",
      "Kali Linux",
      "Nmap",
      "Metasploitable 2",
      "FTP",
      "Payload Crafting (msfvenom)",
      "Reverse TCP",
      "Evidence & Reporting",
    ],
    videoSrc: atbxDemoMp4,
    highlight: true,
    links: [{ label: "Read Write-up", href: "#" }],
  },
  {
    title: "Internal R&D Proposal Management System (.NET) · Video Demo Available",
    blurb:
      "A research and development management system I designed, built and shipped for a government partner. ASP.NET Core MVC + C# backend with SQL, Bootstrap/JS front-end. Beyond features, I owned CI/CD, release notes, schema design, install/upgrade docs, onboarding scripts (Bash/PowerShell), and rollback/runbooks. This is more of an internal tool, but I have been permitted to showcase a demo of the platform in the video below.",
    badges: [
      "C#",
      "Javascript",
      "xUnit Integration Testing",
      "Terraform",
      "LINQ",
      "ASP.NET Core MVC",
      "Razor",
      "Entity Framework",
      "Web API",
      "RESTful API",
      "SQL",
      "AuthN/AuthZ",
      "OWASP ASVS",
      "CI/CD",
      "Release Notes",
      "Runbooks",
      "Rollback",
      "Powershell/Bash Scripting",
      "Jira",
      "Confluence",
      "GitHub Actions / Azure DevOps",
    ],
    videoSrc: mvcDemoMp4,
  },
  {
    title: "MANET Visualiser",
    blurb:
      "An open-source, educational visualiser/simulator for mobile ad hoc network rules and behaviour. Tkinter GUI + clean OOP, with Dockerised dev for reproducible runs. SOLID/DRY and architecture tradeoffs.",
    badges: ["Python", "OOP", "Tkinter", "Simulation", "Instrumentation", "Docker"],
    links: [{ label: "View Public Repo", href: "https://github.com/9Quiescent/manet-sim" }],
  },
  {
    title: "NASA Software Release Data Warehouse",
    blurb:
      "End-to-end XML to relational transformation pipeline around unstructured NASA software releases: generate XML via Python, discover schema with Trang, validate, extract normalised CSVs with XQuery/BaseX, then load into Oracle XE (Docker) with PK/FK constraints and run analytics.",
    badges: [
      "Python 3",
      "JSON→XML",
      "XML",
      "XQuery 3.1",
      "BaseX 10",
      "Schema Discovery (Trang)",
      "xmllint Validation",
      "CSV Normalization",
      "Oracle XE (Docker)",
      "SQL (Oracle)",
      "Data Modeling",
      "PK/FK Constraints",
      "Joins & Aggregations",
      "Indexing",
      "ETL Orchestration",
      "Reproducible Runs",
      "DBeaver",
      "Containerised Environments",
    ],
    links: [{ label: "View Public Repo", href: "https://github.com/9Quiescent/json-xml-relational-pipeline" }],
  },
  {
    title: "Deadman's Draw in C++ · memory management focus [Academic Sample]",
    blurb:
      "C++ implementation of DMD with RAII/smart pointers and deterministic destruction. Focus on ownership, profiling and clean design; assessed with automated unit tests (HD).",
    badges: ["C++", "Memory Management", "Design Patterns", "RAII", "Smart Pointers", "Profiling", "Game Logic"],
    links: [{ label: "View Public Repo", href: "https://github.com/9Quiescent/Kaldt001_COMP_3023_A2" }],
  },
];
