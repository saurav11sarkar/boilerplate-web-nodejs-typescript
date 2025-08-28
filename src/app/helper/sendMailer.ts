import nodemailer from "nodemailer";
import config from "../config";

const sendMailer = async (
  email: string,
  subject?: string,
  text?: string,
  html?: string
) => {
  
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: Number(config.email.port),
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.email.address,
      pass: config.email.pass,
    },
  });
  const info = await transporter.sendMail({
    from: `"Padel leagues" ${config.email.from}`,
    to: email,
    subject,
    text,
    html,
  });

  console.log("Message sent:", info.messageId);
};

export default sendMailer;
