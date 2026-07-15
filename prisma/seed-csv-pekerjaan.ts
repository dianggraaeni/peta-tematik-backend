import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";

const prisma = new PrismaClient();

async function main() {
  console.log("Membaca file webgis-sidokepung.pekerjaan.xlsx - Sheet1.csv...");
  
  // Using the absolute path provided by the user
  const csvPath = "D:\\Documents\\Internship\\BPS Sidoarjo\\desa-cantik\\webgis-sidokepung.pekerjaan.xlsx - Sheet1.csv";
  
  if (!fs.existsSync(csvPath)) {
    console.error("File CSV tidak ditemukan:", csvPath);
    process.exit(1);
  }

  const parser = fs
    .createReadStream(csvPath)
    .pipe(parse({ columns: true, skip_empty_lines: true }));

  const records = [];
  
  for await (const row of parser) {
    let rt = parseInt(row["RT"], 10);
    if (isNaN(rt)) rt = 0;
    
    let rw = parseInt(row["RW"], 10);
    if (isNaN(rw)) rw = 0;
    
    let umur = parseInt(row["Umur"], 10);
    if (isNaN(umur)) umur = 0;
    
    const jenis_kelamin = row["Jenis Kelamin"] || "Tidak Diketahui";
    
    // Fallbacks if empty
    let status_pekerjaan_utama = row["Status Pekerjaan Utama"];
    if (!status_pekerjaan_utama || status_pekerjaan_utama.trim() === "") {
        status_pekerjaan_utama = row["Kegiatan Sehari-hari"] === "Mengurus Rumah Tangga" ? "Mengurus Rumah Tangga" : "Tidak Bekerja";
    }
    
    let bidang_pekerjaan = row["Bidang Pekerjaan"];
    if (!bidang_pekerjaan || bidang_pekerjaan.trim() === "") {
        bidang_pekerjaan = row["Kegiatan Sehari-hari"] === "Mengurus Rumah Tangga" ? "Mengurus Rumah Tangga" : "Tidak Bekerja";
    }
    
    const nama_anggota = row["Nama Anggota"] || "Tanpa Nama";
    const id_keluarga = row["ID Keluarga"] || "KEL_BARU";
    const nmdesa = "SIDOKEPUNG";
    
    records.push({
      rt,
      rw,
      umur,
      jenis_kelamin,
      status_pekerjaan_utama,
      bidang_pekerjaan,
      nama_anggota,
      id_keluarga,
      nmdesa,
    });
  }

  console.log(`Berhasil membaca ${records.length} baris dari CSV.`);
  
  console.log(`Menghapus data Pekerjaan lama untuk desa SIDOKEPUNG (jika ada)...`);
  await prisma.pekerjaan.deleteMany({
    where: {
      nmdesa: "SIDOKEPUNG",
    },
  });

  console.log(`Mulai seeding (memasukkan data) ke tabel Pekerjaan... Ini mungkin butuh waktu beberapa detik.`);
  
  // Create many in chunks to avoid overwhelming the db
  const chunkSize = 500;
  for (let i = 0; i < records.length; i += chunkSize) {
    const chunk = records.slice(i, i + chunkSize);
    await prisma.pekerjaan.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    console.log(`Seeded ${Math.min(i + chunkSize, records.length)} / ${records.length}`);
  }

  console.log("Seeding data Pekerjaan Sidokepung selesai!");
}

main()
  .catch((e) => {
    console.error("Terjadi error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
