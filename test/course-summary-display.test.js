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

test("authenticated app exposes the course summary display workflow", () => {
  const appShell = read("app/app/page.tsx");

  assert.match(appShell, /CourseSummaryDisplay/);
  assert.match(appShell, /from\s+["']\.\/course-summary-display["']/);
  assert.match(appShell, /Course Summary Display/);
});

test("course summary display accepts valid overview and objective input", () => {
  const component = readExisting("app/app/course-summary-display.tsx");

  for (const label of [
    "Course overview",
    "Learning objectives",
    "Generate summary cards",
    "Course overview",
    "Learning objectives",
  ]) {
    assert.match(component, new RegExp(label));
  }

  assert.match(component, /setCourseSummary\(/);
  assert.match(component, /objectives:\s*objectiveLines/);
  assert.match(component, /<li/);
});

test("course summary display blocks empty input with an inline message", () => {
  const component = readExisting("app/app/course-summary-display.tsx");

  assert.match(component, /trim\(\)/);
  assert.match(
    component,
    /Add a course overview and at least one learning objective before generating summary cards\./,
  );
  assert.match(component, /role="alert"/);
});

test("course summary display persists result cards after refresh", () => {
  const component = readExisting("app/app/course-summary-display.tsx");

  assert.match(component, /"use client"/);
  assert.match(
    component,
    /localStorage\.setItem\("syllabus-study-planner:course-summary"/,
  );
  assert.match(
    component,
    /localStorage\.getItem\("syllabus-study-planner:course-summary"\)/,
  );
  assert.match(component, /JSON\.parse/);
  assert.match(component, /JSON\.stringify/);
});
