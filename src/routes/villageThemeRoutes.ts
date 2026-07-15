import { Router } from "express";
import { getVillageThemes, updateVillageThemes } from "../controllers/villageThemeController";

const router = Router();

router.get("/", getVillageThemes);
router.post("/", updateVillageThemes);

export default router;
