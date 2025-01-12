"use server";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { Appointments, Notifications } from "../../drizzle/schema";
import { z } from "zod";

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
      throw new Error("Appointment doesn't exist");
    } else if (appointment.status === "booked") {
      tx.rollback();
      throw new Error("Appointment already booked");
    }

    return await tx
      .update(Appointments)
      .set({
        status: "booked",
        clientId,
      })
      .where(eq(Appointments.id, notification.appointmentId))
      .returning()
      .get();
  });
}
