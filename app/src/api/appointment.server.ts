"use server";
import { eq, and } from "drizzle-orm";
import { db } from "../lib/db";
import { getSession } from "../lib/session";
import { redirect } from "@solidjs/router";
import {
  Appointments,
  Notifications,
  Admins,
  Therapists,
} from "../../drizzle/schema";
import { z } from "zod";
import { posthog } from "posthog-js";
import { logAuditEvent } from "./auditLog.server";

export async function getAppointments() {
  const session = await getSession();
  if (!session.data.userId) {
    return redirect("/auth");
  }
  const appointments = await db
    .select()
    .from(Appointments)
    .where(eq(Appointments.therapistId, session.data.userId));

  posthog.capture(
    "Therapist viewed appointments",
    //   {
    //   therapistId: session.data.userId,
    // }
  );

  await logAuditEvent({
    userId: session.data.userId,
    action: "READ",
    target: `Appointments for therapistId ${session.data.userId}`,
    details: "Viewed appointments",
  });

  return appointments;
}

export async function addAppointment({
  therapistId,
  dateTime,
  From,
}: {
  therapistId: string;
  dateTime: string;
  From: string;
}) {
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

  const therapist = await db
    .select()
    .from(Therapists)
    .where(eq(Therapists.id, therapistId))
    .get();

  if (!therapist) throw new Error("Therapist not found");

  const appointment = await db
    .insert(Appointments)
    .values({
      therapistId: therapistId,
      therapistName: therapist.name,
      dateTime,
      status: "available",
      from: String(From),
    })
    .returning({ id: Appointments.id })
    .get();

  return appointment;
}

export async function getAppointmentsByTherapistId(therapistId: string) {
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
  return await db
    .select()
    .from(Appointments)
    .where(
      and(
        eq(Appointments.therapistId, therapistId),
        eq(Appointments.status, "available"),
      ),
    );
}

export async function getAppointmentByNotificationId(id: string) {
  const appointment = await db.transaction(async (tx) => {
    // Insert the cancellation list and get its generated ID
    const [notification] = await tx
      .select()
      .from(Notifications)
      .where(eq(Notifications.id, id));

    posthog.capture(
      "Notification viewed",
      //   {
      //   clientId: notification.clientId,
      //   appointmentId: notification.appointmentId,
      // }
    );

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

    posthog.capture(
      "Appointment booked",
      //   {
      //   appointmentId: appointment.id,
      //   clientId: clientId,
      // }
    );

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

export async function adminBookAppointment(formData: FormData) {
  const inputData = Object.fromEntries(formData);

  console.log("Input data", inputData);

  const adminBookInput = z.object({
    clientId: z.string().uuid(),
    appointmentId: z.string().uuid(),
  });

  const { clientId, appointmentId } = adminBookInput.parse(inputData);

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

  return await db
    .update(Appointments)
    .set({
      status: "booked",
      clientId,
    })
    .where(eq(Appointments.id, appointmentId))
    .returning()
    .get();
}
