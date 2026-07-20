import express from "express";
import { getManualInsight, updateManualInsight } from "../controllers/manualInsightController";

const router = express.Router();

router.get("/", getManualInsight);
router.post("/", updateManualInsight);

export default router;
