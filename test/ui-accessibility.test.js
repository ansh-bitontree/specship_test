const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("main flows use responsive layout classes that prevent narrow viewport overlap", () => {
  const home = read("app/page.tsx");
  const signIn = read("app/sign-in/page.tsx");
  const appShell = read("app/app/page.tsx");
  const syllabusInput = read("app/syllabus-text-input.tsx");

  assert.match(home, /text-3xl[\s\S]*sm:text-4xl/);
  assert.match(signIn, /text-3xl[\s\S]*sm:text-4xl/);
  assert.match(appShell, /flex-col[\s\S]*gap-4[\s\S]*sm:flex-row/);
  assert.match(appShell, /break-all/);
  assert.match(syllabusInput, /max-w-full/);
  assert.match(syllabusInput, /break-words/);
});

test("interactive controls expose names, descriptions, and visible keyboard focus", () => {
  const signIn = read("app/sign-in/page.tsx");
  const syllabusInput = read("app/syllabus-text-input.tsx");

  assert.match(signIn, /aria-label="Continue to the syllabus workspace"/);
  assert.match(signIn, /focus-visible:outline-none/);
  assert.match(signIn, /focus-visible:ring-2/);
  assert.match(syllabusInput, /htmlFor="syllabus-text"/);
  assert.match(syllabusInput, /aria-describedby="syllabus-text-help syllabus-text-state"/);
  assert.match(syllabusInput, /focus-visible:outline-none/);
  assert.match(syllabusInput, /focus-visible:ring-2/);
});

test("empty loading and error states explain the next action", () => {
  const syllabusInput = read("app/syllabus-text-input.tsx");
  const appShell = read("app/app/page.tsx");

  assert.match(syllabusInput, /id="syllabus-text-state"/);
  assert.match(syllabusInput, /No syllabus saved yet/i);
  assert.match(syllabusInput, /Paste your syllabus above, then save it to start planning\./);
  assert.match(syllabusInput, /Saving syllabus/i);
  assert.match(syllabusInput, /Try again after adding syllabus text\./);
  assert.match(appShell, /No syllabus uploaded yet/i);
  assert.match(
    appShell,
    /Start by pasting your syllabus on the home\s+page\./,
  );
});
