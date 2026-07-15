import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

function cleanNumber(str: string): number {
  if (!str) return 0;
  // Remove quotes, spaces, and dots (used as thousand separator in this dataset)
  return parseInt(str.replace(/["\s.]/g, ""), 10) || 0;
}

function cleanString(str: string): string {
  if (!str) return "";
  return str.replace(/["\s]/g, "").trim();
}

async function main() {
  const csvPath = path.resolve(__dirname, "../../Data Penduduk 2024 - JK.csv");
  const jsonOutPath = path.resolve(__dirname, "../../peta-tematik-frontend/public/data/penduduk.json");
  
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at: ${csvPath}`);
    return;
  }

  const fileContent = fs.readFileSync(csvPath, "utf-8");
  const lines = fileContent.split(/\r?\n/);
  
  const results = [];
  const jsonOutput: Record<string, any> = {};

  // Skip the first 3 lines (Title, empty, Headers)
  for (let i = 3; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split by comma outside of quotes
    const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    
    if (columns.length < 12) continue;

    const idkec = cleanString(columns[0]);
    const kecamatan = columns[1].trim();
    const kode_desa = cleanString(columns[2]);
    const iddesa = cleanString(columns[3]);
    const nmdesa = columns[4].trim();
    
    const L = cleanNumber(columns[5]);
    const P = cleanNumber(columns[6]);
    const total_penduduk = cleanNumber(columns[7]);
    
    // RJK retains quotes and comma, let's just strip quotes
    const rjk = columns[8].replace(/"/g, "").trim();
    
    const kk_l = cleanNumber(columns[9]);
    const kk_p = cleanNumber(columns[10]);
    const total_kk = cleanNumber(columns[11]);

    if (!iddesa) continue;

    // Build Prisma object
    results.push({
      idkec,
      kecamatan,
      kode_desa,
      iddesa,
      nmdesa,
      L,
      P,
      total_penduduk,
      rjk,
      kk_l,
      kk_p,
      total_kk
    });

    // Build JSON object for frontend
    jsonOutput[iddesa] = {
      Kecamatan: kecamatan,
      nmdesa,
      L,
      P,
      total_penduduk,
      KK_L: kk_l,
      KK_P: kk_p,
      total_kk
    };
  }

  console.log(`Parsed ${results.length} records from CSV.`);

  // 1. Clear existing demografi data and insert new
  console.log("Clearing DemografiDesa table...");
  await prisma.demografiDesa.deleteMany();

  console.log("Inserting into DemografiDesa...");
  // Use createMany for bulk insert (if supported) or individual creates
  try {
    await prisma.demografiDesa.createMany({
      data: results,
      skipDuplicates: true,
    });
    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error using createMany, falling back to sequential inserts", error);
    for (const record of results) {
      await prisma.demografiDesa.upsert({
        where: { iddesa: record.iddesa },
        update: record,
        create: record
      });
    }
  }

  // 2. Write JSON for frontend
  fs.writeFileSync(jsonOutPath, JSON.stringify(jsonOutput, null, 2), "utf-8");
  console.log(`Frontend JSON generated at: ${jsonOutPath}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
