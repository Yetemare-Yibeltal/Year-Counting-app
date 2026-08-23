import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { invalidateCachePattern } from "../middleware/cache";

// GET /api/users
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// GET /api/users/:id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// POST /api/users
export const createUser = async (_req: Request, res: Response) => {
  try {
    const user = await prisma.user.create({
      data: {},
    });

    // Invalidate list cache
    await invalidateCachePattern("users:/api/users*");

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    // Invalidate both individual user and list cache
    await invalidateCachePattern(`users:/api/users/${id}*`);
    await invalidateCachePattern("users:/api/users*");

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
