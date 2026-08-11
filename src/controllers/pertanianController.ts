import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAggregate = async (req: Request, res: Response) => {
  const nmdesa = (req.query.nmdesa as string) || "Simoanginangin";
  
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
    } else {
      res.json({ data: [] });
    }
  } catch (error) {
    console.error("Error fetching pertanian aggregate data:", error);
    res.status(500).json({ error: "Failed to fetch aggregate data" });
  }
};

export const getUsahaSayuran = async (req: Request, res: Response) => {
  const nmdesa = (req.query.nmdesa as string) || "Simoanginangin";
  
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
    } else {
      res.json({ data: [] });
    }
  } catch (error) {
    console.error("Error fetching usaha sayuran data:", error);
    res.status(500).json({ error: "Failed to fetch usaha sayuran data" });
  }
};

