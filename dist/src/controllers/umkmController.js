"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUmkmData = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUmkmData = async (req, res) => {
    try {
        const { nmdesa, rt, rw } = req.query;
        const query = {};
        if (nmdesa)
            query.nmdesa = { equals: String(nmdesa), mode: "insensitive" };
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
