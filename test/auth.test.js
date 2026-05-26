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

test("auth configuration documents only the required environment variable names", () => {
  const readme = read("README.md");

  assert.match(readme, /NEXTAUTH_URL/);
  assert.match(readme, /NEXTAUTH_SECRET/);
  assert.doesNotMatch(readme, /DATABASE_URL\s*=/);
  assert.doesNotMatch(readme, /NEXTAUTH_URL\s*=/);
  assert.doesNotMatch(readme, /NEXTAUTH_SECRET\s*=/);
});

test("middleware protects the main app route and sends signed-out users to sign in", () => {
  assert.ok(exists("middleware.ts"), "middleware.ts should exist");

  const middleware = read("middleware.ts");

  assert.match(middleware, /from\s+["']\.\/lib\/auth["']/);
  assert.match(middleware, /AUTH_COOKIE_NAME/);
  assert.match(middleware, /\/sign-in/);
  assert.match(middleware, /export\s+const\s+config/);
  assert.match(middleware, /matcher:\s*\[\s*["']\/app\/:path\*/);
});

test("signed-in users have an application shell route", () => {
  assert.ok(exists("app/app/page.tsx"), "main app shell route should exist");

  const shell = read("app/app/page.tsx");

  assert.match(shell, /getCurrentUser/);
  assert.match(shell, /Syllabus Snap/);
  assert.match(shell, /Upload syllabus/);
});

test("sign-in flow creates the auth cookie before entering the app shell", () => {
  assert.ok(exists("app/sign-in/page.tsx"), "sign-in page should exist");
  assert.ok(exists("app/sign-in/actions.ts"), "sign-in action should exist");

  const signInPage = read("app/sign-in/page.tsx");
  const signInAction = read("app/sign-in/actions.ts");

  assert.match(signInPage, /signIn/);
  assert.match(signInAction, /AUTH_COOKIE_NAME/);
  assert.match(signInAction, /cookies\(\)/);
  assert.match(signInAction, /redirect\(["']\/app["']\)/);
});

test("server-side data loading code can read the current user context", () => {
  assert.ok(exists("lib/auth.ts"), "server auth helper should exist");

  const auth = read("lib/auth.ts");

  assert.match(auth, /export\s+type\s+CurrentUser/);
  assert.match(auth, /export\s+const\s+AUTH_COOKIE_NAME/);
  assert.match(auth, /export\s+async\s+function\s+getCurrentUser/);
  assert.match(auth, /cookies\(\)/);
});
