export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: unknown;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: unknown,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  // ── Common factory methods ──
  static badRequest(message: string, details?: unknown) {
    return new AppError(400, "BAD_REQUEST", message, details);
  }
  static unauthorized(message = "Authentication required") {
    return new AppError(401, "UNAUTHORIZED", message);
  }
  static forbidden(message = "Access denied") {
    return new AppError(403, "FORBIDDEN", message);
  }
  static notFound(resource = "Resource") {
    return new AppError(404, "NOT_FOUND", `${resource} not found`);
  }
  static conflict(message: string) {
    return new AppError(409, "CONFLICT", message);
  }
  static unprocessable(message: string, details?: unknown) {
    return new AppError(422, "UNPROCESSABLE", message, details);
  }
  static tooMany(message = "Too many requests. Please try again later.") {
    return new AppError(429, "RATE_LIMITED", message);
  }
  static internal(message = "An unexpected error occurred") {
    return new AppError(500, "INTERNAL_ERROR", message, undefined, false);
  }
}
