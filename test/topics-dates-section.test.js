const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("topics and dates section is reachable from the main experience", () => {
  const page = read("app/page.tsx");
  const component = read("app/topics-dates-section.tsx");

  assert.match(page, /TopicsDatesSection/);
  assert.match(component, /id="topics-dates"/);
  assert.match(component, /href="#topics-dates"/);
  assert.match(component, /Topics & Dates/);
});

test("topics and dates workflow accepts valid topic and date input", () => {
  const component = read("app/topics-dates-section.tsx");

  for (const label of [
    "Key topics",
    "Date title",
    "Date",
    "Category",
    "Add topic",
    "Add important date",
  ]) {
    assert.match(component, new RegExp(label));
  }

  assert.match(component, /setTopics\(/);
  assert.match(component, /setImportantDates\(/);
});

test("topics and dates workflow blocks empty input with inline messages", () => {
  const component = read("app/topics-dates-section.tsx");

  assert.match(component, /Enter at least one topic before adding it\./);
  assert.match(component, /Add a title and date before saving this item\./);
  assert.match(component, /role="alert"/);
});

test("topics and dates results persist after refresh", () => {
  const component = read("app/topics-dates-section.tsx");

  assert.match(component, /localStorage/);
  assert.match(component, /syllabus-study-planner:topics-dates/);
  assert.match(component, /JSON\.parse/);
  assert.match(component, /JSON\.stringify/);
});
