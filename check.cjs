const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const umkm = await prisma.umkm.findMany();
  console.log("Total UMKM data:", umkm.length);
  if (umkm.length > 0) {
    console.log("First record:", umkm[0]);
    
    // Check if nmdesa field exists
    const simo = await prisma.umkm.findMany({
      where: {
        nmdesa: "SIMOANGINANGIN"
      }
    });
    console.log("Data for SIMOANGINANGIN count:", simo.length);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
