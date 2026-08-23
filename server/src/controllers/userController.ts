import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { invalidateCachePattern } from "../middleware/cache";
import { AppError, asyncHandler } from "../middleware/errorHandler";

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(users);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Invalid user ID parameter", 400);
  }

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json(user);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, name, role } = req.body;

  if (!email || typeof email !== "string") {
    throw new AppError("Email is required and must be a string", 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("A user with this email already exists", 409);
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: typeof name === "string" ? name : null,
      role: role === "ADMIN" ? "ADMIN" : "USER",
    },
  });

  await invalidateCachePattern("users:/api/users*");

  res.status(201).json(user);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError("Invalid user ID parameter", 400);
  }

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

  res.json({ message: "User deleted successfully" });
});
