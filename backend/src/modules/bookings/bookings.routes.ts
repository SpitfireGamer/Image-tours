import { Router } from "express";
import * as bookingsController from "./bookings.controller";
import { authenticate, optionalAuth } from "../../middleware/auth";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { bookingLimiter } from "../../middleware/rateLimiter";
import { createBookingSchema, updateBookingStatusSchema } from "./bookings.schema";

const router = Router();

// ── Create booking (guests allowed) ──
router.post(
  "/",
  bookingLimiter,
  optionalAuth,
  validate(createBookingSchema),
  bookingsController.createBooking
);

// ── List bookings (auth required) ──
router.get("/", authenticate, bookingsController.listBookings);

// ── Dashboard stats (agent/admin only) ──
router.get(
  "/dashboard/stats",
  authenticate,
  authorize("AGENT", "ADMIN"),
  bookingsController.getDashboardStats
);

// ── Get single booking ──
router.get("/:id", authenticate, bookingsController.getBooking);

// ── Update booking status (agent/admin only) ──
router.patch(
  "/:id/status",
  authenticate,
  authorize("AGENT", "ADMIN"),
  validate(updateBookingStatusSchema),
  bookingsController.updateStatus
);

export default router;
