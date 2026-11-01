/* Chatbot Portofolio Muhammad Thufeil Putrayama
   Dilengkapi Knowledge Engine cerdas multi-tier berbasis data portofolio asli.
   Dapat menjawab seluruh pertanyaan pengunjung seputar profil, skripsi RAG, UI/UX Figma,
   aplikasi web fullstack, poster AI, video dokumenter, sertifikasi BNSP, IPK, lokasi kerja,
   keunggulan kandidat, jasa freelance, hingga kontak & CV. */
(function(){
var CHAT_API_URL = ''; // Opsional: URL API endpoint backend jika ada
var AVATAR = './assets/avatar_hero.jpg';

var PROMPTS = [
  ['Karya Terbaik', 'Apa saja karya dan proyek terbaik Thufeil?'],
  ['Skripsi RAG AI', 'Bagaimana sistem chatbot skripsi Thufeil dan berapa akurasinya?'],
  ['Sistem HIMPAUDI', 'Ceritakan proyek HIMPAUDI dan arsitektur desain Figmanya'],
  ['Poster Esports AI', 'Bagaimana proses pembuatan poster PUBG Mobile PMDC?'],
  ['Pendidikan & IPK', 'Bagaimana riwayat pendidikan dan IPK Thufeil?'],
  ['Kontak & Rekrut', 'Bagaimana cara menghubungi atau merekrut Thufeil?']
];

window.PortfolioChat = { handler: null };
var hist = [], busy = false, tipShown = false, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== KAMUS NORMALISASI BAHASA INDONESIA & SLANG =====
var SLANG_MAP = {
  'porto': 'portofolio',
  'portonya': 'portofolio',
  'projek': 'proyek',
  'project': 'proyek',
  'projectnya': 'proyek',
  'projeknya': 'proyek',
  'karyanya': 'karya',
  'kampus': 'gunadarma kuliah universitas',
  'kampusnya': 'gunadarma kuliah universitas',
  'univ': 'universitas gunadarma',
  'kuliahnya': 'kuliah universitas gunadarma',
  'skripsinya': 'skripsi rag',
  'ta': 'skripsi tugas akhir',
  'tugas akhir': 'skripsi tugas akhir',
  'dmn': 'dimana',
  'dmana': 'dimana',
  'dimanakah': 'dimana',
  'gmn': 'bagaimana',
  'gmana': 'bagaimana',
  'bgmn': 'bagaimana',
  'knp': 'kenapa',
  'mengapa': 'kenapa',
  'brp': 'berapa',
  'brapakah': 'berapa',
  'bgt': 'banget',
  'beneran': 'benar',
  'ngoding': 'koding pemrograman programming',
  'koding': 'pemrograman programming',
  'coding': 'pemrograman programming',
  'bikin': 'buat membuat merancang rancang',
  'bikinin': 'buat membuat',
  'joki': 'jasa pembuatan proyek freelance',
  'hire': 'rekrut kerja rekrutmen lowongan',
  'hiring': 'rekrut kerja rekrutmen lowongan',
  'rekrutnya': 'rekrut kerja kontak',
  'wa': 'whatsapp',
  'no': 'nomor',
  'nomornya': 'nomor whatsapp kontak',
  'cp': 'kontak whatsapp email',
  'sosmed': 'instagram linkedin github sosial media',
  'ig': 'instagram',
  'resume': 'cv curriculum vitae unduh berkas',
  'download': 'unduh',
  'unduh': 'unduh cv',
  'lulusan': 'lulus pendidikan gelar sarjana',
  'lulus': 'kelulusan pendidikan sarjana',
  'gpa': 'ipk nilai',
  'ipknya': 'ipk nilai',
  'nilainya': 'nilai ipk',
  'orang mana': 'domisili lokasi tinggal bekasi',
  'anak mana': 'domisili lokasi tinggal bekasi',
  'asal': 'domisili lokasi tinggal bekasi',
  'aslinya': 'domisili lokasi tinggal bekasi',
  'wfh': 'remote kerja jarak jauh lokasi',
  'onsite': 'on site kerja kantor lokasi jabodetabek',
  'fulltime': 'penuh waktu kerja lowongan rekrut',
  'parttime': 'paruh waktu freelance kerja',
  'kelebihannya': 'kelebihan keunggulan kemampuan alasan rekrut',
  'keunggulannya': 'keunggulan kelebihan alasan rekrut',
  'kekurangan': 'evaluasi pengembangan keahlian',
  'bisa apa': 'keahlian kemampuan skill tech stack bisa apa saja',
  'bisa apa aja': 'keahlian kemampuan skill tech stack bisa apa saja'
};

var STOP_WORDS = {
  'yang': 1, 'di': 1, 'ke': 1, 'dari': 1, 'dan': 1, 'ini': 1, 'itu': 1, 'ada': 1,
  'lah': 1, 'pun': 1, 'dong': 1, 'deh': 1, 'sih': 1, 'gitu': 1, 'kan': 1, 'kok': 1,
  'nih': 1, 'ya': 1, 'tuh': 1, 'kek': 1, 'pada': 1, 'untuk': 1, 'dengan': 1, 'atau': 1,
  'adalah': 1, 'yaitu': 1, 'yakni': 1, 'secara': 1, 'buat': 1, 'tentang': 1
};

function normalizeQuery(raw) {
  var s = (raw || '').toLowerCase().replace(/[^a-z0-9\s\+\#\.\/]/g, ' ');
  var words = s.split(/\s+/).filter(Boolean);
  var expanded = [];
  words.forEach(function(w) {
    if (SLANG_MAP[w]) {
      expanded.push(SLANG_MAP[w]);
    } else {
      expanded.push(w);
      // Buang imbuhan umum bahasa Indonesia (sufiks -nya, -an, -kan, -in, -kah, -lah)
      var root = w.replace(/(nya|kan|an|in|kah|lah|ku|mu)$/, '');
      if (root.length >= 3 && root !== w) {
        if (SLANG_MAP[root]) expanded.push(SLANG_MAP[root]);
        else expanded.push(root);
      }
    }
  });
  return expanded.join(' ');
}

// ===== KNOWLEDGE ENGINE PORTOFOLIO LENGKAP (26 DOMAIN) =====
var KB = [
  // 1. GREETING & CASUAL
  {
    id: 'GREETING',
    patterns: [
      /^(halo|hai|hi|hey|hello|assalamu['a]?laikum|pagi|siang|sore|malam|selamat pagi|selamat siang|selamat sore|selamat malam|p\b|spada|permisi|woi|bro|gan|kak|min)\b/i,
      /^(tes|test|testing)(\s+123)?$/i
    ],
    keywords: ['halo', 'hai', 'hello', 'assalamualaikum', 'salam', 'pagi', 'siang', 'sore', 'malam', 'permisi'],
    reply: function() {
      return 'Halo! Senang menyapa Anda. Saya asisten AI resmi portofolio Muhammad Thufeil Putrayama.\n\nSaya dapat menjawab pertanyaan apa pun mengenai Thufeil, di antaranya:\n• Skripsi AI RAG BAAK Gunadarma (Akurasi 86,67% & BM25 + ChromaDB)\n• Proyek UI/UX HIMPAUDI Bekasi Timur (55 frame Figma & SDD 92 Halaman)\n• Aplikasi Fullstack BrandedYM (Laravel 11 & PHP 8.4)\n• Bstation & Bilibili Views Booster (Telemetry Desktop C# & APK Android)\n• Poster Esports PUBG Mobile PMDC (Directed Generative AI Pipeline)\n• Channel YouTube GeoLogika & Lemminoid (Motion Video & Remotion 2D)\n• Riwayat Pendidikan (IPK 3,72) & Sertifikasi BNSP Junior Web Programmer\n• Lokasi kerja (Domisili Bekasi, siap Remote / On-site Jabodetabek) & Kontak\n\nApa yang ingin Anda ketahui lebih lanjut?';
    }
  },

  // 2. THANKS & COMPLIMENTS
  {
    id: 'THANKS',
    patterns: [
      /^(terima kasih|makasih|thanks|thank you|keren|mantap|hebat|top|jos|sip|oke|ok|nice|good job|wah|gokil)\b/i,
      /(terima kasih banyak|makasih banyak|keren banget|mantap banget)/i
    ],
    keywords: ['makasih', 'terima kasih', 'thanks', 'thank you', 'keren', 'mantap', 'hebat', 'top', 'bagus'],
    reply: function() {
      return 'Sama-sama! Senang bisa membantu Anda mengeksplorasi portofolio Thufeil. Jika ada rincian teknis, dokumen pendukung, atau proyek lain yang ingin Anda ketahui, tanyakan saja langsung kepada saya!';
    }
  },

  // 3. ABOUT THUFEIL (PROFIL & BIOGRAFI)
  {
    id: 'ABOUT_THUFEIL',
    patterns: [
      /(siapa (itu )?thufeil|tentang thufeil|profil thufeil|biografi|latar belakang thufeil|siapakah thufeil|kenalan|ceritakan tentang thufeil|biodata)/i
    ],
    keywords: ['siapa', 'thufeil', 'profil', 'tentang', 'biodata', 'biografi', 'background', 'orangnya', 'sosok'],
    reply: function() {
      return 'Muhammad Thufeil Putrayama adalah Sarjana (S1) Sistem Informasi lulusan Fakultas Ilmu Komputer dan Teknologi Informasi (FIKTI), Universitas Gunadarma (lulus 2026 dengan IPK 3,72 dan Skripsi bernilai A).\n\nKeahlian dan fokus utamanya terbagi menjadi 4 pilar:\n1. AI Engineering & RAG: Membangun sistem Retrieval-Augmented Generation cerdas, arsitektur hybrid retrieval (BM25 + ChromaDB Dense Vector), prompt guardrail, dan integrasi multi-LLM (LLaMA 3.3 70B & Gemini Flash API).\n2. Fullstack Web & Software Development: Pengalaman menggunakan Python (FastAPI), PHP 8.4 (Laravel 11), Node.js, C# .NET, dan Java Android Native.\n3. UI/UX Design & Design System: Perancangan master UI komprehensif di Figma (hingga 55 frame terstruktur), penyusunan Software Design Document (SDD 92 halaman), dan validasi pengujian pengguna (Design Thinking & Maze).\n4. Creative Digital & AI Media: Desain poster esports berstandar liga resmi melalui Directed Generative AI, serta produksi video edukasi YouTube dengan tipografi kinetik dan animasi kode Remotion 2D.\n\nThufeil berdomisili di Babelan, Bekasi, dan siap bekerja On-site di wilayah Jabodetabek maupun Remote (WFH).';
    }
  },

  // 4. DAFTAR SEMUA KARYA & REKOMENDASI TERBAIK
  {
    id: 'PORTFOLIO_OVERVIEW',
    patterns: [
      /(portofolio|portonya|karya terbaik|proyek (unggulan|terbaik|favorit)|apa saja karya|daftar karya|rekomendasi (karya|proyek)|proyek apa saja|projek apa saja|karyanya apa aja)/i
    ],
    keywords: ['portofolio', 'porto', 'karya', 'terbaik', 'unggulan', 'favorit', 'rekomendasi', 'proyek', 'daftar', 'highlight'],
    reply: function() {
      return 'Berikut adalah 6 karya dan proyek utama dalam portofolio Muhammad Thufeil Putrayama:\n\n1. Chatbot RAG BAAK Gunadarma (Skripsi S1, Nilai A):\n   Sistem tanya jawab regulasi kampus dengan akurasi 86,67% dan 90% bebas halusinasi berbasis Hybrid Search (BM25 + ChromaDB) dan FastAPI.\n\n2. Portal Sistem Informasi HIMPAUDI Bekasi Timur (4 SKS):\n   Rancangan 55 frame master antarmuka di Figma untuk 3 hak akses pengguna, integrasi KTA digital ber-QR Code, dan dokumen SDD 92 halaman.\n\n3. BrandedYM — Inventaris Toko Pakaian (Laravel 11 & PHP 8.4):\n   Aplikasi web inventaris lengkap dengan visualisasi Chart.js mutasi 6 bulan, auto safety stock alert, dan ekspor laporan PDF/Excel.\n\n4. Bstation & Bilibili Views Booster (Telemetry Protocol Engine):\n   Aplikasi multi-platform (Desktop C#, server Node.js, dan APK Android Java) untuk riset simulasi jabat tangan telemetri streaming OTT.\n\n5. Poster Esports PUBG Mobile PMDC Season 2:\n   Dua poster resmi kompetisi (Alter Ego Ares 144 Pts & BOOM Esports FMVP) yang dirancang dengan metode Directed Generative AI Pipeline.\n\n6. Channel YouTube GeoLogika & Lemminoid:\n   Channel video dokumenter sains geologi (@GeoLogikaOfficial) dan investigasi geopolitik berbasis Remotion 2D code-driven (@Lemminoid).';
    }
  },

  // 5. SKRIPSI BAAK: IKHTISAR & JUDUL
  {
    id: 'SKRIPSI_OVERVIEW',
    patterns: [
      /(judul skripsi|skripsi tentang apa|skripsinya bahas apa|skripsi thufeil|tugas akhir|penelitian skripsi|skripsi s1)/i
    ],
    keywords: ['judul', 'skripsi', 'tugas akhir', 'ta', 'penelitian', 'baak', 'akademik'],
    reply: function() {
      return 'Judul Skripsi S1 Thufeil di Universitas Gunadarma adalah:\n"Sistem Tanya-Jawab Akademik Cerdas BAAK Menggunakan Retrieval-Augmented Generation (RAG)" (Tahun 2026, Meraih Nilai A).\n\nLatar Belakang & Masalah yang Diselesaikan:\nMahasiswa sering kesulitan menemukan regulasi perkuliahan yang tersebar di ratusan dokumen PDF panduan kampus. Sistem ini memungkinkan mahasiswa bertanya menggunakan bahasa alami santai, lalu mesin AI akan menelusuri 153 dokumen rujukan resmi BAAK secara instan dan menjawabnya lengkap dengan badge sitasi dokumen sumber.';
    }
  },

  // 6. SKRIPSI BAAK: METRIK KUANTITATIF & AKURASI
  {
    id: 'SKRIPSI_METRICS',
    patterns: [
      /(berapa akurasi|akurasi skripsi|metrik skripsi|bebas halusinasi|waktu respons|kecepatan jawab|ablation study|hasil pengujian skripsi|hit rate|mrr)/i
    ],
    keywords: ['akurasi', 'halusinasi', 'metrik', 'waktu', 'respons', 'latency', 'ablation', 'hit rate', 'mrr', 'pengujian', 'skenario'],
    reply: function() {
      return 'Hasil pengujian kuantitatif skripsi RAG BAAK Thufeil (diuji pada 30 skenario pertanyaan akademik resmi):\n\n• Akurasi Jawaban: 86,67% (Valid sesuai dokumen regulasi kampus)\n• Tingkat Bebas Halusinasi: 90,00% (Mampu menolak pertanyaan di luar konteks secara sopan)\n• Rata-rata Waktu Respons: 4,81 detik\n• Retrieval Latency: 175 milidetik\n• Hit Rate@5 Hybrid Search: 76,7% (meningkat +13,4 poin persentase dibanding vector search murni)\n• Mean Reciprocal Rank (MRR): 0,644 (tertinggi di antara seluruh skenario pengujian ablation study).';
    }
  },

  // 7. SKRIPSI BAAK: ARSITEKTUR TEKNIS (RAG, BM25, CHROMA, FASTAPI)
  {
    id: 'SKRIPSI_TECH',
    patterns: [
      /(arsitektur rag|apa itu rag|kenapa hybrid|bm25|chromadb|dense vector|multilingual-e5|groq|llama 3\.3|gemini api|query transformation|fastapi|incremental indexing|153 dokumen)/i
    ],
    keywords: ['rag', 'hybrid', 'bm25', 'chromadb', 'e5', 'groq', 'llama', 'gemini', 'fastapi', 'indexing', 'jwt', 'bcrypt', 'rotasi'],
    reply: function() {
      return 'Arsitektur teknis Chatbot RAG BAAK yang dibangun Thufeil:\n\n1. Hybrid Search Engine:\n   Menggabungkan Sparse Search (BM25 Okapi untuk pencocokan kata kunci eksak seperti nama dosen atau kode kelas) dan Dense Vector Search (ChromaDB + multilingual-e5-base untuk pemahaman semantik) menggunakan Reciprocal Rank Fusion (RRF).\n\n2. Query Transformation Otomatis:\n   Sebelum retrieval, pertanyaan informal mahasiswa ditransformasikan oleh LLM menjadi query formal terstruktur untuk meningkatkan relevansi dokumen rujukan.\n\n3. Multi-LLM & Key Rotation Resilience:\n   Engine utama menggunakan Groq API (LLaMA 3.3 70B Versatile) dengan sistem failover otomatis ke Google Gemini Flash API yang dilengkapi rotasi dinamis 3 API Key.\n\n4. Panel Admin & Incremental Indexing:\n   Dilengkapi antarmuka dashboard admin untuk mengelola 153 dokumen BAAK dengan sinkronisasi inkremental berbasis MD5 hash tanpa perlu rebuild total basis data vektor.\n\n5. Keamanan:\n   Dilindungi stateless JWT (HS256) dengan in-memory blacklist, enkripsi Bcrypt (12 rounds), 2FA OTP, dan SlowAPI Rate Limiting.';
    }
  },

  // 8. PROYEK HIMPAUDI: IKHTISAR & KELOMPOK MIRACLE
  {
    id: 'HIMPAUDI_OVERVIEW',
    patterns: [
      /(proyek himpaudi|apa itu himpaudi|kelompok miracle|miracle himpaudi|4 sks|pengelolaan proyek si)/i
    ],
    keywords: ['himpaudi', 'paud', 'miracle', '4 sks', 'pengelolaan proyek', 'guru paud', 'bekasi timur'],
    reply: function() {
      return 'Proyek Sistem Informasi HIMPAUDI Cabang Bekasi Timur adalah proyek mata kuliah Pengelolaan Proyek Sistem Informasi (bobot 4 SKS) di Universitas Gunadarma.\n\nProyek ini dikembangkan oleh Kelompok MIRACLE, di mana Muhammad Thufeil Putrayama bertindak sebagai Lead UI/UX Designer. Sistem ini mendigitalisasi tata kelola organisasi guru PAUD se-Kecamatan Bekasi Timur yang menaungi 48 lembaga PAUD dan lebih dari 126 tenaga pendidik ber-KTA.';
    }
  },

  // 9. PROYEK HIMPAUDI: FIGMA & SDD 92 HALAMAN
  {
    id: 'HIMPAUDI_FIGMA_SDD',
    patterns: [
      /(figma himpaudi|55 frame|layar figma himpaudi|sdd himpaudi|software design document|92 halaman|arsitektur figma himpaudi|link figma himpaudi)/i
    ],
    keywords: ['55 frame', 'sdd', '92 halaman', 'desain himpaudi', 'link figma', 'frame figma', 'autolayout'],
    reply: function() {
      return 'Detail perancangan desain dan dokumentasi teknis HIMPAUDI oleh Thufeil:\n\n• 55 Frame Master di Figma: Merancang 55 layar high-fidelity terstruktur yang memisahkan 3 hak akses pengguna (Portal Publik, Portal Guru PAUD, dan Panel Admin Pengurus) lengkap dengan komponen autolayout, palet warna ramah anak, dan navigasi responsif.\n• Dokumen SDD 92 Halaman: Menyusun Software Design Document (SDD) teknis setebal 92 halaman yang mendokumentasikan diagram use case, diagram aktivitas, sekuens interaksi, dan skema relasi basis data.\n• Tautan Prototipe Asli: File desain Figma dapat langsung dibuka lewat link: https://www.figma.com/design/ThaprloZv785qm5cA30DSQ/HiMPAUDI--MIRACLE-?node-id=7044-630';
    }
  },

  // 10. PROYEK HIMPAUDI: KTA DIGITAL & FITUR UNGGULAN
  {
    id: 'HIMPAUDI_FEATURES',
    patterns: [
      /(kta digital|qr code himpaudi|fitur himpaudi|presensi qr|diklat himpaudi|live chat himpaudi|direktori paud)/i
    ],
    keywords: ['kta', 'qr code', 'fitur', 'presensi', 'scanner', 'diklat', 'seminar', 'live chat', 'direktori'],
    reply: function() {
      return 'Fitur-fitur unggulan sistem HIMPAUDI yang dirancang oleh Thufeil:\n\n1. KTA Digital & QR Code Validator: Kartu Tanda Anggota digital dengan kode QR unik untuk membuktikan keabsahan pendidik PAUD resmi dan absensi kehadiran seminar/diklat secara instan lewat kamera admin.\n2. Manajemen Diklat & E-Ticket: Pendaftaran pelatihan kurikulum mandiri dengan kuota otomatis dan penerbitan tiket elektronik.\n3. Direktori Lembaga PAUD: Pencarian sekolah PAUD se-Kecamatan Bekasi Timur lengkap dengan status akreditasi, kontak, dan integrasi peta lokasi.\n4. Live Chat Konsultasi Pendidik: Kanal konsultasi dua arah antara guru PAUD dengan pengurus cabang seputar kendala kurikulum dan NUPTK.';
    }
  },

  // 11. BRANDEDYM: IKHTISAR SISTEM
  {
    id: 'BRANDEDYM_OVERVIEW',
    patterns: [
      /(brandedym|apa itu brandedym|toko pakaian|inventaris pakaian|sistem persediaan)/i
    ],
    keywords: ['brandedym', 'toko pakaian', 'persediaan', 'inventaris', 'pakaian', 'baju'],
    reply: function() {
      return 'BrandedYM adalah aplikasi web fullstack sistem informasi manajemen persediaan toko pakaian berbasis Laravel 11 dan PHP 8.4.\n\nSistem ini dirancang untuk mendigitalkan pencatatan keluar-masuk stok baju, mencegah kehabisan barang di toko fisik, dan menyediakan laporan mutasi barang siap cetak secara transparan antara staf gudang dan pimpinan.';
    }
  },

  // 12. BRANDEDYM: FITUR TEKNIS (LARAVEL, SAFETY STOCK, PDF/EXCEL)
  {
    id: 'BRANDEDYM_TECH',
    patterns: [
      /(laravel 11|php 8\.4|safety stock|peringatan stok|fitur brandedym|cetak pdf|ekspor excel|dompdf|fastexcel|chartjs brandedym)/i
    ],
    keywords: ['laravel', 'php', 'safety stock', 'stok habis', 'pdf', 'excel', 'cetak', 'mutasi', 'chart.js', 'role'],
    reply: function() {
      return 'Fitur & arsitektur teknis aplikasi BrandedYM:\n\n• Tech Stack: Laravel 11, PHP 8.4, MySQL, Blade Engine, Bootstrap 5 Dark Glassmorphism, dan Chart.js.\n• Dashboard Analitik KPI: Grafik tren arus mutasi barang masuk (dari supplier) dan keluar (penjualan) selama 6 bulan terakhir secara real-time.\n• Peringatan Otomatis Safety Stock: Sistem memberikan notifikasi visual jika jumlah stok fisik suatu pakaian telah mencapai batas minimum aman.\n• Ekspor Laporan Siap Cetak: Generator dokumen PDF resmi berkop toko (DomPDF) dan spreadsheet Excel (FastExcel) dengan filter rentang tanggal transaksi.\n• Multi-Role Access Control: Pemisahan peran Administrator (kendali penuh data master) dan Pimpinan/Staff (akses baca laporan tanpa izin menghapus data).';
    }
  },

  // 13. BSTATION BOOSTER: IKHTISAR & TELEMETRI
  {
    id: 'BSTATION_BOOSTER',
    patterns: [
      /(bstation|bilibili|views booster|telemetri|telemetry|streaming ott|aplikasi bstation|apk bstation|c# bstation)/i
    ],
    keywords: ['bstation', 'bilibili', 'booster', 'views', 'telemetri', 'telemetry', 'ott', 'c#', 'apk', 'android'],
    reply: function() {
      return 'Bstation & Bilibili Views Booster (Telemetry Protocol Engine) adalah proyek riset rekayasa protokol jaringan streaming video OTT multi-platform (PC Desktop, Node.js, dan Android APK):\n\n• Arsitektur 3 Platform:\n  1. Desktop Launcher (C# .NET): Aplikasi mandiri Windows untuk kalibrasi target video dan interval delay.\n  2. Backend Engine (Node.js): Menjalankan simulasi jabat tangan (handshake) telemetri asinkron multi-tahap yang meniru mesin status pemutar video resmi.\n  3. Mobile Client (Android APK): Aplikasi smartphone native berbasis Java Android API 34.\n• Unique Device Fingerprinting: Menghasilkan token identitas dan UUID dinamis perangkat Android pada setiap sesi agar tidak ditandai sebagai lalu lintas bot anomali.\n• Anti-Rate Limit: Jeda acak (configurable jitter 5–600 detik) untuk menjaga pola telemetri tetap organik.\n• Cyberpunk Glassmorphic Dashboard: Dilengkapi 4 gauge melingkar untuk memantau views, rasio sukses, dan timer countdown.';
    }
  },

  // 14. POSTER ESPORTS PMDC: IKHTISAR
  {
    id: 'POSTER_PMDC_OVERVIEW',
    patterns: [
      /(poster pubg|poster pmdc|pmdc season 2|alter ego ares|144 poin|boom esports fmvp|desain poster|karya poster|spidiron)/i
    ],
    keywords: ['poster', 'pmdc', 'pubg', 'ares', 'boom', 'fmvp', 'esports', '144', 'spidiron'],
    reply: function() {
      return 'Karya poster esports dalam portofolio Thufeil adalah bagian dari kompetisi resmi PUBG Mobile Design Challenge (PMDC) Season 2 untuk 2026 PMPL ID Spring yang diunggah di Instagram @spidiron:\n\n1. Alter Ego Ares ("Super Team Back in Action"): Merayakan rekor 144 poin di Super Brief Week 3 dengan aksi ground smash berapi, suar airdrop merah, buggy tempur, dan trofi Golden Helmet PUBG Mobile.\n2. BOOM Esports ("Final MVP"): Poster perayaan gelar pemain terbaik turnamen dengan atmosfer rim-light hutan malam, supercar eksotis, dan grading warna ungu-emas.\n\nKarya-karya ini dapat dilihat langsung di akun Instagram resmi: https://www.instagram.com/spidiron/';
    }
  },

  // 15. POSTER ESPORTS: ALUR DIRECTED GENERATIVE AI PIPELINE
  {
    id: 'POSTER_AI_PIPELINE',
    patterns: [
      /(apakah poster(nya)? (full |secara )?ai|cara buat poster|bagaimana bikin poster|proses pembuatan poster|ai pose transfer|image-to-image|apakah full ai|apakah cuma prompt)/i
    ],
    keywords: ['full ai', 'cara buat', 'bikin poster', 'proses', 'pose transfer', 'image to image', 'staging', 'directed generative ai'],
    reply: function() {
      return 'Bagaimana proses pembuatan poster PUBG Mobile-nya? Apakah full AI dari nol?\n\nJawabannya: BUKAN dibuat dengan mengetik prompt teks otomatis dari nol, melainkan menggunakan alur kerja "Directed Generative AI Pipeline" yang terarah secara teknis:\n\n1. AI Pose Transfer & Manipulation:\nMengambil foto asli para atlet esports, lalu merekayasa pose tubuhnya menggunakan AI agar memiliki gestur aksi laga yang dramatis (seperti pose hero center "ground smash" berapi).\n\n2. Multi-Subject Composition & Staging:\nMenata posisi, proporsi, skala, dan hierarki visual antar-pemain di atas kanvas secara presisi sesuai visi komposisi poster.\n\n3. Generative Image-to-Image Blending:\nMemasukkan kembali susunan subjek ke dalam model generatif AI untuk menyatukan pencahayaan medan tempur (rim-light ungu, kobaran api kendaraan, asap merah suar) secara organis tanpa garis potong manual yang kaku.\n\n4. Tipografi Statistik & Branding Esports:\nTahap akhir penataan tipografi statistik pertandingan (144 points, damage, elims) dan logo resmi liga esports.';
    }
  },

  // 16. YOUTUBE DOKUMENTER: GEOLOGIKA
  {
    id: 'YOUTUBE_GEOLOGIKA',
    patterns: [
      /(geologika|selat bali|air gunung|kalimantan tanpa gunung|channel geologika|youtube geologika|video geologika)/i
    ],
    keywords: ['geologika', 'selat bali', 'air gunung', 'kalimantan', 'geologi', 'sains', 'tektonik'],
    reply: function() {
      return 'GeoLogika (@GeoLogikaOfficial) adalah channel YouTube dokumenter sains dan geologi kebumian Nusantara yang diproduksi Thufeil dengan alur kerja otomatisasi AI agent:\n\n• Alur Produksi: Riset literatur ilmiah geologi, perumusan struktur naskah 8-bab ilmiah berbobot, sinkronisasi audio Faster-Whisper zero-gap, teks kinetik ber-highlight kuning dinamis, dan desain suara akustik organik.\n• Episode Unggulan:\n  1. "Kenapa Tidak Ada Jembatan dari Jawa ke Bali? Jaraknya Cuma 2,4 KM?!" (Membahas tektonik lempeng busur Sunda, palung Selat Bali, dan kearifan lokal sosio-kultural).\n  2. "Mengalir Jutaan Liter Setiap Hari, Kenapa Air di Puncak Gunung Tidak Pernah Habis?" (Membahas siklus hidrogeologi akuifer vulkanik).\n  3. "Ternyata Ini Alasan Kalimantan Tidak Memiliki Gunung Berapi Aktif!" (Eksplorasi tektonik mikrokontinen Sundaland).\n\nTautan Channel: https://www.youtube.com/@GeoLogikaOfficial';
    }
  },

  // 17. YOUTUBE DOKUMENTER: LEMMINOID
  {
    id: 'YOUTUBE_LEMMINOID',
    patterns: [
      /(lemminoid|nikel|truk sampah|remotion 2d|animasi berbasis kode|channel lemminoid|youtube lemminoid)/i
    ],
    keywords: ['lemminoid', 'nikel', 'sampah', 'remotion', 'kode', 'osint', 'investigatif', 'lower third'],
    reply: function() {
      return 'Lemminoid (@Lemminoid) adalah channel YouTube dokumenter investigatif mendalam yang memadukan footage arsip nyata dengan animasi 2D berbasis kode deterministik (React & Remotion):\n\n• Standar Kualitas: Menerapkan standar broadcast lower-third resmi, visualisasi peta geospasial presisi, serta catatan kaki asal-usul data (provenance footnote).\n• Episode Unggulan:\n  1. "Nikel Indonesia Dikeruk Terus!! 13 Tahun Lagi Habis?!" (Investigasi cadangan nikel saprolit Indonesia dan disrupsi baterai LFP mobil listrik).\n  2. "Setelah Diangkut Truk, Ini Yang Sebenarnya Terjadi" (Penelusuran rantai limbah perkotaan dan realitas daur ulang plastik).\n\nTautan Channel: https://www.youtube.com/@Lemminoid';
    }
  },

  // 18. PROYEK KAS RT 02 (PENULISAN ILMIAH)
  {
    id: 'RT02_KAS',
    patterns: [
      /(rt 02|rt02|iuran kas|iuran warga|kas rt|maze rt|design thinking rt|penulisan ilmiah)/i
    ],
    keywords: ['rt02', 'rt 02', 'kas rt', 'iuran', 'warga', 'maze', 'design thinking', 'qris rt'],
    reply: function() {
      return 'Proyek Platform Iuran dan Kas RT 02 adalah karya Penulisan Ilmiah perancangan UI/UX tata kelola keuangan lingkungan warga di Figma (FILE ASLI - 2):\n\n• Metode: Menggunakan 5 tahap Design Thinking (Empathize, Define, Ideate, Prototype, Test).\n• Arsitektur 2 Peran: Dashboard Warga (bayar via QRIS instan / Transfer Bank Mandiri, cek alokasi dana RT, dan riwayat transaksi) serta Dashboard Admin (validasi bukti setoran warga, buat tagihan berkala, dan pembukuan kas).\n• Validasi Pengujian: Diuji langsung lewat platform Maze kepada 17 partisipan (warga dan pengurus RT) dengan tingkat penyelesaian tugas (task completion rate) 100%.\n• Tautan Figma: https://www.figma.com/design/MJfDGNE7hkUOc93Ey9SGgQ/FILE-ASLI--2-?node-id=0-1&p=f&t=LynvMIPhusCoYndW-0';
    }
  },

  // 19. PENDIDIKAN, IPK & KELULUSAN
  {
    id: 'EDUCATION_GPA',
    patterns: [
      /(pendidikan|kuliah di mana|kampusnya di mana|lulusan mana|sarjana apa|gelar thufeil|ipk(nya)? berapa|nilai ipk|kapan lulus|sudah lulus|transkrip|ijazah|sma korpri|gunadarma fikti)/i
    ],
    keywords: ['pendidikan', 'kuliah', 'kampus', 'gunadarma', 'fikti', 'ipk', 'nilai', 'lulus', 'sarjana', 's1', 'sma', 'korpri', 'ijazah', 'transkrip'],
    reply: function() {
      return 'Riwayat pendidikan resmi Muhammad Thufeil Putrayama:\n\n1. S1 Sistem Informasi — Universitas Gunadarma (2022 – 2026):\n   • Status: Lulusan Sarjana Komputer / Sistem Informasi (Tahun Kelulusan 2026)\n   • IPK Akhir: 3,72 dari skala 4,00\n   • Total Beban Studi: 152 SKS dari 74 mata kuliah\n   • Tugas Akhir / Skripsi: Meraih Nilai A (Chatbot RAG BAAK)\n   • Dokumen resmi rangkuman nilai semester 1–8 dapat dilihat pada tab Latar di website.\n\n2. SMA KORPRI Bekasi (2019 – 2022):\n   • Peminatan: MIPA (Matematika dan Ilmu Pengetahuan Alam)\n   • Rata-rata Nilai Ujian Sekolah: 91,63 dari 100\n   • Dokumen ijazah dan daftar nilai resmi tersedia di website.';
    }
  },

  // 20. SERTIFIKASI BNSP
  {
    id: 'CERTS_BNSP',
    patterns: [
      /(sertifikat bnsp|bnsp junior web programmer|lisensi bnsp|uji kompetensi bnsp|unit kompeten)/i
    ],
    keywords: ['bnsp', 'junior web programmer', 'kompeten', '8 unit', 'sertifikasi profesi', 'lisensi'],
    reply: function() {
      return 'Sertifikasi BNSP Junior Web Programmer (Tahun 2026):\n\nMuhammad Thufeil Putrayama memegang sertifikasi profesi nasional resmi dari Badan Nasional Sertifikasi Profesi (BNSP) untuk skema Junior Web Programmer.\n\nPada uji kompetensi tanggal 12 Juni 2026, Thufeil dinyatakan KOMPETEN pada seluruh 8 unit kompetensi yang diujikan:\n1. Menerapkan Perintah Eksekusi Bahasa Pemrograman Berbasis Teks\n2. Menyusun Algoritma Pemrograman\n3. Membuat Struktur Data\n4. Menerapkan Pemrograman Terstruktur\n5. Mengimplementasikan User Interface\n6. Mengimplementasikan Basis Data (Database)\n7. Melakukan Debugging Aplikasi\n8. Menerapkan Clean Code & Dokumentasi Program\n\nSertifikat fisik resmi dapat dilihat pada bagian Sertifikat di website.';
    }
  },

  // 21. APTITUDE TEST & PELATIHAN KAMPUS
  {
    id: 'APTITUDE_AND_TRAINING',
    patterns: [
      /(aptitude test|tes logika|tes bakat|penalaran logika|skor logika|skor tes|pelatihan lainnya|sertifikat lainnya|kursus)/i
    ],
    keywords: ['aptitude', 'tes logika', 'penalaran', 'pelatihan', 'kursus', 'seminar', 'java beginner', 'golang'],
    reply: function() {
      return 'Hasil Aptitude Test & Pelatihan Tambahan Thufeil:\n\n1. Aptitude Test Universitas Gunadarma (No. 695715/AT/FPSI/2026):\n   • Penalaran Logika: Skor 100 (Kategori Sangat Tinggi)\n   • Berpikir Abstrak: Skor 70 (Kategori Rata-rata)\n   • Membuat Kesimpulan: Skor 70 (Kategori Rata-rata)\n\n2. Pelatihan & Sertifikat Pelengkap:\n   • Dasar Pembuatan & Perancangan Aplikasi Web (Jalur Sertifikasi BNSP)\n   • Pemrograman Java (J2SE) Tingkat Menengah & Beginner\n   • Pemrograman Go (Golang) untuk Pemula\n   • Membangun Website Menggunakan HTML5 Semantik\n   • Workshop Penelitian Ilmiah & Diseminasi Riset Mahasiswa FIKTI\n   • Creative Problem Solving Generative AI FIKTI\n   • ESET Campus Security Day (Cybersecurity Awareness).';
    }
  },

  // 22. TECH STACK & SKILL PEMROGRAMAN
  {
    id: 'TECH_SKILLS',
    patterns: [
      /(tech stack|skill(nya)? apa|keahlian|bahasa pemrograman|bisa ngoding apa|framework apa|bisa python|bisa laravel|bisa figma|bisa web|tools apa)/i
    ],
    keywords: ['tech stack', 'skill', 'keahlian', 'pemrograman', 'framework', 'bahasa', 'tools', 'python', 'fastapi', 'laravel', 'figma', 'javascript'],
    reply: function() {
      return 'Daftar keahlian teknis (Tech Stack) yang dikuasai Muhammad Thufeil Putrayama:\n\n• AI & RAG Engineering: Python 3.11, FastAPI, ChromaDB, BM25 Okapi, HuggingFace embeddings (multilingual-e5-base), Groq API (LLaMA 3.3 70B), Google Gemini Flash API, Prompt Engineering, Faster-Whisper.\n• Backend Development: PHP 8.4 (Laravel 11), Node.js, C# .NET, RESTful API, Stateless JWT, Bcrypt, MySQL, SlowAPI.\n• Frontend Development: HTML5 Semantik, CSS3 murni (Dark Glassmorphism & Micro-animations), JavaScript Modern (ES6+), Blade Engine, Bootstrap 5, Chart.js.\n• Mobile & Desktop: Android Native (Java API 34), Windows Desktop (C# .NET Launcher).\n• UI/UX & Prototyping: Figma (Design System, Autolayout, High-Fidelity Interactive Prototyping), Design Thinking, Maze Usability Testing, Software Design Document (SDD).\n• Media & Video Automation: Adobe Photoshop, Directed Generative AI, Remotion 2D (React + TypeScript), FFmpeg, Kinetic Typography.';
    }
  },

  // 23. DOMISILI, LOKASI KERJA & PREFERENSI (REMOTE / ON-SITE)
  {
    id: 'WORK_LOCATION_PREFERENCE',
    patterns: [
      /(domisili|tinggal di mana|orang mana|anak mana|lokasi kerja|bekasi mana|bisa remote|bisa wfh|bisa on[- ]?site|bisa kerja di mana|jabodetabek|apakah siap kerja)/i
    ],
    keywords: ['domisili', 'lokasi', 'tinggal', 'bekasi', 'babelan', 'remote', 'wfh', 'onsite', 'jabodetabek', 'jakarta', 'siap kerja'],
    reply: function() {
      return 'Informasi Domisili & Ketersediaan Kerja:\n\n• Domisili: Babelan, Bekasi, Jawa Barat.\n• Kesiapan Kerja: Terbuka dan siap segera (Immediately Available) untuk peluang kerja Full-Time, Kontrak, maupun Proyek/Freelance.\n• Model Kerja yang Didukung:\n  1. Remote / WFH (Work From Home) secara penuh.\n  2. On-Site / WFO di area Jabodetabek (Bekasi, Jakarta, Depok, Tangerang, Bogor).\n  3. Hybrid (Kombinasi On-site dan Remote).';
    }
  },

  // 24. ALASAN MEREKRUT & KEUNGGULAN (WHY HIRE THUFEIL?)
  {
    id: 'WHY_HIRE',
    patterns: [
      /(kenapa (harus )?rekrut|mengapa rekrut|alasan hire|kelebihan thufeil|keunggulan thufeil|kenapa pilih thufeil|kelebihan kandidat|strength)/i
    ],
    keywords: ['kenapa rekrut', 'alasan hire', 'kelebihan', 'keunggulan', 'nilai jual', 'kelebihan thufeil', 'rekomendasi'],
    reply: function() {
      return 'Mengapa Anda harus mempertimbangkan untuk merekrut Muhammad Thufeil Putrayama?\n\n1. Kombinasi Langka (AI + Fullstack + UI/UX):\n   Thufeil tidak hanya mampu mendesain antarmuka yang estetis dan fungsional di Figma (55 frame + SDD 92 halaman), tetapi juga mampu membangun arsitektur backend AI (RAG, FastAPI, LLaMA) serta web fullstack (Laravel 11, Node.js, C#).\n\n2. Terbukti Secara Kuantitatif & Akademik:\n   Meraih IPK 3,72 dengan predikat Skripsi A di Universitas Gunadarma, serta skor Aptitude Test Penalaran Logika 100/100.\n\n3. Sertifikasi Profesi Nasional (BNSP):\n   Telah tersertifikasi kompeten pada seluruh 8 unit kompetensi Junior Web Programmer oleh BNSP.\n\n4. Eksekusi Berbasis Standar Industri:\n   Disiplin dalam dokumentasi arsitektur perangkat lunak (SDD), pengujian pengguna terukur (Maze 100% completion rate), dan optimasi performa bebas halusinasi (90% anti-hallucination rate).';
    }
  },

  // 25. JASA FREELANCE & PROYEK
  {
    id: 'FREELANCE_SERVICES',
    patterns: [
      /(terima jasa apa|bisa joki|bisa freelance|bisa bikin web|bisa buat web|bisa bikin website|bisa bikin chatbot|bisa bikin poster|terima proyek|biaya jasa|rate)/i
    ],
    keywords: ['jasa', 'freelance', 'bikin website', 'bikin chatbot', 'bikin poster', 'proyek', 'joki', 'rate', 'jasa pembuatan'],
    reply: function() {
      return 'Thufeil terbuka untuk kerja sama proyek freelance maupun konsultasi di bidang:\n\n1. Pembuatan Sistem Chatbot AI & RAG: Integrasi basis data dokumen perusahaan/kampus dengan LLM, hybrid search, dan antarmuka web.\n2. Desain UI/UX & Prototipe Figma: Pembuatan antarmuka aplikasi web/mobile, design system, dan dokumen spesifikasi perangkat lunak (SDD).\n3. Pengembangan Web Fullstack: Pembuatan sistem inventaris, portal organisasi, dan aplikasi web berbasis Laravel / FastAPI.\n4. Desain Visual & Poster Esports: Poster promosi turnamen dengan alur Directed Generative AI dan tipografi sinematik.\n5. Video Dokumenter & Motion: Pembuatan video explainer berbasis tipografi kinetik atau Remotion 2D.\n\nUntuk mendiskusikan kebutuhan proyek, scope, dan rate, silakan hubungi WhatsApp Thufeil di +62 815-1471-3206 atau email putrayama63@gmail.com.';
    }
  },

  // 26. KONTAK RESMI & CARA MENGUNDUH CV
  {
    id: 'CONTACT_HIRE',
    patterns: [
      /(kontak|hubungi|rekrut|hire|email|nomor wa|whatsapp|linkedin|github|instagram|cv|download cv|unduh cv|resume|nomor telepon|pesan)/i
    ],
    keywords: ['kontak', 'hubungi', 'rekrut', 'hire', 'email', 'whatsapp', 'wa', 'nomor', 'linkedin', 'github', 'instagram', 'cv', 'resume', 'unduh'],
    reply: function() {
      return 'Saluran komunikasi resmi Muhammad Thufeil Putrayama:\n\n• WhatsApp: +62 815-1471-3206 (Tautan chat: https://wa.me/6281514713206)\n• Email Resmi: putrayama63@gmail.com (atau muhammadthufeilputrayama@gmail.com)\n• LinkedIn: https://www.linkedin.com/in/thufeil/\n• GitHub: https://github.com/YAMA2063\n• Instagram: https://www.instagram.com/spidiron/\n• Unduh CV: Anda dapat mengunduh berkas resume ATS terbaru (format PDF) langsung melalui tombol "Unduh CV" di navbar atas atau tautan ./assets/CV_ATS_MUHAMMAD_THUFEIL_PUTRAYAMA.pdf\n\nThufeil sangat terbuka untuk undangan wawancara kerja, kolaborasi proyek, maupun diskusi teknologi!';
    }
  }
];

// ===== SMART QUERY ENGINE (MULTI-TIER MATCHING) =====
function findAnswer(query) {
  var raw = (query || '').trim();
  if (!raw) return 'Silakan ketik pertanyaan Anda seputar karya, skripsi RAG, sertifikasi, atau profil Thufeil.';

  var q = raw.toLowerCase();
  var nq = normalizeQuery(raw);

  // TIER 1: Regex Pattern Matching (Langsung periksa raw dan normalized)
  for (var i = 0; i < KB.length; i++) {
    var entry = KB[i];
    if (entry.patterns) {
      for (var p = 0; p < entry.patterns.length; p++) {
        if (entry.patterns[p].test(raw) || entry.patterns[p].test(q) || entry.patterns[p].test(nq)) {
          return entry.reply();
        }
      }
    }
  }

  // TIER 2: Weighted Keyword Matching pada Normalized Query
  var bestMatch = null, maxScore = 0;
  var tokens = nq.split(/\s+/).filter(function(t){ return t.length >= 2 && !STOP_WORDS[t]; });

  KB.forEach(function(entry){
    var score = 0;
    if (entry.keywords) {
      entry.keywords.forEach(function(kw){
        var kwLower = kw.toLowerCase();
        // Cek kecocokan frasa
        if (nq.indexOf(kwLower) !== -1 || q.indexOf(kwLower) !== -1) {
          score += 3;
        }
        // Cek kecocokan token satuan
        tokens.forEach(function(token){
          if (token === kwLower) {
            score += 2;
          } else if (token.length >= 4 && (kwLower.indexOf(token) !== -1 || token.indexOf(kwLower) !== -1)) {
            score += 1;
          }
        });
      });
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = entry;
    }
  });

  if (bestMatch && maxScore >= 2) {
    return bestMatch.reply();
  }

  // TIER 3: Specific Entity Fallback (Jika mengandung nama proyek atau istilah kunci spesifik)
  if (/rag|baak|skripsi|halusinasi|e5|chroma/i.test(nq)) return KB[4].reply(); // Skripsi RAG
  if (/himpaudi|paud|miracle|sdd|kta/i.test(nq)) return KB[7].reply(); // HIMPAUDI
  if (/brandedym|pakaian|baju|safety stock|stok/i.test(nq)) return KB[10].reply(); // BrandedYM
  if (/bstation|bilibili|booster|telemetry/i.test(nq)) return KB[12].reply(); // Bstation
  if (/poster|pmdc|pubg|alter ego|ares|boom/i.test(nq)) return KB[13].reply(); // Poster PMDC
  if (/geologika|lemminoid|youtube|video/i.test(nq)) return KB[15].reply(); // Video
  if (/kuliah|ipk|nilai|sma|pendidikan|lulus/i.test(nq)) return KB[18].reply(); // Pendidikan
  if (/bnsp|sertifikat|kompeten/i.test(nq)) return KB[19].reply(); // Sertifikat BNSP
  if (/skill|keahlian|bahasa|pemrograman|framework/i.test(nq)) return KB[21].reply(); // Tech skills
  if (/kontak|hubungi|rekrut|hire|wa|email|cv/i.test(nq)) return KB[25].reply(); // Kontak & CV

  // TIER 4: Informative Smart Fallback
  return 'Terima kasih atas pertanyaan Anda! Sebagai asisten AI portofolio Muhammad Thufeil Putrayama, saya dapat memberikan informasi lengkap seputar:\n\n' +
    '1. Skripsi AI & Chatbot RAG BAAK Gunadarma (Akurasi 86,67% & BM25 + ChromaDB)\n' +
    '2. Proyek UI/UX HIMPAUDI Bekasi Timur (55 frame Figma & SDD 92 Halaman)\n' +
    '3. BrandedYM (Aplikasi Web Inventaris Toko Pakaian Laravel 11 & PHP 8.4)\n' +
    '4. Bstation & Bilibili Views Booster (Telemetry Protocol C#, Node.js & Android APK)\n' +
    '5. Poster Esports PUBG Mobile PMDC S2 (Directed Generative AI Pipeline)\n' +
    '6. Channel YouTube GeoLogika & Lemminoid (AI Video & Animasi Remotion 2D)\n' +
    '7. Riwayat Pendidikan S1 Gunadarma (IPK 3,72) & Sertifikasi Profesi BNSP\n' +
    '8. Lokasi Kerja (Domisili Bekasi, siap Remote / On-site Jabodetabek) & Unduh CV\n\n' +
    'Bisa tolong sebutkan topik atau proyek mana yang ingin Anda ketahui lebih dalam?';
}
window.PortfolioChat.findAnswer = findAnswer;

function ask(msg){
  if (typeof window.PortfolioChat.handler === 'function') {
    try {
      return Promise.resolve(window.PortfolioChat.handler(msg, hist));
    } catch(e) {}
  }
  if (CHAT_API_URL) {
    return fetch(CHAT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, history: hist })
    })
    .then(function(r){
      if(!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then(function(d){ return d.reply || findAnswer(msg); })
    .catch(function(){ return findAnswer(msg); });
  }
  return Promise.resolve(findAnswer(msg));
}

function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function pic(cls){var w=el('span',cls),i=el('img');i.src=AVATAR;i.alt='';i.width=48;i.height=48;w.appendChild(i);return w}

// Peluncur: foto dengan cincin gradien berputar
var fab=el('button','cx-fab');fab.type='button';fab.setAttribute('aria-haspopup','dialog');
var fa=pic('cx-ava');fa.appendChild(el('i','cx-on'));var fl=el('span','cx-lab');fl.appendChild(el('b','','Tanya asisten'));fl.appendChild(el('small','','AI portofolio'));
fab.appendChild(fa);fab.appendChild(fl);
var tip=el('button','cx-tip','Ingin tahu karya terbaiknya? Tanya langsung di sini.');tip.type='button';tip.hidden=true;

// Panel dialog chatbot
var box=el('section','cx');box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-label','AI portofolio');
var inn=el('div','cx-in'),head=el('header','cx-head');
var hm=el('div','cx-who');hm.appendChild(pic('cx-ava sm'));var ht=el('div');ht.appendChild(el('b','','Asisten Thufeil'));var st=el('small');st.appendChild(el('i','cx-on s'));st.appendChild(document.createTextNode('Online, siap menjawab portofolio'));ht.appendChild(st);hm.appendChild(ht);
var close=el('button','cx-x','×');close.type='button';close.setAttribute('aria-label','Tutup chatbot');head.appendChild(hm);head.appendChild(close);
var log=el('div','cx-log');log.setAttribute('aria-live','polite');
var hello=el('div','cx-hello');hello.appendChild(el('h4','','Ada yang ingin ditanyakan?'));hello.appendChild(el('p','','Tanya apa saja seputar karya, skripsi RAG, sertifikat, atau riwayat Thufeil.'));
var grid=el('div','cx-grid');
PROMPTS.forEach(function(p){
  var b=el('button','cx-card');b.type='button';
  b.appendChild(el('b','',p[0]));
  b.appendChild(el('span','','→'));
  b.addEventListener('click',function(){submit(p[1])});
  grid.appendChild(b);
});
hello.appendChild(grid);log.appendChild(hello);
var form=el('form','cx-form'),inp=el('input');inp.placeholder='Tulis pertanyaan Anda di sini...';inp.setAttribute('aria-label','Pertanyaan');inp.autocomplete='off';inp.maxLength=500;
var send=el('button','cx-send','↑');send.type='submit';send.setAttribute('aria-label','Kirim');form.appendChild(inp);form.appendChild(send);
var note=el('p','cx-note','Jawaban interaktif dibuat otomatis oleh AI Knowledge Engine Portofolio.');
[head,log,form,note].forEach(function(n){inn.appendChild(n)});box.appendChild(inn);
document.body.appendChild(fab);document.body.appendChild(tip);document.body.appendChild(box);

function row(role){
  var r=el('div','cx-row '+(role==='user'?'u':'b'));
  if(role!=='user')r.appendChild(pic('cx-ava xs'));
  var m=el('div','cx-msg');r.appendChild(m);
  log.appendChild(r);
  log.scrollTop=log.scrollHeight;
  return m;
}

function reveal(node,text){
  if(reduce||text.length>1000){
    node.textContent=text;
    log.scrollTop=log.scrollHeight;
    return Promise.resolve();
  }
  var w=text.split(/(\s+)/),i=0,step=Math.max(2,Math.ceil(w.length/60))*2;
  return new Promise(function(res){
    var t=setInterval(function(){
      i+=step;
      node.textContent=w.slice(0,i).join('');
      log.scrollTop=log.scrollHeight;
      if(i>=w.length){
        clearInterval(t);
        node.textContent=text;
        res();
      }
    }, 20);
  });
}

function submit(text){
  text=(text||'').trim();
  if(!text||busy)return;
  busy=true;
  if(hello.parentNode)hello.remove();
  row('user').textContent=text;
  hist.push({role:'user',text:text});
  var d=row('bot');
  d.classList.add('dots');
  for(var k=0;k<3;k++)d.appendChild(el('i'));
  log.scrollTop=log.scrollHeight;
  
  ask(text).then(function(r){
    d.classList.remove('dots');
    d.textContent='';
    hist.push({role:'bot',text:r});
    if(window.sfxBeep)window.sfxBeep(880,.08);
    return reveal(d,r);
  })
  .catch(function(){
    d.classList.remove('dots');
    d.textContent='Maaf, chatbot sedang tidak bisa memproses pertanyaan. Coba lagi sebentar.';
  })
  .then(function(){
    busy=false;
    inp.focus();
  });
}

form.addEventListener('submit',function(e){
  e.preventDefault();
  var v=inp.value;
  inp.value='';
  submit(v);
});

function toggle(s){
  box.hidden=!s;
  fab.hidden=s;
  tip.hidden=true;
  if(s){inp.focus()}else fab.focus();
}

fab.addEventListener('click',function(){toggle(true)});
close.addEventListener('click',function(){toggle(false)});
tip.addEventListener('click',function(){toggle(true)});
box.addEventListener('keydown',function(e){if(e.key==='Escape')toggle(false)});
setTimeout(function(){
  if(box.hidden&&!tipShown){
    tipShown=true;
    tip.hidden=false;
    setTimeout(function(){tip.hidden=true},9000);
  }
}, 4500);

})();
