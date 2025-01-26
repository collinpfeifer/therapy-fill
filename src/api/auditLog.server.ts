"use server";
import { db } from "~/lib/db";
import { AuditLogs } from "../../drizzle/schema";
import { z } from "zod";
import { posthog } from "posthog-js";
import { generateLogHash } from "~/lib/auditLog";
import { getRequestEvent } from "solid-js/web";

export async function logAuditEvent(data: {
  userId: string;
  action: string;
  target: string;
  details: string;
}) {
  const logSchema = z.object({
    userId: z.string(),
    action: z.enum([
      "READ",
      "CREATE",
      "UPDATE",
      "DELETE",
      "SIGN_IN",
      "SIGN_UP",
      "SIGN_OUT",
    ]),
    target: z.string(),
    details: z.string(),
  });

  const { userId, action, target, details } = logSchema.parse(data);
  const requestEvent = getRequestEvent();
  if (!requestEvent) throw new Error("Request event is not available");
  const request = requestEvent.request;

  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("origin") ||
    "unknown";

  const hash = generateLogHash({ request, userId, action, details });

  const auditLog = await db
    .insert(AuditLogs)
    .values({
      userId,
      action,
      url: request.url,
      target,
      details,
      sourceIp: ip,
      hash,
    })
    .returning()
    .get();

  posthog.capture("Audit log", { hash });

  return auditLog;
}
