import express from "express";
import cors from "cors";
import { ENV } from "./config/env.config";
import { Logger } from "./utils/logger.util";
import analyticsRoutes from "./routes/analytics.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors({ origin: ENV.CORS_ORIGIN }));
app.use(express.json());

app.use("/api/analytics", analyticsRoutes);

app.use(errorHandler);

app.listen(ENV.PORT, () => {
  Logger.info(`Year Counting API Server operating on port ${ENV.PORT}`);
});
