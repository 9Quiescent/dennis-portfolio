# Dennis Portfolio

Hey, I'm Dennis and you're in the repository for my portfolio site. 
The purpose of this portfolio is to make it ridiculously easy to find what you need (projects, skills, education) without wrestling the UI, and also show how I think about product trade‑offs, particularly where LLMs are useful, and where we should keep things boring (a.k.a. reliable).

---

## What this repo is (Currently)

It’s Vite + React + TypeScript + Tailwind v4 and a tiny bit of JavaScript. Built Using Visual Studio Code (MacOS) as an IDE, alongside too many extensions to count.

- **Two views**: **About** and **Projects**. The big pills in the hero switch between them.
- **NavBuddy**: the bubbleman button in the hero. Speak to the site to navigate, or ask a few on-topic questions.
- **Design language**: rounded cards, soft gradients, subtle shadows, light animation, subtle inspiration from the SEGA Dreamcast, and LOTS of baby blue.
- **Performance posture**: minimal dependencies, predictable CSS, tiny components.

If you’re skimming as a recruiter: hit **Projects** for demos and links, **About** for the summary, education (UniSA), tooling, and highlights. If you like shortcuts, try the tapping the bubbleman, type “projects” or “education” and the UI will take you there, while the LLM provides modular feedback.


---

## NavBuddy: my take on “use LLMs, but never allow over reliance LLMs, at least in their current form.”

So I really like video games, and something I really like is in games like Pokemon Stadium(/Stadium2/Colosseum/Battle Revolution), the announcer is equipped with voicelines for just about any scenario you'd encounter in game. Text-based output through LLMs, helps achieve a similar effect with reduced repetition, and easier management at scale. It is however, crucial that you provide the LLM extremely strict guide rails, so at least in this case, the basic UX isn't hanging off guesswork. NavBuddy is therefore built “deterministic first, LLM second.” Even with these guardrails however, there were various cases where due to the inherent behaviour of LLMs, I was wrestling with and had to dance around leaked raw JSON. I naturally overcame this with even stricter guardrails, but it was again, not without a lot pushback, as compared to the UI navigation which essentially just worked. Playwright was  my saving grace really, being able to test and rapidly iterate on the system through automated testing.

### How Navbuddy works

1. **Deterministic routing (no network).**  
   If you type “projects”, “about”, “education”, “tooling”, “experience” or anything that obviously maps to a section, with written intent to traverse, the UI itself switches the tab and scrolls to a corresponding collection of elements wrapped around an anchor. Zero latency. 

2. **LLM for feedback.**  
 NavBuddy *can* then also call an endpoint for a helpful response, dependent on the type of query. It gets a focused facts blob (summary, education, projects, tooling, experience), so it answers from the site’s own data.

**Why bother?**  
At its core, navigation should definitely be predictable, fast, and boring in a good way, while LLMs are great for fuzzy questions, context stitching, or “what should I look at?” moments. This split keeps the core flow solid while still letting the assistant be… helpful. The responses are still quite robotic regardless, but that's okay, seeing as LLMs *are* robots.

## Adding new content

I also wanted this portfolio to be intuitive on my end as I add new projects to the site, modify text or even want to remove content. Seeing as this will typically be static content that I do this with, I've created panels to handle intended presentation, which are populated in `src/data/site.ts` containing *what* should be wrapped around which panel. Site.ts essentially holds a set of constants:

- `ABOUT_SUMMARY`: longform text; use newlines for paragraphs.
- `EDUCATION`: `{ degree, school, url?, years? }[]`
- `TOOLING`: groups like `{ title, items: string[] }`
- `EXPERIENCE_POINTS`: string bullets
- `PROJECTS`: `{ title, blurb, badges?, links?, videoSrc?, posterSrc?, highlight? }[]`

Of which are plugged into my UI components for streamlined, DRY modification. This is also just a fundamental SOC.

---

## What I wanted to demonstrate

If you’re evaluating me for a role: you can glance at Projects for code and demos, About for context, and NavBuddy for my approach to “smart” features on the cutting edge. Naturally, this was also deployed to the Cloud (Cloudflare Pages/Workers), which was guard-railed by a tough CI/CD including Vitest. The goal with that was essentially locking any potential oversights that made it past my feature-based unit tests, out of production (Cloud).

---

## Licenses / Disclaimers

It’s my personal site, but I do not and will never claim to own specific graphics including the University of South Australia logo, or BubbleBuddy. Such content belongs to its respective copyright. 

- Dennis
