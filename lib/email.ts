import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 587, // for SSL/TLS
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});
