import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.demografiDesa.count();
  const sample = await prisma.demografiDesa.findFirst();
  console.log("Count:", count);
  console.log("Sample:", sample);
}
main().finally(() => prisma.$disconnect());
