"use server";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { Clients, CancellationLists } from "../../drizzle/schema";
import { z } from "zod";

export async function addClientToCancellationList(formData: {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  textConsent: string;
}) {
  const waitlistClient = z.object({
    name: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    textConsent: z.enum(["on", "off"]),
    id: z.string().uuid(),
  });

  const { id, name, email, phoneNumber, textConsent } =
    waitlistClient.parse(formData);

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
    return {
      success: true,
      result: await tx
        .insert(Clients)
        .values({
          cancellationListId: cancellationList.id,
          name,
          email,
          phoneNumber,
          textConsent: textConsent === "on",
        })
        .returning()
        .get(),
    };
  });
}
