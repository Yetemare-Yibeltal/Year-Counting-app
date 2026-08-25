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
app.use(globalLimiter);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

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

// Handle unhandled routes (404)
app.all("*", (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Centralized Error Handling Middleware
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
