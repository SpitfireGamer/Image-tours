import mongoose, { Schema, Document } from "mongoose";

export interface IOTP extends Document {
  email: string;
  otp: string;
  purpose: "VERIFY_EMAIL" | "RESET_PASSWORD";
  expiresAt: Date;
  isUsed: boolean;
  attempts: number;
  createdAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["VERIFY_EMAIL", "RESET_PASSWORD"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index — auto-delete expired OTPs
    },
    isUsed: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Compound index for lookups
otpSchema.index({ email: 1, purpose: 1, isUsed: 1 });

export const OTP = mongoose.model<IOTP>("OTP", otpSchema);
