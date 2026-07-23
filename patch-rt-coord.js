const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const csvPath = '../data-raw-csv/Mikro data Usaha Kelengkeng Simoketawang 16-10-2024 12.18 (1).xlsx - Sheet1.csv';
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split(/[\r\n]+/).filter(l => l.trim() !== '');
  
  // Extract RT mapping from CSV by GPS coords
  // Format: ..., Lat, Lng, ... (Lat is idx 5, Lng is idx 6)
  const coordToRt = {};
  for (let i = 1; i < lines.length; i++) {
     const parts = lines[i].split(',');
     if (parts.length > 7) {
        const rtString = parts[2];
        const lat = parseFloat(parts[5]).toFixed(6);
        const lng = parseFloat(parts[6]).toFixed(6);
        const rtMatch = rtString.match(/RT\s*0*(\d+)/i);
        if (rtMatch) {
           const key = `${lat},${lng}`;
           coordToRt[key] = rtMatch[1].padStart(3, '0');
        }
     }
  }
  
  const points = await prisma.peta.findMany({ where: { desa_id: 'SIMOKETAWANG' } });
  const kel = points.filter(p => p.properties && p.properties.marker_type === 'Kelengkeng');
  
  let updatedCount = 0;
  for (const pt of kel) {
     if (pt.geometry && pt.geometry.coordinates) {
        const lng = parseFloat(pt.geometry.coordinates[0]).toFixed(6);
        const lat = parseFloat(pt.geometry.coordinates[1]).toFixed(6);
        const key = `${lat},${lng}`;
        if (coordToRt[key]) {
           const props = { ...pt.properties, rt: coordToRt[key] };
           await prisma.peta.update({
              where: { id: pt.id },
              data: { properties: props }
           });
           updatedCount++;
        } else {
           console.log('No RT found in CSV for coord:', key, pt.properties.nama_kepala_keluarga);
        }
     }
  }
  
  console.log(`Updated ${updatedCount} points with RT from CSV using coordinates!`);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
