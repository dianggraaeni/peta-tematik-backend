"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsahaSayuran = exports.getAggregate = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAggregate = async (req, res) => {
    const nmdesa = req.query.nmdesa || "Simoanginangin";
    try {
        const aggregateData = await prisma.villageDataJSON.findUnique({
            where: {
                desa_name_dataType: {
                    desa_name: nmdesa,
                    dataType: "pertanian_aggregate"
                }
            }
        });
        if (aggregateData && aggregateData.data) {
            res.json({ data: aggregateData.data });
        }
        else {
            res.json({ data: [] });
        }
    }
    catch (error) {
        console.error("Error fetching pertanian aggregate data:", error);
        res.status(500).json({ error: "Failed to fetch aggregate data" });
    }
};
exports.getAggregate = getAggregate;
const getUsahaSayuran = async (req, res) => {
    const nmdesa = req.query.nmdesa || "Simoanginangin";
    try {
        const usahaData = await prisma.villageDataJSON.findUnique({
            where: {
                desa_name_dataType: {
                    desa_name: nmdesa,
                    dataType: "pertanian_usahasayuran"
                }
            }
        });
        if (usahaData && usahaData.data) {
            res.json({ data: usahaData.data });
        }
        else {
            res.json({ data: [] });
        }
    }
    catch (error) {
        console.error("Error fetching usaha sayuran data:", error);
        res.status(500).json({ error: "Failed to fetch usaha sayuran data" });
    }
};
exports.getUsahaSayuran = getUsahaSayuran;
