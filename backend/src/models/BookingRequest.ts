import mongoose, { Schema, Document } from "mongoose";

// ── Enums ──
export const BOOKING_STATUS = [
  "PENDING", "REVIEWING", "OPTIONS_SENT", "CONFIRMED",
  "PAYMENT_PENDING", "PAYMENT_RECEIVED", "BOOKING_IN_PROGRESS",
  "BOOKED", "COMPLETED", "CANCELLED", "REFUNDED"
] as const;

export const TRAVEL_TYPE = [
  "FLIGHT", "TRAIN", "HOTEL", "FULL_PACKAGE", "MULTI"
] as const;

export const TRAVEL_CLASS = [
  "ECONOMY", "BUSINESS", "FIRST", "SLEEPER", "AC3", "AC2", "AC1"
] as const;

export const MEAL_PREFERENCE = ["VEG", "NON_VEG", "VEGAN", "JAIN"] as const;

export const TRIP_OCCASION = [
  "HONEYMOON", "ANNIVERSARY", "FAMILY", "BUSINESS",
  "PILGRIMAGE", "GROUP_TOUR", "SOLO"
] as const;

export const REQUEST_SOURCE = ["WEBSITE", "WHATSAPP", "PHONE", "REFERRAL"] as const;

// ── Status transition matrix ──
export const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["REVIEWING", "CANCELLED"],
  REVIEWING: ["OPTIONS_SENT", "CANCELLED"],
  OPTIONS_SENT: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PAYMENT_PENDING", "CANCELLED"],
  PAYMENT_PENDING: ["PAYMENT_RECEIVED", "CANCELLED"],
  PAYMENT_RECEIVED: ["BOOKING_IN_PROGRESS"],
  BOOKING_IN_PROGRESS: ["BOOKED", "CANCELLED"],
  BOOKED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: ["REFUNDED"],
  REFUNDED: [],
};

export interface IBookingRequest extends Document {
  requestNumber: string;
  customerId: mongoose.Types.ObjectId;
  agentId?: mongoose.Types.ObjectId;
  travelType: (typeof TRAVEL_TYPE)[number];
  fromCity: string;
  toCity: string;
  departureDate: Date;
  returnDate?: Date;
  isFlexibleDates: boolean;
  flexibilityDays: number;
  adultsCount: number;
  childrenCount: number;
  infantsCount: number;
  hasSeniors: boolean;
  budgetMin: number;
  budgetMax: number;
  budgetPerPerson: boolean;
  travelClass?: (typeof TRAVEL_CLASS)[number];
  mealPreference?: (typeof MEAL_PREFERENCE)[number];
  seatPreference?: string;
  specialRequests?: string;
  occasion?: (typeof TRIP_OCCASION)[number];
  isPriority: boolean;
  expectedResponseAt?: Date;
  status: (typeof BOOKING_STATUS)[number];
  cancellationReason?: string;
  internalNotes?: string;
  source: (typeof REQUEST_SOURCE)[number];
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  // Guest info (unauthenticated)
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  // Timestamps
  assignedAt?: Date;
  firstResponseAt?: Date;
  confirmedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bookingRequestSchema = new Schema<IBookingRequest>(
  {
    requestNumber: { type: String, unique: true, required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    agentId: { type: Schema.Types.ObjectId, ref: "User", index: true },

    travelType: { type: String, enum: TRAVEL_TYPE, required: true },
    fromCity: { type: String, required: true, trim: true },
    toCity: { type: String, required: true, trim: true },
    departureDate: { type: Date, required: true, index: true },
    returnDate: { type: Date },
    isFlexibleDates: { type: Boolean, default: false },
    flexibilityDays: { type: Number, default: 0 },

    adultsCount: { type: Number, required: true, min: 1, max: 20 },
    childrenCount: { type: Number, default: 0, min: 0, max: 10 },
    infantsCount: { type: Number, default: 0, min: 0, max: 4 },
    hasSeniors: { type: Boolean, default: false },

    budgetMin: { type: Number, required: true },
    budgetMax: { type: Number, required: true },
    budgetPerPerson: { type: Boolean, default: true },

    travelClass: { type: String, enum: TRAVEL_CLASS },
    mealPreference: { type: String, enum: MEAL_PREFERENCE },
    seatPreference: { type: String },
    specialRequests: { type: String, maxlength: 500 },
    occasion: { type: String, enum: TRIP_OCCASION },

    isPriority: { type: Boolean, default: false },
    expectedResponseAt: { type: Date },

    status: { type: String, enum: BOOKING_STATUS, default: "PENDING", index: true },
    cancellationReason: { type: String },
    internalNotes: { type: String },

    source: { type: String, enum: REQUEST_SOURCE, default: "WEBSITE" },
    utmSource: { type: String },
    utmMedium: { type: String },
    utmCampaign: { type: String },

    guestName: { type: String },
    guestPhone: { type: String },
    guestEmail: { type: String },

    assignedAt: { type: Date },
    firstResponseAt: { type: Date },
    confirmedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

// ── Compound indexes ──
bookingRequestSchema.index({ status: 1, createdAt: -1 });
bookingRequestSchema.index({ agentId: 1, status: 1 });
bookingRequestSchema.index({ customerId: 1, createdAt: -1 });

export const BookingRequest = mongoose.model<IBookingRequest>("BookingRequest", bookingRequestSchema);
