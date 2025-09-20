// tests/recruiter-smoke.spec.ts
import { test, expect } from "@playwright/test";
import {
  buildBadgeIndex,
  queryToTools,
  resolveByTools,
} from "../../src/ai/matcher";

type Project = { title: string; blurb: string; badges: string[]; allText?: string };

function parseProjects(ctx: string): Project[] {
  const start = ctx.indexOf("[PROJECTS_JSON]");
  const end = ctx.indexOf("[END_PROJECTS_JSON]");
  if (start < 0 || end < 0) return [];
  const raw = ctx.slice(start + "[PROJECTS_JSON]".length, end).trim();
  try { return JSON.parse(raw) as Project[]; } catch { return []; }
}

function answerFromBadges(query: string, projects: Project[]) {
  if (!projects.length) return null;
  const index = buildBadgeIndex(projects.map(p => ({ title: p.title, blurb: p.blurb, badges: p.badges })));
  const TOOL_HINT = /\b(use|uses|using|used|with|built (with|on)|leverage|leverages|stack|tech|tools?)\b/i;
  const q = String(query || "");

  if (TOOL_HINT.test(q) || /\bwhich\b.*\b(projects?)\b.*\b(use|with|built)\b/i.test(q)) {
    const tools = queryToTools(q);
    const needsAll = /\band\b|\+/i.test(q);
    if (tools.length) {
      const matches = resolveByTools(index, tools, needsAll ? "all" : "any");
      return matches.length
        ? { say: `Matches for ${tools.join(needsAll ? " + " : " | ")}: ${matches.join(", ")}.`, chips: matches.slice(0, 4) }
        : { say: "No matching projects found in the portfolio badges.", chips: [] };
    }
  }

  if (/\b(list|name|show)\b.*\bprojects?\b/i.test(q)) {
    const titles = projects.map(p => p.title);
    return titles.length
      ? { say: `Projects: ${titles.join(", ")}.`, chips: titles.slice(0, 4) }
      : { say: "Not provided on the portfolio site.", chips: [] };
  }
  return null;
}

async function openAssistant(page) {
  await page.goto("/");
  await page.getByRole("button", { name: /open nav buddy/i }).click();

  const panel = page.locator(".navbuddy-panel"); // container for say + chips
  const say = panel.getByTestId("navbuddy-say");
  const input = panel.getByPlaceholder(/ask or command/i);

  // helper: check a chip (button) inside the panel
  const chip = (re: RegExp) => panel.getByRole("button", { name: re });

  return { panel, say, input, chip };
}

