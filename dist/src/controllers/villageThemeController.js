"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVillageThemes = exports.getVillageThemes = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getVillageThemes = async (req, res) => {
    try {
        const themes = await prisma_1.default.villageTheme.findMany();
        const themeMap = {};
        themes.forEach(t => {
            themeMap[t.desa_name] = Array.isArray(t.themes) ? t.themes : [];
        });
        res.json(themeMap);
    }
    catch (error) {
        console.error("Error fetching village themes:", error);
        res.status(500).json({ error: "Failed to fetch village themes" });
    }
};
exports.getVillageThemes = getVillageThemes;
const updateVillageThemes = async (req, res) => {
    const { desa_name, themes } = req.body;
    if (!desa_name || !Array.isArray(themes)) {
        return res.status(400).json({ error: "Invalid request payload" });
    }
    try {
        const updated = await prisma_1.default.villageTheme.upsert({
            where: { desa_name },
            update: { themes },
            create: { desa_name, themes },
        });
        res.json(updated);
    }
    catch (error) {
        console.error("Error updating village themes:", error);
        res.status(500).json({ error: "Failed to update village themes" });
    }
};
exports.updateVillageThemes = updateVillageThemes;
