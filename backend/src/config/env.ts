import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),

  // MongoDB
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  // JWT
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_ACCESS_EXPIRY: z.string().default("1h"),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().default(""),
  GOOGLE_CLIENT_SECRET: z.string().default(""),
  GOOGLE_CALLBACK_URL: z.string().default("http://localhost:4000/api/v1/auth/google/callback"),

  // Email SMTP
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  FROM_EMAIL: z.string().default("jpatrikar1@gmail.com"),
  FROM_NAME: z.string().default("Image Tours & Travel"),

  // Business
  AGENT_PHONE: z.string().default("+917875132513"),
  AGENT_EMAIL: z.string().default("jpatrikar1@gmail.com"),
  AGENT_NAME: z.string().default("Image Tours & Travel"),

  // Razorpay
  RAZORPAY_KEY_ID: z.string().default(""),
  RAZORPAY_KEY_SECRET: z.string().default(""),
  RAZORPAY_WEBHOOK_SECRET: z.string().default(""),
  PRIORITY_FEE_AMOUNT: z.coerce.number().default(149),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Environment validation failed:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
