import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma";
import { redis, isRedisReady } from "./lib/redis";
import { globalLimiter } from "./middleware/rateLimiter";
import { globalErrorHandler, AppError } from "./middleware/errorHandler";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "5000", 10);

app.use(express.json());

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

      let redisStatus = "disconnected";
      if (isRedisReady()) {
        try {
          const pingResponse = await redis.ping();
          if (pingResponse === "PONG") {
            redisStatus = "connected";
          }
        } catch {
          redisStatus = "disconnected";
        }
      }

      const isSystemHealthy = dbStatus === "connected";
      const statusCode = isSystemHealthy ? 200 : 503;

      res.status(statusCode).json({
        status: isSystemHealthy ? "ok" : "degraded",
        timestamp: new Date().toISOString(),
        services: {
          database: dbStatus,
          redis: redisStatus,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

app.use(globalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.all("*", (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const server = app.listen(PORT, (): void => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`[Process] Received ${signal}. Initiating graceful shutdown...`);

  server.close(async () => {
    console.log("[HTTP Server] Server closed to new requests.");

    try {
      await prisma.$disconnect();
      console.log("[Prisma] Database client disconnected successfully.");
    } catch (err) {
      console.error("[Prisma] Error disconnecting database client:", err);
    }

    try {
      if (isRedisReady()) {
        redis.disconnect();
        console.log("[Redis] Connection disconnected successfully.");
      }
    } catch (err) {
      console.error("[Redis] Error disconnecting client:", err);
    }

    console.log("[Process] Shutdown complete. Exiting process.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("[Process] Forced shutdown initiated due to timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("unhandledRejection", (reason: unknown) => {
  console.error("[Process Warning] Unhandled Rejection at Promise:", reason);
});

process.on("uncaughtException", (error: Error) => {
  console.error("[Process Error] Uncaught Exception thrown:", error.message);
});

export default app;
