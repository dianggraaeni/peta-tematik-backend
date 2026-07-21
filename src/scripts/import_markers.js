const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const prisma = new PrismaClient();

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

async function main() {
  console.log("Mulai import data UMKM Simoangin-angin...");
  const umkmPath = path.resolve(__dirname, "../../../data-raw-csv/Mikro Data UMKM Simoangin-angin 25-09-2024 09.44 (1).xlsx - Sheet1.csv");
  
  if (fs.existsSync(umkmPath)) {
    const umkmData = await parseCSV(umkmPath);
    let umkmCount = 0;
    for (const row of umkmData) {
      if (!row.longitude || !row.latitude) continue;
      
      const properties = {
        nama_usaha: row.nama_usaha,
        alamat: row.alamat,
        kategori_usaha_mikro: row.skala_usaha, // Kolom T
        kategori_kbli: row.kategori_usaha, // Kolom P
        kegiatan_utama_usaha: row.kegiatan_utama_usaha, // Kolom Q
        bentuk_badan_usaha: row.bentuk_badan_usaha, // Kolom R
        nmdesa: "Simoanginangin",
        marker_type: "UMKM"
      };

      const geometry = {
        type: "Point",
        coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)]
      };

      try {
        await prisma.peta.create({
          data: {
            desa_id: "Simoanginangin",
            type: "Feature",
            properties: properties,
            geometry: geometry
          }
        });
        umkmCount++;
      } catch (err) {
        console.error("Error inserting UMKM row:", err);
      }
    }
    console.log(`Berhasil import ${umkmCount} data UMKM Simoangin-angin.`);
  } else {
    console.log("File UMKM Simoangin-angin tidak ditemukan:", umkmPath);
  }

  console.log("Mulai import data Kelengkeng Simoketawang...");
  const kelengkengPath = path.resolve(__dirname, "../../../data-raw-csv/Mikro data Usaha Kelengkeng Simoketawang 16-10-2024 12.18 (1).xlsx - Sheet1.csv");
  
  if (fs.existsSync(kelengkengPath)) {
    const kelengkengData = await parseCSV(kelengkengPath);
    let kelengkengCount = 0;
    for (const row of kelengkengData) {
      if (!row.longitude || !row.latitude) continue;

      const properties = {
        nama_kepala_keluarga: row.nama_kepala_keluarga,
        alamat: row.alamat,
        jumlah_pohon: row.jml_pohon, // Kolom H
        volume_produksi: row.volume_produksi, // Kolom O
        pemanfaatan_produk: row.pemanfaatan_produk, // Kolom P
        nmdesa: "Simoketawang",
        marker_type: "Kelengkeng"
      };

      const geometry = {
        type: "Point",
        coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)]
      };

      try {
        await prisma.peta.create({
          data: {
            desa_id: "Simoketawang",
            type: "Feature",
            properties: properties,
            geometry: geometry
          }
        });
        kelengkengCount++;
      } catch (err) {
        console.error("Error inserting Kelengkeng row:", err);
      }
    }
    console.log(`Berhasil import ${kelengkengCount} data Kelengkeng Simoketawang.`);
  } else {
    console.log("File Kelengkeng Simoketawang tidak ditemukan:", kelengkengPath);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
