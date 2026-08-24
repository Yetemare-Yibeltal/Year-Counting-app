import { Router } from "express";
import { getUsers } from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";
import { cacheMiddleware } from "../middleware/cache";

const router = Router();

router.route("/")
  .get(authenticate, cacheMiddleware("300s"), getUsers3);

export default router;
