import { Request, Response } from "express";
import prisma from "../config/prisma";

// GET /api/village-themes
export const getVillageThemes = async (req: Request, res: Response) => {
  try {
    const themes = await prisma.villageTheme.findMany();
    // Transform into a Record<string, string[]> for easy frontend use
    const themeMap: Record<string, string[]> = {};
    themes.forEach(t => {
      themeMap[t.desa_name] = Array.isArray(t.themes) ? (t.themes as string[]) : [];
    });
    res.json(themeMap);
  } catch (error) {
    console.error("Error fetching village themes:", error);
    res.status(500).json({ error: "Failed to fetch village themes" });
  }
};

// POST /api/village-themes
export const updateVillageThemes = async (req: Request, res: Response) => {
  const { desa_name, themes } = req.body;
  if (!desa_name || !Array.isArray(themes)) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  try {
    const updated = await prisma.villageTheme.upsert({
      where: { desa_name },
      update: { themes },
      create: { desa_name, themes },
    });
    res.json(updated);
  } catch (error) {
    console.error("Error updating village themes:", error);
    res.status(500).json({ error: "Failed to update village themes" });
  }
};
