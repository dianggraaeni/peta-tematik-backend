import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(__dirname, "../data/manualInsights.json");

// Helper to read data
const readData = () => {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading manualInsights.json:", err);
    return [];
  }
};

// Helper to write data
const writeData = (data: any) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing manualInsights.json:", err);
  }
};

export const getManualInsight = (req: Request, res: Response) => {
  const { desa_name, contextType } = req.query;

  if (!desa_name || !contextType) {
    return res.status(400).json({ error: "desa_name and contextType are required" });
  }

  const data = readData();
  const insight = data.find(
    (item: any) =>
      item.desa_name.toLowerCase() === (desa_name as String).toLowerCase() &&
      item.contextType.toLowerCase() === (contextType as String).toLowerCase()
  );

  if (insight) {
    return res.json(insight);
  } else {
    // If not found, return empty or default
    return res.json({
      desa_name,
      contextType,
      insightText: `Belum ada insight manual untuk ${desa_name} pada tema ${contextType}.`
    });
  }
};

export const updateManualInsight = (req: Request, res: Response) => {
  const { desa_name, contextType, insightText } = req.body;

  if (!desa_name || !contextType || insightText === undefined) {
    return res.status(400).json({ error: "desa_name, contextType, and insightText are required" });
  }

  const data = readData();
  const index = data.findIndex(
    (item: any) =>
      item.desa_name.toLowerCase() === desa_name.toLowerCase() &&
      item.contextType.toLowerCase() === contextType.toLowerCase()
  );

  if (index >= 0) {
    data[index].insightText = insightText;
  } else {
    data.push({
      id: Date.now().toString(),
      desa_name,
      contextType,
      insightText
    });
  }

  writeData(data);
  return res.json({ message: "Insight berhasil disimpan!" });
};
