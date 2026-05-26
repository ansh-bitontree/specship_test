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

test("authenticated app exposes loading and error handling workflow", () => {
  const appShell = read("app/app/page.tsx");

  assert.match(appShell, /LoadingErrorHandlingWorkflow/);
  assert.match(
    appShell,
    /from\s+["']\.\/loading-error-handling-workflow["']/,
  );
  assert.match(appShell, /Loading & Error Handling/);
});

test("workflow blocks empty input with an inline message", () => {
  const workflow = readExisting("app/app/loading-error-handling-workflow.tsx");

  assert.match(workflow, /"use client"/);
  assert.match(workflow, /<textarea/);
  assert.match(workflow, /trim\(\)/);
  assert.match(workflow, /Enter syllabus content before running analysis\./);
  assert.match(workflow, /role="alert"/);
});

test("workflow shows a skeleton while the API call is in flight", () => {
  const workflow = readExisting("app/app/loading-error-handling-workflow.tsx");

  assert.match(workflow, /fetch\(["']\/api\/syllabus-analysis["']/);
  assert.match(workflow, /setIsLoading\(true\)/);
  assert.match(workflow, /animate-pulse/);
  assert.match(workflow, /aria-busy=\{isLoading\}/);
});

test("workflow displays friendly API failure and rate limit messages", () => {
  const workflow = readExisting("app/app/loading-error-handling-workflow.tsx");

  assert.match(
    workflow,
    /We could not analyze your syllabus right now\. Please try again\./,
  );
  assert.match(
    workflow,
    /Too many analysis attempts\. Please wait a minute and try again\./,
  );
  assert.match(workflow, /response\.status === 429/);
});

test("valid analysis results persist and are restored after refresh", () => {
  const workflow = readExisting("app/app/loading-error-handling-workflow.tsx");

  assert.match(
    workflow,
    /localStorage\.setItem\("syllabus-study-planner:analysis-result"/,
  );
  assert.match(
    workflow,
    /localStorage\.getItem\("syllabus-study-planner:analysis-result"\)/,
  );
  assert.match(workflow, /Analysis result/);
});

test("syllabus analysis API validates input and returns a result", () => {
  const route = readExisting("app/api/syllabus-analysis/route.ts");

  assert.match(route, /export\s+async\s+function\s+POST/);
  assert.match(route, /NextResponse\.json/);
  assert.match(route, /status:\s*400/);
  assert.match(route, /status:\s*429/);
  assert.match(route, /status:\s*502/);
  assert.match(route, /summary/);
});
