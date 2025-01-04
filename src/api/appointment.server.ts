"use server";
import { eq } from "drizzle-orm";
import { db } from "./db.server";
import { Appointments, Clients } from "../../drizzle/schema";
import { z } from "zod";
import { sendSMS } from "./twilio.server";
import { sendEmail } from "./resend.server";
