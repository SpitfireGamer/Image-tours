import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess, sendCreated, sendNoContent } from "../../utils/response";
import * as authService from "./auth.service";
import { env } from "../../config/env";
import { User } from "../../models/User";

export const register = catchAsync(async (req: Request, res: Response) => {
  console.log("==> Incoming Registration Request:", req.body);
  try {
    const result = await authService.registerUser(req.body);
    console.log("==> Registration Success:", result);
    sendCreated(res, result);
  } catch (error) {
    console.error("==> Registration Error:", error);
    throw error;
  }
});

export const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.verifyOTP(req.body);
  sendSuccess(res, result);
});

export const resendOTP = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.resendOTP(req.body.email);
  sendSuccess(res, result);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  sendSuccess(res, result);
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.forgotPassword(req.body.email);
  sendSuccess(res, result);
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.resetPassword(req.body);
  sendSuccess(res, result);
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.refreshAccessToken(req.body.refreshToken);
  sendSuccess(res, result);
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.id);
  sendSuccess(res, { user });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  // In a JWT system, we rely on token expiry.
  // Clear refresh token from DB for security.
  await User.findByIdAndUpdate(req.user!.id, { refreshToken: null });
  sendNoContent(res);
});

export const googleCallback = catchAsync(async (req: Request, res: Response) => {
  // Passport attaches the user to req.user after Google callback
  const googleUser = req.user as any;
  const result = await authService.handleGoogleAuth({
    googleId: googleUser.googleId || googleUser.id,
    email: googleUser.emails?.[0]?.value || googleUser.email,
    name: googleUser.displayName || googleUser.name,
    avatar: googleUser.photos?.[0]?.value || googleUser.avatar,
  });

  // Redirect to frontend with token
  const params = new URLSearchParams({
    token: result.token,
    refreshToken: result.refreshToken,
    ...(result.needsPhone && { needsPhone: "true" }),
  });
  res.redirect(`${env.FRONTEND_URL}/auth/callback?${params.toString()}`);
});
