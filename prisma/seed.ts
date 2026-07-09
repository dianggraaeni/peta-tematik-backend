import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Menghapus data lama (jika ada)...");
  await prisma.pekerjaan.deleteMany();
  await prisma.peta.deleteMany();

  console.log("Menambahkan data dummy Pekerjaan...");
  // Dummy Data Penduduk RT 1 RW 1
  const pekerjaanData = [
    {
      rt: 1,
      rw: 1,
      umur: 25,
      jenis_kelamin: "Laki-laki",
      status_pekerjaan_utama: "Bekerja",
      bidang_pekerjaan: "Pendidikan",
      nama_anggota: "Budi (DUMMY)",
      id_keluarga: "KEL_DUMMY_1",
    },
    {
      rt: 1,
      rw: 1,
      umur: 28,
      jenis_kelamin: "Perempuan",
      status_pekerjaan_utama: "Bekerja",
      bidang_pekerjaan: "Kesehatan",
      nama_anggota: "Siti (DUMMY)",
      id_keluarga: "KEL_DUMMY_1",
    },
    {
      rt: 1,
      rw: 1,
      umur: 30,
      jenis_kelamin: "Laki-laki",
      status_pekerjaan_utama: "Tidak Bekerja",
      bidang_pekerjaan: "-",
      nama_anggota: "Andi (DUMMY)",
      id_keluarga: "KEL_DUMMY_2",
    },
    // Dummy Data Penduduk RT 7 RW 3 (Dusun Bendo Malang - Leboh banyak perempuan)
    {
      rt: 7,
      rw: 3,
      umur: 22,
      jenis_kelamin: "Perempuan",
      status_pekerjaan_utama: "Bekerja",
      bidang_pekerjaan: "Perdagangan",
      nama_anggota: "Ayu (DUMMY)",
      id_keluarga: "KEL_DUMMY_3",
    },
    {
      rt: 7,
      rw: 3,
      umur: 45,
      jenis_kelamin: "Perempuan",
      status_pekerjaan_utama: "Mengurus Rumah Tangga",
      bidang_pekerjaan: "-",
      nama_anggota: "Ibu Ratna (DUMMY)",
      id_keluarga: "KEL_DUMMY_4",
    },
    {
      rt: 7,
      rw: 3,
      umur: 50,
      jenis_kelamin: "Laki-laki",
      status_pekerjaan_utama: "Bekerja",
      bidang_pekerjaan: "Pertanian",
      nama_anggota: "Pak Joko (DUMMY)",
      id_keluarga: "KEL_DUMMY_4",
    },
  ];

  await prisma.pekerjaan.createMany({
    data: pekerjaanData,
  });

  console.log("Membaca file desa.geojson asli...");
  const geojsonPath = path.resolve(
    __dirname,
    "../../desa-cantik-frontend/public/geoJson/desa.geojson"
  );
  
  const rawData = fs.readFileSync(geojsonPath, "utf-8");
  const geojson = JSON.parse(rawData);

  console.log(`Menambahkan ${geojson.features.length} wilayah dari desa.geojson...`);
  
  for (const feature of geojson.features) {
    await prisma.peta.create({
      data: {
        desa_id: feature.properties.id_desa || "DUMMY_DESA",
        type: feature.type,
        properties: feature.properties,
        geometry: feature.geometry,
      },
    });
  }

  console.log("Selesai! Data peta asli + data penduduk dummy berhasil dimasukkan ke PostgreSQL.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
