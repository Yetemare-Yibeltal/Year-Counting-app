import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";

const router = Router();

router.get("/year-progress", AnalyticsController.getYearProgress);
router.post("/calculate-diff", AnalyticsController.calculateDateDiff);

export default router;
