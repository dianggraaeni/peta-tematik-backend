const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  console.log('ADMINS:', users.map(u => u.username));
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
