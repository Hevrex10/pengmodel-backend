import { sendEmail } from "../utils/sendEmail.js";
import AppError from "../utils/appError.js";

export async function sendContactMessage(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return next(new AppError("Please fill in all fields", 400));
    }

    await sendEmail({
      email: process.env.CONTACT_EMAIL,
      subject: `PengModel Contact: ${subject}`,
      replyTo: email,
      message: `
        New message from the PengModel website

        Name: ${name}
        Email: ${email}
        Subject: ${subject}

        Message:
        ${message}
              `,
    });

    res.status(200).json({
      status: "success",
      message: "Your message has been sent successfully.",
    });
  } catch (err) {
    next(err);
  }
}
