const fs = require('fs');
const path = require('path');

const geoJsonPath = path.join(__dirname, '../../../peta-tematik-frontend/public/geoJson/peta_desa_2026_1.geojson');
const outPath = path.join(__dirname, '../data/manualInsights.json');

console.log("Reading GeoJSON from:", geoJsonPath);

const geoJson = JSON.parse(fs.readFileSync(geoJsonPath, 'utf8'));

const uniqueDesa = new Set();
geoJson.features.forEach(f => {
  const nmdesa = f.properties.NMDESA || f.properties.nmdesa || f.properties.DESA || f.properties.desa;
  if (nmdesa) {
    uniqueDesa.add(nmdesa.trim().toUpperCase());
  }
});

console.log("Found", uniqueDesa.size, "unique villages.");

const templates = {
  umkm: [
    "Desa {desa} memiliki potensi UMKM yang berkembang pesat, terutama di sektor industri rumahan dan kuliner lokal.",
    "Banyak masyarakat Desa {desa} yang merintis usaha mikro di bidang kerajinan dan perdagangan barang-barang kebutuhan sehari-hari.",
    "Potensi perdagangan di Desa {desa} sangat menjanjikan dengan banyaknya pelaku UMKM yang mulai memanfaatkan pemasaran digital.",
    "Sektor UMKM di Desa {desa} didominasi oleh usaha makanan ringan dan produksi konveksi skala kecil.",
    "Terdapat potensi pengembangan pusat oleh-oleh lokal dan produk kreatif unggulan di Desa {desa}."
  ],
  pekerjaan: [
    "Sebagian besar penduduk Desa {desa} berprofesi sebagai tenaga kerja di sektor industri dan jasa.",
    "Mata pencaharian utama warga Desa {desa} bertumpu pada sektor pertanian, perdagangan, serta wirausaha mandiri.",
    "Desa {desa} memiliki tingkat partisipasi angkatan kerja yang baik, mayoritas terserap di perusahaan swasta sekitar wilayah.",
    "Banyak penduduk Desa {desa} yang bekerja sebagai pekerja harian lepas, pedagang, maupun pegawai instansi pemerintahan.",
    "Keberagaman profesi di Desa {desa} menciptakan ekosistem ekonomi yang stabil, ditopang oleh sektor perdagangan dan industri manufaktur."
  ],
  demografi: [
    "Desa {desa} memiliki struktur penduduk usia produktif yang sangat besar, memberikan keunggulan bonus demografi.",
    "Komposisi penduduk Desa {desa} menunjukkan rasio jenis kelamin yang seimbang dengan angka harapan hidup yang terus membaik.",
    "Pertumbuhan penduduk di Desa {desa} cukup dinamis karena letaknya yang strategis sebagai area permukiman pekerja.",
    "Desa {desa} didominasi oleh keluarga muda, sehingga program-program terkait kesejahteraan ibu dan anak sangat potensial.",
    "Tingkat kepadatan penduduk di Desa {desa} tergolong tinggi, seiring dengan masifnya pembangunan perumahan baru."
  ]
};

const getRandomTemplate = (arr, desaName) => {
  const index = Math.floor(Math.random() * arr.length);
  const titleCaseDesa = desaName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  return arr[index].replace(/{desa}/g, titleCaseDesa);
};

const insights = [];
let idCounter = 1;
const templatesGeneral = [
  "Desa {desa} merupakan salah satu desa yang memiliki potensi besar dalam pengembangan UMKM lokal dan pertanian produktif.",
  "Keunggulan utama Desa {desa} terletak pada kekompakan warganya dalam memajukan sektor ekonomi kreatif dan perdagangan skala mikro.",
  "Masyarakat Desa {desa} dikenal aktif dalam berbagai kegiatan produktif, mulai dari industri rumahan hingga perdagangan jasa.",
  "Secara demografis dan ekonomi, Desa {desa} memiliki prospek pengembangan kawasan yang menjanjikan sebagai penyangga wilayah Sidoarjo.",
  "Desa {desa} terus menunjukkan perkembangan yang signifikan di sektor infrastruktur desa dan partisipasi warga dalam perekonomian lokal."
];

uniqueDesa.forEach(desa => {
  insights.push({
    id: String(idCounter++),
    desa_name: desa.toUpperCase(),
    contextType: "general",
    insightText: getRandomTemplate(templatesGeneral, desa)
  });
});

fs.writeFileSync(outPath, JSON.stringify(insights, null, 2), 'utf8');
console.log("Successfully generated", insights.length, "dummy insights for all villages in", outPath);
