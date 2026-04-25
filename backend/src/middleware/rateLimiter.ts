import rateLimit from "express-rate-limit";

/** Global: 100 requests per 15 min per IP */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    error: { code: "RATE_LIMITED", message: "Too many requests. Please try again later." },
  },
});

/** Auth endpoints: 10 per hour per IP */
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    data: null,
    error: { code: "RATE_LIMITED", message: "Too many auth attempts. Try again in an hour." },
  },
});

/** Booking creation: 5 per hour per IP */
export const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    data: null,
    error: { code: "RATE_LIMITED", message: "Too many booking requests. Please wait." },
  },
});

/** OTP/Password reset: 3 per hour per IP */
export const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    data: null,
    error: { code: "RATE_LIMITED", message: "Too many OTP requests. Try again later." },
  },
});
