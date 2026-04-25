import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User, IUser } from "../../models/User";
import { OTP } from "../../models/OTP";
import { AppError } from "../../utils/AppError";
import { generateTokens } from "../../middleware/auth";
import { sendOTPEmail, sendWelcomeEmail } from "../../services/email.service";
import { env } from "../../config/env";
import type { RegisterInput, LoginInput, VerifyOTPInput, ResetPasswordInput } from "./auth.schema";

/**
 * Generate a cryptographically secure 6-digit OTP.
 */
const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Register a new user, send OTP for verification.
 */
export const registerUser = async (input: RegisterInput) => {
  // Check for existing user
  const existingEmail = await User.findOne({ email: input.email });
  if (existingEmail) throw AppError.conflict("An account with this email already exists");

  const existingPhone = await User.findOne({ phone: input.phone });
  if (existingPhone) throw AppError.conflict("An account with this phone number already exists");

  // Create user
  const user = new User({
    email: input.email,
    phone: input.phone,
    name: input.name,
    password: input.password,
    isVerified: false,
    referredBy: input.referralCode || undefined,
  });

  // Validate referral code if provided
  if (input.referralCode) {
    const referrer = await User.findOne({ referralCode: input.referralCode });
    if (!referrer) throw AppError.badRequest("Invalid referral code");
  }

  await user.save();

  // Generate and send OTP
  const otp = generateOTP();
  await OTP.create({
    email: input.email,
    otp,
    purpose: "VERIFY_EMAIL",
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  });

  await sendOTPEmail(input.email, otp, input.name);

  return {
    user: user.toPublicJSON(),
    message: "Registration successful. Please verify your email with the OTP sent.",
  };
};

/**
 * Verify email with OTP and activate account.
 */
export const verifyOTP = async (input: VerifyOTPInput) => {
  const otpRecord = await OTP.findOne({
    email: input.email,
    purpose: "VERIFY_EMAIL",
    isUsed: false,
  }).sort({ createdAt: -1 });

  if (!otpRecord) throw AppError.badRequest("No pending OTP found. Please request a new one.");

  // Check expiry
  if (otpRecord.expiresAt < new Date()) {
    throw AppError.badRequest("OTP has expired. Please request a new one.");
  }

  // Check attempts (max 5)
  if (otpRecord.attempts >= 5) {
    throw AppError.tooMany("Too many failed attempts. Please request a new OTP.");
  }

  // Verify OTP
  if (otpRecord.otp !== input.otp) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw AppError.badRequest(`Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.`);
  }

  // Mark OTP as used
  otpRecord.isUsed = true;
  await otpRecord.save();

  // Activate user
  const user = await User.findOneAndUpdate(
    { email: input.email },
    { isVerified: true },
    { new: true }
  );

  if (!user) throw AppError.notFound("User");

  // Generate tokens
  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  // Send welcome email (non-blocking)
  sendWelcomeEmail(user.email, user.name).catch(() => {});

  return {
    user: user.toPublicJSON(),
    token: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: tokens.expiresAt,
  };
};

/**
 * Resend OTP for email verification.
 */
export const resendOTP = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw AppError.notFound("User");
  if (user.isVerified) throw AppError.badRequest("Email is already verified");

  // Invalidate old OTPs
  await OTP.updateMany(
    { email, purpose: "VERIFY_EMAIL", isUsed: false },
    { isUsed: true }
  );

  const otp = generateOTP();
  await OTP.create({
    email,
    otp,
    purpose: "VERIFY_EMAIL",
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await sendOTPEmail(email, otp, user.name);

  return { message: "A new OTP has been sent to your email." };
};

/**
 * Login with email + password.
 */
export const loginUser = async (input: LoginInput) => {
  // Find user with password field
  const user = await User.findOne({ email: input.email }).select("+password");
  if (!user) throw AppError.unauthorized("Invalid email or password");

  if (!user.password) {
    throw AppError.badRequest("This account uses Google Sign-In. Please login with Google.");
  }

  const isPasswordValid = await user.comparePassword(input.password);
  if (!isPasswordValid) throw AppError.unauthorized("Invalid email or password");

  if (!user.isActive) throw AppError.forbidden("Account has been deactivated");

  if (!user.isVerified) {
    // Re-send OTP
    const otp = generateOTP();
    await OTP.create({
      email: input.email,
      otp,
      purpose: "VERIFY_EMAIL",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await sendOTPEmail(input.email, otp, user.name);

    throw new AppError(
      403,
      "EMAIL_NOT_VERIFIED",
      "Please verify your email first. A new OTP has been sent."
    );
  }

  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return {
    user: user.toPublicJSON(),
    token: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: tokens.expiresAt,
  };
};

/**
 * Handle Google OAuth user — find or create.
 */
export const handleGoogleAuth = async (profile: {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
}) => {
  let user = await User.findOne({
    $or: [{ googleId: profile.googleId }, { email: profile.email }],
  });

  if (user) {
    // Link Google ID if not already linked
    if (!user.googleId) {
      user.googleId = profile.googleId;
      user.avatar = profile.avatar;
      await user.save();
    }
  } else {
    // Create new user (Google users are auto-verified)
    user = await User.create({
      email: profile.email,
      name: profile.name,
      googleId: profile.googleId,
      avatar: profile.avatar,
      phone: `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`, // unique placeholder
      isVerified: true,
    });
  }

  if (!user.isActive) throw AppError.forbidden("Account has been deactivated");

  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return {
    user: user.toPublicJSON(),
    token: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: tokens.expiresAt,
    needsPhone: user.phone === "+910000000000",
  };
};

/**
 * Forgot password — send reset OTP.
 */
export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if email exists
    return { message: "If an account exists with this email, you'll receive a reset code." };
  }

  const otp = generateOTP();
  await OTP.create({
    email,
    otp,
    purpose: "RESET_PASSWORD",
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await sendOTPEmail(email, otp, user.name);

  return { message: "If an account exists with this email, you'll receive a reset code." };
};

/**
 * Reset password using OTP.
 */
export const resetPassword = async (input: ResetPasswordInput) => {
  const otpRecord = await OTP.findOne({
    email: input.email,
    purpose: "RESET_PASSWORD",
    isUsed: false,
  }).sort({ createdAt: -1 });

  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    throw AppError.badRequest("Invalid or expired OTP");
  }

  if (otpRecord.otp !== input.otp) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw AppError.badRequest("Invalid OTP");
  }

  otpRecord.isUsed = true;
  await otpRecord.save();

  const user = await User.findOne({ email: input.email }).select("+password");
  if (!user) throw AppError.notFound("User");

  user.password = input.newPassword;
  await user.save();

  return { message: "Password reset successfully. You can now login." };
};

/**
 * Refresh access token.
 */
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_SECRET) as { id: string; type: string };
    if (decoded.type !== "refresh") throw AppError.unauthorized("Invalid refresh token");

    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken) {
      throw AppError.unauthorized("Invalid refresh token");
    }

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
    };
  } catch {
    throw AppError.unauthorized("Invalid or expired refresh token");
  }
};

/**
 * Get current user profile.
 */
export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw AppError.notFound("User");
  return user.toPublicJSON();
};
