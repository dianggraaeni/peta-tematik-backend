const { PrismaClient } = require('@prisma/client');
const turf = require('@turf/turf');
const prisma = new PrismaClient();
async function main() {
  const points = await prisma.peta.findMany({ where: { desa_id: 'SIMOKETAWANG' } });
  const kel = points.filter(p => p.properties && p.properties.marker_type === 'Kelengkeng');
  const polys = points.filter(p => p.type === 'Feature' && p.geometry && p.geometry.type !== 'Point');
  
  const results = {};
  for (const pt of kel) {
     let assignedRt = null;
     // 1. Check strict containment
     for (const poly of polys) {
        try {
           if (turf.booleanPointInPolygon(pt, poly)) {
              const nmsls = poly.properties.nmsls || '';
              const rtMatch = nmsls.match(/RT\s(\S+)/);
              assignedRt = rtMatch ? rtMatch[1] : 'unknown';
              break;
           }
        } catch(e) {}
     }
     
     // 2. If unmatched, find nearest polygon
     if (!assignedRt) {
        let minDist = Infinity;
        for (const poly of polys) {
           try {
              // Convert polygon to lines to find distance to boundary
              const lines = turf.polygonToLine(poly.geometry);
              const dist = turf.pointToLineDistance(pt, lines, {units: 'meters'});
              if (dist < minDist) {
                 minDist = dist;
                 const nmsls = poly.properties.nmsls || '';
                 const rtMatch = nmsls.match(/RT\s(\S+)/);
                 assignedRt = rtMatch ? rtMatch[1] : 'unknown';
              }
           } catch(e) {}
        }
     }
     
     results[assignedRt] = (results[assignedRt] || 0) + (Number.parseInt(pt.properties.jumlah_pohon) || 0);
  }
  console.log('SUM with Nearest:', results);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
