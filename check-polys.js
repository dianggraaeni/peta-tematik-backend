const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const points = await prisma.peta.findMany({ where: { desa_id: 'SIMOKETAWANG' } });
  const polys = points.filter(p => p.type === 'Feature' && p.geometry && p.geometry.type !== 'Point');
  console.log(polys.map(p => p.properties.kdsls));
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
