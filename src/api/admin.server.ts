"use server";
import { redirect } from "@solidjs/router";
import { eq } from "drizzle-orm";
import { getSession } from "../lib/session";
import { db } from "../lib/db";
import { Admins } from "../../drizzle/schema";
import { z } from "zod";
import bun from "bun";
import { logAuditEvent } from "./auditLog.server";

export async function adminSignIn(formData: FormData) {
  const inputData = Object.fromEntries(formData);
  const signInInput = z.object({
    email: z.string().email().min(3),
    password: z.string().min(6),
  });

  const { email, password } = signInInput.parse(inputData);

  const user = await db
    .select()
    .from(Admins)
    .where(eq(Admins.email, email))
    .get();

  console.log("User", user);
  console.log("Test", await bun.password.verify(password, user!.password));

  if (!user || !(await bun.password.verify(password, user.password)))
    throw new Error("Invalid sign-in");

  const session = await getSession();
  await session.update((d) => (d.userId = user.id));

  console.log(session.data.userId);

  await logAuditEvent({
    userId: user.id,
    action: "SIGN_IN",
    target: user.id,
    details: `Admin signed in`,
  });

  console.log("Redirecting to /admin");

  return redirect("/admin");
}

export async function adminLogout() {
  const session = await getSession();
  await logAuditEvent({
    userId: session.data.userId,
    action: "SIGN_OUT",
    target: session.data.userId,
    details: `Admin signed out`,
  });
  await session.update((d) => (d.userId = undefined));
  throw redirect("/auth");
}
