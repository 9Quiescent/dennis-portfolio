import unisaLogo from "../assets/unisa_logo.png";

/** Generic text for about, remember to change later future me */
const ABOUT_SUMMARY =
  "I ship calm reliability. Small, reversible changes. Tests that matter. Runbooks that save weekends. Platform work, clean frontends, and careful rollouts. If it breaks, fix it and write the play so it doesn’t repeat.";

const EXPERIENCE_POINTS: string[] = [
  "Lead Developer, Scrum Master, and Product Owner for a government partner (FSSA) R&D proposal management system. Shipped MVP to production and iterated in sprints.",
  "Owned architecture end-to-end: normalized SQL schema & migrations, C# REST APIs (ASP.NET Core Web API), Razor/Bootstrap UI, and Azure infrastructure provisioned with Terraform.",
  "Process & delivery: ran sprint ceremonies, backlog grooming, and release planning; wrote epics/user stories/acceptance criteria; managed change control, release notes, and stakeholder demos in Jira/Confluence.",
  "Quality & reliability: CI/CD via GitHub Actions/Azure DevOps with xUnit integration tests, schema checks, and static-analysis gates; one-click deploys with documented rollback plans and runbooks.",
  "Security by default: AuthN/AuthZ with role-based access, input validation, and OWASP ASVS-aligned practices; least-privilege identities and secrets management.",
  "Performance & DX: tuned EF Core queries and indexes, server-side pagination, and caching on read paths; structured logging and health checks kept the app responsive under realistic data volumes.",
  "Operational excellence: SLIs/SLOs, dashboards, and on-call-friendly docs; install/upgrade guides and onboarding scripts (Bash/PowerShell) for smooth handoffs.",
  "Collaboration & impact: partnered with research and IT to turn ambiguous requirements into shippable increments; delivered a maintainable codebase for final handoff.",
];

const TOOLING: Array<{ title: string; items: string[] }> = [
  { title: "Languages", items: ["C#", "Python", "Java", "TypeScript/JavaScript", "SQL", "C++", "Bash", "PowerShell"] },
  { title: "Frameworks", items: ["ASP.NET Core MVC", "Razor", "Entity Framework", "Web API (REST)", "React", "xUnit", "Tailwind CSS", "Vite"] },
  { title: "Cloud, Orchestration & Infra", items: ["AWS", "Azure", "Docker", "Kubernetes (AKS)", "Terraform", "Linux"] },
  { title: "Virtualisation & Lab", items: ["VMware Workstation/ESXi", "VirtualBox", "UTM (Apple Silicon)", "WSL2", "Docker Desktop", "Ubuntu"] },
  { title: "DevOps", items: ["GitHub Actions", "Azure DevOps Pipelines", "CI/CD", "Release Notes", "Runbooks", "Rollback Plans", "SemVer", "Docker Compose", "Cloudflare Pages/Workers"] },
  { title: "Networking & Security", items: ["OWASP ASVS", "OWASP Top 10", "AuthN/AuthZ", "Nmap", "Wireshark/PCAP", "Burp Suite (lab)", "Metasploit (lab)", "Threat-modeling"] },
  { title: "Data", items: ["ETL", "XQuery/BaseX", "XML/JSON", "Oracle XE", "Data Modeling", "Joins/Indexes"] },
  { title: "Observability & QA", items: ["Health checks", "SLIs/SLOs", "Structured logging", "Integration tests"] },
  { title: "Project & Docs", items: ["Jira", "Confluence", "ADRs", "Markdown"] },
  { title: "AI/ML", items: ["Python (pandas, numpy, Jupyter, Pytorch)", "scikit-learn", "matplotlib", "Hugging Face Transformers", "RAG (LangChain/LangGraph)", "Embeddings & vector DBs (pgvector/Pinecone)", "Evaluation (Ragas)", "FastAPI for model APIs"] },
];

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

function ToolGroup({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <li className="mb-1 break-inside-avoid">
      <span className="font-semibold">{title}:</span>{" "}
      <span className="opacity-90">{items.join(", ")}</span>
    </li>
  );
}

export default function AboutPanel() {
  return (
    <div className="grid-chan" data-animate>
      {/* A bit about me */}
      <div className="span-12">
        <DcCard className="p-5">
          <h2 className="text-2xl font-extrabold">A bit about me</h2>
          <p className="mt-2 opacity-90">{ABOUT_SUMMARY}</p>
        </DcCard>
      </div>

      {/* Education */}
      <div className="span-12">
        <DcCard className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <img
            src={unisaLogo}
            alt="University of South Australia"
            className="h-10 w-auto object-contain"
            loading="lazy"
            decoding="async"
          />
          <div>
            <h3 className="font-extrabold">Education</h3>
            <p className="opacity-90 text-sm mt-1">
              <b>Bachelor of Information Technology (Software Development)</b> —
              University of South Australia (UniSA).
            </p>
          </div>
        </DcCard>
      </div>

      {/* Tooling */}
      <div className="span-12">
        <DcCard className="p-4">
          <h3 className="text-lg font-extrabold">
            My Tooling & Technologies of Choice
          </h3>
          <ul className="mt-2 text-[13px] leading-snug md:columns-2 xl:columns-3 [column-gap:1.25rem]">
            {TOOLING.map((g) => (
              <ToolGroup key={g.title} title={g.title} items={g.items} />
            ))}
          </ul>
        </DcCard>
      </div>

      {/* Experience */}
      <div className="span-12">
        <DcCard className="p-5">
          <h3 className="text-lg font-extrabold">My Recent Experience Highlights</h3>
          <ul className="mt-2 list-disc pl-5 leading-relaxed text-sm">
            {EXPERIENCE_POINTS.map((line, i) => (
              <li key={i} className="opacity-90">
                {line}
              </li>
            ))}
          </ul>
        </DcCard>
      </div>
    </div>
  );
}
