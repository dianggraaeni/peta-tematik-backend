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