test.describe("Recruiter-style smoke tests (badge-driven)", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => { (window as any).__NAVBUDDY_ENDPOINT = "https://worker.test/navbuddy"; });

    await page.route("https://worker.test/navbuddy", async (route) => {
      const body = await route.request().postDataJSON();
      const query = String(body?.query || "");
      const ctx = String(body?.context || "");
      const projects = parseProjects(ctx);
      const det = answerFromBadges(query, projects);
      if (det) {
        await route.fulfill({ status: 200, headers: { "content-type": "application/json" }, body: JSON.stringify(det) });
        return;
      }
      await route.fulfill({
        status: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ say: "Not provided on the portfolio site.", chips: [] }),
      });
    });
  });

  // --- AI vs API ambiguity ---
  test("AI ≠ API: 'projects that use ai' should NOT pull Web API projects", async ({ page }) => {
    const { say, input, chip } = await openAssistant(page);
    await input.fill("projects that use ai");
    await input.press("Enter");

    await expect(say).toBeVisible();
    await expect(say).toContainText(/Matches for/i);
    await expect(chip(/Portfolio/i)).toBeVisible();
    await expect(chip(/Proposal Management|R&D Proposal/i)).toHaveCount(0);
  });

  // --- Stop-words + 'where' clause ---
  test("'where he used' stop-words: Web API", async ({ page }) => {
    const { input, chip } = await openAssistant(page);
    await input.fill("show me projects where he used web api");
    await input.press("Enter");
    await expect(chip(/Proposal Management/i)).toBeVisible();
  });

  // --- Synonyms / phrasing variants ---
  test("Synonymy: 'built on REST' → Web API project", async ({ page }) => {
    const { input, chip } = await openAssistant(page);
    await input.fill("which projects were built on rest?");
    await input.press("Enter");
    await expect(chip(/Proposal Management/i)).toBeVisible();
  });

  // --- Multiple tokens (AND) ---
  test("AND: 'React and TypeScript' → Portfolio", async ({ page }) => {
    const { input, chip } = await openAssistant(page);
    await input.fill("show me projects built with react and typescript");
    await input.press("Enter");
    await expect(chip(/Portfolio/i)).toBeVisible();
  });

  // --- Multiple tokens (OR) ---
  test("OR: 'Docker or Oracle' → returns any matching (MANET, NASA DW)", async ({ page }) => {
    const { input, chip } = await openAssistant(page);
    await input.fill("which projects use docker or oracle?");
    await input.press("Enter");
    await expect(chip(/MANET Visualiser/i)).toBeVisible();
    await expect(chip(/NASA Software Release Data Warehouse/i)).toBeVisible();
  });

  // --- Security-y queries that still map to badges ---
  test("Security term: 'OWASP' → R&D Proposal", async ({ page }) => {
    const { input, chip } = await openAssistant(page);
    await input.fill("show me projects with owasp");
    await input.press("Enter");
    await expect(chip(/Proposal Management/i)).toBeVisible();
  });

  test("Lab tooling: 'Nmap' → Attack the Box", async ({ page }) => {
    const { input, chip } = await openAssistant(page);
    await input.fill("any projects using nmap?");
    await input.press("Enter");
    await expect(chip(/Attack the Box Demonstration/i)).toBeVisible();
  });

  // --- Data/ETL stack ---
  test("ETL / Oracle pipeline → NASA DW", async ({ page }) => {
    const { input, chip } = await openAssistant(page);
    await input.fill("projects with etl and oracle");
    await input.press("Enter");
    await expect(chip(/NASA Software Release Data Warehouse/i)).toBeVisible();
  });

  // --- DevOps / CI ---
  test("CI/CD experience → Proposal (badges: CI/CD, GitHub Actions/Azure DevOps)", async ({ page }) => {
    const { input, chip } = await openAssistant(page);
    await input.fill("which projects show ci/cd?");
    await input.press("Enter");
    await expect(chip(/Proposal Management/i)).toBeVisible();
  });

  // --- Containerization ---
  test("Dockerized work → MANET & NASA DW (via chips)", async ({ page }) => {
    const { input, chip } = await openAssistant(page);
    await input.fill("do you have any dockerised projects?");
    await input.press("Enter");
    await expect(chip(/MANET Visualiser/i)).toBeVisible();
    await expect(chip(/NASA Software Release Data Warehouse/i)).toBeVisible();
  });

  // --- Languages ---
  test("C++ project request navigates to Projects and surfaces the C++ card", async ({ page }) => {
  const { say, input } = await openAssistant(page);

  await input.fill("show me your c++ work");
  await input.press("Enter");

  // 1) The assistant keeps it brief and suggests the projects page for code
  await expect(say).toBeVisible();
  await expect(say).toContainText(/projects page/i); // e.g., "Please look through the projects page for code."

  // 2) The UI navigates/scrolls to Projects; assert the C++ project card is visible
  const cppHeading = page.getByRole("heading", { name: /Deadman[’']s Draw in C\+\+/i });
  await expect(cppHeading).toBeVisible({ timeout: 10000 });
  });

  // --- General 'stack' phrasing should still map to tooling tokens ---
  test("'What’s your stack?' phrasing with tokens → React/TS hit", async ({ page }) => {
    const { input, chip } = await openAssistant(page);
    await input.fill("which projects in your stack use react?");
    await input.press("Enter");
    await expect(chip(/Portfolio/i)).toBeVisible();
  });

  // --- Hard no-match remains graceful ---
  test("No match: 'FORTRAN' → graceful none", async ({ page }) => {
    const { say, input } = await openAssistant(page);
    await input.fill("any projects using fortran?");
    await input.press("Enter");
    await expect(say).toContainText(/Not provided on the portfolio site./i);
  });
});
