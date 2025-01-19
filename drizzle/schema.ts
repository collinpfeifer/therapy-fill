import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { InferSelectModel, relations, sql } from "drizzle-orm";
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
  textConsent: integer({ mode: "boolean" }).default(false).notNull(),
});

export type CancellationList = InferSelectModel<typeof CancellationLists>;

export const CancellationLists = sqliteTable("cancellationLists", {
  id: text("id")
    .$defaultFn(() => uuidv4())
    .primaryKey(),
});

export type Client = InferSelectModel<typeof Clients>;

export const Clients = sqliteTable("clients", {
  id: text("id")
    .$defaultFn(() => uuidv4())
    .primaryKey(),
  cancellationListId: text("cancellationListId")
    .references(() => CancellationLists.id)
    .notNull(),
  therapistId: text("therapistId").references(() => Therapists.id),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phoneNumber").notNull().unique(),
  textConsent: integer({ mode: "boolean" }).default(false).notNull(),
});

export type Appointment = InferSelectModel<typeof Appointments>;
export type AppointmentStatus = "available" | "booked" | "cancelled";

export const Appointments = sqliteTable("appointments", {
  id: text("id")
    .$defaultFn(() => uuidv4())
    .primaryKey(),
  clientId: text("clientId").references(() => Clients.id),
  dateTime: text("dateTime").notNull(),
  from: text("from").notNull(),
  status: text("status").notNull(),
  therapistId: text("therapistId")
    .references(() => Therapists.id)
    .notNull(),
  therapistName: text("therapistName").notNull(),
});

export type Notification = InferSelectModel<typeof Notifications>;
export type NotificationStatus = "sent" | "responded";

export const Notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  appointmentId: text("appointmentId")
    .references(() => Appointments.id)
    .notNull(),
  clientId: text("clientId")
    .references(() => Clients.id)
    .notNull(),
  phoneNumber: text("phoneNumber").notNull(),
  status: text("status").notNull(),
  bookingLink: text("bookingLink").notNull(),
});

export type AuditLog = InferSelectModel<typeof AuditLogs>;
export type AuditLogAction = "READ" | "CREATE" | "UPDATE" | "DELETE";

export const AuditLogs = sqliteTable("auditLogs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventTime: text("eventTime")
    .notNull()
    .default(sql`(current_timestamp)`),
  userId: text("userId").notNull(),
  action: text("action").notNull(),
  target: text("target").notNull(),
  details: text("details").notNull(),
  sourceIp: text("sourceIp").notNull(),
  url: text("url").notNull(),
  hash: text("hash").notNull(),
});

export const therapistsRelations = relations(Therapists, ({ one, many }) => ({
  cancellationList: one(CancellationLists, {
    fields: [Therapists.cancellationListId],
    references: [CancellationLists.id],
  }),
  clients: many(Clients),
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
  therapist: one(Therapists, {
    fields: [Clients.therapistId],
    references: [Therapists.id],
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
