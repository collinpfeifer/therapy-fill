"use server";
import { redirect } from "@solidjs/router";
import { useSession } from "vinxi/http";
import { eq } from "drizzle-orm";
import { db } from "./db.server";
import { Users } from "../../drizzle/schema";
import { z } from "zod";
import bun from "bun";
import { sendEmail } from "./resend.server";

export async function signIn(formData: FormData) {
  const inputData = Object.fromEntries(formData);

  const signInInput = z.object({
    email: z.string().email().min(3),
    password: z.string().min(6),
  });

  const { email, password } = signInInput.parse(inputData);
  const user = db.select().from(Users).where(eq(Users.email, email)).get();

  if (!user || !(await bun.password.verify(password, user.password)))
    throw new Error("Invalid sign-in");

  const session = await getSession();
  await session.update((d) => {
    d.userId = user.id;
  });

  return redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const inputData = Object.fromEntries(formData);

  console.log("Input data", inputData);

  const signUpInput = z.object({
    email: z.string().email().min(3),
    password: z.string().min(6),
  });

  const { email, password } = signUpInput.parse(inputData);

  const existingUser = db
    .select()
    .from(Users)
    .where(eq(Users.email, email))
    .get();

  if (existingUser) throw new Error("User already exists");

  const newUser = db
    .insert(Users)
    .values({ email, password: await bun.password.hash(password) })
    .returning()
    .get();

  const session = await getSession();
  await session.update((d) => {
    d.userId = newUser.id;
  });

  await sendEmail({
    to: email,
    subject: "Welcome to Therapy Fill! 🥳 🎉",
    name: "Collin @ TherapyFill :)",
    from: "collin@therapyfill.com",
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

  return redirect("/dashboard");
}

function getSession() {
  return useSession({
    password: process.env.SESSION_SECRET!,
  });
}

export async function logout() {
  const session = await getSession();
  await session.update((d) => (d.userId = undefined));
  throw redirect("/auth");
}

export async function getUser() {
  const session = await getSession();
  const userId = session.data.userId;
  if (userId === undefined) throw redirect("/auth");

  try {
    const user = db.select().from(Users).where(eq(Users.id, userId)).get();
    if (!user) throw redirect("/auth");
    return { id: user.id, email: user.email };
  } catch {
    throw logout();
  }
}
