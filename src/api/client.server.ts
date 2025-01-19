"use server";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { getSession } from "../lib/session";
import { Clients } from "../../drizzle/schema";
import { logAuditEvent } from "./auditLog.server";
import { posthog } from "posthog-js";

export async function getClients() {
  const session = await getSession();
  const clients = await db
    .select()
    .from(Clients)
    .where(eq(Clients.therapistId, session.data.userId));

  posthog.capture("Therapist viewed clients", {
    therapistId: session.data.userId,
  });

  await logAuditEvent({
    userId: session.data.userId,
    action: "READ",
    target: `Clients for therapistId ${session.data.userId}`,
    details: "Viewed clients",
  });

  return clients;
}
