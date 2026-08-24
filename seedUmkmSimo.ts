import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';

const prisma = new PrismaClient();

async function main() {
  const workbook = xlsx.readFile('D:/Documents/Internship/BPS Sidoarjo/desa-cantik/Mikro Data UMKM Simoangin-angin 25-09-2024 09.44 (1).xlsx');
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  console.log('Total rows:', data.length);

  const formattedData = data.map((item: any) => {
    let rt = '0';
    let rw = '0';
    let dusun = '-';
    if (item.rt_rw_dusun) {
      const rtMatch = item.rt_rw_dusun.match(/RT\s+(\d+)/i);
      const rwMatch = item.rt_rw_dusun.match(/RW\s+(\d+)/i);
      const dusunMatch = item.rt_rw_dusun.match(/DUSUN\s+(.+)/i);
      if (rtMatch) rt = String(Number(rtMatch[1]));
      if (rwMatch) rw = String(Number(rwMatch[1]));
      if (dusunMatch) dusun = dusunMatch[1].trim();
    }

    // Parse KBLI
    let kbli = item.kategori_usaha ? item.kategori_usaha.replace('kbli_', '').toUpperCase() : '';
    
    // Skala Usaha
    let skala = item.skala_usaha || '';
    
    // Lokasi
    let lokasi = item.lokasi_tempat_usaha || '';

    return {
      nmdesa: 'Simoanginangin',
      nama: String(item.nama_usaha || '-'),
      rt: rt,
      rw: rw,
      dusun: dusun,
      jml_ruta: 1,
      jml_umkm: 1,
      jml_umkm_kbli_a: kbli === 'A' ? 1 : 0,
      jml_umkm_kbli_b: kbli === 'B' ? 1 : 0,
      jml_umkm_kbli_c: kbli === 'C' ? 1 : 0,
      jml_umkm_kbli_d: kbli === 'D' ? 1 : 0,
      jml_umkm_kbli_e: kbli === 'E' ? 1 : 0,
      jml_umkm_kbli_f: kbli === 'F' ? 1 : 0,
      jml_umkm_kbli_g: kbli === 'G' ? 1 : 0,
      jml_umkm_kbli_h: kbli === 'H' ? 1 : 0,
      jml_umkm_kbli_i: kbli === 'I' ? 1 : 0,
      jml_umkm_kbli_j: kbli === 'J' ? 1 : 0,
      jml_umkm_kbli_k: kbli === 'K' ? 1 : 0,
      jml_umkm_kbli_l: kbli === 'L' ? 1 : 0,
      jml_umkm_kbli_m: kbli === 'M' ? 1 : 0,
      jml_umkm_kbli_n: kbli === 'N' ? 1 : 0,
      jml_umkm_kbli_o: kbli === 'O' ? 1 : 0,
      jml_umkm_kbli_p: kbli === 'P' ? 1 : 0,
      jml_umkm_kbli_q: kbli === 'Q' ? 1 : 0,
      jml_umkm_kbli_r: kbli === 'R' ? 1 : 0,
      jml_umkm_kbli_s: kbli === 'S' ? 1 : 0,
      jml_umkm_kbli_t: kbli === 'T' ? 1 : 0,
      jml_umkm_kbli_u: kbli === 'U' ? 1 : 0,
      jml_umkm_skala_usaha_mikro: skala === 'usaha-mikro' ? 1 : 0,
      jml_umkm_skala_usaha_kecil: skala === 'usaha-kecil' ? 1 : 0,
      jml_umkm_skala_usaha_menengah: skala === 'usaha-menengah' ? 1 : 0,
      jml_umkm_lokasi_bangunan_khusus_usaha: lokasi === 'bangunan-khusus-usaha' ? 1 : 0,
      jml_umkm_lokasi_bangunan_campuran: lokasi === 'bangunan-campuran' ? 1 : 0,
      jml_umkm_lokasi_kaki_lima: lokasi === 'kaki-lima' ? 1 : 0,
      jml_umkm_lokasi_keliling: lokasi === 'keliling' ? 1 : 0,
      jml_umkm_lokasi_didalam_bangunan_tempat_tinggal_online: lokasi === 'di-dalam-bangunan-tempat-tinggal' || lokasi === 'online' ? 1 : 0,
    };
  });

  await prisma.umkm.deleteMany({ where: { nmdesa: 'Simoanginangin' } });
  await prisma.umkm.createMany({ data: formattedData });
  console.log('Seeded UMKM Simoanginangin with', formattedData.length, 'records.');
}

main().catch(console.error).finally(() => prisma.());
