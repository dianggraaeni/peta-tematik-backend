import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Membaca file sidokepung.geojson...");
  const geojsonPath = path.resolve(
    __dirname,
    "../../peta-tematik-frontend/public/geoJson/sidokepung.geojson"
  );
  
  const rawData = fs.readFileSync(geojsonPath, "utf-8");
  const geojson = JSON.parse(rawData);

  console.log(`Menghapus data peta lama untuk desa SIDOKEPUNG (jika ada)...`);
  await prisma.peta.deleteMany({
    where: {
      desa_id: "SIDOKEPUNG",
    },
  });

  console.log(`Menambahkan ${geojson.features.length} wilayah dari sidokepung.geojson...`);
  
  for (const feature of geojson.features) {
    await prisma.peta.create({
      data: {
        desa_id: "SIDOKEPUNG",
        type: feature.type,
        properties: feature.properties,
        geometry: feature.geometry,
      },
    });
  }

  console.log("Seeding peta Sidokepung selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
