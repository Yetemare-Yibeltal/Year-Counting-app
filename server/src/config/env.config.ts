import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
  JWT_SECRET: process.env.JWT_SECRET || "super-secret-year-counter-key-2026",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};
