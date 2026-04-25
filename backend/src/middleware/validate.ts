import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../utils/AppError";

/**
 * Zod validation middleware factory.
 * Validates req.body against the provided schema.
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formatted = (error as ZodError).issues.map((e: any) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return next(
          new AppError(400, "VALIDATION_ERROR", "Invalid request data", formatted)
        );
      }
      next(error);
    }
  };
};

/**
 * Validates query params against a Zod schema.
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formatted = (error as ZodError).issues.map((e: any) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return next(
          new AppError(400, "VALIDATION_ERROR", "Invalid query parameters", formatted)
        );
      }
      next(error);
    }
  };
};
