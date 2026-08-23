import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { invalidateCachePattern } from "../middleware/cache";

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

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid user ID parameter" });
    }

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

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name, role } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
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
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid user ID parameter" });
    }

    await prisma.user.delete({
      where: { id },
    });

    await invalidateCachePattern(`users:/api/users/${id}*`);
    await invalidateCachePattern("users:/api/users*");

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
