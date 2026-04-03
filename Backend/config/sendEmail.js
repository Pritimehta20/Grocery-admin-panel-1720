import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.log('Provide EMAIL_USER and EMAIL_PASS in Backend/.env');
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT || 587),
  secure: Number(process.env.EMAIL_PORT || 587) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready');
  }
});

const sendEmail = async ({ sendTo, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `Harvest Green <${process.env.EMAIL_USER}>`,
      to: sendTo,
      subject,
      html,
      text: text || 'Please open this email in an HTML-supported email client.',
    });

    console.log('Message sent:', info.messageId);
    return { data: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return null;
  }
};

export default sendEmail;