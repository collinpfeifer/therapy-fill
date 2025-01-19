import {
  Therapists,
  Appointments,
  Notifications,
  Clients,
  CancellationLists,
  AuditLogs,
} from "drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { runMigrations } from "~/lib/migrations";

// await runMigrations();

console.log(
  await db
    .select()
    .from(Appointments)
    .where(eq(Appointments.from, "+13179955114"))
    .get(),
);
console.log(await db.select().from(Notifications).get());
console.log(await db.select().from(Clients).get());
console.log(await db.select().from(Therapists).get());
console.log(await db.select().from(CancellationLists).get());
console.log(await db.select().from(AuditLogs).get());
