import {
  Therapists,
  Appointments,
  Notifications,
  Clients,
  CancellationLists,
  AuditLogs,
  Admins,
} from "drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { runMigrations } from "~/lib/db";

// await runMigrations();

// console.log(await db.select().from(Appointments));
// console.log(await db.select().from(Notifications).get());
console.log(await db.select().from(Clients));
// console.log(await db.select().from(Therapists));
console.log(await db.select().from(CancellationLists));
// console.log(await db.select().from(AuditLogs).get());
// console.log(
//   await db
//     .select()
//     .from(Admins)
//     .where(eq(Admins.email, "cpfeifer@madcactus.org"))
//     .get(),
// );
// console.log(await db.select().from(AuditLogs));
