import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin123", salt);
  
  await prisma.user.updateMany({
    data: {
      password: hashedPassword
    }
  });
  console.log("All passwords reset to admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
