import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const SMTP_ID = process.env.SMTP_ID;
const SMTP_PW = process.env.SMTP_PW;

interface MailSendProps {
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async ({
  to,
  subject,
  html,
}: MailSendProps): Promise<nodemailer.SentMessageInfo> => {
  if (!to) throw new Error('Need "to" Propertie.');

  try {
    console.log(SMTP_ID, SMTP_PW);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: SMTP_ID,
        pass: SMTP_PW,
      },
    });

    const mailOptions = {
      from: "CLAB",
      to,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send email");
  }
};
