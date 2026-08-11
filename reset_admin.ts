import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin123", salt);
  
  await prisma.user.upsert({
    where: { username: "admin_pusat" },
    update: { password: hashedPassword },
    create: {
      username: "admin_pusat",
      name: "Admin Pusat",
      email: "admin_pusat@bps.go.id",
      password: hashedPassword,
      role: "admin",
    }
  });
  console.log("SUCCESS! Password for admin_pusat is now admin123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
