"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPetaData = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getPetaData = async (req, res) => {
    try {
        const { nmdesa } = req.query;
        const whereClause = {};
        if (nmdesa) {
            whereClause.desa_id = nmdesa;
        }
        const docs = await prisma_1.default.peta.findMany({
            where: whereClause,
        });
        const groupedData = await prisma_1.default.pekerjaan.groupBy({
            by: ["rt", "rw", "jenis_kelamin"],
            where: nmdesa ? { nmdesa: nmdesa } : undefined,
            _count: {
                _all: true,
            },
        });
        const rtRwStats = {};
        for (const item of groupedData) {
            const key = `${item.rt}-${item.rw}`;
            const count = item._count._all;
            if (!rtRwStats[key]) {
                rtRwStats[key] = {
                    total: count,
                    maxCount: count,
                    dominantGender: item.jenis_kelamin,
                };
            }
            else {
                rtRwStats[key].total += count;
                if (count > rtRwStats[key].maxCount) {
                    rtRwStats[key].maxCount = count;
                    rtRwStats[key].dominantGender = item.jenis_kelamin;
                }
            }
        }
        const genderMap = new Map();
        for (const [key, stats] of Object.entries(rtRwStats)) {
            genderMap.set(key, {
                gender: stats.dominantGender,
                count: stats.maxCount,
                total: stats.total,
            });
        }
        const features = docs.map((doc) => {
            const originalProps = doc.properties;
            const nmsls = originalProps.nmsls || "";
            const rtMatch = nmsls.match(/RT\s(\S+)/);
            const rwMatch = nmsls.match(/RW\s(\S+)/);
            const dusunMatch = nmsls.match(/DUSUN\s(.+)/i);
            const rtGeoJson = rtMatch ? Number.parseInt(rtMatch[1], 10) : null;
            const rwGeoJson = rwMatch ? Number.parseInt(rwMatch[1], 10) : null;
            const dusun = dusunMatch ? dusunMatch[1].trim() : "-";
            const dominantInfo = rtGeoJson !== null && rwGeoJson !== null
                ? genderMap.get(`${rtGeoJson}-${rwGeoJson}`)
                : null;
            return {
                type: doc.type || "Feature",
                geometry: doc.geometry,
                properties: {
                    ...originalProps,
                    RT: rtMatch ? rtMatch[1] : "-",
                    RW: rwMatch ? rwMatch[1] : "-",
                    dusun: dusun,
                    kecamatan: originalProps.nmkec || "-",
                    nmdesa: originalProps.nmdesa || "Data Tidak Tersedia",
                    dominantGender: dominantInfo ? dominantInfo.gender : null,
                    dominantGenderCount: dominantInfo ? dominantInfo.count : 0,
                    totalPopulation: dominantInfo ? dominantInfo.total : 0,
                },
            };
        });
        const geojson = {
            type: "FeatureCollection",
            features: features,
        };
        res.json(geojson);
    }
    catch (error) {
        console.error("Error fetching GeoJSON data:", error);
        res.status(500).send("Failed to fetch GeoJSON data from PostgreSQL.");
    }
};
exports.getPetaData = getPetaData;
