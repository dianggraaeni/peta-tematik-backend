const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  console.log("Memulai backup data dari PostgreSQL...");
  const data = {};

  // Fetch all data
  data.users = await prisma.user.findMany();
  console.log(`- ${data.users.length} Users backed up.`);

  data.peta = await prisma.peta.findMany();
  console.log(`- ${data.peta.length} Peta backed up.`);

  data.pekerjaan = await prisma.pekerjaan.findMany();
  console.log(`- ${data.pekerjaan.length} Pekerjaan backed up.`);

  data.villageThemes = await prisma.villageTheme.findMany();
  console.log(`- ${data.villageThemes.length} VillageThemes backed up.`);

  data.demografiDesa = await prisma.demografiDesa.findMany();
  console.log(`- ${data.demografiDesa.length} DemografiDesa backed up.`);

  data.umkm = await prisma.umkm.findMany();
  console.log(`- ${data.umkm.length} UMKM backed up.`);

  // Write to file
  fs.writeFileSync('./backup_db.json', JSON.stringify(data, null, 2));
  console.log("Semua data berhasil dibackup ke backup_db.json!");
}

main()
  .catch(e => {
    console.error("Terjadi kesalahan:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
