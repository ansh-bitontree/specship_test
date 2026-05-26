const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readExisting(relativePath) {
  const filePath = path.join(root, relativePath);

  assert.ok(fs.existsSync(filePath), `expected ${relativePath} to exist`);
  return fs.readFileSync(filePath, "utf8");
}

test("authenticated app exposes the AI summary generation workflow", () => {
  const appShell = read("app/app/page.tsx");

  assert.match(appShell, /AiSummaryGeneration/);
  assert.match(appShell, /from\s+["']\.\/ai-summary-generation["']/);
  assert.match(appShell, /AI Summary Generation/);
});

test("AI summary generation blocks empty input with an inline message", () => {
  const component = readExisting("app/app/ai-summary-generation.tsx");

  assert.match(component, /"use client"/);
  assert.match(component, /<textarea/);
  assert.match(component, /trim\(\)/);
  assert.match(component, /Paste syllabus text before generating an AI summary\./);
  assert.match(component, /role="alert"/);
});

test("AI summary generation completes valid workflow and renders structured result", () => {
  const component = readExisting("app/app/ai-summary-generation.tsx");

  assert.match(component, /fetch\(["']\/api\/syllabus-analysis["']/);
  assert.match(component, /courseOverview/);
  assert.match(component, /topics/);
  assert.match(component, /dates/);
  assert.match(component, /assignments/);
  assert.match(component, /exams/);
  assert.match(component, /studyRecommendations/);

  for (const label of [
    "Course overview",
    "Topics",
    "Important dates",
    "Assignments",
    "Exams",
    "Study recommendations",
  ]) {
    assert.match(component, new RegExp(label));
  }
});

test("AI summary results persist and are restored after refresh", () => {
  const component = readExisting("app/app/ai-summary-generation.tsx");

  assert.match(
    component,
    /localStorage\.setItem\("syllabus-study-planner:ai-summary"/,
  );
  assert.match(
    component,
    /localStorage\.getItem\("syllabus-study-planner:ai-summary"\)/,
  );
  assert.match(component, /JSON\.parse/);
  assert.match(component, /JSON\.stringify/);
});

test("syllabus analysis API sends a structured GPT-4 prompt to OpenAI", () => {
  const route = readExisting("app/api/syllabus-analysis/route.ts");

  assert.match(route, /process\.env\.OPENAI_API_KEY/);
  assert.match(route, /https:\/\/api\.openai\.com\/v1\/chat\/completions/);
  assert.match(route, /model:\s*["']gpt-4/);
  assert.match(route, /Authorization/);
  assert.match(route, /Bearer\s+\$\{process\.env\.OPENAI_API_KEY\}/);
  assert.match(route, /courseOverview/);
  assert.match(route, /topics/);
  assert.match(route, /dates/);
  assert.match(route, /assignments/);
  assert.match(route, /exams/);
  assert.match(route, /studyRecommendations/);
  assert.match(route, /response_format/);
});
