const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const points = await prisma.peta.findMany({ where: { desa_id: 'SIMOKETAWANG' } });
  const kel = points.filter(p => p.properties && p.properties.marker_type === 'Kelengkeng');
  let sum = 0;
  kel.forEach(p => sum += Number.parseInt(p.properties.jumlah_pohon) || 0);
  console.log('TOTAL DB:', sum);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
