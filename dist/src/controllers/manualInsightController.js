"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateManualInsight = exports.getManualInsight = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getManualInsight = async (req, res) => {
    const { desa_name, contextType } = req.query;
    if (!desa_name || !contextType) {
        return res.status(400).json({ error: "desa_name and contextType are required" });
    }
    try {
        const insight = await prisma_1.default.manualInsight.findUnique({
            where: {
                desa_name_contextType: {
                    desa_name: String(desa_name),
                    contextType: String(contextType)
                }
            }
        });
        if (insight) {
            return res.json(insight);
        }
        else {
            return res.json({
                desa_name,
                contextType,
                insightText: `Belum ada insight manual untuk ${desa_name} pada tema ${contextType}.`
            });
        }
    }
    catch (err) {
        console.error("Error fetching manual insight:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.getManualInsight = getManualInsight;
const updateManualInsight = async (req, res) => {
    const { desa_name, contextType, insightText } = req.body;
    if (!desa_name || !contextType || insightText === undefined) {
        return res.status(400).json({ error: "desa_name, contextType, and insightText are required" });
    }
    try {
        const updated = await prisma_1.default.manualInsight.upsert({
            where: {
                desa_name_contextType: {
                    desa_name: String(desa_name),
                    contextType: String(contextType)
                }
            },
            update: {
                insightText: String(insightText)
            },
            create: {
                desa_name: String(desa_name),
                contextType: String(contextType),
                insightText: String(insightText)
            }
        });
        return res.json({ message: "Insight berhasil disimpan!", data: updated });
    }
    catch (err) {
        console.error("Error updating manual insight:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateManualInsight = updateManualInsight;
