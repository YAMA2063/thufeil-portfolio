/* Chatbot Portofolio Muhammad Thufeil Putrayama
   Dilengkapi Knowledge Engine cerdas berbasis data portofolio asli.
   Dapat menjawab seluruh pertanyaan seputar profil, skripsi RAG, proyek UI/UX,
   aplikasi web, poster AI, video dokumenter, sertifikasi BNSP, pendidikan/IPK, dan kontak.
   Mendukung integrasi API eksternal via CHAT_API_URL atau window.PortfolioChat.handler jika diinginkan. */
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

// ===== KNOWLEDGE ENGINE PORTOFOLIO =====
var KB = [
  {
    id: 'GREETING',
    patterns: [/^(halo|hai|hi|hey|hello|assalamu['a]?laikum|pagi|siang|sore|malam|selamat pagi|selamat siang|selamat sore|selamat malam|tes|test)/i],
    keywords: ['halo', 'hai', 'hello', 'assalamualaikum', 'salam'],
    reply: function() {
      return 'Halo! Senang menyapa Anda. Saya asisten virtual resmi Muhammad Thufeil Putrayama.\n\nSaya bisa menjawab berbagai pertanyaan tentang Thufeil, mulai dari:\n• Skripsi AI & Chatbot RAG BAAK Gunadarma (akurasi 86,67%)\n• Desain UI/UX & Dokumen SDD 92 Halaman HIMPAUDI di Figma\n• Aplikasi Web Fullstack BrandedYM (Laravel 11) & Bstation Booster\n• Poster Esports PUBG Mobile PMDC (Directed Generative AI Pipeline)\n• Channel YouTube Dokumenter (GeoLogika & Lemminoid)\n• Riwayat Pendidikan (IPK 3,72) & Sertifikasi Kompetensi BNSP\n• Kontak resmi & pengunduhan CV\n\nApa yang ingin Anda ketahui lebih lanjut?';
    }
  },
  {
    id: 'THANKS',
    patterns: [/^(terima kasih|makasih|thanks|thank you|keren|mantap|hebat|top|jos|sip|oke|ok|nice)/i],
    keywords: ['makasih', 'terima kasih', 'thanks', 'thank you', 'keren', 'mantap'],
    reply: function() {
      return 'Sama-sama! Senang bisa membantu Anda mengeksplorasi portofolio Thufeil. Jika ada detail teknis, dokumen, atau proyek lain yang ingin Anda tanyakan, silakan beri tahu saya!';
    }
  },
  {
    id: 'ABOUT_ME',
    patterns: [/(siapa (itu )?thufeil|tentang thufeil|profil thufeil|biografi|latar belakang thufeil|siapakah thufeil|kenalan)/i],
    keywords: ['siapa', 'thufeil', 'profil', 'tentang', 'biodata', 'biografi', 'background', 'orangnya'],
    reply: function() {
      return 'Muhammad Thufeil Putrayama adalah Sarjana (S1) Sistem Informasi lulusan Fakultas Ilmu Komputer dan Teknologi Informasi (FIKTI), Universitas Gunadarma (lulus 2026 dengan IPK 3,72 dan Skripsi bernilai A).\n\nKeahlian dan fokus utamanya mencakup:\n1. AI Engineering & RAG: Membangun sistem Retrieval-Augmented Generation cerdas, hybrid search (BM25 + Dense Vector), dan integrasi multi-LLM.\n2. Fullstack Web Development: Berpengalaman dengan Python (FastAPI), PHP (Laravel 11), Node.js, C# .NET, dan Java Android.\n3. UI/UX Design & Design System: Perancangan sistem informasi berskala besar di Figma (hingga 55 frame high-fidelity) serta pengujian pengguna (Design Thinking & Maze).\n4. Creative Media & AI Art: Produksi motion graphic (Remotion 2D, FFmpeg, Whisper) dan digital imaging esports terarah (Directed Generative AI).\n\nThufeil berdomisili di Bekasi, Jawa Barat, dan terbuka untuk peluang kerja Full-Time, Kontrak, maupun Proyek/Freelance.';
    }
  },
  {
    id: 'BEST_WORK',
    patterns: [/(karya terbaik|proyek (unggulan|terbaik|favorit)|rekomendasi (karya|proyek)|apa saja (yang dibuat|karyanya))/i],
    keywords: ['karya', 'terbaik', 'unggulan', 'favorit', 'rekomendasi', 'proyek', 'portfolio', 'highlight'],
    reply: function() {
      return 'Berikut adalah karya-karya unggulan utama dalam portofolio Thufeil:\n\n1. Chatbot RAG Tanya-Jawab Akademik BAAK Gunadarma (Skripsi S1, Nilai A):\n   Sistem AI penelusuran regulasi akademik kampus dengan akurasi 86,67% dan 90% bebas halusinasi berbasis Hybrid Search (BM25 + ChromaDB) dan FastAPI.\n\n2. Portal Sistem Informasi HIMPAUDI Bekasi Timur (4 SKS):\n   Perancangan antarmuka 55 frame master di Figma untuk 3 hak akses, integrasi KTA digital QR Code, dan penyusunan Software Design Document (SDD) 92 halaman.\n\n3. BrandedYM — Inventaris Toko Pakaian (Laravel 11):\n   Aplikasi web fullstack persediaan pakaian dengan grafik tren mutasi barang 6 bulan, auto safety stock alert, serta cetak laporan PDF & Excel.\n\n4. Bstation & Bilibili Views Booster (Telemetry Protocol Engine):\n   Aplikasi multi-platform (Desktop C#, Node.js, dan APK Android Java) untuk riset simulasi telemetri protokol streaming video OTT.\n\n5. Poster Esports PUBG Mobile PMDC Season 2:\n   Dua poster turnamen resmi (Alter Ego Ares 144 Pts & BOOM Esports FMVP) yang dikerjakan lewat alur kerja Directed Generative AI.\n\n6. Channel Dokumenter YouTube (GeoLogika & Lemminoid):\n   Produksi video edukasi geologi (GeoLogika) dan investigasi geopolitik berbasis kode Remotion 2D (Lemminoid).';
    }
  },
  {
    id: 'RAG_SKRIPSI',
    patterns: [/(skripsi|rag|chatbot akademik|baak|tanya jawab akademik|akurasi|halusinasi|retrieval|bm25|chromadb|groq|llama|gunadarma)/i],
    keywords: ['skripsi', 'rag', 'baak', 'akurasi', 'halusinasi', 'hybrid', 'bm25', 'chromadb', 'vektor', 'vector', 'retrieval', 'groq', 'llama', 'gemini', 'fastapi'],
    reply: function() {
      return 'Proyek Skripsi S1 Thufeil berjudul "Sistem Tanya-Jawab Akademik Cerdas BAAK Menggunakan Retrieval-Augmented Generation (RAG)" di Universitas Gunadarma, yang berhasil meraih Nilai A.\n\nHighlight & Metrik Hasil Riset:\n• Akurasi Jawaban: 86,67% (Valid sesuai dokumen regulasi resmi BAAK)\n• Tingkat Bebas Halusinasi: 90,00%\n• Hit Rate@5 Hybrid Search: 76,7% (meningkat +13,4 pt dibanding metode vektor murni)\n• Mean Reciprocal Rank (MRR): 0,644 (tertinggi dari seluruh skenario pengujian)\n• Waktu Respons Rata-rata: 4,81 detik dengan Retrieval Latency hanya 175 ms.\n\nArsitektur Teknologi:\n• Hybrid Search Engine: Menggabungkan Sparse Search (BM25 Okapi) dan Dense Vector Search (ChromaDB + multilingual-e5-base) menggunakan Reciprocal Rank Fusion (RRF).\n• Query Transformation Otomatis: Mentransformasikan pertanyaan bahasa alami mahasiswa menjadi query formal menggunakan Groq (LLaMA 3.3 70B) dan Google Gemini API dengan rotasi kunci dinamis.\n• Transparansi Sitasi: Setiap bubble jawaban menyematkan badge dokumen rujukan resmi kampus.\n• Keamanan & Admin: Panel kontrol admin untuk incremental indexing 153 dokumen BAAK, dilindungi Stateless JWT (HS256), hashing Bcrypt, dan 2FA OTP.';
    }
  },
  {
    id: 'HIMPAUDI',
    patterns: [/(himpaudi|paud|miracle|sdd|kta digital|4 sks|pengelolaan proyek|figma himpaudi)/i],
    keywords: ['himpaudi', 'paud', 'miracle', 'sdd', 'kta', 'qr', 'guru', 'bekasi', 'timur', 'diklat', 'seminar', '4 sks'],
    reply: function() {
      return 'Proyek Sistem Informasi HIMPAUDI Cabang Bekasi Timur adalah proyek mata kuliah Pengelolaan Proyek Sistem Informasi (bobot 4 SKS) di Universitas Gunadarma yang dikerjakan oleh Kelompok MIRACLE, di mana Muhammad Thufeil Putrayama bertindak sebagai Lead UI/UX Designer.\n\nPencapaian & Ruang Lingkup Proyek:\n• Desain Master Figma: Merancang 55 Frame High-Fidelity terstruktur yang mencakup 3 peran pengguna (Tamu/Publik, Portal Guru PAUD, dan Panel Administrator Pengurus).\n• Dokumen SDD 92 Halaman: Menyusun Software Design Document (SDD) teknis setebal 92 halaman yang mendokumentasikan use case diagram, sekuens interaksi, struktur navigasi, dan skema basis data.\n• Fitur Unggulan: KTA Digital berstandar QR Code unik untuk validasi keanggotaan dan pemindai presensi diklat guru secara instan, direktori lembaga PAUD se-kecamatan, dan kanal live chat konsultasi guru.\n• Tautan Prototipe: Desain asli dapat diakses langsung melalui link Figma yang tersedia pada kartu karya portofolio.';
    }
  },
  {
    id: 'BRANDEDYM',
    patterns: [/(brandedym|laravel|persediaan|inventaris|toko pakaian|stok|mutasi barang|safety stock)/i],
    keywords: ['brandedym', 'laravel', 'php', 'persediaan', 'stok', 'inventaris', 'pakaian', 'baju', 'barang', 'fastexcel', 'dompdf'],
    reply: function() {
      return 'BrandedYM adalah aplikasi web fullstack sistem manajemen persediaan toko pakaian berbasis Laravel 11 dan PHP 8.4.\n\nFitur & Arsitektur Utama:\n• Dashboard Analitik: Dilengkapi visualisasi Chart.js untuk memantau grafik tren arus barang masuk dan keluar selama 6 bulan secara real-time.\n• Otomatisasi Safety Stock: Sistem secara cerdas memicu peringatan otomatis jika stok fisik barang mendekati batas minimum aman.\n• Manajemen Mutasi: Mencatat transaksi barang masuk dari supplier dan barang keluar untuk penjualan dengan pembaruan kartu stok instan.\n• Ekspor Laporan Siap Cetak: Fitur ekspor laporan mutasi ke format PDF resmi siap cetak (DomPDF) dan spreadsheet Microsoft Excel (FastExcel) dengan filter tanggal.\n• Multi-Role Access: Pemisahan hak akses antara Administrator (akses penuh) dan Pimpinan/Staf (hanya memantau laporan tanpa izin merusak master data).';
    }
  },
  {
    id: 'BSTATION',
    patterns: [/(bstation|bilibili|views booster|telemetri|telemetry|streaming ott|bte|apk bstation)/i],
    keywords: ['bstation', 'bilibili', 'booster', 'telemetri', 'telemetry', 'views', 'apk', 'c#', 'node.js', 'ott'],
    reply: function() {
      return 'Bstation & Bilibili Views Booster (Telemetry Protocol Engine) adalah proyek riset rekayasa protokol streaming video OTT yang diimplementasikan ke dalam 3 platform terpadu:\n\n1. Launcher Desktop PC: Aplikasi mandiri Windows berbasis C# .NET.\n2. Backend Engine: Server Node.js untuk eksekusi jabat tangan (handshake) telemetri asinkron multi-tahap.\n3. Mobile Client: Aplikasi smartphone Android native (file APK mandiri berbasis Java Android API 34).\n\nFitur Teknis Unggulan:\n• Device Fingerprinting Unik: Menghasilkan token identitas dan metadata perangkat Android unik (UUID dinamis) pada setiap sesi agar tidak terdeteksi anomali oleh server OTT.\n• Anti-Rate Limit: Algoritma jeda acak (configurable jitter delay 5–600 detik) untuk menjaga pola lalu lintas telemetri tetap organik.\n• Cyberpunk Glassmorphic UI: Dilengkapi 4 indikator circular gauge interaktif untuk memantau views real-time, rasio keberhasilan, dan timer countdown request.';
    }
  },
  {
    id: 'POSTER_AI',
    patterns: [/(poster|pmdc|pubg mobile|alter ego|ares|boom esports|fmvp|spidiron|desain poster|apakah full ai|cara buat poster|pose ai)/i],
    keywords: ['poster', 'pmdc', 'pubg', 'ares', 'boom', 'fmvp', 'spidiron', 'pose', 'ai poster', 'esports', '144'],
    reply: function() {
      return 'Karya poster esports dalam portofolio Thufeil adalah bagian dari ajang resmi PUBG Mobile Design Challenge (PMDC) Season 2 untuk 2026 PMPL ID Spring yang dipublikasikan di akun Instagram @spidiron.\n\nTerdapat dua karya poster resmi:\n1. Alter Ego Ares ("Super Team Back in Action"): Merayakan rekor 144 poin di Super Brief Week 3 dengan aksi ground smash berapi dan trofi Golden Helmet PUBG Mobile.\n2. BOOM Esports ("Final MVP"): Poster dark fantasy sinematik perayaan pemain terbaik PMPL ID Spring bersama supercar eksotis dan atmosfer hutan malam.\n\nBagaimana Cara Pembuatannya? (Directed Generative AI Pipeline):\nKarya ini BUKAN dibuat dengan prompt AI otomatis dari nol, melainkan alur terarah:\n• AI Pose Transfer: Mengubah pose asli para atlet esports menggunakan AI agar gestur tubuh memiliki aksi laga dinamis.\n• Multi-Subject Staging: Menyusun dan menata komposisi para pemain di atas kanvas secara proporsional.\n• Image-to-Image Generative Blending: Memasukkan kembali susunan pemain ke AI untuk meleburkan pencahayaan medan tempur (rim-light, kobaran api buggy, asap suar airdrop) secara organik tanpa garis potong kasar.\n• Penataan Tipografi Statistik: Finishing tipografi statistik pertandingan dan branding resmi liga esports.';
    }
  },
  {
    id: 'YOUTUBE_VIDEO',
    patterns: [/(geologika|lemminoid|youtube|video dokumenter|selat bali|air gunung|nikel|truk sampah|kalimantan)/i],
    keywords: ['geologika', 'lemminoid', 'youtube', 'video', 'dokumenter', 'remotion', 'whisper', 'naskah', 'geologi'],
    reply: function() {
      return 'Thufeil memproduksi konten video dokumenter YouTube dengan standar sinematik dan riset mendalam melalui dua channel:\n\n1. GeoLogika (@GeoLogikaOfficial):\n   Channel dokumenter investigasi sains dan geologi kebumian Nusantara. Seluruh produksinya menggunakan pipeline otomatisasi AI agent: riset literatur ilmiah, struktur narasi 8-bab ilmiah, sinkronisasi fonem audio Faster-Whisper zero-gap, teks kinetik dinamis, dan desain suara akustik organik.\n   • Episode unggulan: "Kenapa Tidak Ada Jembatan Selat Bali?" dan "Mengalir Tiap Hari Kenapa Tak Habis?".\n\n2. Lemminoid (@Lemminoid):\n   Channel dokumenter investigatif mendalam berbasis visualisasi data dan intelijen sumber terbuka (OSINT). Memadukan footage nyata dengan animasi 2D deterministik berbasis kode (React & Remotion), standar broadcast lower-third, dan catatan kaki asal-usul data (provenance footnote).\n   • Episode unggulan: "Nikel Indonesia Dikeruk Terus" dan "Setelah Diangkut Truk Sampah".';
    }
  },
  {
    id: 'RT02_KAS',
    patterns: [/(rt 02|rt02|iuran kas|iuran warga|kas rt|maze|design thinking|warga rt)/i],
    keywords: ['rt02', 'rt', 'iuran', 'kas', 'warga', 'maze', 'qris'],
    reply: function() {
      return 'Proyek Platform Iuran dan Kas RT 02 adalah karya Penulisan Ilmiah perancangan UI/UX website tata kelola iuran warga dan laporan kas transparan.\n\n• Metode: Menerapkan 5 tahap Design Thinking (Empathize, Define, Ideate, Prototype, Test).\n• Arsitektur: Membagi antarmuka menjadi mode Warga (dashboard iuran, QRIS, transfer bank, transparansi kas) dan mode Admin RT (verifikasi bukti setoran, pembuatan tagihan, pembukuan kas).\n• Validasi Pengujian: Diuji menggunakan platform Maze kepada 17 partisipan (warga dan pengurus RT) dengan tingkat keberhasilan penyelesaian tugas (task completion rate) 100%.';
    }
  },
  {
    id: 'EDUCATION_GPA',
    patterns: [/(pendidikan|kuliah|ipk|nilai|universitas|gunadarma|sma|korpri|ijazah|transkrip|sks)/i],
    keywords: ['pendidikan', 'kuliah', 'ipk', 'nilai', 'gunadarma', 'sma', 'korpri', 'ijazah', 'transkrip', 'sks', 'lulusan'],
    reply: function() {
      return 'Berikut adalah riwayat pendidikan resmi Muhammad Thufeil Putrayama:\n\n1. S1 Sistem Informasi — Universitas Gunadarma (2022 – 2026):\n   • IPK Akhir: 3,72 (dari skala 4,00)\n   • Beban Studi: 152 SKS dari total 74 mata kuliah\n   • Tugas Akhir / Skripsi: Meraih Nilai A (Chatbot RAG BAAK)\n   • Seluruh rangkuman nilai dari semester 1 s.d. 8 dapat dilihat langsung di website pada bagian Latar.\n\n2. SMA KORPRI Bekasi (2019 – 2022):\n   • Peminatan: MIPA (Matematika dan Ilmu Pengetahuan Alam)\n   • Rata-rata Nilai Ujian Sekolah: 91,63\n   • Dokumen ijazah dan daftar nilai resmi tersedia di website.';
    }
  },
  {
    id: 'CERTS_SKILLS',
    patterns: [/(sertifikat|sertifikasi|bnsp|lisensi|aptitude test|tes logika|junior web programmer)/i],
    keywords: ['sertifikat', 'sertifikasi', 'bnsp', 'lisensi', 'aptitude', 'kompeten', 'pelatihan'],
    reply: function() {
      return 'Thufeil memiliki sejumlah sertifikasi kompetensi resmi dan penghargaan akademik, di antaranya:\n\n1. BNSP Junior Web Programmer (2026):\n   Sertifikasi profesi nasional dari Badan Nasional Sertifikasi Profesi (BNSP). Dinyatakan KOMPETEN pada seluruh 8 unit kompetensi (Struktur data, pemrograman terstruktur, implementasi user interface, database, debugging, dll.).\n\n2. Aptitude Test Universitas Gunadarma (2026):\n   Tes kemampuan skolastik & analitikal dengan hasil skor Penalaran Logika 100 (Sangat Tinggi), Berpikir Abstrak 70, dan Membuat Kesimpulan 70.\n\n3. Sertifikasi Pelatihan & Kursus Tambahan:\n   • Dasar Pembuatan & Perancangan Aplikasi Web (Gunadarma / BNSP Pathway)\n   • Pemrograman Java (J2SE) Tingkat Menengah & Beginner\n   • Pemrograman Go (Golang) untuk Pemula\n   • Pembuatan Website HTML5 Semantik\n   • Workshop Generative AI & AI-Powered Learning FIKTI\n   • ESET Campus Security Day (Cybersecurity)\n\nSeluruh sertifikat dapat dilihat langsung dengan penampil dokumen 2-halaman interaktif pada bagian Sertifikat di website.';
    }
  },
  {
    id: 'TECH_SKILLS',
    patterns: [/(keahlian|skill|kemampuan|tech stack|bahasa pemrograman|framework|tools|bisa apa aja)/i],
    keywords: ['keahlian', 'skill', 'kemampuan', 'tech', 'stack', 'bahasa', 'pemrograman', 'tools', 'framework', 'bisa'],
    reply: function() {
      return 'Keahlian teknis dan teknologi (Tech Stack) yang dikuasai Muhammad Thufeil Putrayama:\n\n• AI & Machine Learning: Retrieval-Augmented Generation (RAG), ChromaDB, BM25 Okapi, HuggingFace embeddings (multilingual-e5-base), Groq API (LLaMA 3.3 70B), Google Gemini API, Prompt Engineering, Faster-Whisper.\n• Backend Development: Python (FastAPI), PHP 8.4 (Laravel 11), Node.js, C# .NET, RESTful API, Stateless JWT, Bcrypt, SlowAPI Rate Limiting.\n• Frontend Development: HTML5, CSS3 murni modern, JavaScript modern (ES6+), Blade Engine, Bootstrap 5 (Glassmorphic Dark UI), Chart.js.\n• Mobile & Desktop: Android Native (Java API 34), Windows C# Desktop Client.\n• UI/UX & Design: Figma (Design System, Autolayout, High-Fidelity Prototyping), Design Thinking, Maze Testing, Software Design Document (SDD).\n• Media & Video Production: Adobe Photoshop, Directed Generative AI, Remotion 2D (React), FFmpeg, Motion Design, Kinetic Typography.';
    }
  },
  {
    id: 'CONTACT_HIRE',
    patterns: [/(kontak|hubungi|rekrut|hire|email|whatsapp|wa|linkedin|github|cv|nomor|kerja sama|freelance|lowongan)/i],
    keywords: ['kontak', 'hubungi', 'rekrut', 'hire', 'email', 'whatsapp', 'wa', 'nomor', 'linkedin', 'github', 'cv', 'telepon', 'pesan'],
    reply: function() {
      return 'Anda dapat menghubungi Muhammad Thufeil Putrayama secara langsung melalui saluran resmi berikut:\n\n• Email Resmi: muhammadthufeilputrayama@gmail.com\n• WhatsApp: +62 813-8255-0803\n• LinkedIn: linkedin.com/in/thufeil/\n• GitHub: github.com/YAMA2063\n• Instagram: @spidiron\n• Unduh CV: Klik tombol "Unduh CV" di pojok kanan atas navbar website untuk mengunduh dokumen resume terbaru.\n\nThufeil siap berdiskusi terkait tawaran pekerjaan penuh waktu (full-time), kontrak, maupun proyek freelance software engineering dan desain.';
    }
  }
];

function answerLocally(query) {
  var q = (query || '').toLowerCase().trim();
  if (!q) return 'Silakan ketik pertanyaan Anda tentang karya, skripsi, atau keahlian Thufeil.';

  // 1. Cek regex patterns (prioritas tertinggi)
  for (var i = 0; i < KB.length; i++) {
    var entry = KB[i];
    if (entry.patterns) {
      for (var p = 0; p < entry.patterns.length; p++) {
        if (entry.patterns[p].test(q)) {
          return entry.reply();
        }
      }
    }
  }

  // 2. Cek keyword scoring (toleransi sinonim dan kata kunci ganda)
  var bestMatch = null, maxScore = 0;
  KB.forEach(function(entry){
    var score = 0;
    if (entry.keywords) {
      entry.keywords.forEach(function(kw){
        if (q.indexOf(kw.toLowerCase()) !== -1) {
          score += 1;
        }
      });
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = entry;
    }
  });

  if (bestMatch && maxScore > 0) {
    return bestMatch.reply();
  }

  // 3. Fallback cerdas jika pertanyaan tidak spesifik
  return 'Terima kasih atas pertanyaan Anda! Sebagai asisten virtual Muhammad Thufeil Putrayama, saya memiliki data lengkap seputar:\n\n' +
    '1. Skripsi AI & Chatbot RAG BAAK (Akurasi 86,67% & BM25 + ChromaDB)\n' +
    '2. Proyek HIMPAUDI Bekasi Timur (55 frame Figma & SDD 92 Halaman)\n' +
    '3. BrandedYM (Aplikasi Web Inventaris Toko Pakaian Laravel 11)\n' +
    '4. Bstation & Bilibili Views Booster (Telemetry Protocol C# & Android)\n' +
    '5. Poster Esports PUBG Mobile PMDC S2 (Directed Generative AI Pipeline)\n' +
    '6. Channel YouTube GeoLogika & Lemminoid (AI Video & Remotion 2D)\n' +
    '7. Riwayat Pendidikan S1 Gunadarma (IPK 3,72) & Sertifikasi Kompetensi BNSP\n' +
    '8. Informasi Kontak & Cara Mengunduh CV\n\n' +
    'Bisa tolong perjelas bagian mana yang ingin Anda ketahui lebih dalam?';
}

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
    .then(function(d){ return d.reply || answerLocally(msg); })
    .catch(function(){ return answerLocally(msg); });
  }
  return Promise.resolve(answerLocally(msg));
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
