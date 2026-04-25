import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";

interface JWTPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Verifies JWT token and attaches user to request.
 * Use this on all protected routes.
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw AppError.unauthorized("No authentication token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;

    const user = await User.findById(decoded.id);
    if (!user) throw AppError.unauthorized("User no longer exists");
    if (!user.isActive) throw AppError.forbidden("Account has been deactivated");

    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    if ((error as Error).name === "TokenExpiredError") {
      return next(AppError.unauthorized("Token has expired. Please login again."));
    }
    if ((error as Error).name === "JsonWebTokenError") {
      return next(AppError.unauthorized("Invalid token"));
    }
    next(error);
  }
};

/**
 * Optional auth — attaches user if token present, continues if not.
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return next();

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    const user = await User.findById(decoded.id);

    if (user && user.isActive) {
      req.user = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      };
    }
  } catch {
    // Token invalid — continue as unauthenticated
  }
  next();
};

/**
 * Generates access + refresh token pair.
 */
export const generateTokens = (user: { _id: unknown; email: string; role: string }) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRY as any }
  );

  const refreshToken = jwt.sign(
    { id: user._id, type: "refresh" },
    env.JWT_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRY as any }
  );

  const decoded = jwt.decode(accessToken) as JWTPayload;
  const expiresAt = new Date(decoded.exp * 1000).toISOString();

  return { accessToken, refreshToken, expiresAt };
};
