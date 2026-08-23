import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
} from "../controllers/userController";
import { validate } from "../middleware/validate";
import { cacheMiddleware } from "../middleware/cache";
import { createUserSchema, userIdParamSchema } from "../schemas/userSchema";

const router = Router();

router
  .route("/")
  .get(cacheMiddleware(300), getUsers)
  .post(validate(createUserSchema), createUser);

router
  .route("/:id")
  .get(validate(userIdParamSchema), cacheMiddleware(300), getUserById)
  .delete(validate(userIdParamSchema), deleteUser);

export default router;
