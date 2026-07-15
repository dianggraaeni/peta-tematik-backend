const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const users = [
    { username: 'admin_sidokepung', password: 'password123', email: 'sidokepung@bps.go.id' },
    { username: 'admin_grogol', password: 'password123', email: 'grogol@bps.go.id' },
    { username: 'admin_simoanginangin', password: 'password123', email: 'simoanginangin@bps.go.id' },
    { username: 'admin_simoketawang', password: 'password123', email: 'simoketawang@bps.go.id' },
  ];

  for (const u of users) {
    const existingUser = await prisma.user.findUnique({ where: { username: u.username } });
    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      await prisma.user.create({
        data: {
          name: u.username,
          username: u.username,
          email: u.email,
          password: hashedPassword,
          role: 'admin',
        },
      });
      console.log(`Created ${u.username}`);
    } else {
      // update password to password123 to be sure
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      await prisma.user.update({
        where: { username: u.username },
        data: { password: hashedPassword }
      });
      console.log(`Updated ${u.username}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
