"use server";
import type { APIEvent } from "@solidjs/start/server";
import { calendar } from "~/lib/googleCalendar";

export async function POST({ request }: APIEvent) {
  const body = await request.text();
  const headers = request.headers;

  // Verify the notification
  const channelId = headers.get("X-Goog-Channel-ID");
  const resourceId = headers.get("X-Goog-Resource-ID");

  // Process the notification
  console.log("Calendar change detected:", { channelId, resourceId });

  // Fetch the latest events
  const events = await calendar.events.list({
    calendarId: "primary",
    updatedMin: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // Last 5 minutes
  });

  console.log("Updated events:", events.data.items);

  // You can implement your own logic here to handle the updates

  return new Response("OK", { status: 200 });
}
