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
    const kegiatan = (o.properties.kegiatan_utama_usaha || "").toUpperCase();
    
    if (
      (name === "JUAL BELI GABAH DAN BERAS") ||
      (name.includes("TOKO KELONTONG") && o.properties.alamat.toUpperCase().includes("SIMO")) ||
      (kegiatan.includes("BASRENG") && kegiatan.includes("SEBLAK")) ||
      (kegiatan.includes("LES PRIVAT")) ||
      (name.includes("KELONTONG") && kegiatan.includes("SNACK ONLINE"))
    ) {
      targets.push(o);
    }
  }

  console.log(`Found ${targets.length} targets to fix.`);

  const centerLng = 112.596;
  const centerLat = -7.441;

  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    console.log("Fixing:", t.properties.nama_usaha, "|", t.properties.kegiatan_utama_usaha);
    
    // Slight random offset so they don't overlap perfectly
    const newLng = centerLng + (Math.random() * 0.002 - 0.001);
    const newLat = centerLat + (Math.random() * 0.002 - 0.001);

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
