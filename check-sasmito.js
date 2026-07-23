const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const points = await prisma.peta.findMany({ where: { desa_id: 'SIMOKETAWANG' } });
  const kel = points.filter(p => p.properties && p.properties.marker_type === 'Kelengkeng');
  kel.forEach(p => {
    if (p.properties.nama_kepala_keluarga && p.properties.nama_kepala_keluarga.includes('SASMITO')) {
      console.log('DB SASMITO:', p.properties);
    }
  });
}
main().catch(console.error).finally(() => prisma.$disconnect());
