const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = 'password123';
  
  const existingUser = await prisma.user.findUnique({ where: { username } });
  
  if (existingUser) {
    console.log(`User ${username} already exists!`);
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  await prisma.user.create({
    data: {
      name: 'Administrator',
      username,
      email: 'admin@bps.go.id',
      password: hashedPassword,
      role: 'admin',
    },
  });
  
  console.log(`User ${username} created successfully with password: ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
