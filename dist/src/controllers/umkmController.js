"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadUmkmData = exports.getUmkmData = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUmkmData = async (req, res) => {
    try {
        const { nmdesa, rt, rw } = req.query;
        const query = {};
        if (nmdesa)
            query.nmdesa = { equals: String(nmdesa) };
        if (rt)
            query.rt = String(rt);
        if (rw)
            query.rw = String(rw);
        const data = await prisma.umkm.findMany({
            where: query,
        });
        res.status(200).json(data);
    }
    catch (error) {
        console.error("Error fetching UMKM data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getUmkmData = getUmkmData;
const uploadUmkmData = async (req, res) => {
    try {
        const dataArray = req.body;
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return res.status(400).json({ error: "Data umkm harus berupa array dan tidak boleh kosong" });
        }
        const nmdesa = dataArray[0].nmdesa;
        await prisma.umkm.deleteMany({
            where: { nmdesa: nmdesa },
        });
        const createData = dataArray.map((item) => ({
            rt: String(item.rt || "0"),
            rw: String(item.rw || "0"),
            dusun: String(item.dusun || "-"),
            nama: String(item.nama_usaha || "-"),
            jml_ruta: Number(item.jml_ruta) || 1,
            jml_umkm: Number(item.jml_umkm) || 1,
            nmdesa: nmdesa
        }));
        await prisma.umkm.createMany({
            data: createData
        });
        res.status(200).json({ success: true, count: createData.length });
    }
    catch (err) {
        console.error("Error bulk insert umkm:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.uploadUmkmData = uploadUmkmData;
