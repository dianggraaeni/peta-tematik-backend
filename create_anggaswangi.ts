import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin_anggaswangi' },
    update: { password: hashedPassword },
    create: {
      username: 'admin_anggaswangi',
      password: hashedPassword,
      name: 'Admin Anggaswangi',
      role: 'admin',
      email: 'anggaswangi@desa.com'
    }
  });
  console.log('Created admin_anggaswangi');
}

main().catch(console.error).finally(() => prisma.$disconnect());
