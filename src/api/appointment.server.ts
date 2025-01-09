"use server";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { getSession } from "../lib/session";
import { Appointments } from "../../drizzle/schema";

export async function getAppointments() {
  const session = await getSession();
  const appointments = await db
    .select()
    .from(Appointments)
    .where(eq(Appointments.therapistId, session.data.userId));

  return appointments;
}
