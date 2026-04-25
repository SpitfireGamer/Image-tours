import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import { env } from "./config/env";
import { configurePassport } from "./config/passport";
import { requestIdMiddleware } from "./middleware/requestId";
import { globalLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";

// ── Route imports ──
import authRoutes from "./modules/auth/auth.routes";
import bookingRoutes from "./modules/bookings/bookings.routes";

const app = express();

// ═══════════════════════════════════════════
// SECURITY & PARSING
// ═══════════════════════════════════════════
app.use(helmet({
  contentSecurityPolicy: env.NODE_ENV === "production" ? undefined : false,
}));

app.use(cors({
  origin: env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()),
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ═══════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════
app.use(requestIdMiddleware);
app.use(globalLimiter);

if (env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ── Passport ──
app.use(passport.initialize());
configurePassport();

// ═══════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    environment: env.NODE_ENV,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ═══════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bookings", bookingRoutes);

// ═══════════════════════════════════════════
// 404 HANDLER
// ═══════════════════════════════════════════
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    error: {
      code: "NOT_FOUND",
      message: `Route not found`,
    },
  });
});

// ═══════════════════════════════════════════
// GLOBAL ERROR HANDLER
// ═══════════════════════════════════════════
app.use(errorHandler);

export default app;
