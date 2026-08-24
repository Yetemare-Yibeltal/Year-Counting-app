import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "superrefreshsecretkey";

// Mock user storage for demonstration/development
const users: any[] = [];

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const newUser = {
      id: String(users.length + 1),
      name: name || "User",
      email,
      password, // In production, hash with bcrypt
      role: "USER",
    };

    users.push(newUser);

    const accessToken = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: newUser.id },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      res.status(401).json({ message: "Refresh token required" });
      return;
    }

    const decoded = jwt.verify(token, REFRESH_SECRET) as any;
    const user = users.find((u) => u.id === decoded.userId);

    if (!user) {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error: any) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};
