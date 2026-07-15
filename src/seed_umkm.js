const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const csv = require("csv-parser");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting to seed UMKM data...");

  const results = [];
  fs.createReadStream("../simoanginangin.xlsx - simoanginangin.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      let count = 0;
      for (const row of results) {
        try {
          await prisma.umkm.create({
            data: {
              kode: row.kode,
              nama: row.nama,
              rt: row.rt,
              rw: row.rw,
              dusun: row.dusun,
              jml_ruta: parseInt(row.jml_ruta) || 0,
              jml_umkm: parseInt(row.jml_umkm) || 0,
              jml_umkm_kbli_a: parseInt(row.jml_umkm_kbli_a) || 0,
              jml_umkm_kbli_b: parseInt(row.jml_umkm_kbli_b) || 0,
              jml_umkm_kbli_c: parseInt(row.jml_umkm_kbli_c) || 0,
              jml_umkm_kbli_d: parseInt(row.jml_umkm_kbli_d) || 0,
              jml_umkm_kbli_e: parseInt(row.jml_umkm_kbli_e) || 0,
              jml_umkm_kbli_f: parseInt(row.jml_umkm_kbli_f) || 0,
              jml_umkm_kbli_g: parseInt(row.jml_umkm_kbli_g) || 0,
              jml_umkm_kbli_h: parseInt(row.jml_umkm_kbli_h) || 0,
              jml_umkm_kbli_i: parseInt(row.jml_umkm_kbli_i) || 0,
              jml_umkm_kbli_j: parseInt(row.jml_umkm_kbli_j) || 0,
              jml_umkm_kbli_k: parseInt(row.jml_umkm_kbli_k) || 0,
              jml_umkm_kbli_l: parseInt(row.jml_umkm_kbli_l) || 0,
              jml_umkm_kbli_m: parseInt(row.jml_umkm_kbli_m) || 0,
              jml_umkm_kbli_n: parseInt(row.jml_umkm_kbli_n) || 0,
              jml_umkm_kbli_o: parseInt(row.jml_umkm_kbli_o) || 0,
              jml_umkm_kbli_p: parseInt(row.jml_umkm_kbli_p) || 0,
              jml_umkm_kbli_q: parseInt(row.jml_umkm_kbli_q) || 0,
              jml_umkm_kbli_r: parseInt(row.jml_umkm_kbli_r) || 0,
              jml_umkm_kbli_s: parseInt(row.jml_umkm_kbli_s) || 0,
              jml_umkm_kbli_t: parseInt(row.jml_umkm_kbli_t) || 0,
              jml_umkm_kbli_u: parseInt(row.jml_umkm_kbli_u) || 0,
              jml_umkm_lokasi_bangunan_khusus_usaha: parseInt(row.jml_umkm_lokasi_bangunan_khusus_usaha) || 0,
              jml_umkm_lokasi_bangunan_campuran: parseInt(row.jml_umkm_lokasi_bangunan_campuran) || 0,
              jml_umkm_lokasi_kaki_lima: parseInt(row.jml_umkm_lokasi_kaki_lima) || 0,
              jml_umkm_lokasi_keliling: parseInt(row.jml_umkm_lokasi_keliling) || 0,
              jml_umkm_lokasi_didalam_bangunan_tempat_tinggal_online: parseInt(row.jml_umkm_lokasi_didalam_bangunan_tempat_tinggal_online) || 0,
              jml_umkm_bentuk_pt_persero_sejenisnya: parseInt(row.jml_umkm_bentuk_pt_persero_sejenisnya) || 0,
              jml_umkm_bentuk_ijin_desa_ijin_lainnya: parseInt(row.jml_umkm_bentuk_ijin_desa_ijin_lainnya) || 0,
              jml_umkm_bentuk_tidak_berbadan_hukum: parseInt(row.jml_umkm_bentuk_tidak_berbadan_hukum) || 0,
              jml_umkm_skala_usaha_mikro: parseInt(row.jml_umkm_skala_usaha_mikro) || 0,
              jml_umkm_skala_usaha_kecil: parseInt(row.jml_umkm_skala_usaha_kecil) || 0,
              jml_umkm_skala_usaha_menengah: parseInt(row.jml_umkm_skala_usaha_menengah) || 0,
              nmdesa: "Simoanginangin"
            },
          });
          count++;
        } catch (e) {
          console.error("Error inserting row:", row.rt, e);
        }
      }
      console.log(`Successfully seeded ${count} UMKM rows.`);
      await prisma.$disconnect();
    });
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
