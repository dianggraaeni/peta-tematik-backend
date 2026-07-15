const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.pekerjaan.deleteMany({
    where: {
      nama_anggota: {
        contains: '(DUMMY)',
      }
    }
  });
  console.log(`Berhasil menghapus ${result.count} data dummy dari tabel Pekerjaan.`);
}

main()
  .catch(e => {
    console.error("Terjadi kesalahan:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
