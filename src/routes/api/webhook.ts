import { json } from "@solidjs/router";
import { APIEvent } from "@solidjs/start/server";
import { queryAppointment } from "~/api/ollama.server";
import { sendSMS } from "~/api/twilio.server";
import { db } from "~/api/db.server";
import { Appointments, Therapists } from "../../../drizzle/schema";
import { levenshteinDistance } from "~/lib/levenshteinDistance";

export const POST = async ({ request }: APIEvent) => {
  const { Body, From } = Object.fromEntries(await request.formData());
  // Retrieve incoming message and phone number

  console.log(Body);
  // Step 1: Send the message to Ollama
  const response = await queryAppointment(`The user sent: "${Body}".
         Extract:
         - Therapist's name
         - Appointment time
         - Appointment date
          - Any clarification needed
         Return the response as JSON. If details are missing, ask for clarification.`);

  const { therapistName, time, date, clarification } = response;
  console.log(response);
  let responseMessage =
    "Your appointment has been cancelled! Please let me know if you need to reschedule.";
  // Step 2: Process extracted data
  if (!therapistName || !time || !date) {
    responseMessage =
      "Could you please provide the name of your therapist and the date and time of your appointment?";
  } else if (clarification) {
    responseMessage = clarification;
  } else {
    // Step 3: Save the appointment to the database
    const therapists = await db.select().from(Therapists);
    console.log(therapists);

    // Compute Levenshtein distances
    const distances = therapists.map((therapist) => ({
      therapist,
      distance: levenshteinDistance(therapistName, therapist.name),
    }));

    // Find the user with the smallest distance
    const closestMatch = distances.reduce((prev, curr) =>
      curr.distance < prev.distance ? curr : prev,
    );

    // Save the appointment
    await db.insert(Appointments).values({
      therapistId: closestMatch.therapist.id,
      time,
      date,
      from: String(From),
    });
  }

  // await sendSMS({ to: From, body: responseMessage });
  console.log(responseMessage);
  return json({ status: "success", responseMessage });
};
