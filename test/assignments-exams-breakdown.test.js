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

test("assignments and exams breakdown is reachable from the authenticated app", () => {
  const shell = read("app/app/page.tsx");

  assert.match(shell, /AssignmentsExamsBreakdown/);
  assert.match(shell, /from\s+["']\.\.\/assignments-exams-breakdown["']/);
});

test("assignments and exams breakdown supports valid syllabus extraction input", () => {
  assert.ok(
    exists("app/assignments-exams-breakdown.tsx"),
    "assignments and exams component should exist",
  );

  const component = read("app/assignments-exams-breakdown.tsx");

  for (const label of [
    "Assignments & Exams Breakdown",
    "Syllabus assignment and exam text",
    "Extract assignments and exams",
    "Assignment",
    "Exam",
    "Description",
    "Due date",
  ]) {
    assert.match(component, new RegExp(label));
  }

  assert.match(component, /parseAssignmentsAndExams/);
  assert.match(component, /setBreakdownItems/);
});

test("assignments and exams breakdown blocks empty or invalid input inline", () => {
  const component = read("app/assignments-exams-breakdown.tsx");

  assert.match(component, /Paste assignment or exam details before extracting\./);
  assert.match(component, /Include at least one assignment or exam with a date\./);
  assert.match(component, /role="alert"/);
  assert.match(component, /trim\(\)/);
});

test("assignments and exams breakdown persists results after refresh", () => {
  const component = read("app/assignments-exams-breakdown.tsx");

  assert.match(component, /"use client"/);
  assert.match(component, /localStorage\.setItem/);
  assert.match(component, /localStorage\.getItem/);
  assert.match(component, /syllabus-study-planner:assignments-exams/);
  assert.match(component, /JSON\.parse/);
  assert.match(component, /JSON\.stringify/);
});
