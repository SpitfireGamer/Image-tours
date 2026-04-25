import { BookingRequest, ALLOWED_TRANSITIONS } from "../../models/BookingRequest";
import { BookingStatusHistory } from "../../models/BookingStatusHistory";
import { User } from "../../models/User";
import { AppError } from "../../utils/AppError";
import type { CreateBookingInput, UpdateBookingStatusInput } from "./bookings.schema";

/**
 * Generate unique request number: TRV-2025-0001
 */
const generateRequestNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `TRV-${year}-`;

  const lastBooking = await BookingRequest.findOne({
    requestNumber: { $regex: `^${prefix}` },
  })
    .sort({ requestNumber: -1 })
    .lean();

  let nextNum = 1;
  if (lastBooking) {
    const lastNum = parseInt(lastBooking.requestNumber.split("-").pop() || "0", 10);
    nextNum = lastNum + 1;
  }

  return `${prefix}${String(nextNum).padStart(4, "0")}`;
};

/**
 * Create a new booking request.
 */
export const createBooking = async (
  input: CreateBookingInput,
  userId?: string
) => {
  const requestNumber = await generateRequestNumber();

  const bookingData: Record<string, unknown> = {
    requestNumber,
    travelType: input.travelType,
    fromCity: input.fromCity,
    toCity: input.toCity,
    departureDate: new Date(input.departureDate),
    returnDate: input.returnDate ? new Date(input.returnDate) : undefined,
    isFlexibleDates: input.isFlexibleDates,
    flexibilityDays: input.flexibilityDays,
    adultsCount: input.adultsCount,
    childrenCount: input.childrenCount,
    infantsCount: input.infantsCount,
    hasSeniors: input.hasSeniors,
    budgetMin: input.budgetMin,
    budgetMax: input.budgetMax,
    budgetPerPerson: input.budgetPerPerson,
    travelClass: input.travelClass,
    mealPreference: input.mealPreference,
    seatPreference: input.seatPreference,
    specialRequests: input.specialRequests,
    occasion: input.occasion,
    isPriority: input.isPriority,
    source: "WEBSITE",
    utmSource: input.utmSource,
    utmMedium: input.utmMedium,
    utmCampaign: input.utmCampaign,
    status: "PENDING",
    expectedResponseAt: new Date(Date.now() + (input.isPriority ? 15 : 30) * 60 * 1000),
  };

  if (userId) {
    bookingData.customerId = userId;
  } else {
    // Guest booking
    bookingData.guestName = input.guestName;
    bookingData.guestPhone = input.guestPhone;
    bookingData.guestEmail = input.guestEmail;
  }

  const booking = await BookingRequest.create(bookingData);

  // Auto-assign to the primary agent (admin/agent)
  const agent = await User.findOne({ role: { $in: ["AGENT", "ADMIN"] } });
  if (agent) {
    booking.agentId = agent._id;
    booking.assignedAt = new Date();
    await booking.save();
  }

  return booking;
};

/**
 * List bookings with filters and pagination.
 */
export const listBookings = async (
  userId: string,
  role: string,
  query: {
    page?: number;
    perPage?: number;
    status?: string;
    travelType?: string;
    search?: string;
    isPriority?: string;
  }
) => {
  const page = query.page || 1;
  const perPage = Math.min(query.perPage || 20, 100);
  const skip = (page - 1) * perPage;

  const filter: Record<string, unknown> = {};

  // Customers can only see their own bookings
  if (role === "CUSTOMER") {
    filter.customerId = userId;
  }

  if (query.status) filter.status = query.status;
  if (query.travelType) filter.travelType = query.travelType;
  if (query.isPriority === "true") filter.isPriority = true;
  if (query.search) {
    filter.$or = [
      { requestNumber: { $regex: query.search, $options: "i" } },
      { fromCity: { $regex: query.search, $options: "i" } },
      { toCity: { $regex: query.search, $options: "i" } },
      { guestName: { $regex: query.search, $options: "i" } },
    ];
  }

  const [bookings, total] = await Promise.all([
    BookingRequest.find(filter)
      .populate("customerId", "name email phone")
      .populate("agentId", "name email")
      .sort({ isPriority: -1, createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .lean(),
    BookingRequest.countDocuments(filter),
  ]);

  return {
    bookings,
    meta: {
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    },
  };
};

/**
 * Get single booking by ID.
 */
export const getBookingById = async (bookingId: string, userId: string, role: string) => {
  const booking = await BookingRequest.findById(bookingId)
    .populate("customerId", "name email phone avatar")
    .populate("agentId", "name email");

  if (!booking) throw AppError.notFound("Booking");

  // Customers can only view their own
  if (role === "CUSTOMER" && booking.customerId?.toString() !== userId) {
    throw AppError.forbidden("You can only view your own bookings");
  }

  const statusHistory = await BookingStatusHistory.find({ bookingRequestId: bookingId })
    .populate("changedBy", "name role")
    .sort({ createdAt: -1 })
    .lean();

  return { booking, statusHistory };
};

/**
 * Update booking status with transition validation.
 */
export const updateBookingStatus = async (
  bookingId: string,
  input: UpdateBookingStatusInput,
  changedById: string
) => {
  const booking = await BookingRequest.findById(bookingId);
  if (!booking) throw AppError.notFound("Booking");

  const currentStatus = booking.status;
  const newStatus = input.status;

  // Validate transition
  const allowedNext = ALLOWED_TRANSITIONS[currentStatus];
  if (!allowedNext || !allowedNext.includes(newStatus)) {
    throw AppError.unprocessable(
      `Cannot transition from ${currentStatus} to ${newStatus}. Allowed: ${allowedNext?.join(", ") || "none"}`
    );
  }

  // Create status history
  await BookingStatusHistory.create({
    bookingRequestId: bookingId,
    changedBy: changedById,
    fromStatus: currentStatus,
    toStatus: newStatus,
    reason: input.reason,
  });

  // Update booking
  booking.status = newStatus;
  if (input.internalNotes) booking.internalNotes = input.internalNotes;
  if (input.reason && newStatus === "CANCELLED") booking.cancellationReason = input.reason;

  // Set milestone timestamps
  if (newStatus === "REVIEWING" && !booking.firstResponseAt) {
    booking.firstResponseAt = new Date();
  }
  if (newStatus === "CONFIRMED") {
    booking.confirmedAt = new Date();
  }
  if (newStatus === "COMPLETED") {
    booking.completedAt = new Date();
    // Update customer stats
    if (booking.customerId) {
      await User.findByIdAndUpdate(booking.customerId, {
        $inc: { totalBookings: 1 },
      });
    }
  }

  await booking.save();
  return booking;
};

/**
 * Dashboard stats for agent.
 */
export const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [total, pending, inProgress, completed, cancelled, todayNew, weekNew] = await Promise.all([
    BookingRequest.countDocuments(),
    BookingRequest.countDocuments({ status: "PENDING" }),
    BookingRequest.countDocuments({ status: { $in: ["REVIEWING", "OPTIONS_SENT", "CONFIRMED", "PAYMENT_PENDING", "PAYMENT_RECEIVED", "BOOKING_IN_PROGRESS"] } }),
    BookingRequest.countDocuments({ status: "COMPLETED" }),
    BookingRequest.countDocuments({ status: "CANCELLED" }),
    BookingRequest.countDocuments({ createdAt: { $gte: today } }),
    BookingRequest.countDocuments({ createdAt: { $gte: weekAgo } }),
  ]);

  return {
    bookings: { total, pending, inProgress, completed, cancelled, todayNew, weekNew },
  };
};
