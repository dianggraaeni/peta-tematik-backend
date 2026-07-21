const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const allUmkm = await prisma.peta.findMany({
    where: {
      desa_id: "Simoanginangin",
      properties: { path: "$.marker_type", equals: "UMKM" }
    }
  });

  const targets = [];
  
  for (const o of allUmkm) {
    const name = (o.properties.nama_usaha || "").toUpperCase();
    if (name.includes("PERMAK") || name.includes("PERACANGAN BIRU")) {
      targets.push(o);
    }
  }

  console.log(`Found ${targets.length} additional outliers to fix.`);

  const centerLng = 112.596;
  const centerLat = -7.441;

  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    console.log("Fixing:", t.properties.nama_usaha);
    
    // Slight random offset
    const newLng = centerLng + (Math.random() * 0.003 - 0.0015);
    const newLat = centerLat + (Math.random() * 0.003 - 0.0015);

    await prisma.peta.update({
      where: { id: t.id },
      data: {
        geometry: {
          type: "Point",
          coordinates: [newLng, newLat]
        }
      }
    });
  }

  console.log("Done fixing.");
  await prisma.$disconnect();
}

main().catch(console.error);
