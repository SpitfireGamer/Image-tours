import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // True for 465, false for 587
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  connectionTimeout: 10000, // 10 seconds timeout
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    if (!env.SMTP_USER || !env.SMTP_PASS) {
      console.warn("⚠️ Email not configured — skipping send to:", options.to);
      return false;
    }
    await transporter.sendMail({
      from: `"${env.FROM_NAME}" <${env.FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log(`✉️ Email sent to ${options.to}: ${options.subject}`);
    return true;
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return false; // never block the flow
  }
};

export const sendOTPEmail = async (email: string, otp: string, name: string): Promise<boolean> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', Arial, sans-serif; background: #0a0a0f; color: #f5f0eb; margin: 0; padding: 0; }
        .container { max-width: 500px; margin: 40px auto; background: #111118; border-radius: 20px; padding: 40px; border: 1px solid rgba(200,149,108,0.12); }
        .logo { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
        .logo span { color: #d4a853; }
        .otp-box { background: linear-gradient(135deg, #c8956c 0%, #d4a853 100%); color: #0a0a0f; font-size: 36px; font-weight: 800; letter-spacing: 12px; text-align: center; padding: 20px; border-radius: 12px; margin: 24px 0; }
        .text { color: #a8a0b0; font-size: 15px; line-height: 1.7; }
        .warning { color: #706880; font-size: 13px; margin-top: 24px; }
        .divider { width: 60px; height: 2px; background: linear-gradient(90deg, #c8956c, #d4a853); margin: 20px 0; border-radius: 1px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo"><span>Image</span> Tours</div>
        <div class="divider"></div>
        <p class="text">Hi ${name},</p>
        <p class="text">Your verification code is:</p>
        <div class="otp-box">${otp}</div>
        <p class="text">This code expires in <strong>5 minutes</strong>.</p>
        <p class="text">If you didn't request this, please ignore this email.</p>
        <p class="warning">— Image Tours & Travel | Your Personal Travel Concierge</p>
      </div>
    </body>
    </html>
  `;

  console.log(`\n================================`);
  console.log(`🔑 DEV OTP FOR ${email}: ${otp}`);
  console.log(`================================\n`);

  return sendEmail({
    to: email,
    subject: `${otp} — Your Image Tours Verification Code`,
    html,
  });
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<boolean> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', Arial, sans-serif; background: #0a0a0f; color: #f5f0eb; margin: 0; padding: 0; }
        .container { max-width: 500px; margin: 40px auto; background: #111118; border-radius: 20px; padding: 40px; border: 1px solid rgba(200,149,108,0.12); }
        .logo { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
        .logo span { color: #d4a853; }
        .text { color: #a8a0b0; font-size: 15px; line-height: 1.7; }
        .cta { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #25d366 0%, #128c7e 100%); color: #fff; text-decoration: none; border-radius: 10px; font-weight: 600; margin-top: 16px; }
        .divider { width: 60px; height: 2px; background: linear-gradient(90deg, #c8956c, #d4a853); margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo"><span>Image</span> Tours</div>
        <div class="divider"></div>
        <p class="text">Welcome aboard, ${name}! 🎉</p>
        <p class="text">Your account is verified and ready to go. Start planning your dream trip with a real person — no bots, no generic packages.</p>
        <a href="https://wa.me/917875132513?text=Hi!%20I%20just%20signed%20up%20on%20Image%20Tours." class="cta">💬 Chat on WhatsApp</a>
        <p class="text" style="margin-top: 24px;">Or simply browse destinations on our website and hit "Enquire Now" on any package.</p>
        <p class="text">— Image Tours & Travel</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Welcome to Image Tours & Travel! 🌍",
    html,
  });
};
