"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGeojsonDesa = exports.uploadGeojsonDesa = exports.listBackups = exports.deleteActiveFile = exports.downloadFile = exports.uploadGeojsonTematik = exports.uploadPendudukFile = exports.savePendudukManual = exports.getPendudukData = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const FRONTEND_DATA_DIR = path_1.default.resolve(process.cwd(), "../peta-tematik-frontend/public/data");
const GEOJSON_DIR = path_1.default.resolve(process.cwd(), "../peta-tematik-frontend/public/geoJson");
const BACKUP_DIR = path_1.default.resolve(process.cwd(), "data/backups");
if (!fs_1.default.existsSync(BACKUP_DIR)) {
    fs_1.default.mkdirSync(BACKUP_DIR, { recursive: true });
}
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (ext === ".json" || ext === ".geojson") {
            cb(null, true);
        }
        else {
            cb(new Error("Hanya file .json atau .geojson yang diizinkan"));
        }
    },
});
const backupFile = (filename) => {
    const srcPath = path_1.default.join(FRONTEND_DATA_DIR, filename);
    if (fs_1.default.existsSync(srcPath)) {
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        const backupName = `${filename}.${ts}.bak`;
        const destPath = path_1.default.join(BACKUP_DIR, backupName);
        fs_1.default.copyFileSync(srcPath, destPath);
        return backupName;
    }
    return null;
};
const getPendudukData = async (req, res) => {
    try {
        const filePath = path_1.default.join(FRONTEND_DATA_DIR, "penduduk.json");
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: "File tidak ditemukan" });
        }
        const raw = fs_1.default.readFileSync(filePath, "utf8");
        const data = JSON.parse(raw);
        res.json({ success: true, data });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Gagal membaca file" });
    }
};
exports.getPendudukData = getPendudukData;
const savePendudukManual = async (req, res) => {
    try {
        const { data } = req.body;
        if (!data || typeof data !== "object") {
            return res.status(400).json({ success: false, message: "Data tidak valid" });
        }
        const backupName = backupFile("penduduk.json");
        const filePath = path_1.default.join(FRONTEND_DATA_DIR, "penduduk.json");
        fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
        res.json({
            success: true,
            message: "Data demografi berhasil disimpan",
            backup: backupName,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Gagal menyimpan data" });
    }
};
exports.savePendudukManual = savePendudukManual;
const uploadPendudukFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "File tidak ditemukan" });
        }
        let parsed;
        try {
            parsed = JSON.parse(req.file.buffer.toString("utf8"));
        }
        catch (_a) {
            return res.status(400).json({ success: false, message: "File bukan JSON yang valid" });
        }
        const backupName = backupFile("penduduk.json");
        const filePath = path_1.default.join(FRONTEND_DATA_DIR, "penduduk.json");
        fs_1.default.writeFileSync(filePath, JSON.stringify(parsed, null, 2), "utf8");
        res.json({
            success: true,
            message: "File penduduk.json berhasil diupload dan disimpan",
            backup: backupName,
            entries: Object.keys(parsed).length,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Gagal mengupload file" });
    }
};
exports.uploadPendudukFile = uploadPendudukFile;
const uploadGeojsonTematik = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "File tidak ditemukan" });
        }
        let parsed;
        try {
            parsed = JSON.parse(req.file.buffer.toString("utf8"));
        }
        catch (_a) {
            return res.status(400).json({ success: false, message: "File bukan JSON/GeoJSON yang valid" });
        }
        if (parsed.type !== "FeatureCollection" || !Array.isArray(parsed.features)) {
            return res.status(400).json({
                success: false,
                message: "File harus berformat GeoJSON FeatureCollection",
            });
        }
        const backupName = backupFile("peta_sidoarjo.geojson");
        const filePath = path_1.default.join(FRONTEND_DATA_DIR, "peta_sidoarjo.geojson");
        fs_1.default.writeFileSync(filePath, JSON.stringify(parsed, null, 2), "utf8");
        res.json({
            success: true,
            message: "File peta_sidoarjo.geojson berhasil diupload dan disimpan",
            backup: backupName,
            features: parsed.features.length,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Gagal mengupload file" });
    }
};
exports.uploadGeojsonTematik = uploadGeojsonTematik;
const downloadFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const allowed = ["penduduk.json", "peta_sidoarjo.geojson"];
        if (!allowed.includes(filename)) {
            return res.status(403).json({ success: false, message: "File tidak diizinkan" });
        }
        const filePath = path_1.default.join(FRONTEND_DATA_DIR, filename);
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: "File tidak ditemukan" });
        }
        res.download(filePath, filename);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Gagal mendownload file" });
    }
};
exports.downloadFile = downloadFile;
const deleteActiveFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const allowed = ["penduduk.json", "peta_sidoarjo.geojson"];
        if (!allowed.includes(filename)) {
            return res.status(403).json({ success: false, message: "File tidak diizinkan" });
        }
        const filePath = path_1.default.join(FRONTEND_DATA_DIR, filename);
        if (fs_1.default.existsSync(filePath)) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const backupName = `${filename}.${timestamp}.bak`;
            fs_1.default.copyFileSync(filePath, path_1.default.join(BACKUP_DIR, backupName));
            fs_1.default.unlinkSync(filePath);
        }
        res.json({ success: true, message: "File berhasil dihapus" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Gagal menghapus file" });
    }
};
exports.deleteActiveFile = deleteActiveFile;
const listBackups = async (req, res) => {
    try {
        if (!fs_1.default.existsSync(BACKUP_DIR)) {
            return res.json({ success: true, backups: [] });
        }
        const files = fs_1.default
            .readdirSync(BACKUP_DIR)
            .map((f) => ({
            name: f,
            size: fs_1.default.statSync(path_1.default.join(BACKUP_DIR, f)).size,
            created: fs_1.default.statSync(path_1.default.join(BACKUP_DIR, f)).mtime,
        }))
            .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        res.json({ success: true, backups: files });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Gagal membaca backup" });
    }
};
exports.listBackups = listBackups;
const uploadGeojsonDesa = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "File tidak ditemukan" });
        }
        const { desaName } = req.params;
        if (!desaName)
            return res.status(400).json({ success: false, message: "Nama desa tidak valid" });
        let parsed;
        try {
            parsed = JSON.parse(req.file.buffer.toString("utf8"));
        }
        catch (_a) {
            return res.status(400).json({ success: false, message: "File bukan JSON/GeoJSON yang valid" });
        }
        if (parsed.type !== "FeatureCollection" && !parsed.features) {
            return res.status(400).json({
                success: false,
                message: "File harus berformat GeoJSON",
            });
        }
        const filename = `${desaName.toLowerCase()}.geojson`;
        const srcPath = path_1.default.join(GEOJSON_DIR, filename);
        let backupName = null;
        if (fs_1.default.existsSync(srcPath)) {
            const ts = new Date().toISOString().replace(/[:.]/g, "-");
            backupName = `${filename}.${ts}.bak`;
            const destPath = path_1.default.join(BACKUP_DIR, backupName);
            fs_1.default.copyFileSync(srcPath, destPath);
        }
        fs_1.default.writeFileSync(srcPath, JSON.stringify(parsed, null, 2), "utf8");
        res.json({
            success: true,
            message: `File ${filename} berhasil diupload dan disimpan`,
            backup: backupName
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Gagal mengupload file geojson" });
    }
};
exports.uploadGeojsonDesa = uploadGeojsonDesa;
const deleteGeojsonDesa = async (req, res) => {
    try {
        const { desaName } = req.params;
        if (!desaName)
            return res.status(400).json({ success: false, message: "Nama desa tidak valid" });
        const filename = `${desaName.toLowerCase()}.geojson`;
        const filePath = path_1.default.join(GEOJSON_DIR, filename);
        if (fs_1.default.existsSync(filePath)) {
            const ts = new Date().toISOString().replace(/[:.]/g, "-");
            const backupName = `${filename}.${ts}.bak`;
            fs_1.default.copyFileSync(filePath, path_1.default.join(BACKUP_DIR, backupName));
            fs_1.default.unlinkSync(filePath);
        }
        res.json({ success: true, message: "Batas wilayah berhasil dihapus" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Gagal menghapus batas wilayah" });
    }
};
exports.deleteGeojsonDesa = deleteGeojsonDesa;
