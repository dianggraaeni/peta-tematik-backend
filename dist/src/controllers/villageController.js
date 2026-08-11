"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVillagesGroupedByKecamatan = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getVillagesGroupedByKecamatan = async (req, res) => {
    try {
        const demografi = await prisma_1.default.demografiDesa.findMany({
            select: {
                kecamatan: true,
                nmdesa: true
            },
            orderBy: [
                { kecamatan: 'asc' },
                { nmdesa: 'asc' }
            ]
        });
        const grouped = {};
        demografi.forEach((d) => {
            const kec = d.kecamatan.toUpperCase();
            const desa = d.nmdesa.toUpperCase();
            if (!grouped[kec]) {
                grouped[kec] = [];
            }
            if (!grouped[kec].includes(desa)) {
                grouped[kec].push(desa);
            }
        });
        return res.status(200).json(grouped);
    }
    catch (error) {
        console.error("Error getting villages:", error);
        return res.status(500).json({ error: "Gagal mengambil daftar desa" });
    }
};
exports.getVillagesGroupedByKecamatan = getVillagesGroupedByKecamatan;
