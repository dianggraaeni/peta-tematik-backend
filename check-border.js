const { PrismaClient } = require('@prisma/client');
const turf = require('@turf/turf');
const prisma = new PrismaClient();
async function main() {
  const points = await prisma.peta.findMany({ where: { desa_id: 'SIMOKETAWANG' } });
  const kel = points.filter(p => p.properties && p.properties.marker_type === 'Kelengkeng');
  const polys = points.filter(p => p.type === 'Feature' && p.geometry && p.geometry.type !== 'Point');
  
  for (const pt of kel) {
     const nama = pt.properties.nama_kepala_keluarga;
     const pohon = Number.parseInt(pt.properties.jumlah_pohon) || 0;
     let assignedRt = null;
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
     
     if (assignedRt === '003' && pohon === 1) console.log('RT 003 (1 tree):', nama);
     if (assignedRt === '006' && pohon === 1) console.log('RT 006 (1 tree):', nama);
     if (assignedRt === '008') console.log('RT 008:', nama, pohon);
  }
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
