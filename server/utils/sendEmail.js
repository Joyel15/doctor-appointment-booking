import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create a reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send an email using the configured transporter
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);

    // Re-throw the error so the calling controller can handle it
    throw error;
  }
};

export default sendEmail;