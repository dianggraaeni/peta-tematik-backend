const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  console.log("Memulai proses restore data ke MySQL...");
  
  if (!fs.existsSync('./backup_db.json')) {
    console.error("File backup_db.json tidak ditemukan!");
    return;
  }
  
  const rawData = fs.readFileSync('./backup_db.json');
  const data = JSON.parse(rawData);

  // Users
  if (data.users && data.users.length > 0) {
    console.log(`Mengembalikan ${data.users.length} data Users...`);
    await prisma.user.createMany({ data: data.users, skipDuplicates: true });
  }

  // Peta
  if (data.peta && data.peta.length > 0) {
    console.log(`Mengembalikan ${data.peta.length} data Peta...`);
    // Insert in chunks to avoid max placeholder limits
    for (let i = 0; i < data.peta.length; i += 50) {
      await prisma.peta.createMany({ data: data.peta.slice(i, i + 50), skipDuplicates: true });
    }
  }

  // Pekerjaan
  if (data.pekerjaan && data.pekerjaan.length > 0) {
    console.log(`Mengembalikan ${data.pekerjaan.length} data Pekerjaan...`);
    for (let i = 0; i < data.pekerjaan.length; i += 500) {
      await prisma.pekerjaan.createMany({ data: data.pekerjaan.slice(i, i + 500), skipDuplicates: true });
    }
  }

  // DemografiDesa
  if (data.demografiDesa && data.demografiDesa.length > 0) {
    console.log(`Mengembalikan ${data.demografiDesa.length} data DemografiDesa...`);
    for (let i = 0; i < data.demografiDesa.length; i += 100) {
      await prisma.demografiDesa.createMany({ data: data.demografiDesa.slice(i, i + 100), skipDuplicates: true });
    }
  }

  // Umkm
  if (data.umkm && data.umkm.length > 0) {
    console.log(`Mengembalikan ${data.umkm.length} data UMKM...`);
    await prisma.umkm.createMany({ data: data.umkm, skipDuplicates: true });
  }

  // VillageThemes
  if (data.villageThemes && data.villageThemes.length > 0) {
    console.log(`Mengembalikan ${data.villageThemes.length} data VillageThemes...`);
    // Need to handle 'themes' mapping since it's Json now instead of String[]
    const mappedThemes = data.villageThemes.map(vt => ({
      ...vt,
      themes: Array.isArray(vt.themes) ? vt.themes : JSON.parse(vt.themes || '[]')
    }));
    await prisma.villageTheme.createMany({ data: mappedThemes, skipDuplicates: true });
  }

  console.log("✅ Restore data berhasil sepenuhnya!");
}

main()
  .catch(e => {
    console.error("❌ Terjadi kesalahan saat restore:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
