import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getVillagesGroupedByKecamatan = async (req: Request, res: Response) => {
  try {
    const demografi = await prisma.demografiDesa.findMany({
      select: {
        kecamatan: true,
        nmdesa: true
      },
      orderBy: [
        { kecamatan: 'asc' },
        { nmdesa: 'asc' }
      ]
    });

    const grouped: Record<string, string[]> = {};

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
  } catch (error) {
    console.error("Error getting villages:", error);
    return res.status(500).json({ error: "Gagal mengambil daftar desa" });
  }
};
