"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const manualInsightController_1 = require("../controllers/manualInsightController");
const router = express_1.default.Router();
router.get("/", manualInsightController_1.getManualInsight);
router.post("/", manualInsightController_1.updateManualInsight);
exports.default = router;
