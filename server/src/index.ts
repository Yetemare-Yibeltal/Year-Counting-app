import express from "express";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma";
import { redis } from "./lib/redis";
import { globalLimiter, strictLimiter } from "./middleware/rateLimiter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Apply global rate limiter to all incoming requests
app.use(globalLimiter);

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const redisPing = await redis.ping();

    res.json({
      status: "ok",
      database: "connected",
      redis: redisPing === "PONG" ? "connected" : "disconnected",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Health check failed",
    });
  }
});

// Example route using the stricter rate limiter
app.post("/api/auth/login", strictLimiter, (_req, res) => {
  res.json({ message: "Login attempt processed" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
