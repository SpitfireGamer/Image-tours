import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

type Role = "CUSTOMER" | "AGENT" | "ADMIN";

/**
 * Role-based access control middleware factory.
 * Usage: authorize("ADMIN") or authorize("AGENT", "ADMIN")
 */
export const authorize = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized());
    }
    if (!roles.includes(req.user.role as Role)) {
      return next(
        AppError.forbidden(`Access denied. Required role: ${roles.join(" or ")}`)
      );
    }
    next();
  };
};
