import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin123", salt);
  
  const desas = ["sidokepung", "simoketawang"];
  
  for (const desa of desas) {
    const username = `admin_${desa}`;
    await prisma.user.upsert({
      where: { username },
      update: { password: hashedPassword },
      create: {
        username,
        name: `Admin ${desa.toUpperCase()}`,
        email: `${username}@bps.go.id`,
        password: hashedPassword,
        role: "admin",
      }
    });
    console.log(`Upserted ${username}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
