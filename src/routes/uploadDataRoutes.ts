import { Router } from "express";
import {
  upload,
  getPendudukData,
  savePendudukManual,
  uploadPendudukFile,
  uploadGeojsonTematik,
  uploadGeojsonDesa,
  deleteGeojsonDesa,
  downloadFile,
  listBackups,
  deleteActiveFile,
} from "../controllers/uploadDataController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Semua route ini butuh login (JWT)
router.use(authenticateToken);

// GET data penduduk saat ini
router.get("/penduduk", getPendudukData);

// PUT simpan edit manual penduduk
router.put("/penduduk", savePendudukManual);

// POST upload file penduduk.json baru
router.post("/penduduk-file", upload.single("file"), uploadPendudukFile);

// POST upload file peta_sidoarjo.geojson baru
router.post("/geojson-tematik", upload.single("file"), uploadGeojsonTematik);

// POST upload file namadesa.geojson baru
router.post("/geojson-desa/:desaName", upload.single("file"), uploadGeojsonDesa);

// DELETE hapus file namadesa.geojson aktif
router.delete("/geojson-desa/:desaName", deleteGeojsonDesa);

// GET download file template
router.get("/download/:filename", downloadFile);

// DELETE hapus file aktif
router.delete("/active/:filename", deleteActiveFile);

// GET list semua backup
router.get("/backups", listBackups);

export default router;
