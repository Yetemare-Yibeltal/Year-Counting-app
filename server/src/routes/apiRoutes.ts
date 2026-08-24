import { Router } from "express";
import { getSystemSpecs } from "../controllers/systemController";
import { calculateTimeDifference } from "../controllers/calculatorController";

const router = Router();

router.get("/specs", getSystemSpecs);
router.post("/calculate", calculateTimeDifference);

export default router;
