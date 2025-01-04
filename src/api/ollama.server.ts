"use server";
import ollama from "ollama";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const Appointment = z.object({
  therapistName: z.string(),
  time: z.string(),
  date: z.string(),
  clarification: z.string().nullish().default(null),
});

// Function to send request to Ollama and get AI-generated response
export async function queryAppointment(query: string) {
  try {
    const response = await ollama.chat({
      model: "llama3.2", // Specify the model, adjust as needed
      messages: [{ role: "user", content: query }],
      format: zodToJsonSchema(Appointment), // Format the response
    });
    return Appointment.parse(JSON.parse(response.message.content)); // This is the AI-generated response
  } catch (error) {
    console.error("Error calling Ollama:", error);
    return { therapistName: null, time: null, date: null, clarification: null };
  }
}
