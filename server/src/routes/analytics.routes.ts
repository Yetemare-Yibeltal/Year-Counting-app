import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";

const router = Router();

router.get("/calendar", AnalyticsController.getCalendarConversions);
router.get("/life-metrics", AnalyticsController.getLifeAnalytics);

export default router;
