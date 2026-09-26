import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ email, subject, message }) {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [email],
    subject,
    text: message,
  });

  if (error) {
    console.error("RESEND ERROR:", error);
    throw new Error(error.message);
  }

  return data;
}