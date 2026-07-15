const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const admins = [
    { username: 'admin_grogol', password: 'password123', name: 'Admin Grogol', email: 'grogol@bps.go.id' },
    { username: 'admin_sidokepung', password: 'password123', name: 'Admin Sidokepung', email: 'sidokepung@bps.go.id' },
    { username: 'admin_simo', password: 'password123', name: 'Admin Simoanginangin', email: 'simo@bps.go.id' },
    { username: 'admin_ketawang', password: 'password123', name: 'Admin Simoketawang', email: 'ketawang@bps.go.id' }
  ];

  for (const admin of admins) {
    const existingUser = await prisma.user.findUnique({ where: { username: admin.username } });
    if (existingUser) {
      console.log(`User ${admin.username} already exists!`);
      continue;
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(admin.password, salt);
    
    await prisma.user.create({
      data: {
        name: admin.name,
        username: admin.username,
        email: admin.email,
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log(`User ${admin.username} created successfully.`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
