"use server";
import { redirect } from "@solidjs/router";
import { eq } from "drizzle-orm";
import { getSession } from "../lib/session";
import { db } from "../lib/db";
import { Therapists, CancellationLists, Admins } from "../../drizzle/schema";
import { z } from "zod";
import bun from "bun";
import { sendEmail } from "../lib/resend";
import { posthog } from "posthog-js";
import { logAuditEvent } from "./auditLog.server";

export async function signIn(formData: FormData) {
  const inputData = Object.fromEntries(formData);
  const signInInput = z.object({
    email: z.string().email().min(3),
    password: z.string().min(6),
  });

  const { email, password } = signInInput.parse(inputData);

  const user = await db
    .select()
    .from(Therapists)
    .where(eq(Therapists.email, email))
    .get();

  if (!user || !(await bun.password.verify(password, user.password)))
    throw new Error("Invalid sign-in");

  const session = await getSession();
  await session.update((d) => {
    d.userId = user.id;
  });

  posthog.capture(
    "Therapist signed in",
    //   {
    //   therapistId: user.id,
    // }
  );

  await logAuditEvent({
    userId: user.id,
    action: "SIGN_IN",
    target: user.id,
    details: `Therapist signed in`,
  });

  return redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const inputData = Object.fromEntries(formData);

  console.log("Input data", inputData);

  const signUpInput = z.object({
    name: z.string(),
    email: z.string().email().min(3),
    password: z.string().min(6),
    textConsent: z.enum(["on", "off"]),
  });

  const { name, email, password, textConsent } = signUpInput.parse(inputData);

  // console.log("Parsed data", { name, email, password, textConsent });

  const existingUser = await db
    .select()
    .from(Therapists)
    .where(eq(Therapists.email, email))
    .get();

  console.log("Existing user", existingUser);
  if (existingUser) throw new Error("User already exists");

  const newUser = await db.transaction(async (tx) => {
    // Insert the cancellation list and get its generated ID
    const [cancellationList] = await tx
      .insert(CancellationLists)
      .values({})
      .returning({ id: CancellationLists.id });

    console.log("Cancellation list", cancellationList);

    // Insert the therapist, linking it to the cancellation list
    return await tx
      .insert(Therapists)
      .values({
        name,
        email,
        password: await bun.password.hash(password),
        textConsent: textConsent === "on",
        cancellationListId: cancellationList.id, // Use the generated ID
      })
      .returning()
      .get();
  });

  const session = await getSession();
  await session.update((d) => {
    d.userId = newUser.id;
  });

  await sendEmail({
    to: email,
    subject: "Welcome to Therapy Fill! 🥳 🎉",
    name: "Collin @ TherapyFill :)",
    from: "cpfeifer@madcactus.org",
    message: `Hi! Welcome to TherapyFill!

    I'm Collin, founder of TherapyFill and I'm so glad you're here!
    To get started, you should be able to access your dashboard and see your cancellation link and phone number.
    I reccomend sending the cancellation link and phone number to your clients so they can join your cancellation list and know where to reach out moving forward.
    From there, whenever someone cancels we will let you know and reach out to the list to fill that spot! Easy peasy!

   If you have any questions, please feel free to reply to this email (Yes this is my real email!)

   Happy therapy!
   - Collin`,
    scheduledAt: new Date(
      Date.now() + Math.floor(Math.random() * (300 - 60) + 60) * 1000,
    ),
  });

  posthog.capture(
    "Therapist signed up",
    //   {
    //   therapistId: newUser.id,
    // }
  );

  await logAuditEvent({
    userId: newUser.id,
    action: "SIGN_UP",
    target: newUser.id,
    details: `Therapist signed up`,
  });

  return redirect("/dashboard");
}

export async function logout() {
  const session = await getSession();

  await logAuditEvent({
    userId: session.data.userId,
    action: "SIGN_OUT",
    target: session.data.userId,
    details: `Therapist signed out`,
  });
  await session.update((d) => (d.userId = undefined));

  throw redirect("/auth");
}

export async function getUser() {
  const session = await getSession();
  const userId = session.data.userId;
  if (userId === undefined) throw redirect("/auth");

  try {
    const user = await db
      .select()
      .from(Therapists)
      .where(eq(Therapists.id, userId))
      .get();
    if (!user) throw redirect("/auth");
    return user;
  } catch {
    throw logout();
  }
}

export async function getTherapists() {
  const session = await getSession();
  if (!session.data.userId) {
    return redirect("/auth");
  }
  const admin = await db
    .select()
    .from(Admins)
    .where(eq(Admins.id, session.data.userId))
    .get();
  if (!admin) {
    return redirect("/auth");
  }
  return await db.select().from(Therapists);
}
