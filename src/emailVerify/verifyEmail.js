import dotenv from "dotenv/config";
import nodemailer from "nodemailer";

export const verifyEmail = async (email, token) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.mailUser,
      pass: process.env.mailPass,
    },
  });

  const mailConfiguration = {
    from: process.env.mailUser,
    to: email,
    subject: "For EMAIL verification purpose!",
    text: `For verification click here http://localhost:8002/${token}`,
  };

  transport.sendMail(mailConfiguration, async (err, info) => {
    if (err) {
      console.log("Email not sent!");
    }
    console.log(info);
    console.log("Email send successfully!");
  });
};
