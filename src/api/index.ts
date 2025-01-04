import { action } from "@solidjs/router";
import { signIn, signUp, getUser, logout as l } from "./therapist.server";
import { addClientToCancellationList } from "./cancellationList.server";

// Sign In
export const signin = action(signIn, "signIn");
// Sign Up
export const signup = action(signUp, "signUp");
// Logout
export const logout = action(l, "logout");
//Get User
export const getuser = action(getUser, "getUser");
// Add Client to Waitlist
export const addclienttocancellationlist = action(
  addClientToCancellationList,
  "addClientToCancellationList",
);
