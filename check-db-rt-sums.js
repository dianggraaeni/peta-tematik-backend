const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const points = await prisma.peta.findMany({ where: { desa_id: 'SIMOKETAWANG' } });
  const kel = points.filter(p => p.properties && p.properties.marker_type === 'Kelengkeng');
  const totals = {};
  kel.forEach(p => {
     const rt = p.properties.rt || 'unknown';
     totals[rt] = (totals[rt] || 0) + (parseInt(p.properties.jumlah_pohon) || 0);
  });
  console.log('RT SUMS:', totals);
}
main().catch(console.error).finally(() => prisma.$disconnect());
