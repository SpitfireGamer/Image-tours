import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  phone: string;
  name: string;
  password?: string;
  role: "CUSTOMER" | "AGENT" | "ADMIN";
  isVerified: boolean;
  isActive: boolean;
  googleId?: string;
  avatar?: string;
  preferences?: Record<string, unknown>;
  totalBookings: number;
  totalSpent: number;
  referralCode: string;
  referredBy?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toPublicJSON(): Record<string, unknown>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    password: {
      type: String,
      minlength: 8,
      select: false, // never returned by default
    },
    role: {
      type: String,
      enum: ["CUSTOMER", "AGENT", "ADMIN"],
      default: "CUSTOMER",
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    googleId: { type: String, sparse: true },
    avatar: { type: String },
    preferences: { type: Schema.Types.Mixed },
    totalBookings: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    referralCode: {
      type: String,
      unique: true,
      index: true,
    },
    referredBy: { type: String },
    refreshToken: { type: String, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Hash password before save ──
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ── Generate referral code before save ──
userSchema.pre("save", function () {
  if (!this.referralCode) {
    this.referralCode = `IMG${this._id.toString().slice(-6).toUpperCase()}`;
  }
});

// ── Compare password ──
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Public JSON (strip sensitive fields) ──
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    email: this.email,
    phone: this.phone,
    name: this.name,
    role: this.role,
    isVerified: this.isVerified,
    avatar: this.avatar,
    totalBookings: this.totalBookings,
    referralCode: this.referralCode,
    createdAt: this.createdAt,
  };
};

export const User = mongoose.model<IUser>("User", userSchema);
