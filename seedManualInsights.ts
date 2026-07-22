import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const data = require('./src/data/manualInsights.json');

async function main() {
  await prisma.manualInsight.deleteMany({});
  const mappedData = data.map((item: any) => ({
    desa_name: item.desa_name,
    contextType: item.contextType,
    insightText: item.insightText
  }));
  await prisma.manualInsight.createMany({
    data: mappedData,
    skipDuplicates: true
  });
  console.log('Successfully seeded manual insights');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
