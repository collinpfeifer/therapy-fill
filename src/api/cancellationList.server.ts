"use server";
import { eq } from "drizzle-orm";
import { db } from "./db.server";
import {
  CancellationListClients,
  CancellationLists,
} from "../../drizzle/schema";
import { z } from "zod";

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
    message: z.string(),
    textConsent: z.boolean(),
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
      throw new Error("Waitlist doesn't exist");
    }
    return await tx
      .insert(CancellationListClients)
      .values({
        cancellationListId: cancellationList.id,
        name,
        email,
        phoneNumber,
        textConsent,
      })
      .returning()
      .get();
  });
}
