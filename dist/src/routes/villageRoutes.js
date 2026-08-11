"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const villageController_1 = require("../controllers/villageController");
const router = express_1.default.Router();
router.get("/by-kecamatan", villageController_1.getVillagesGroupedByKecamatan);
exports.default = router;
