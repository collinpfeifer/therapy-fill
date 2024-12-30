"use server";
import { redirect } from "@solidjs/router";
import { useSession } from "vinxi/http";
import { eq } from "drizzle-orm";
import { db } from "./db.server";
import { Users } from "../../drizzle/schema";
import { z } from "zod";

async function signIn(email: string, password: string) {
  const user = db.select().from(Users).where(eq(Users.email, email)).get();
  if (!user || password !== user.password) throw new Error("Invalid sign-in");
  return user;
}

async function signUp(email: string, password: string) {
  const existingUser = db
    .select()
    .from(Users)
    .where(eq(Users.email, email))
    .get();
  if (existingUser) throw new Error("User already exists");
  return db.insert(Users).values({ email, password }).returning().get();
}

function getSession() {
  return useSession({
    password: process.env.SESSION_SECRET!,
  });
}

export async function signInOrSignUp(formData: FormData) {
  const inputData = Object.fromEntries(formData);

  const user = z.object({
    email: z.string().email().min(3),
    password: z.string().nonempty().min(6),
    signInType: z.enum(["sign-in", "sign-up"]),
  });

  const { email, password, signInType } = user.parse(inputData);

  try {
    const user = await (signInType !== "sign-in"
      ? signIn(email, password)
      : signUp(email, password));
    const session = await getSession();
    await session.update((d) => {
      d.userId = user.id;
    });
  } catch (err) {
    return err as Error;
  }
  throw redirect("/");
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
