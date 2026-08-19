import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUmkmData = async (req: Request, res: Response) => {
  try {
    const { nmdesa, rt, rw } = req.query;

    const query: any = {};
    if (nmdesa) query.nmdesa = { equals: String(nmdesa) };
    if (rt) query.rt = String(rt);
    if (rw) query.rw = String(rw);

    const data = await prisma.umkm.findMany({
      where: query,
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching UMKM data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const uploadUmkmData = async (req: Request, res: Response) => {
  try {
    const dataArray = req.body;
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return res.status(400).json({ error: "Data umkm harus berupa array dan tidak boleh kosong" });
    }

    const nmdesa = dataArray[0].nmdesa;
    
    // Hapus data lama untuk desa ini
    await prisma.umkm.deleteMany({
      where: { nmdesa: nmdesa },
    });

    // Karena UMKM map butuhnya aggregasi per RT RW, 
    // Data yang diupload mungkin mikro (ada ratusan baris).
    // Kita simpan dummy aggregasinya, atau simpan mentah-mentah ke field `nama` / `rt` 
    // Tapi karena schema UMKM itu untuk agregasi, kita buat dummy agregasinya.
    // Atau simply kita insert satu-satu dengan default values for others.
    
    const createData = dataArray.map((item: any) => ({
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
  } catch (err) {
    console.error("Error bulk insert umkm:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
