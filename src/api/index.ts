import { action } from "@solidjs/router";
import { signInOrSignUp, getUser, logout as l } from "./user.server";
import { addClientToWaitlist } from "./waitlist.server";

// Sign Up or Sign In
export const signinorsignup = action(signInOrSignUp, "signInOrSignUp");
// Logout
export const logout = action(l, "logout");
//Get User
export const getuser = action(getUser, "getUser");
// Add Client to Waitlist
export const addclienttowaitlist = action(
  addClientToWaitlist,
  "addClientToWaitlist",
);
