import { z } from "zod";

const futureDate = z.string().refine(
  (val) => new Date(val) > new Date(),
  "Departure date must be in the future"
);

export const createBookingSchema = z.object({
  travelType: z.enum(["FLIGHT", "TRAIN", "HOTEL", "FULL_PACKAGE", "MULTI"]),
  fromCity: z.string().min(2).max(100).trim(),
  toCity: z.string().min(2).max(100).trim(),
  departureDate: futureDate,
  returnDate: z.string().optional(),
  isFlexibleDates: z.boolean().default(false),
  flexibilityDays: z.number().min(0).max(7).optional(),

  adultsCount: z.number().min(1).max(20),
  childrenCount: z.number().min(0).max(10).default(0),
  infantsCount: z.number().min(0).max(4).default(0),
  hasSeniors: z.boolean().default(false),

  budgetMin: z.number().positive("Budget must be positive"),
  budgetMax: z.number().positive("Budget must be positive"),
  budgetPerPerson: z.boolean().default(true),

  travelClass: z.enum(["ECONOMY", "BUSINESS", "FIRST", "SLEEPER", "AC3", "AC2", "AC1"]).optional(),
  mealPreference: z.enum(["VEG", "NON_VEG", "VEGAN", "JAIN"]).optional(),
  seatPreference: z.string().max(100).optional(),
  specialRequests: z.string().max(500).optional(),
  occasion: z.enum(["HONEYMOON", "ANNIVERSARY", "FAMILY", "BUSINESS", "PILGRIMAGE", "GROUP_TOUR", "SOLO"]).optional(),

  isPriority: z.boolean().default(false),

  // Guest info (unauthenticated users)
  guestName: z.string().min(2).max(100).optional(),
  guestPhone: z.string().regex(/^\+91[6-9]\d{9}$/).optional(),
  guestEmail: z.string().email().optional(),

  // UTM
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
}).refine(
  (data) => data.budgetMax >= data.budgetMin,
  { message: "Maximum budget must be >= minimum budget", path: ["budgetMax"] }
);

export const updateBookingStatusSchema = z.object({
  status: z.enum([
    "PENDING", "REVIEWING", "OPTIONS_SENT", "CONFIRMED",
    "PAYMENT_PENDING", "PAYMENT_RECEIVED", "BOOKING_IN_PROGRESS",
    "BOOKED", "COMPLETED", "CANCELLED", "REFUNDED"
  ]),
  reason: z.string().max(500).optional(),
  internalNotes: z.string().max(1000).optional(),
});

export const packageEnquirySchema = z.object({
  name: z.string().min(2).max(100).trim(),
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, "Must be a valid Indian mobile number"),
  email: z.string().email().optional(),
  message: z.string().max(500).optional(),
  travelDate: z.string().optional(),
  groupSize: z.number().min(1).max(50).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
export type PackageEnquiryInput = z.infer<typeof packageEnquirySchema>;
