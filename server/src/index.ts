import express from "express";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma";
import { redis } from "./lib/redis";
import { globalLimiter } from "./middleware/rateLimiter";
import { globalErrorHandler, AppError } from "./middleware/errorHandler";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(globalLimiter);

// API Routes
app.use("/api/users", userRoutes);

app.get("/health", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const redisPing = await redis.ping();

    res.json({
      status: "ok",
      database: "connected",
      redis: redisPing === "PONG" ? "connected" : "disconnected",
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
