import app from "./app";
import { env } from "./config/env";
import { connectDatabase, disconnectDatabase } from "./config/database";

const startServer = async () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║   IMAGE TOURS & TRAVEL — Backend API         ║
  ║   Environment: ${env.NODE_ENV.padEnd(28)}║
  ╚══════════════════════════════════════════════╝
  `);

  // 1. Connect to MongoDB
  await connectDatabase();

  // 2. Start Express
  const server = app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
    console.log(`📋 Health check: http://localhost:${env.PORT}/health`);
    console.log(`🔗 API base: http://localhost:${env.PORT}/api/v1`);
  });

  // ═══════════════════════════════════════════
  // GRACEFUL SHUTDOWN
  // ═══════════════════════════════════════════
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    server.close(async () => {
      console.log("HTTP server closed");
      await disconnectDatabase();
      console.log("All connections closed. Goodbye! 👋");
      process.exit(0);
    });

    // Force shutdown after 30s
    setTimeout(() => {
      console.error("Forced shutdown after timeout");
      process.exit(1);
    }, 30000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
  });

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    shutdown("UNCAUGHT_EXCEPTION");
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
