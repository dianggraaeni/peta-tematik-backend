"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePekerjaanData = exports.updatePekerjaanData = exports.createPekerjaanData = exports.getPekerjaanData = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getPekerjaanData = async (req, res) => {
    try {
        const { rt, rw, nmdesa } = req.query;
        const whereClause = {};
        if (rt && rw) {
            whereClause.rt = Number.parseInt(rt, 10);
            whereClause.rw = Number.parseInt(rw, 10);
        }
        if (nmdesa) {
            whereClause.nmdesa = nmdesa;
        }
        const dataFromDb = await prisma_1.default.pekerjaan.findMany({
            where: whereClause,
        });
        if (dataFromDb.length === 0) {
            return res.json([]);
        }
        const transformedData = dataFromDb.map((item) => ({
            _id: item.id,
            rt: String(item.rt),
            rw: String(item.rw),
            umur: item.umur,
            jenis_kelamin: item.jenis_kelamin,
            status_pekerjaan_utama: item.status_pekerjaan_utama,
            bidang_pekerjaan: item.bidang_pekerjaan,
            nama_anggota: item.nama_anggota,
            nmdesa: item.nmdesa,
        }));
        res.json(transformedData);
    }
    catch (error) {
        console.error("❌ Error in getPekerjaanData:", error);
        res.status(500).json({
            error: "Failed to fetch data from PostgreSQL",
            details: error.message,
        });
    }
};
exports.getPekerjaanData = getPekerjaanData;
const createPekerjaanData = async (req, res) => {
    try {
        const { rt, rw, umur, jenis_kelamin, status_pekerjaan_utama, bidang_pekerjaan, nama_anggota, nmdesa, } = req.body;
        if (!rt ||
            !rw ||
            !umur ||
            !jenis_kelamin ||
            !status_pekerjaan_utama ||
            !bidang_pekerjaan ||
            !nama_anggota ||
            !nmdesa) {
            return res.status(400).json({ message: "All fields must be filled." });
        }
        const newData = await prisma_1.default.pekerjaan.create({
            data: {
                rt: Number.parseInt(rt),
                rw: Number.parseInt(rw),
                umur: Number.parseInt(umur),
                jenis_kelamin,
                status_pekerjaan_utama,
                bidang_pekerjaan,
                nama_anggota,
                nmdesa,
                id_keluarga: "KEL_BARU",
            },
        });
        res.status(201).json({
            message: "Data added successfully",
            insertedId: newData.id,
        });
    }
    catch (error) {
        console.error("Failed to add data:", error);
        res.status(500).json({
            message: "Failed to add data to the database.",
            error: error.message,
        });
    }
};
exports.createPekerjaanData = createPekerjaanData;
const updatePekerjaanData = async (req, res) => {
    try {
        const { id } = req.params;
        const { rt, rw, umur, jenis_kelamin, status_pekerjaan_utama, bidang_pekerjaan, nama_anggota, nmdesa, } = req.body;
        const result = await prisma_1.default.pekerjaan.update({
            where: { id },
            data: {
                rt: Number.parseInt(rt),
                rw: Number.parseInt(rw),
                umur: Number.parseInt(umur),
                jenis_kelamin,
                status_pekerjaan_utama,
                bidang_pekerjaan,
                nama_anggota,
                nmdesa,
            },
        });
        if (!result) {
            return res.status(404).json({ message: "Data not found." });
        }
        res.json({ message: "Data updated successfully." });
    }
    catch (error) {
        console.error("Failed to update data:", error);
        res.status(500).json({ message: "Failed to update data in the database." });
    }
};
exports.updatePekerjaanData = updatePekerjaanData;
const deletePekerjaanData = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.pekerjaan.delete({
            where: { id },
        });
        res.json({ message: "Data deleted successfully." });
    }
    catch (error) {
        console.error("Failed to delete data:", error);
        res.status(500).json({
            message: "Failed to delete data from the database.",
        });
    }
};
exports.deletePekerjaanData = deletePekerjaanData;
