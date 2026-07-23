const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const csvPath = '../data-raw-csv/Mikro data Usaha Kelengkeng Simoketawang 16-10-2024 12.18 (1).xlsx - Sheet1.csv';
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split(/[\r\n]+/).filter(l => l.trim() !== '');
  
  // Extract RT mapping from CSV
  // CSV Format: ID, ID2, RT string, Nama, Alamat, Lat, Lng, ...
  const nameToRt = {};
  for (let i = 1; i < lines.length; i++) {
     const parts = lines[i].split(',');
     if (parts.length > 4) {
        const rtString = parts[2];
        const nama = parts[3];
        const rtMatch = rtString.match(/RT\s*0*(\d+)/i);
        if (rtMatch && nama) {
           nameToRt[nama.trim().toUpperCase()] = rtMatch[1].padStart(3, '0');
        }
     }
  }
  
  const points = await prisma.peta.findMany({ where: { desa_id: 'SIMOKETAWANG' } });
  const kel = points.filter(p => p.properties && p.properties.marker_type === 'Kelengkeng');
  
  let updatedCount = 0;
  for (const pt of kel) {
     const nama = (pt.properties.nama_kepala_keluarga || '').toUpperCase();
     if (nameToRt[nama]) {
        const props = { ...pt.properties, rt: nameToRt[nama] };
        await prisma.peta.update({
           where: { id: pt.id },
           data: { properties: props }
        });
        updatedCount++;
     } else {
        console.log('No RT found in CSV for:', nama);
     }
  }
  
  console.log(`Updated ${updatedCount} points with RT from CSV!`);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
