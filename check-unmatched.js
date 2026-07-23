const { PrismaClient } = require('@prisma/client');
const turf = require('@turf/turf');
const prisma = new PrismaClient();
async function main() {
  const points = await prisma.peta.findMany({ where: { desa_id: 'SIMOKETAWANG' } });
  const kel = points.filter(p => p.properties && p.properties.marker_type === 'Kelengkeng');
  const polys = points.filter(p => p.type === 'Feature' && p.geometry && p.geometry.type !== 'Point');
  
  let unmatched = 0;
  for (const pt of kel) {
     let matched = false;
     for (const poly of polys) {
        try {
           if (turf.booleanPointInPolygon(pt, poly)) {
              matched = true; break;
           }
        } catch(e) {}
     }
     if (!matched) {
       unmatched++;
       console.log('Unmatched Point:', pt.properties.nama_kepala_keluarga, pt.properties.jumlah_pohon);
     }
  }
  console.log('Total Unmatched:', unmatched);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
