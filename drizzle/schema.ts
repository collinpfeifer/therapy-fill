import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const Emails = sqliteTable("emails", {
  id: integer("id").primaryKey().unique().notNull(),
  email: text("email").notNull().unique(),
});
