import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address format"),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .optional(),
    role: z.enum(["USER", "ADMIN"]).optional().default("USER"),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user ID format. Must be a valid UUID"),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserIdParamInput = z.infer<typeof userIdParamSchema>;
