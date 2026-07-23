const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const points = await prisma.peta.findMany({ where: { desa_id: 'SIMOKETAWANG' } });
  const kel = points.filter(p => p.properties && p.properties.marker_type === 'Kelengkeng');
  console.log(kel[0]);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
