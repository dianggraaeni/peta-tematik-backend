import type { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// Path ke folder public/data di frontend
const FRONTEND_DATA_DIR = path.resolve(process.cwd(), "../peta-tematik-frontend/public/data");

// Backup dir di dalam backend/data/backups
const BACKUP_DIR = path.resolve(process.cwd(), "data/backups");

// Pastikan backup dir ada
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Multer config: simpan ke temp memory
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // max 50MB
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".json" || ext === ".geojson") {
      cb(null, true);
    } else {
      cb(new Error("Hanya file .json atau .geojson yang diizinkan"));
    }
  },
});

// Helper: backup file sebelum replace
const backupFile = (filename: string): string | null => {
  const srcPath = path.join(FRONTEND_DATA_DIR, filename);
  if (fs.existsSync(srcPath)) {
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const backupName = `${filename}.${ts}.bak`;
    const destPath = path.join(BACKUP_DIR, backupName);
    fs.copyFileSync(srcPath, destPath);
    return backupName;
  }
  return null;
};

// GET /api/upload-data/penduduk — ambil data penduduk saat ini
export const getPendudukData = async (req: Request, res: Response) => {
  try {
    const filePath = path.join(FRONTEND_DATA_DIR, "penduduk.json");
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File tidak ditemukan" });
    }
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal membaca file" });
  }
};

// PUT /api/upload-data/penduduk — simpan data penduduk yang diedit manual
export const savePendudukManual = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    if (!data || typeof data !== "object") {
      return res.status(400).json({ success: false, message: "Data tidak valid" });
    }

    const backupName = backupFile("penduduk.json");

    const filePath = path.join(FRONTEND_DATA_DIR, "penduduk.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

    res.json({
      success: true,
      message: "Data demografi berhasil disimpan",
      backup: backupName,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal menyimpan data" });
  }
};

// POST /api/upload-data/penduduk-file — upload file penduduk.json baru
export const uploadPendudukFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "File tidak ditemukan" });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(req.file.buffer.toString("utf8"));
    } catch {
      return res.status(400).json({ success: false, message: "File bukan JSON yang valid" });
    }

    const backupName = backupFile("penduduk.json");

    const filePath = path.join(FRONTEND_DATA_DIR, "penduduk.json");
    fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), "utf8");

    res.json({
      success: true,
      message: "File penduduk.json berhasil diupload dan disimpan",
      backup: backupName,
      entries: Object.keys(parsed).length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengupload file" });
  }
};

// POST /api/upload-data/geojson-tematik — upload peta_sidoarjo.geojson baru
export const uploadGeojsonTematik = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "File tidak ditemukan" });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(req.file.buffer.toString("utf8"));
    } catch {
      return res.status(400).json({ success: false, message: "File bukan JSON/GeoJSON yang valid" });
    }

    if (parsed.type !== "FeatureCollection" || !Array.isArray(parsed.features)) {
      return res.status(400).json({
        success: false,
        message: "File harus berformat GeoJSON FeatureCollection",
      });
    }

    const backupName = backupFile("peta_sidoarjo.geojson");

    const filePath = path.join(FRONTEND_DATA_DIR, "peta_sidoarjo.geojson");
    fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), "utf8");

    res.json({
      success: true,
      message: "File peta_sidoarjo.geojson berhasil diupload dan disimpan",
      backup: backupName,
      features: parsed.features.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengupload file" });
  }
};

// GET /api/upload-data/download/:filename — download file saat ini sebagai template
export const downloadFile = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const allowed = ["penduduk.json", "peta_sidoarjo.geojson"];
    if (!allowed.includes(filename)) {
      return res.status(403).json({ success: false, message: "File tidak diizinkan" });
    }
    const filePath = path.join(FRONTEND_DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File tidak ditemukan" });
    }
    res.download(filePath, filename);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mendownload file" });
  }
};

// DELETE /api/upload-data/active/:filename - hapus file aktif
export const deleteActiveFile = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const allowed = ["penduduk.json", "peta_sidoarjo.geojson"];
    if (!allowed.includes(filename)) {
      return res.status(403).json({ success: false, message: "File tidak diizinkan" });
    }
    const filePath = path.join(FRONTEND_DATA_DIR, filename);
    if (fs.existsSync(filePath)) {
      // Backup dulu sebelum hapus
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backupName = `${filename}.${timestamp}.bak`;
      fs.copyFileSync(filePath, path.join(BACKUP_DIR, backupName));
      fs.unlinkSync(filePath);
    }
    res.json({ success: true, message: "File berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal menghapus file" });
  }
};

// GET /api/upload-data/backups — list semua backup yang tersedia
export const listBackups = async (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      return res.json({ success: true, backups: [] });
    }
    const files = fs
      .readdirSync(BACKUP_DIR)
      .map((f) => ({
        name: f,
        size: fs.statSync(path.join(BACKUP_DIR, f)).size,
        created: fs.statSync(path.join(BACKUP_DIR, f)).mtime,
      }))
      .sort(
        (a, b) =>
          new Date(b.created).getTime() - new Date(a.created).getTime()
      );
    res.json({ success: true, backups: files });
  } catch (err) {
    res.status(500).json({ success: false, message: "Gagal membaca backup" });
  }
};
