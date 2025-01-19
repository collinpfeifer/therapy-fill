"use server";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { Appointments, Notifications } from "../../drizzle/schema";
import { z } from "zod";
import { posthog } from "posthog-js";
import { logAuditEvent } from "./auditLog.server";

export async function getAppointments() {
  const appointments = await db.select().from(Appointments);
  return appointments;
}

export async function getAppointmentByNotificationId(id: string) {
  const appointment = await db.transaction(async (tx) => {
    // Insert the cancellation list and get its generated ID
    const [notification] = await tx
      .select()
      .from(Notifications)
      .where(eq(Notifications.id, id));

    posthog.capture("Notification viewed", {
      clientId: notification.clientId,
      appointmentId: notification.appointmentId,
    });

    await logAuditEvent({
      userId: notification.clientId,
      action: "READ",
      target: notification.id,
      details: `Notification viewed by client ${notification.clientId}`,
    });

    // Insert the therapist, linking it to the cancellation list
    return await tx
      .select()
      .from(Appointments)
      .where(eq(Appointments.id, notification.appointmentId))
      .get();
  });

  return appointment;
}

export async function bookAppointment(formData: { notificationId: string }) {
  const bookAppointmentInput = z.object({
    notificationId: z.string(),
  });

  const { notificationId } = bookAppointmentInput.parse(formData);

  return await db.transaction(async (tx) => {
    const [notification] = await tx
      .select()
      .from(Notifications)
      .where(eq(Notifications.id, notificationId));

    const clientId = notification.clientId;

    if (!notification) {
      tx.rollback();
      throw new Error("Notification doesn't exist");
    }

    const [appointment] = await tx
      .select()
      .from(Appointments)
      .where(eq(Appointments.id, notification.appointmentId));

    if (!appointment) {
      tx.rollback();
      return { success: false, result: new Error("Appointment doesn't exist") };
    } else if (appointment.status === "booked") {
      tx.rollback();
      return {
        success: false,
        result: new Error("Appointment already booked"),
      };
    }

    posthog.capture("Appointment booked", {
      appointmentId: appointment.id,
      clientId: clientId,
    });

    await logAuditEvent({
      userId: clientId,
      action: "UPDATE",
      target: appointment.id,
      details: `Appointment booked by client ${clientId}`,
    });

    return {
      success: true,
      result: await tx
        .update(Appointments)
        .set({
          status: "booked",
          clientId,
        })
        .where(eq(Appointments.id, notification.appointmentId))
        .returning()
        .get(),
    };
  });
}
