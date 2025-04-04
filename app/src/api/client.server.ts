"use server";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { getSession } from "../lib/session";
import { Clients, Admins, Therapists } from "../../drizzle/schema";
import { logAuditEvent } from "./auditLog.server";
import { posthog } from "posthog-js";
import { redirect } from "@solidjs/router";

export async function getClients() {
  const session = await getSession();
  if (!session.data.userId) {
    return redirect("/auth");
  }
  const therapist = await db
    .select()
    .from(Therapists)
    .where(eq(Therapists.id, session.data.userId))
    .get();

  if (!therapist) {
    return redirect("/auth");
  }

  const clients = await db
    .select()
    .from(Clients)
    .where(eq(Clients.therapistId, session.data.userId));

  posthog.capture(
    "Therapist viewed clients",
    //   {
    //   therapistId: session.data.userId,
    // }
  );

  await logAuditEvent({
    userId: session.data.userId,
    action: "READ",
    target: `Clients for therapistId ${session.data.userId}`,
    details: "Viewed clients",
  });

  return clients;
}

export async function getClientsByTherapistId(therapistId: string) {
  const session = await getSession();

  // if (!session.data.userId) {
  //   return redirect("/auth");
  // }

  // const admin = await db
  //   .select()
  //   .from(Admins)
  //   .where(eq(Admins.id, session.data.userId))
  //   .get();

  // if (!admin) {
  //   return redirect("/auth");
  // }

  return await db.transaction(async (tx) => {
    const therapist = await tx
      .select()
      .from(Therapists)
      .where(eq(Therapists.id, therapistId))
      .get();

    if (!therapist) {
      tx.rollback();
    }
    if (therapist?.cancellationListId) {
      const clients = await tx
        .select()
        .from(Clients)
        .where(eq(Clients.cancellationListId, therapist.cancellationListId));
      return clients;
    } else return [];
  });
}
