"use server";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { getSession } from "../lib/session";
import { Clients } from "../../drizzle/schema";

export async function getClients() {
  const session = await getSession();
  const clients = await db
    .select()
    .from(Clients)
    .where(eq(Clients.therapistId, session.data.userId));
  return clients;
}
