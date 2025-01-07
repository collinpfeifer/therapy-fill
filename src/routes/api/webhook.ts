import { json } from "@solidjs/router";
import { APIEvent } from "@solidjs/start/server";
import { queryAppointment } from "~/api/ollama.server";
import { sendSMS } from "~/lib/twilio";
import { db } from "~/lib/db";
import { Appointments, Therapists } from "~/../drizzle/schema";
import { eq } from "drizzle-orm";

export const POST = async ({ request }: APIEvent) => {
  const { Body, From } = Object.fromEntries(await request.formData());
  // Retrieve incoming message and phone number
  // Step 1: Send the message to Ollama
  const response = await queryAppointment(`The user sent: "${Body}".
         Extract:
         - Therapist's name
         - Appointment time
         - Appointment date
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
    await db.insert(Appointments).values({
      therapistId: therapist.id,
      dateTime,
      from: String(From),
    });
  }

  // await sendSMS({ to: From, body: responseMessage });
  console.log(responseMessage);
  return json({ status: "success", responseMessage });
};
