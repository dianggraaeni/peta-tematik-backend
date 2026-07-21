const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');

async function main() {
  const geojsonPath = 'D:\\\\Documents\\\\Internship\\\\BPS Sidoarjo\\\\desa-cantik\\\\3515090001-Simoketawang-Wonoayu.geojson';
  
  if (!fs.existsSync(geojsonPath)) {
    console.error(`File not found: ${geojsonPath}`);
    return;
  }

  const rawData = fs.readFileSync(geojsonPath, 'utf8');
  const geojson = JSON.parse(rawData);

  if (!geojson.features || !Array.isArray(geojson.features)) {
    console.error('Invalid GeoJSON format');
    return;
  }

  let count = 0;
  for (const feature of geojson.features) {
    await prisma.peta.create({
      data: {
        desa_id: "Simoketawang",
        type: feature.type,
        properties: feature.properties,
        geometry: feature.geometry
      }
    });
    count++;
  }
  
  console.log(`Successfully imported ${count} polygons for Simoketawang.`);
  
  // Move file to backend data folder
  const destDir = 'D:\\\\Documents\\\\Internship\\\\BPS Sidoarjo\\\\desa-cantik\\\\peta-tematik-backend\\\\data';
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const destPath = path.join(destDir, '3515090001-Simoketawang-Wonoayu.geojson');
  fs.renameSync(geojsonPath, destPath);
  console.log(`Moved file to ${destPath}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
