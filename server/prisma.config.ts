import dotenv from "dotenv";
import path from "path";
import { defineConfig } from "@prisma/config";

dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  earlyAccess: true,
  schema: {
    kind: "single",
    filePath: path.resolve(__dirname, "prisma/schema.prisma"),
  },
});
