"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInsight = void 0;
const generative_ai_1 = require("@google/generative-ai");
const getInsight = async (req, res) => {
    const { featureName, data, contextType } = req.body;
    if (!featureName || !data || !contextType) {
        return res.status(400).json({ error: "Missing required parameters" });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY is not set.");
        return res.status(500).json({ error: "Server AI configuration error" });
    }
    try {
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let prompt = "";
        if (contextType === "pekerjaan") {
            prompt = `Sebagai analis data BPS yang profesional namun mudah dipahami, berikan insight singkat (1-2 kalimat) berdasarkan data penduduk untuk wilayah ${featureName}. Data statistik:
      - Total Penduduk: ${data.totalPenduduk || 0}
      - Pekerjaan Dominan: ${data.dominanPekerjaan || "Tidak diketahui"}
      - Rasio Jenis Kelamin (L/P): ${data.lakiLaki || 0}/${data.perempuan || 0}
      Fokus pada kesimpulan utama atau potensi wilayah ini secara singkat tanpa menyebutkan kembali angka mentahnya secara detail.`;
        }
        else if (contextType === "umkm") {
            prompt = `Sebagai analis data BPS yang profesional namun mudah dipahami, berikan insight singkat (1-2 kalimat) berdasarkan data UMKM untuk wilayah ${featureName}. Data statistik:
      - Total UMKM: ${data.totalUmkm || 0}
      - KBLI (Sektor) Dominan: ${data.dominanKbli || "Tidak diketahui"}
      Fokus pada kesimpulan utama atau potensi ekonomi wilayah ini secara singkat tanpa menyebutkan kembali angka mentahnya secara detail.`;
        }
        else {
            prompt = `Berikan insight singkat (1-2 kalimat) untuk wilayah ${featureName} berdasarkan data berikut: ${JSON.stringify(data)}`;
        }
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.json({ insight: text });
    }
    catch (error) {
        console.error("Error generating AI insight:", error);
        res.status(500).json({ error: "Failed to generate insight" });
    }
};
exports.getInsight = getInsight;
