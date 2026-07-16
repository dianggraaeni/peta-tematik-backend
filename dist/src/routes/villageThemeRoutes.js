"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const villageThemeController_1 = require("../controllers/villageThemeController");
const router = (0, express_1.Router)();
router.get("/", villageThemeController_1.getVillageThemes);
router.post("/", villageThemeController_1.updateVillageThemes);
exports.default = router;
