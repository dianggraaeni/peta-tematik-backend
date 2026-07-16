import express from "express";
import { getInsight } from "../controllers/aiInsightController";

const router = express.Router();

router.post("/", getInsight);

export default router;
