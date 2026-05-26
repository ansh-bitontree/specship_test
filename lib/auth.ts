export type CurrentUser = {
  id: string;
  name: string;
  email: string;
};

export const AUTH_COOKIE_NAME = "syllabus_snap_user";

export const demoUser: CurrentUser = {
  id: "demo-user",
  name: "Syllabus Snap User",
  email: "student@example.com",
};

export function encodeCurrentUser(user: CurrentUser): string {
  return Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
}

function decodeCurrentUser(value: string): CurrentUser | null {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));

    if (
      typeof parsed?.id === "string" &&
      typeof parsed?.name === "string" &&
      typeof parsed?.email === "string"
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const value = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  return value ? decodeCurrentUser(value) : null;
}
