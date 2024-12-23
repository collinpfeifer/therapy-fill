"use server";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { Emails } from "../../drizzle/schema";

export async function addEmail(email: string) {
  const emailExists = db
    .select()
    .from(Emails)
    .where(eq(Emails.email, email))
    .get();
  if (emailExists)
    return {
      email: null,
      success: false,
      message: "An error has occurred. Please try again.",
    };
  return {
    email: db.insert(Emails).values({ email }).returning().get(),
    success: true,
    message: "Thank you for joining our beta, we will be in touch shortly!",
  };
}
