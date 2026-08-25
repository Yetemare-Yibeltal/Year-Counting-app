import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma";
import { redis, checkRedisHealth } from "./lib/redis";
import { globalLimiter } from "./middleware/rateLimiter";
import { globalErrorHandler, AppError } from "./middleware/errorHandler";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "5000", 10);

app.use(express.json());

// 1. Health check endpoint positioned BEFORE global rate limiting
app.get(
  "/health",
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let dbStatus = "disconnected";
      try {
        await prisma.$queryRaw`SELECT 1`;
        dbStatus = "connected";
      } catch {
        dbStatus = "disconnected";
      }

      const redisHealth = await checkRedisHealth();

      const isHealthy = dbStatus === "connected";
      const httpStatusCode = isHealthy ? 200 : 503;

      res.status(httpStatusCode).json({
        status: isHealthy ? "ok" : "degraded",
        timestamp: new Date().toISOString(),
        services: {
          database: dbStatus,
          redis: redisHealth.status,
          redisLatencyMs: redisHealth.latencyMs,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// 2. Global Rate Limiter
app.use(globalLimiter);

// 3. Application API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// 4. Handle Unmatched Routes (404)
app.all("*", (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 5. Centralized Error Handler
app.use(globalErrorHandler);

const server = app.listen(PORT, (): void => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

// Graceful Shutdown Process Handlers
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`[Server] Received ${signal}. Closing server gracefully...`);

  server.close(async () => {
    console.log("[HTTP Server] Closed to new incoming connections.");

    try {
      await prisma.$disconnect();
      console.log("[Database] Prisma connection closed.");
    } catch (err) {
      console.error("[Database Error] Error disconnecting Prisma:", err);
    }

    try {
      if (redis.status === "ready") {
        redis.disconnect();
        console.log("[Redis] Client disconnected.");
      }
    } catch (err) {
      console.error("[Redis Error] Error disconnecting Redis client:", err);
    }

    console.log("[Server] Graceful shutdown process complete.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("[Server] Forceful shutdown initiated due to timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("unhandledRejection", (reason: unknown) => {
  console.error("[Process Warning] Unhandled Rejection at Promise:", reason);
});

process.on("uncaughtException", (error: Error) => {
  console.error("[Process Error] Uncaught Exception:", error.message);
});

export default app;
