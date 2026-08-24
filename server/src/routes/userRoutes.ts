import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
} from "../controllers/userController";
import { validate } from "../middleware/validate";
import { cacheMiddleware } from "../middleware/cache";
import { authenticate } from "../middleware/authMiddleware";
import { createUserSchema, userIdParamSchema } from "../schemas/userSchema";

const router = Router();

router
  .route("/")
  .get(authenticate, cacheMiddleware(300), getUsers)
  .post(validate(createUserSchema), createUser);

router
  .route("/:id")
  .get(
    authenticate,
    validate(userIdParamSchema),
    cacheMiddleware(300),
    getUserById,
  )
  .delete(authenticate, validate(userIdParamSchema), deleteUser);

export default router;
