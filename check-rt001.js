const { PrismaClient } = require('@prisma/client');
const turf = require('@turf/turf');
const prisma = new PrismaClient();
async function main() {
  const points = await prisma.peta.findMany({ where: { desa_id: 'SIMOKETAWANG' } });
  const kel = points.filter(p => p.properties && p.properties.marker_type === 'Kelengkeng');
  const polys = points.filter(p => p.type === 'Feature' && p.geometry && p.geometry.type !== 'Point');
  
  for (const poly of polys) {
     const nmsls = poly.properties.nmsls || '';
     const rtMatch = nmsls.match(/RT\s(\S+)/);
     const rt = rtMatch ? rtMatch[1] : 'unknown';
     
     if (rt === '001') {
       const matched = [];
       for (const pt of kel) {
          try {
             if (turf.booleanPointInPolygon(pt, poly)) {
                matched.push(Number.parseInt(pt.properties.jumlah_pohon) || 0);
             }
          } catch(e) {}
       }
       console.log('RT 001 points:', matched);
       break;
     }
  }
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
