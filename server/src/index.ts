import express from "express";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma";
import { redis } from "./lib/redis";
import { globalLimiter } from "./middleware/rateLimiter";
import { globalErrorHandler, AppError } from "./middleware/errorHandler";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// 1. Health check placed BEFORE rate limiter to ensure uptime checks always respond
app.get("/health", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    let redisStatus = "disconnected";
    if (redis.status === "ready") {
      try {
        const redisPing = await redis.ping();
        if (redisPing === "PONG") redisStatus = "connected";
      } catch {
        redisStatus = "disconnected";
      }
    }

    res.json({
      status: "ok",
      database: "connected",
      redis: redisStatus,
    });
  } catch (error) {
    next(error);
  }
});

// 2. Global rate limiter applied to API endpoints
app.use(globalLimiter);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Handle unhandled routes (404)
app.all("*", (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized Error Handling Middleware
app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful Shutdown
const handleShutdown = async () => {
  console.log("Shutting down gracefully...");
  server.close(async () => {
    await prisma.$disconnect();
    redis.disconnect();
    console.log("Database and Redis connections closed.");
    process.exit(0);
  });
};

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);
