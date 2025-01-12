import { json } from "@solidjs/router";
import { APIEvent } from "@solidjs/start/server";
import { queryAppointment } from "~/api/ollama.server";
import { sendSMS } from "~/lib/twilio";
import { db } from "~/lib/db";
import {
  Appointments,
  Therapists,
  Clients,
  Notifications,
} from "~/../drizzle/schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

export const POST = async ({ request }: APIEvent) => {
  const { Body, From } = Object.fromEntries(await request.formData());
  // Retrieve incoming message and phone number

  // Step 1: Send the message to Ollama
  const response = await queryAppointment(`The user sent: "${Body}".
         Extract:
         - Therapist's name
         - Appointment date and time
         - Any clarification needed
         Return the response as JSON. If details are missing, ask for clarification.`);

  const { therapistName, dateTime, clarification } = response;

  // Find the therapist
  let responseMessage =
    "Your appointment has been cancelled! Please let me know if you need to reschedule.";
  // Step 2: Process extracted data
  if (!therapistName || !dateTime) {
    responseMessage =
      "Could you please provide the name of your therapist and the date and time of your appointment?";
  } else if (clarification) {
    responseMessage = clarification;
  } else {
    // Step 3: Save the appointment to the database
    // Find the therapist

    const therapist = await db
      .select()
      .from(Therapists)
      .where(eq(Therapists.name, therapistName))
      .get();

    if (!therapist) {
      responseMessage = `Sorry, I couldn't find a therapist named ${therapistName}. Could you please provide the name of your therapist and the date and time of your appointment?`;
      console.log(responseMessage);
      // await sendSMS({ to: From, body: responseMessage });
      return json({ status: "error", responseMessage });
    }
    // Save the appointment
    const appointment = await db
      .insert(Appointments)
      .values({
        therapistId: therapist.id,
        therapistName,
        dateTime,
        status: "available",
        from: String(From),
      })
      .returning({ id: Appointments.id })
      .get();

    const clients = await db
      .select()
      .from(Clients)
      .where(eq(Clients.therapistId, therapist.id));
    // Send a notification to the clients
    for (const client of clients) {
      const notificationId = nanoid(10);

      const bookingLink =
        new URL(request.url).origin + "/book/" + notificationId;

      await db.insert(Notifications).values({
        id: notificationId,
        clientId: client.id,
        phoneNumber: client.phoneNumber,
        status: "sent",
        appointmentId: appointment.id,
        bookingLink,
      });

      await sendSMS({
        to: client.phoneNumber,
        body: `An appointment with ${therapistName} has become available at ${dateTime}. Click here to book: ${bookingLink}`,
      });
    }
  }

  // await sendSMS({ to: From, body: responseMessage });
  console.log(responseMessage);
  return json({ status: "success", responseMessage });
};
