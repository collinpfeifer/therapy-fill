import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { InferSelectModel, relations } from "drizzle-orm";
// import { randomUUIDv7 } from "bun"; // doesnt work sad :(
import { v4 as uuidv4 } from "uuid";

export type Therapist = InferSelectModel<typeof Therapists>;

export const Therapists = sqliteTable("therapists", {
  id: text("id")
    .$defaultFn(() => uuidv4())
    .primaryKey(),
  cancellationListId: text("cancellationListId")
    .unique()
    .references(() => CancellationLists.id),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  textConsent: integer({ mode: "boolean" }).default(false),
});

export const CancellationLists = sqliteTable("cancellationLists", {
  id: text("id")
    .$defaultFn(() => uuidv4())
    .primaryKey(),
});

export const Clients = sqliteTable("clients", {
  id: text("id")
    .$defaultFn(() => uuidv4())
    .primaryKey(),
  cancellationListId: text("cancellationListId").references(
    () => CancellationLists.id,
  ),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phoneNumber").notNull().unique(),
  textConsent: integer({ mode: "boolean" }).default(false),
});

export const Appointments = sqliteTable("appointments", {
  id: text("id")
    .$defaultFn(() => uuidv4())
    .primaryKey(),
  clientId: text("clientId").references(() => Clients.id),
  dateTime: text("dateTime").notNull(),
  from: text("from").notNull(),
  therapistId: text("therapistId").references(() => Therapists.id),
});

export const therapistsRelations = relations(Therapists, ({ one, many }) => ({
  cancellationList: one(CancellationLists, {
    fields: [Therapists.cancellationListId],
    references: [CancellationLists.id],
  }),
  appointments: many(Appointments),
}));

export const cancellationListRelations = relations(
  CancellationLists,
  ({ many, one }) => ({
    clients: many(Clients),
    therapist: one(Therapists, {
      fields: [CancellationLists.id],
      references: [Therapists.cancellationListId],
    }),
  }),
);

export const clientRelations = relations(Clients, ({ one, many }) => ({
  cancellationList: one(CancellationLists, {
    fields: [Clients.cancellationListId],
    references: [CancellationLists.id],
  }),
  appointments: many(Appointments),
}));

export const appointmentRelations = relations(Appointments, ({ one }) => ({
  client: one(Clients, {
    fields: [Appointments.clientId],
    references: [Clients.id],
  }),
  therapist: one(Therapists, {
    fields: [Appointments.therapistId],
    references: [Therapists.id],
  }),
}));
