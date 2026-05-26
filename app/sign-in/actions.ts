"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, demoUser, encodeCurrentUser } from "@/lib/auth";

export async function signIn() {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, encodeCurrentUser(demoUser), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/app");
}
