import { z } from "zod";

const indianPhone = z
  .string()
  .regex(/^\+91[6-9]\d{9}$/, "Must be a valid Indian mobile number (+91XXXXXXXXXX)");

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  phone: indianPhone,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Password must contain at least one special character"),
  referralCode: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

export const verifyOTPSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[0-9]/, "Must contain one number")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Must contain one special character"),
});

export const resendOTPSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
