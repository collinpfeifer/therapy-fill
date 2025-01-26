import { action, query } from "@solidjs/router";
import {
  signIn,
  signUp,
  getUser,
  logout as l,
  getTherapists,
} from "./therapist.server";
import { addClientToCancellationList } from "./cancellationList.server";
import {
  getAppointments,
  getAppointmentByNotificationId,
  bookAppointment,
  getAppointmentsByTherapistId,
  addAppointment,
  adminBookAppointment,
} from "./appointment.server";
import { getClients, getClientsByTherapistId } from "./client.server";
import { logAuditEvent } from "./auditLog.server";
import { adminSignIn } from "./admin.server";

// Sign In
export const signin = action(signIn, "signIn");
// Sign Up
export const signup = action(signUp, "signUp");
// Logout
export const logout = action(l, "logout");
//Get User
export const getuser = query(getUser, "getUser");
// Add Client to Waitlist
export const addclienttocancellationlist = action(
  addClientToCancellationList,
  "addClientToCancellationList",
);
// Get appointments
export const getappointments = query(getAppointments, "getAppointments");
// Get Appointment by Notification ID
export const getappointmentbynotificationid = query(
  getAppointmentByNotificationId,
  "getAppointmentByNotificationId",
);
// Get Clients
export const getclients = query(getClients, "getClients");
// Book Appointment
export const bookappointment = action(bookAppointment, "bookAppointment");
// Log Audit Event
export const logauditevent = action(logAuditEvent, "logAuditEvent");
// Admin Sign In
export const adminsignin = action(adminSignIn, "adminSignIn");
// Get Therapists
export const gettherapists = query(getTherapists, "getTherapists");
// Get Clients By Therapist ID
export const getclientsbytherapistid = query(
  (id) => getClientsByTherapistId(id),
  "getClientsByTherapistId",
);
// Get Appointments By Therapist ID
export const getappointmentsbytherapistid = query(
  (id) => getAppointmentsByTherapistId(id),
  "getAppointmentsByTherapistId",
);
// Add Appointment
export const addappointment = action(addAppointment, "addAppointment");
// Admin Book Appointment
export const adminbookappointment = action(
  adminBookAppointment,
  "adminBookAppointment",
);
