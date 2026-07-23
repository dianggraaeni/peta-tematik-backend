const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const points = await prisma.peta.findMany({
    where: { desa_id: 'SIMOKETAWANG' }
  });
  
  const kelengkengPoints = points.filter(p => p.type === 'Feature' && p.properties && p.properties.marker_type === 'Kelengkeng');
  console.log('KEYS:', [...new Set(kelengkengPoints.map(p => JSON.stringify(Object.keys(p.properties))))]);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
