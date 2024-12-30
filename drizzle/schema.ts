import { text, sqliteTable, blob } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { randomUUIDv7 } from "bun";

export const Users = sqliteTable("users", {
  id: blob("id")
    .$defaultFn(() => randomUUIDv7())
    .primaryKey()
    .unique(),
  waitlistId: blob("id").unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const Waitlists = sqliteTable("waitlists", {
  id: blob("id")
    .$defaultFn(() => randomUUIDv7())
    .primaryKey()
    .unique()
    .references(() => Users.waitlistId),
});

export const WaitlistClients = sqliteTable("waitlistClients", {
  id: blob("id")
    .$defaultFn(() => randomUUIDv7())
    .primaryKey()
    .unique(),
  waitlistId: blob("id").references(() => Waitlists.id),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phoneNumber").notNull().unique(),
  message: text("message"),
});

export const usersRelations = relations(Users, ({ one }) => ({
  waitlist: one(Waitlists, {
    fields: [Users.waitlistId],
    references: [Waitlists.id],
  }),
}));

export const waitlistRelations = relations(Waitlists, ({ many }) => ({
  waitlistClients: many(WaitlistClients),
}));
