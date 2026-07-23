const { PrismaClient } = require('@prisma/client');
const turf = require('@turf/turf');
const prisma = new PrismaClient();
async function main() {
  const points = await prisma.peta.findMany({ where: { desa_id: 'SIMOKETAWANG' } });
  const kel = points.filter(p => p.properties && p.properties.marker_type === 'Kelengkeng');
  const polys = points.filter(p => p.type === 'Feature' && p.geometry && p.geometry.type !== 'Point');
  
  const results = {};
  for (const poly of polys) {
     const kdsls = poly.properties.kdsls;
     let count = 0;
     for (const pt of kel) {
        try {
           if (turf.booleanPointInPolygon(pt, poly)) count++;
        } catch(e) {}
     }
     results[kdsls] = count;
  }
  console.log('COUNTS:', results);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
