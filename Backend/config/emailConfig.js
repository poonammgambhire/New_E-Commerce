import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // 👈 he add kara

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Test kara
transporter.verify((error, success) => {
  if (error) {
    console.log("Email Error:", error.message);
  } else {
    console.log("Email Server Ready ✅");
  }
});

export default transporter;