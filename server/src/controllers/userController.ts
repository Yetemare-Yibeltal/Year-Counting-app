import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { invalidateCachePattern } from "../middleware/cache";
import { AppError, asyncHandler } from "../middleware/errorHandler";
import { ApiResponse } from "../utils/apiResponse";

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return ApiResponse.success(res, users, "Users retrieved successfully");
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return ApiResponse.success(res, user, "User retrieved successfully");
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, name, role } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("A user with this email address already exists", 409);
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      role,
    },
  });

  await invalidateCachePattern("users:/api/users*");

  return ApiResponse.created(res, user, "User account created successfully");
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await prisma.user.delete({
    where: { id },
  });

  await invalidateCachePattern(`users:/api/users/${id}*`);
  await invalidateCachePattern("users:/api/users*");

  return ApiResponse.success(res, { id }, "User account deleted successfully");
});
