import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASSWORD;

export const emailService = {
  async sendEmail(options: EmailOptions): Promise<void> {
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.warn('SMTP configuration is missing. Email not sent.');
      return;
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${SMTP_USER}" <${SMTP_USER}>`,
      ...options,
    });
  },
};
