import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendEmail = async ({
  to,
  name,
  from,
  subject,
  message,
  scheduledAt,
}: {
  to: string | string[];
  name: string;
  from: string;
  subject: string;
  message: string;
  scheduledAt?: Date;
}) =>
  await resend.emails.send({
    from: `${name} <${from}>`,
    to,
    subject,
    html: message,
    scheduledAt: scheduledAt?.toISOString(),
  });
