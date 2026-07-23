const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const points = await prisma.peta.findMany({ where: { desa_id: 'SIMOKETAWANG' } });
  const kel = points.filter(p => p.properties && p.properties.marker_type === 'Kelengkeng');
  
  const expected = [
    'MARSAID', 'TRI DIDIK S', 'BAGUS SASMITO', 'MARDI ALI H', 
    'KARJANI', 'SUGIANTO', 'SYARONI', 'SAPARI', 'NURUL MA\'ARIF', 'SUTRISNO'
  ];
  
  expected.forEach(name => {
     const pt = kel.find(p => p.properties.nama_kepala_keluarga && p.properties.nama_kepala_keluarga.toUpperCase() === name.toUpperCase());
     if (pt) {
        console.log(`${name}: rt = ${pt.properties.rt}, pohon = ${pt.properties.jumlah_pohon}`);
     } else {
        console.log(`${name}: NOT FOUND`);
     }
  });
}
main().catch(console.error).finally(() => prisma.$disconnect());
