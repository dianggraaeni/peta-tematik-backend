import express from "express";
import { getVillagesGroupedByKecamatan } from "../controllers/villageController";

const router = express.Router();

router.get("/by-kecamatan", getVillagesGroupedByKecamatan);

export default router;
