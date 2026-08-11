"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVillageData = exports.uploadVillageData = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const uploadVillageData = async (req, res) => {
    try {
        const { desa_name, dataType, data } = req.body;
        if (!desa_name || !dataType || !data) {
            return res.status(400).json({ error: "desa_name, dataType, dan data wajib diisi" });
        }
        const formattedDesa = desa_name.toLowerCase().trim();
        const result = await prisma_1.default.villageDataJSON.upsert({
            where: {
                desa_name_dataType: {
                    desa_name: formattedDesa,
                    dataType: dataType
                }
            },
            update: {
                data: data
            },
            create: {
                desa_name: formattedDesa,
                dataType: dataType,
                data: data
            }
        });
        return res.status(200).json({ success: true, message: `Data ${dataType} untuk ${formattedDesa} berhasil disimpan.`, result });
    }
    catch (error) {
        console.error("Error saving village data:", error);
        return res.status(500).json({ error: "Gagal menyimpan data" });
    }
};
exports.uploadVillageData = uploadVillageData;
const getVillageData = async (req, res) => {
    try {
        const { desa_name, dataType } = req.params;
        if (!desa_name) {
            return res.status(400).json({ error: "Parameter desa_name wajib diisi" });
        }
        const formattedDesa = desa_name.toLowerCase().trim();
        if (dataType) {
            const record = await prisma_1.default.villageDataJSON.findUnique({
                where: {
                    desa_name_dataType: {
                        desa_name: formattedDesa,
                        dataType: dataType
                    }
                }
            });
            if (!record) {
                return res.status(404).json({ error: `Data ${dataType} tidak ditemukan untuk desa ${formattedDesa}` });
            }
            return res.status(200).json(record.data);
        }
        else {
            const records = await prisma_1.default.villageDataJSON.findMany({
                where: { desa_name: formattedDesa }
            });
            const result = {};
            for (const record of records) {
                result[record.dataType] = record.data;
            }
            return res.status(200).json(result);
        }
    }
    catch (error) {
        console.error("Error getting village data:", error);
        return res.status(500).json({ error: "Gagal mengambil data" });
    }
};
exports.getVillageData = getVillageData;
