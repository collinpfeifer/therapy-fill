import { integer, text, sqliteTable, blob } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
// import { randomUUIDv7 } from "bun"; // doesnt work sad :(
import { v4 as uuidv4 } from "uuid";

export const Users = sqliteTable("users", {
  id: blob("id")
    .$defaultFn(() => uuidv4())
    .primaryKey(),
  cancellationListId: blob("id").unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  textConsent: integer({ mode: "boolean" }).default(false),
});

export const CancellationLists = sqliteTable("cancellationLists", {
  id: blob("id")
    .$defaultFn(() => uuidv4())
    .primaryKey()
    .references(() => Users.cancellationListId),
});

export const CancellationListClients = sqliteTable("cancellationListClients", {
  id: blob("id")
    .$defaultFn(() => uuidv4())
    .primaryKey(),
  cancellationListId: blob("id").references(() => CancellationLists.id),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phoneNumber").notNull().unique(),
  textConsent: integer({ mode: "boolean" }).default(false),
});

export const usersRelations = relations(Users, ({ one }) => ({
  waitlist: one(CancellationLists, {
    fields: [Users.cancellationListId],
    references: [CancellationLists.id],
  }),
}));

export const cancellationListsRelations = relations(
  CancellationLists,
  ({ many }) => ({
    waitlistClients: many(CancellationListClients),
  }),
);
