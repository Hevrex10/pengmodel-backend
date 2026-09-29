import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ email, subject, message, replyTo }) {
  const emailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    text: message,
  };

  if (replyTo) {
    emailOptions.replyTo = replyTo;
  }

  const { data, error } = await resend.emails.send(emailOptions);
  

  if (error) {
    console.error("RESEND ERROR:", error);
    throw new Error(error.message);
  }
  return data;
}
