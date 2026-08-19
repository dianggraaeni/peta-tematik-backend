import express from "express";
import { uploadVillageData, getVillageData, deleteVillageData } from "../controllers/villageDataController";

const router = express.Router();

router.post("/", uploadVillageData);
router.get("/:desa_name", getVillageData);
router.get("/:desa_name/:dataType", getVillageData);
router.delete("/:desa_name/:dataType", deleteVillageData);

export default router;
