import nodemailer from "nodemailer";
import { renderWelcomeEmailHtml } from "@/lib/email-templates";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getSmtpConfig() {
  const portRaw = getRequiredEnv("EMAIL_SERVER_PORT");

  return {
    host: getRequiredEnv("EMAIL_SERVER_HOST"),
    port: Number(portRaw),
    secure: Number(portRaw) === 465,
    auth: {
      user: getRequiredEnv("EMAIL_SERVER_USER"),
      pass: getRequiredEnv("EMAIL_SERVER_PASSWORD"),
    },
    from: getRequiredEnv("EMAIL_FROM"),
  };
}

export async function sendWelcomeEmail(email: string, name?: string) {
  const smtp = getSmtpConfig();
  const displayName = name ?? email.split("@")[0];

  const transport = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.auth,
  });

  await transport.sendMail({
    to: email,
    from: smtp.from,
    subject: "MONOLITH_AI // ACCESS_GRANTED",
    text: `Welcome to MONOLITH_AI\n\nYour account is ready.\nStart your first project now: ${process.env.NEXTAUTH_URL}/projects`,
    html: renderWelcomeEmailHtml(displayName),
  });
}
