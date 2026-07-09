import type { Request, Response } from "express";
import prisma from "../config/prisma";

// READ
export const getPekerjaanData = async (req: Request, res: Response) => {
  try {
    const { rt, rw } = req.query;

    const whereClause: any = {};
    if (rt && rw) {
      whereClause.rt = Number.parseInt(rt as string, 10);
      whereClause.rw = Number.parseInt(rw as string, 10);
    }

    const dataFromDb = await prisma.pekerjaan.findMany({
      where: whereClause,
    });

    if (dataFromDb.length === 0) {
      return res.json([]);
    }

    // Map Prisma models to the exact same format expected by the frontend
    const transformedData = dataFromDb.map((item) => ({
      _id: item.id,
      rt: String(item.rt),
      rw: String(item.rw),
      umur: item.umur,
      jenis_kelamin: item.jenis_kelamin,
      status_pekerjaan_utama: item.status_pekerjaan_utama,
      bidang_pekerjaan: item.bidang_pekerjaan,
      nama_anggota: item.nama_anggota,
    }));

    res.json(transformedData);
  } catch (error: any) {
    console.error("❌ Error in getPekerjaanData:", error);
    res.status(500).json({
      error: "Failed to fetch data from PostgreSQL",
      details: error.message,
    });
  }
};

// CREATE
export const createPekerjaanData = async (req: Request, res: Response) => {
  try {
    const {
      rt,
      rw,
      umur,
      jenis_kelamin,
      status_pekerjaan_utama,
      bidang_pekerjaan,
      nama_anggota,
    } = req.body;

    if (
      !rt ||
      !rw ||
      !umur ||
      !jenis_kelamin ||
      !status_pekerjaan_utama ||
      !bidang_pekerjaan ||
      !nama_anggota
    ) {
      return res.status(400).json({ message: "All fields must be filled." });
    }

    const newData = await prisma.pekerjaan.create({
      data: {
        rt: Number.parseInt(rt),
        rw: Number.parseInt(rw),
        umur: Number.parseInt(umur),
        jenis_kelamin,
        status_pekerjaan_utama,
        bidang_pekerjaan,
        nama_anggota,
        id_keluarga: "KEL_BARU",
      },
    });

    res.status(201).json({
      message: "Data added successfully",
      insertedId: newData.id,
    });
  } catch (error: any) {
    console.error("Failed to add data:", error);
    res.status(500).json({
      message: "Failed to add data to the database.",
      error: error.message,
    });
  }
};

// UPDATE
export const updatePekerjaanData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      rt,
      rw,
      umur,
      jenis_kelamin,
      status_pekerjaan_utama,
      bidang_pekerjaan,
      nama_anggota,
    } = req.body;

    const result = await prisma.pekerjaan.update({
      where: { id },
      data: {
        rt: Number.parseInt(rt),
        rw: Number.parseInt(rw),
        umur: Number.parseInt(umur),
        jenis_kelamin,
        status_pekerjaan_utama,
        bidang_pekerjaan,
        nama_anggota,
      },
    });

    if (!result) {
      return res.status(404).json({ message: "Data not found." });
    }

    res.json({ message: "Data updated successfully." });
  } catch (error: any) {
    console.error("Failed to update data:", error);
    res.status(500).json({ message: "Failed to update data in the database." });
  }
};

// DELETE
export const deletePekerjaanData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.pekerjaan.delete({
      where: { id },
    });

    res.json({ message: "Data deleted successfully." });
  } catch (error: any) {
    console.error("Failed to delete data:", error);
    res.status(500).json({
      message: "Failed to delete data from the database.",
    });
  }
};
