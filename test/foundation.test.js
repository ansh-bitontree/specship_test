const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("project foundation exposes a Next App Router TypeScript Tailwind app", () => {
  const packageJson = JSON.parse(read("package.json"));

  assert.equal(packageJson.scripts.dev, "next dev");
  assert.equal(packageJson.scripts.build, "next build");
  assert.equal(packageJson.scripts.start, "next start");
  assert.ok(packageJson.dependencies.next);
  assert.ok(packageJson.dependencies.react);
  assert.ok(packageJson.dependencies["react-dom"]);
  assert.ok(packageJson.devDependencies.typescript);
  assert.ok(packageJson.devDependencies.tailwindcss);
  assert.ok(fs.existsSync(path.join(root, "app", "layout.tsx")));
  assert.ok(fs.existsSync(path.join(root, "app", "page.tsx")));
  assert.ok(fs.existsSync(path.join(root, "app", "globals.css")));
  assert.ok(fs.existsSync(path.join(root, "tailwind.config.ts")));
  assert.ok(fs.existsSync(path.join(root, "tsconfig.json")));
});

test("project foundation ignores generated and local-only files", () => {
  const ignoredPatterns = read(".gitignore")
    .split(/\r?\n/)
    .filter(Boolean);

  for (const pattern of ["node_modules", ".next", ".env*.local"]) {
    assert.ok(
      ignoredPatterns.includes(pattern) || ignoredPatterns.includes(`${pattern}/`),
      `missing ${pattern} from .gitignore`,
    );
  }
});

test("database client setup is reusable from a server-side module", () => {
  const dbModule = read("lib/db.ts");

  assert.match(dbModule, /@prisma\/client/);
  assert.match(dbModule, /PrismaClient/);
  assert.match(dbModule, /export\s+(const\s+)?db/);
});

test("prisma schema defines the initial syllabus study data model", () => {
  const schema = read("prisma/schema.prisma");
  const models = [
    "User",
    "Syllabus",
    "CourseSummary",
    "Topic",
    "ImportantDate",
    "Assignment",
    "Exam",
    "StudyPlan",
  ];

  assert.match(schema, /provider\s+=\s+"postgresql"/);

  for (const model of models) {
    assert.match(schema, new RegExp(`model\\s+${model}\\s+{`));
  }

  assert.match(schema, /courseSummary\s+CourseSummary\?/);
  assert.match(schema, /topics\s+Topic\[\]/);
  assert.match(schema, /importantDates\s+ImportantDate\[\]/);
  assert.match(schema, /assignments\s+Assignment\[\]/);
  assert.match(schema, /exams\s+Exam\[\]/);
  assert.match(schema, /studyPlans\s+StudyPlan\[\]/);
});
