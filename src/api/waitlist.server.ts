"use server";
import { eq } from "drizzle-orm";
import { db } from "./db.server";
import { WaitlistClients, Waitlists } from "../../drizzle/schema";
import { z } from "zod";

export async function addClientToWaitlist(formData: {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  message: string | null;
}) {
  const waitlistClient = z.object({
    name: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    message: z.string(),
    id: z.string().uuid(),
  });

  const { id, name, email, phoneNumber, message } =
    waitlistClient.parse(formData);

  return await db.transaction(async (tx) => {
    const waitlist = await tx
      .select()
      .from(Waitlists)
      .where(eq(Waitlists.id, id))
      .get();
    if (!waitlist) {
      tx.rollback();
      throw new Error("Waitlist doesn't exist");
    }
    return await tx
      .insert(WaitlistClients)
      .values({
        waitlistId: waitlist.id,
        name,
        email,
        phoneNumber,
        message,
      })
      .returning()
      .get();
  });
}
