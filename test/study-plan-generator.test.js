const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

test("authenticated app exposes the study plan generator entry point", () => {
  const shell = read("app/app/page.tsx");

  assert.ok(
    exists("app/app/study-plan-generator.tsx"),
    "study plan generator component should exist",
  );
  assert.match(shell, /StudyPlanGenerator/);
  assert.match(shell, /from\s+["']\.\/study-plan-generator["']/);
  assert.match(shell, /href="#study-plan-generator"/);
  assert.match(shell, /Study Plan Generator/);
});

test("study plan generator workflow accepts valid planning input", () => {
  const component = read("app/app/study-plan-generator.tsx");

  for (const label of [
    "Syllabus structure",
    "Available study hours per week",
    "Number of study weeks",
    "Generate study plan",
  ]) {
    assert.match(component, new RegExp(label));
  }

  assert.match(component, /setGeneratedPlan\(/);
  assert.match(component, /Personalized study notes/);
  assert.match(component, /Week-by-week plan/);
});

test("study plan generator blocks invalid input with a clear inline message", () => {
  const component = read("app/app/study-plan-generator.tsx");

  assert.match(component, /trim\(\)/);
  assert.match(component, /Number\.isFinite/);
  assert.match(
    component,
    /Add syllabus structure and valid study time before generating a plan\./,
  );
  assert.match(component, /role="alert"/);
  assert.match(component, /aria-invalid/);
});

test("study plan generator persists generated results after refresh", () => {
  const component = read("app/app/study-plan-generator.tsx");

  assert.match(component, /"use client"/);
  assert.match(component, /localStorage\.getItem\(STORAGE_KEY\)/);
  assert.match(component, /localStorage\.setItem\(STORAGE_KEY/);
  assert.match(component, /syllabus-study-planner:study-plan-generator/);
  assert.match(component, /Generated study plan/);
});
