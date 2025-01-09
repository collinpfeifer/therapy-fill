import { action, query } from "@solidjs/router";
import { signIn, signUp, getUser, logout as l } from "./therapist.server";
import { addClientToCancellationList } from "./cancellationList.server";
import { getAppointments } from "./appointment.server";
import { getClients } from "./client.server";

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
// Get Appointments
export const getappointments = query(getAppointments, "getAppointments");
// Get Clients
export const getclients = query(getClients, "getClients");
