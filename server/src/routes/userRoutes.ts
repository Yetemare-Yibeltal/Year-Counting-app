import { Router } from "express";
import { getUsers, getUserById } from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Protect all user routes with JWT authentication
router.get("/", authenticate, getUsers);
router.get("/:id", authenticate, getUserById);

export default router;
