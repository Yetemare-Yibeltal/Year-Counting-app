import express from "express";
import { globalRateLimiter, strictRateLimiter } from "./middleware/rateLimiter";
import { cacheMiddleware, invalidateCachePattern } from "./middleware/cache";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// 1. Apply global rate limiting across all API endpoints
app.use("/api", globalRateLimiter);

// 2. Cached GET Endpoint (TTL: 300 seconds)
app.get("/api/metrics", cacheMiddleware(300), async (req, res) => {
  try {
    const metrics = await prisma.user.findMany({
      select: { id: true, createdAt: true },
    });

    res.json({ success: true, count: metrics.length, data: metrics });
  } catch (error) {
    res.status(500).json({ error: "Database query failed" });
  }
});

// 3. Rate-limited POST Endpoint + Cache Invalidation
app.post("/api/metrics", strictRateLimiter, async (req, res) => {
  try {
    const newEntry = await prisma.user.create({ data: req.body });

    // Invalidate cached GET queries so fresh data is returned next time
    await invalidateCachePattern("/api/metrics*");

    res.status(201).json({ success: true, data: newEntry });
  } catch (error) {
    res.status(400).json({ error: "Failed to create entry" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
