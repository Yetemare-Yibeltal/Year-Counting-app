import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { cacheMiddleware, invalidateRouteCache } from "../middleware/cache";

const router = Router();

// GET /api/users (caches for 300 seconds)
router.get(
  "/",
  cacheMiddleware(300, "users"),
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });
      res.json({ status: "success", data: users });
    } catch (error) {
      next(error);
    }
  },
);

// GET /api/users/:id (caches for 120 seconds)
router.get(
  "/:id",
  cacheMiddleware(120, "users"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      if (!user) {
        res.status(404).json({ status: "fail", message: "User not found" });
        return;
      }

      res.json({ status: "success", data: user });
    } catch (error) {
      next(error);
    }
  },
);

// PUT /api/users/:id (invalidates user cache)
router.put(
  "/:id",
  invalidateRouteCache("/api/users"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { name, email },
      });

      res.json({ status: "success", data: updatedUser });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
