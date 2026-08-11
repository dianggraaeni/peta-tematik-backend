"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const villageDataController_1 = require("../controllers/villageDataController");
const router = express_1.default.Router();
router.post("/", villageDataController_1.uploadVillageData);
router.get("/:desa_name", villageDataController_1.getVillageData);
router.get("/:desa_name/:dataType", villageDataController_1.getVillageData);
exports.default = router;
