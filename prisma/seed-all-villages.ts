import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  const geojsonDir = path.resolve(__dirname, "../../peta-tematik-frontend/public/geoJson");
  const filesToSeed = [
    "3515080017-Grogol-Tulangan.geojson",
    "3515090001-Simoketawang-Wonoayu.geojson",
    "3515090013-Simoanginangin-Wonoayu.geojson",
    "3515120015-Sidokepung-Buduran.geojson",
  ];

  for (const filename of filesToSeed) {
    const geojsonPath = path.join(geojsonDir, filename);
    
    if (!fs.existsSync(geojsonPath)) {
      console.warn(`File not found: ${geojsonPath}. Skipping...`);
      continue;
    }

    console.log(`\n--- Memproses file: ${filename} ---`);
    const rawData = fs.readFileSync(geojsonPath, "utf-8");
    const geojson = JSON.parse(rawData);

    if (!geojson.features || geojson.features.length === 0) {
      console.warn("GeoJSON tidak memiliki fitur. Skipping...");
      continue;
    }

    // Extract village name from the first feature's properties and remove spaces
    const nmdesaRaw = geojson.features[0].properties.nmdesa;
    if (!nmdesaRaw) {
      console.warn("Properti 'nmdesa' tidak ditemukan pada GeoJSON. Skipping...");
      continue;
    }
    
    const desa_id = nmdesaRaw.replace(/\s+/g, "").toUpperCase();
    console.log(`Desa ID terdeteksi: ${desa_id}`);

    console.log(`Menghapus data peta lama untuk desa ${desa_id} (jika ada)...`);
    await prisma.peta.deleteMany({
      where: {
        desa_id: desa_id,
      },
    });

    console.log(`Menambahkan ${geojson.features.length} wilayah ke database...`);
    
    // Using a transaction to speed up the inserts
    const createPromises = geojson.features.map((feature: any) => {
      return prisma.peta.create({
        data: {
          desa_id: desa_id,
          type: feature.type,
          properties: feature.properties,
          geometry: feature.geometry,
        },
      });
    });

    await prisma.$transaction(createPromises);
    console.log(`Selesai memproses ${desa_id}.`);
  }

  console.log("\nSemua proses seeding peta selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
