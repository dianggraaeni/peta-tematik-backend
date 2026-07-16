import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

export const getInsight = async (req: Request, res: Response) => {
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
    let prompt = "";
    if (contextType === "pekerjaan") {
      prompt = `Sebagai analis data BPS yang profesional, berikan insight singkat (1-3 kalimat) mengenai potensi pekerjaan dan demografi di wilayah ${featureName}, Kabupaten Sidoarjo. Gunakan pengetahuan bawaanmu tentang kondisi riil, sosial, dan ekonomi wilayah tersebut di dunia nyata (seolah-olah kamu mencari profil wilayahnya di internet), lalu gabungkan dengan data statistik ini:
      - Total Penduduk Bekerja/Usia Kerja: ${data.totalPenduduk || 0}
      - Pekerjaan Dominan: ${data.dominanPekerjaan || "Tidak diketahui"}
      - Rasio Jenis Kelamin (L/P): ${data.lakiLaki || 0}/${data.perempuan || 0}
      Fokus pada potensi atau profil wilayah ini secara analitis. Di akhir insight, selalu sertakan perkiraan tahun (misal: 2023/2024) dan sumber rujukan umum (misal: BPS Sidoarjo/Data Desa).`;
    } else if (contextType === "umkm") {
       prompt = `Sebagai analis data BPS yang profesional, berikan insight singkat (1-3 kalimat) mengenai potensi UMKM dan ekonomi di wilayah ${featureName}, Kabupaten Sidoarjo. Gunakan pengetahuan bawaanmu tentang karakteristik riil dan sejarah wilayah tersebut di dunia nyata (seolah-olah kamu mencari profil ekonominya di internet), lalu gabungkan dengan data statistik ini:
      - Total UMKM: ${data.totalUmkm || 0}
      - KBLI (Sektor) Dominan: ${data.dominanKbli || "Tidak diketahui"}
      Fokus pada kesimpulan utama atau potensi ekonomi wilayah ini secara spesifik. Di akhir insight, selalu sertakan perkiraan tahun (misal: 2023/2024) dan sumber rujukan umum (misal: BPS Sidoarjo/Data Desa).`;
    } else if (contextType === "statistik_kecamatan") {
       prompt = `Sebagai analis data BPS yang profesional, berikan insight analitis singkat (1-3 kalimat) mengenai karakteristik atau potensi kecamatan/desa ${featureName} di Kabupaten Sidoarjo. Gunakan pengetahuan luasmu tentang profil sosial, budaya, letak geografis, atau ikon wilayah tersebut di internet, dikombinasikan dengan data kependudukan berikut:
      - Total Penduduk: ${data.jumlah_penduduk || data.total_penduduk || 0} jiwa
      - Total Rumah Tangga/KK: ${data.jumlah_rumah_tangga || data.total_kk || 0}
      Fokus pada potensi unik atau tantangan di kecamatan/desa ini secara nyata. Di akhir insight, selalu sertakan perkiraan tahun (misal: 2023/2024) dan sumber rujukan umum (misal: BPS Sidoarjo/Data Desa).`;
    } else {
      prompt = `Berikan insight singkat (1-2 kalimat) untuk wilayah ${featureName} berdasarkan data berikut: ${JSON.stringify(data)}. Di akhir insight, cantumkan sumber data (BPS Sidoarjo) dan tahun data.`;
    }

    try {
      // 1. Try Gemini
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
        generationConfig: { temperature: 0.1 }
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return res.json({ insight: text });
    } catch (geminiError: any) {
      console.warn("Gemini Failed:", geminiError.message || geminiError);

      // 2. Fallback to Groq
      try {
        const groqKey = process.env.GROQ_API_KEY;
        if (!groqKey) throw new Error("GROQ_API_KEY not found");
        
        console.log("Trying Fallback 1: Groq API...");
        const groqRes = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1
        }, {
          headers: {
            "Authorization": `Bearer ${groqKey}`,
            "Content-Type": "application/json"
          }
        });

        return res.json({ insight: groqRes.data.choices[0].message.content });
      } catch (groqError: any) {
        console.warn("Groq Failed:", groqError.message || groqError);

        // 3. Fallback to OpenRouter
        try {
          const openRouterKey = process.env.OPENROUTER_API_KEY;
          if (!openRouterKey) throw new Error("OPENROUTER_API_KEY not found");

          console.log("Trying Fallback 2: OpenRouter API...");
          const orRes = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "google/gemini-1.5-flash",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1
          }, {
            headers: {
              "Authorization": `Bearer ${openRouterKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "http://localhost:5173", // Required by OpenRouter
              "X-Title": "Peta Tematik BPS" // Required by OpenRouter
            }
          });

          return res.json({ insight: orRes.data.choices[0].message.content });
        } catch (orError: any) {
          console.error("OpenRouter Failed:", orError.message || orError);
          // All APIs failed
          return res.status(429).json({ error: "Terlalu banyak permintaan ke AI. Silakan coba lagi nanti (Semua server sibuk)." });
        }
      }
    }
  } catch (err: any) {
    console.error("Fatal Error generating AI insight:", err);
    res.status(500).json({ error: "Failed to generate insight" });
  }
};
