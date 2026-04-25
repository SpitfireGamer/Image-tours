import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let code = "INTERNAL_ERROR";
  let message = "An unexpected error occurred";
  let details: unknown = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;

    if (err.isOperational) {
      console.warn(`[${(req as any).requestId || 'unknown'}] ${statusCode} ${code}: ${message}`);
    } else {
      console.error(`[${(req as any).requestId || 'unknown'}] CRITICAL: ${err.stack}`);
    }
  } else {
    console.error(`[${(req as any).requestId || 'unknown'}] UNHANDLED: ${err.stack}`);

    // Mongoose duplicate key error
    if ((err as any).code === 11000) {
      statusCode = 409;
      code = "DUPLICATE_KEY";
      const field = Object.keys((err as any).keyValue || {})[0] || "field";
      message = `A record with this ${field} already exists`;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
      statusCode = 400;
      code = "VALIDATION_ERROR";
      message = err.message;
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
      statusCode = 401;
      code = "INVALID_TOKEN";
      message = "Invalid authentication token";
    }
    if (err.name === "TokenExpiredError") {
      statusCode = 401;
      code = "TOKEN_EXPIRED";
      message = "Authentication token has expired";
    }
  }

  const errorResponse: Record<string, unknown> = {
    code,
    message,
  };
  if (env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }
  if (details) {
    errorResponse.details = details;
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    error: errorResponse,
  });
};
