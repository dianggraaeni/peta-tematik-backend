import { Request, Response } from "express";
import prisma from "../config/prisma";

export const uploadVillageData = async (req: any, res: any) => {
  try {
    const { desa_name, dataType, data } = req.body;

    if (!desa_name || !dataType || !data) {
      return res.status(400).json({ error: "desa_name, dataType, dan data wajib diisi" });
    }

    const formattedDesa = desa_name.toLowerCase().trim();
    
    // Save or update data
    const result = await prisma.villageDataJSON.upsert({
      where: {
        desa_name_dataType: {
          desa_name: formattedDesa,
          dataType: dataType
        }
      },
      update: {
        data: data
      },
      create: {
        desa_name: formattedDesa,
        dataType: dataType,
        data: data
      }
    });

    return res.status(200).json({ success: true, message: `Data ${dataType} untuk ${formattedDesa} berhasil disimpan.`, result });
  } catch (error) {
    console.error("Error saving village data:", error);
    return res.status(500).json({ error: "Gagal menyimpan data" });
  }
};

export const getVillageData = async (req: any, res: any) => {
  try {
    const { desa_name, dataType } = req.params;
    
    if (!desa_name) {
       return res.status(400).json({ error: "Parameter desa_name wajib diisi" });
    }

    const formattedDesa = desa_name.toLowerCase().trim();

    if (dataType) {
        // Fetch specific data type
        const record = await prisma.villageDataJSON.findUnique({
            where: {
                desa_name_dataType: {
                    desa_name: formattedDesa,
                    dataType: dataType
                }
            }
        });
        
        if (!record) {
            return res.status(404).json({ error: `Data ${dataType} tidak ditemukan untuk desa ${formattedDesa}` });
        }
        return res.status(200).json(record.data);
    } else {
        // Fetch all data types for the village
        const records = await prisma.villageDataJSON.findMany({
            where: { desa_name: formattedDesa }
        });
        
        const result: Record<string, any> = {};
        for (const record of records) {
            result[record.dataType] = record.data;
        }
        
        return res.status(200).json(result);
    }
  } catch (error) {
    console.error("Error getting village data:", error);
    return res.status(500).json({ error: "Gagal mengambil data" });
  }
};
