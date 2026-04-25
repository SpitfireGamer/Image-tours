import { Router } from "express";
import passport from "passport";
import * as authController from "./auth.controller";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/auth";
import { authLimiter, otpLimiter } from "../../middleware/rateLimiter";
import {
  registerSchema,
  loginSchema,
  verifyOTPSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendOTPSchema,
} from "./auth.schema";

const router = Router();

// ── Public auth routes (rate limited) ──
router.post("/register", authLimiter, validate(registerSchema), authController.register);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/verify-otp", otpLimiter, validate(verifyOTPSchema), authController.verifyOTP);
router.post("/resend-otp", otpLimiter, validate(resendOTPSchema), authController.resendOTP);
router.post("/forgot-password", otpLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", otpLimiter, validate(resetPasswordSchema), authController.resetPassword);
router.post("/refresh-token", authController.refreshToken);

// ── Protected routes ──
router.get("/me", authenticate, authController.getMe);
router.post("/logout", authenticate, authController.logout);

// ── Google OAuth ──
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  authController.googleCallback
);

export default router;
