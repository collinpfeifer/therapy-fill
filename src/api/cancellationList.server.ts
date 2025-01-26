"use server";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { Clients, CancellationLists, AuditLogs } from "../../drizzle/schema";
import { z } from "zod";
import { posthog } from "posthog-js";
import { getRequestEvent } from "solid-js/web";
import { generateLogHash } from "~/lib/auditLog";

export async function addClientToCancellationList(formData: {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  textConsent: boolean;
}) {
  const waitlistClient = z.object({
    name: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    textConsent: z.boolean(),
    id: z.string().uuid(),
  });

  const { id, name, email, phoneNumber, textConsent } =
    waitlistClient.parse(formData);

  console.log("Text Consent", textConsent);
  return await db.transaction(async (tx) => {
    const cancellationList = await tx
      .select()
      .from(CancellationLists)
      .where(eq(CancellationLists.id, id))
      .get();

    if (!cancellationList) {
      tx.rollback();
      return { success: false, result: new Error("Waitlist doesn't exist") };
    }

    console.log("Text consent", textConsent);

    const client = await tx
      .insert(Clients)
      .values({
        name,
        email,
        phoneNumber,
        cancellationListId: cancellationList.id,
        textConsent: textConsent,
      })
      .returning()
      .get();

    posthog.capture(
      "Client added to cancellation list",
      //   {
      //   cancellationListId: cancellationList.id,
      //   clientId: client.id,
      // }
    );

    const requestEvent = getRequestEvent();
    if (!requestEvent) throw new Error("Request event is not available");
    const request = requestEvent.request;

    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      request.headers.get("origin") ||
      "unknown";

    const userId = client.id;
    const action = "CREATE";
    const details = `Client ${client.id} added to cancellation list ${cancellationList.id}`;

    const hash = generateLogHash({ request, userId, action, details });

    await tx.insert(AuditLogs).values({
      userId,
      action,
      url: request.url,
      target: cancellationList.id,
      details,
      sourceIp: ip,
      hash,
    });

    posthog.capture("Audit log", { hash });

    return {
      success: true,
      result: client,
    };
  });
}
