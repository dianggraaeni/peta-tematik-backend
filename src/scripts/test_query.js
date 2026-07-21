const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const umkmList = await prisma.umkm.findMany({
    where: { nmdesa: "Simoanginangin" },
  });
  console.log(`Umkm count Simoanginangin: ${umkmList.length}`);
  
  if (umkmList.length > 0) {
    console.log("Sample UMKM:", umkmList[0]);
  } else {
    // Check what nmdesa values exist in Umkm table
    const allUmkm = await prisma.umkm.findMany({
      select: { nmdesa: true },
      distinct: ['nmdesa']
    });
    console.log("Available nmdesa in Umkm table:", allUmkm);
  }

  // Check what desa_id values exist in Peta table
  const allPeta = await prisma.peta.findMany({
    select: { desa_id: true },
    distinct: ['desa_id']
  });
  console.log("Available desa_id in Peta table:", allPeta);

  await prisma.$disconnect();
}

main().catch(console.error);
