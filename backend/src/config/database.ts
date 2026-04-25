import mongoose from "mongoose";
import { env } from "./env";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    if (env.NODE_ENV === "development") {
      console.warn("⚠️  MongoDB connection failed — running in offline mode");
      console.warn("   Update MONGODB_URI in .env to connect to your database");
      console.warn("   Error:", (error as Error).message);
      return; // Don't exit in dev — allow health check and API testing
    }
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Attempting reconnection...");
  });
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log("MongoDB disconnected gracefully");
};
