import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
} from "../controllers/userController";
import { cacheMiddleware } from "../middleware/cache";

const router = Router();

// Cache list responses for 5 minutes (300 seconds)
router.get("/", cacheMiddleware("users", 300), getUsers);

// Cache individual user details for 10 minutes (600 seconds)
router.get("/:id", cacheMiddleware("users", 600), getUserById);

// Write operations invalidate cached data
router.post("/", createUser);
router.delete("/:id", deleteUser);

export default router;
