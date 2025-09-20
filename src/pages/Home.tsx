import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import AboutPanel from "../sections/AboutPanel";
import ProjectsPanel from "../sections/ProjectsPanel";
import { projects as PROJECTS } from "../data/projects";

export type TabKey = "about" | "projects";

export default function Home(_props?: { contactEmail?: string }) {
  const [tab, setTab] = useState<TabKey>("about");

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-animate]")
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          el.style.transitionDelay = (el.dataset.delay as string) || "0ms";
          el.classList.add("in");
          io.unobserve(el);
        });
      },
      { threshold: 0.1 }
    );
    nodes.forEach((el, i) => {
      (el as any).dataset.delay = `${i * 70}ms`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, [tab]);

  return (
    <main className="min-h-screen text-ink bg-hero-sky">
      <header className="px-5 sm:px-10 pt-6 sm:pt-8">
        <div className="max-w-7xl mx-auto">
          <Hero active={tab} onGo={setTab} />
        </div>
      </header>

      <section className="px-5 sm:px-10 mt-5 sm:mt-6 pb-16">
        <div className="max-w-7xl mx-auto grid gap-5 sm:gap-6">
          {tab === "about" ? <AboutPanel /> : <ProjectsPanel projects={PROJECTS} />}
        </div>
      </section>
    </main>
  );
}
