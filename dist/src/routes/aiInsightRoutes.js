"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiInsightController_1 = require("../controllers/aiInsightController");
const router = express_1.default.Router();
router.post("/", aiInsightController_1.getInsight);
exports.default = router;
