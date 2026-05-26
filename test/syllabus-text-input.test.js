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

test("main page exposes the syllabus text input workflow", () => {
  const page = read("app/page.tsx");

  assert.match(page, /SyllabusTextInput/);
  assert.match(page, /from\s+["']\.\/syllabus-text-input["']/);
});

test("syllabus text input blocks empty submissions with an inline message", () => {
  const input = readExisting("app/syllabus-text-input.tsx");

  assert.match(input, /<textarea/);
  assert.match(input, /Paste syllabus text/i);
  assert.match(input, /trim\(\)/);
  assert.match(input, /Please paste syllabus content before continuing\./);
  assert.match(input, /role="alert"/);
});

test("syllabus text input persists valid submissions for refresh visibility", () => {
  const input = readExisting("app/syllabus-text-input.tsx");

  assert.match(input, /"use client"/);
  assert.match(input, /localStorage\.setItem\("syllabus-source-text"/);
  assert.match(input, /localStorage\.getItem\("syllabus-source-text"\)/);
  assert.match(input, /Your saved syllabus/i);
});
