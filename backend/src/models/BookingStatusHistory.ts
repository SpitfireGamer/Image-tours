import mongoose, { Schema, Document } from "mongoose";

export interface IBookingStatusHistory extends Document {
  bookingRequestId: mongoose.Types.ObjectId;
  changedBy: mongoose.Types.ObjectId;
  fromStatus: string;
  toStatus: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const statusHistorySchema = new Schema<IBookingStatusHistory>(
  {
    bookingRequestId: { type: Schema.Types.ObjectId, ref: "BookingRequest", required: true, index: true },
    changedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fromStatus: { type: String, required: true },
    toStatus: { type: String, required: true },
    reason: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

statusHistorySchema.index({ bookingRequestId: 1, createdAt: -1 });

export const BookingStatusHistory = mongoose.model<IBookingStatusHistory>(
  "BookingStatusHistory",
  statusHistorySchema
);
