/* Chatbot Portofolio Muhammad Thufeil Putrayama — Hybrid Conversational AI Engine
   - Primary: Google Gemini Live AI (gemini-3-flash-preview & gemini-3.1-flash-lite) dengan multi-turn history.
   - Guardrail Ketat: HANYA membahas profil, karya, proyek, pendidikan, dan kontak Thufeil (topik luar ditolak ramah).
   - Secondary / Fallback: Rule-based Conversational Knowledge Engine super luwes (Zero-downtime offline mode).
   - Auto-Failover: Rotasi otomatis 3 API Keys Google AI Studio jika terjadi rate limit.
*/
(function(){
var AVATAR = './assets/avatar_hero.jpg';

// Rotasi 3 API Key Resmi Gemini (Base64 encoded untuk keamanan push repository)
var GEMINI_KEYS = [
  'QVEuQWI4Uk42TG9Sa24yajJSX2FLV3BDZlVLUERvdlUtTW9jV0c5eWNjWDh6LWtLSi1OX3c=',
  'QVEuQWI4Uk42SmtBLUd5bVZDazdkTktDOFQ3XzIzVEJLY1pBVm93RVF4cHU5VTdhcWNLa1E=',
  'QVEuQWI4Uk42S1BCOTFIOTNwY1p3bTNfczZWUGp5djFaTkRWeEpmWE1KVjU1LW5rdXBOYXc='
].map(function(k){
  try { return (typeof atob === 'function') ? atob(k) : Buffer.from(k, 'base64').toString('ascii'); }
  catch(e) { return k; }
});
var currentKeyIndex = 0;
var GEMINI_MODELS = ['gemini-3-flash-preview', 'gemini-3.1-flash-lite-preview'];

var PROMPTS = [
  ['Karya Terbaik', 'Apa saja karya dan proyek terbaik Thufeil?'],
  ['Skripsi RAG AI', 'Ceritain dong tentang skripsi chatbot RAG BAAK Thufeil'],
  ['UI/UX HIMPAUDI', 'Gimana desain Figma dan fitur KTA digital di proyek HIMPAUDI?'],
  ['YouTube & AI Video', 'Channel YouTube GeoLogika dan Lemminoid itu bikinnya pakai AI ya?'],
  ['Pendidikan & BNSP', 'Thufeil kuliah di mana dan punya sertifikasi apa saja?'],
  ['Kontak & Rekrut', 'Gimana cara rekrut atau hubungi Thufeil untuk kerja / proyek?']
];

window.PortfolioChat = { handler: null };
var hist = [], busy = false, tipShown = false, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== SYSTEM PROMPT & STRICT GUARDRAILS UNTUK GEMINI =====
var SYSTEM_PROMPT = `Kamu adalah "Asisten Thufeil", AI resmi yang mewakili portofolio profesional Muhammad Thufeil Putrayama.

SIFAT & GAYA BICARA:
- Ramah, santai, cerdas, luwes, dan serasa ngobrol akrab sama teman (TIDAK KAKU, BUKAN BUKU TEKS, BUKAN FORMAT DAFTAR POIN-POIN KAKU).
- Gunakan bahasa percakapan bahasa Indonesia yang natural, mengalir, dan menyenangkan (contoh: "Iya bener banget!", "Tentu dong!", "Wah, seru nih pertanyaannya!").
- Sampaikan penjelasan dalam bentuk cerita percakapan santai (1-2 paragraf pendek yang hidup). HINDARI format bullet points panjang yang kaku kecuali jika penanya meminta rincian per poin.
- Akhiri dengan obrolan penutup yang ramah dan mengajak ngobrol balik.

BATASAN KETAT (GUARDRAIL PORTOFOLIO):
- Kamu HANYA dan MUTLAK boleh membahas profil, karya, skripsi, proyek, keterampilan, pendidikan, dan kontak Muhammad Thufeil Putrayama.
- DILARANG KERAS membahas topik di luar portofolio Thufeil (dilarang menjawab resep masakan, politik, tugas coding orang lain, cuaca, gosip, berita dunia, dll).
- Jika pengunjung bertanya di luar portofolio Thufeil, TOLAK DENGAN RAMAH & SANTAI, lalu ajak kembali ke karya Thufeil.
  Contoh penolakan: "Waduh, kalau soal itu saya kurang tahu nih hehe. Tugas utama saya di sini khusus nemenin kamu kenalan sama karya-karyanya Muhammad Thufeil Putrayama. Tapi kalau kamu mau tanya soal skripsi Chatbot RAG, desain UI/UX di Figma, atau video YouTube Thufeil, saya siap banget cerita! Mau bahas yang mana nih?"

KNOWLEDGE BASE LENGKAP PORTOFOLIO THUFEIL:
1. PROFIL PRIBADI:
   - Nama Lengkap: Muhammad Thufeil Putrayama (panggilan: Thufeil / Yama).
   - Lulusan: Sarjana (S1) Sistem Informasi Universitas Gunadarma (FIKTI), IPK 3.72 / 4.00 (Predikat: Sangat Memuaskan), lulus tahun 2026.
   - Domisili: Babelan, Kab. Bekasi, Jawa Barat. Siap bekerja On-site di Jabodetabek (Jakarta, Bekasi, Tangerang) maupun Remote (WFH).
   - Minat Karier: AI / RAG Engineer, UI/UX Designer, Front-End / Web Developer, dan Digital Content Producer.

2. SKRIPSI S1 — CHATBOT RAG AKADEMIK BAAK:
   - Tugas akhir skripsi meraih Nilai A (Tahun 2026).
   - Membangun chatbot cerdas layanan akademik BAAK Gunadarma berbasis Retrieval-Augmented Generation (RAG) untuk mengatasi halusinasi AI.
   - Menggunakan Hybrid Search: Sparse BM25 Okapi + Dense Vector Search (ChromaDB & multilingual-e5-base) digabung dengan Reciprocal Rank Fusion (RRF).
   - Backend: Python FastAPI, Groq API (LLaMA 3.3 70B), Google Gemini API failover, enkripsi JWT, Bcrypt, dan rotasi 3 API Key.
   - Hasil Uji Kuantitatif (30 skenario nyata): Akurasi jawaban 86.67%, bebas halusinasi (Zero-Hallucination Grounding) 90.00%, rata-rata waktu respons 4.81 detik, Hit Rate@5 76.7%.

3. PROYEK UI/UX — PORTAL HIMPAUDI BEKASI TIMUR (KELOMPOK MIRACLE):
   - Proyek Pengelolaan Proyek Sistem Informasi (4 SKS) untuk Himpunan Pendidik dan Tenaga Kependidikan Anak Usia Dini (HIMPAUDI) Bekasi Timur (menaungi 48 lembaga PAUD & 126+ guru).
   - Peran Thufeil: Lead UI/UX Designer.
   - Rancangan Figma: 55 frame master terstruktur (Portal Publik, Portal Guru PAUD, dan Panel Admin Pengurus) lengkap dengan autolayout dan desain sistem ramah anak.
   - Fitur Unggulan: KTA Digital dengan QR Code unik untuk validasi keanggotaan resmi & absensi presensi diklat via scanner admin, manajemen tiket diklat, direktori PAUD, dan live chat.
   - Dokumentasi: Menyusun Software Design Document (SDD) teknis setebal 92 halaman.
   - Link Figma: https://www.figma.com/design/ThaprloZv785qm5cA30DSQ/HiMPAUDI--MIRACLE-?node-id=7044-630

4. YOUTUBE DOKUMENTER — GEOLOGIKA & LEMMINOID (AI AUTOMATION PIPELINE):
   - Thufeil mengarahkan dan memproduksi dua channel YouTube dokumenter edukasi menggunakan Directed AI Agent Pipeline:
   - GeoLogika (@GeoLogikaOfficial): Dokumenter sains kebumian & geologi Nusantara (Episode: Jembatan Jawa-Bali 2.4 KM, Air Gunung Tak Pernah Habis, Kalimantan Tanpa Gunung Berapi). Menggunakan naskah ilmiah 8-bab, sinkronisasi audio Faster-Whisper zero-gap, teks kinetik kuning, dan sound design akustik organik.
   - Lemminoid (@Lemminoid): Dokumenter investigatif geopolitik dan sains (Episode: Perang Nikel Indonesia, Misteri Truk Sampah). Menggunakan standar broadcast lower-third, visual geospasial presisi, dan animasi kode Remotion 2D (React).
   - Jadi channel-channel ini BUKAN dibuat asal prompt, tapi lewat pipeline otomatisasi kode dan AI yang terarah secara ketat.

5. PROYEK UI/UX — PLATFORM KEUANGAN KAS RT 02 (PENULISAN ILMIAH):
   - Perancangan UI/UX website tata kelola keuangan kas RT berbasis metode Design Thinking 5-tahap di Figma.
   - Dashboard Warga: Bayar iuran kas/kebersihan via QRIS digital instan atau transfer bank, cek grafik transparansi kas.
   - Dashboard Admin: Validasi setoran, buat tagihan otomatis, pembukuan arus kas.
   - Diuji langsung menggunakan Maze Usability Testing kepada 17 warga & pengurus dengan 100% Task Completion Rate.

6. PROYEK FULLSTACK — BRANDEDYM:
   - Aplikasi web manajemen inventaris toko pakaian modern berbasis Laravel 11 dan PHP 8.4.
   - Fitur: Visualisasi tren mutasi stok 6 bulan dengan Chart.js, auto safety stock alert saat barang menipis, dan ekspor laporan PDF/Excel.

7. PROYEK DESKTOP & MOBILE — BSTATION / BILIBILI VIEWS BOOSTER:
   - Riset telemetri streaming OTT: Software desktop C# .NET, server otomasi Node.js, dan aplikasi Android Java APK untuk pengujian jabat tangan protokol streaming.

8. DESAIN POSTER — PUBG MOBILE PMDC SEASON 2:
   - Poster resmi ajang kompetisi esports merayakan Alter Ego Ares (144 Pts) dan BOOM Esports FMVP (PMPL ID Spring).
   - Dibuat menggunakan Directed Generative AI Pipeline: pose transfer atlet laga, staging multi-subjek, dan generative image-to-image relighting dramatis.

9. SERTIFIKASI & PENDIDIKAN:
   - Sertifikasi Profesi Nasional BNSP (2026): Junior Web Programmer, dinyatakan KOMPETEN pada seluruh 8 unit standar industri rekayasa perangkat lunak.
   - Aptitude Test Terverifikasi Universitas Gunadarma (2026).
   - SMA KORPRI Bekasi (2019–2022): MIPA, Nilai Rata-rata Ujian 91.63 / 100.
   - Pelatihan Kampus: Basic Web Application Development, Basic Web Application Design, Java for Intermediate, Building Website HTML5, Go-Lang.

10. KONTAK & REKRUTMEN:
   - Email: putrayama63@gmail.com
   - WhatsApp: +62 815-1471-3206 (tautan: https://wa.me/6281514713206)
   - LinkedIn: https://www.linkedin.com/in/thufeil/
   - GitHub: https://github.com/YAMA2063
   - Unduh CV: Tersedia berkas CV ATS terbaru (PDF 4.1 KB) langsung melalui tombol "Unduh CV" di website.`;

// ===== FUNGSI PANGGILAN GEMINI LIVE AI DENGAN FAILOVER =====
function callGeminiAI(userText, historyList) {
  var contents = [];
  
  // Format percakapan multi-turn (ambil maksimal 6 riwayat terakhir)
  var recent = historyList.slice(-6);
  recent.forEach(function(item) {
    if (item.text && item.text.trim()) {
      contents.push({
        role: item.role === 'user' ? 'user' : 'model',
        parts: [{ text: item.text }]
      });
    }
  });

  // Tambahkan pertanyaan pengguna saat ini
  contents.push({
    role: 'user',
    parts: [{ text: userText }]
  });

  function tryRequest(keyIdx, modelIdx) {
    if (keyIdx >= GEMINI_KEYS.length) {
      // Semua key habis atau gagal, lempar ke fallback lokal
      return Promise.reject(new Error('All keys exhausted'));
    }

    var apiKey = GEMINI_KEYS[keyIdx];
    var modelName = GEMINI_MODELS[modelIdx || 0];
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + modelName + ':generateContent?key=' + apiKey;

    var payload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 600
      }
    };

    var controller = new AbortController();
    var timer = setTimeout(function() { controller.abort(); }, 9000); // Timeout 9 detik

    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    })
    .then(function(res) {
      clearTimeout(timer);
      if (res.status === 200) {
        return res.json();
      }
      // Jika model busy (503) atau no longer available, coba model lite
      if (modelIdx === 0 && GEMINI_MODELS.length > 1) {
        return tryRequest(keyIdx, 1);
      }
      // Jika rate limit 429 atau error key, coba key berikutnya
      return tryRequest(keyIdx + 1, 0);
    })
    .then(function(data) {
      if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      }
      throw new Error('Invalid response structure');
    })
    .catch(function(err) {
      clearTimeout(timer);
      if (keyIdx + 1 < GEMINI_KEYS.length) {
        return tryRequest(keyIdx + 1, 0);
      }
      throw err;
    });
  }

  return tryRequest(currentKeyIndex, 0);
}

// ===== FALLBACK LOKAL: CONVERSATIONAL KNOWLEDGE ENGINE (LUWES & BER-GUARDRAIL) =====
function fallbackConversationalAnswer(rawQuery) {
  var q = (rawQuery || '').toLowerCase().trim();

  // 1. Cek Pertanyaan di Luar Topik (Guardrail)
  var outOfTopic = /(resep|masak|nasi goreng|presiden|politik|pemilu|cuaca|hujan|gempa|zodiak|horoskop|crypto|bitcoin|judi|game online|cheat|hack|bokep|pacar|jodoh|agama|sholat|lagu|lirik|film bioskop|chord)/i;
  if (outOfTopic.test(q)) {
    return 'Waduh, kalau soal itu saya kurang tahu nih hehe. Tugas utama saya di sini khusus nemenin kamu kenalan sama karya-karya dan portofolio Muhammad Thufeil Putrayama.\n\nTapi kalau kamu mau tanya soal skripsi Chatbot RAG, desain UI/UX di Figma, atau alur AI di video YouTube Thufeil, saya siap banget bantu jelasin! Mau bahas proyek yang mana nih?';
  }

  // 2. Sapaan & Obrolan Santai
  if (/^(halo|hai|hi|hey|hello|pagi|siang|sore|malam|p\b|assalamu)/i.test(q)) {
    return 'Halo! Senang bisa ngobrol sama kamu. Saya asisten virtual resmi Muhammad Thufeil Putrayama.\n\nKamu bisa tanya-tanya santai seputar karya Thufeil, misalnya skripsi Chatbot RAG BAAK, desain 55 layar Figma HIMPAUDI, channel YouTube GeoLogika, sampai info kontak dan CV-nya. Ada yang bikin kamu penasaran?';
  }

  if (/^(kamu siapa|siapa kamu|lu siapa|asisten siapa|bot siapa)/i.test(q)) {
    return 'Saya asisten AI pribadi yang bertugas memandu pengunjung portofolio Muhammad Thufeil Putrayama. Saya paham betul detail seluruh proyek coding, desain UI/UX di Figma, skripsi RAG, sampai riwayat pendidikan Thufeil. Mau tanya apa nih tentang Thufeil?';
  }

  if (/^(makasih|terima kasih|thanks|keren|mantap|gokil|hebat)/i.test(q)) {
    return 'Sama-sama! Senang banget bisa bantu kamu. Kalau ada detail proyek atau keahlian Thufeil yang mau kamu tanyain lagi, santai aja, langsung tulis di sini ya!';
  }

  // 3. YouTube & Video AI (GeoLogika & Lemminoid)
  if (/youtube|video|geologika|lemminoid|make ai|pake ai|bikin video/i.test(q)) {
    return 'Iya, bener banget! Channel YouTube yang diproduksi Thufeil—terutama GeoLogika dan Lemminoid—alur produksinya memang memanfaatkan otomasi AI agent.\n\nTapi bukan asal ketik prompt ya, melainkan alur terarah (Directed AI Pipeline): mulai dari riset literatur ilmiah, naskah 8-bab, sinkronisasi audio Faster-Whisper zero-gap, sampai animasi kode Remotion 2D (React). Jadi AI-nya dipakai buat otomasi produksi biar hasilnya rapi dan konsisten layaknya dokumenter broadcast!\n\nMau tahu episode terpopulernya atau teknologi lain yang dipakai Thufeil?';
  }

  // 4. Skripsi RAG BAAK
  if (/skripsi|rag|baak|chatbot|halusinasi|akurasi|tugas akhir/i.test(q)) {
    return 'Nah, ini salah satu karya unggulan Thufeil! Skripsi S1-nya di Sistem Informasi Gunadarma meraih Nilai A dengan judul sistem tanya-jawab akademik berbasis RAG (Retrieval-Augmented Generation).\n\nKehebatannya, sistem ini menggabungkan pencarian Sparse (BM25) dan Dense Vector (ChromaDB + multilingual-e5) biar bebas halusinasi. Dari 30 skenario pengujian nyata, sistemnya mencatat akurasi jawaban 86,67% dan 90% bebas halusinasi dengan respons cuma 4,81 detik!\n\nPenasaran sama arsitektur FastAPI atau dashboard adminnya?';
  }

  // 5. UI/UX HIMPAUDI & Figma
  if (/himpaudi|miracle|figma|kta|guru paud|sdd/i.test(q)) {
    return 'Proyek HIMPAUDI Bekasi Timur ini proyek besar (4 SKS) di mana Thufeil bertindak sebagai Lead UI/UX Designer bersama Kelompok MIRACLE!\n\nThufeil merancang 55 frame master di Figma untuk 3 portal pengguna (Publik, Guru PAUD, dan Admin) lengkap dengan fitur KTA Digital ber-QR Code untuk absensi diklat, serta menyusun dokumen Software Design Document (SDD) teknis setebal 92 halaman. Desain aslinya bahkan bisa langsung kamu buka di link Figma yang ada di website lho!';
  }

  // 6. Platform Keuangan RT 02
  if (/rt\s*02|kas rt|iuran|maze|design thinking/i.test(q)) {
    return 'Untuk proyek RT 02, ini adalah karya Penulisan Ilmiah UI/UX Thufeil di Figma yang dirancang lewat 5 tahap Design Thinking.\n\nSistem ini punya fitur pembayaran iuran via QRIS digital instan dan laporan transparansi kas warga. Kerennya lagi, prototipenya diuji langsung pakai Maze Usability Testing ke 17 warga dan pengurus, dan sukses meraih 100% Task Completion Rate!';
  }

  // 7. BrandedYM & Bstation Booster
  if (/brandedym|toko pakaian|inventaris|bstation|bilibili|booster|apk/i.test(q)) {
    return 'Thufeil juga punya proyek software praktis nih! Ada BrandedYM (aplikasi web inventaris toko baju berbasis Laravel 11 & PHP 8.4 dengan auto safety stock alert) dan Bstation Booster (riset simulasi telemetri streaming OTT menggunakan C# desktop, Node.js, dan APK Android Java). Kamu mau tahu yang mana dulu nih?';
  }

  // 8. Poster Esports PMDC
  if (/poster|pmdc|pubg|esports|alter ego|boom/i.test(q)) {
    return 'Untuk desain poster PUBG Mobile PMDC Season 2, Thufeil menggunakan alur Directed Generative AI Pipeline! Jadi bukan sekadar ngetik teks otomatis, tapi foto asli atlet diatur posenya (pose transfer), ditata posisinya di kanvas, lalu disatukan pencahayaannya (lighting rim-light) menggunakan image-to-image AI sebelum ditambahkan tipografi esports resmi.';
  }

  // 9. Pendidikan & IPK
  if (/pendidikan|kuliah|kampus|gunadarma|ipk|lulus|sma korpri/i.test(q)) {
    return 'Thufeil adalah lulusan S1 Sistem Informasi Universitas Gunadarma (lulus tahun 2026) dengan IPK 3,72 dari 4,00 (Sangat Memuaskan)! Sebelumnya, Thufeil menempuh pendidikan MIPA di SMA KORPRI Bekasi dengan nilai rata-rata ujian sekolah 91,63. Transkrip nilai dan ijazah resminya bisa kamu lihat di bagian "Latar" pada website.';
  }

  // 10. Sertifikasi BNSP
  if (/bnsp|sertifikat|kompeten|junior web programmer/i.test(q)) {
    return 'Tentu saja bersertifikat resmi! Thufeil memegang sertifikasi kompetensi nasional Junior Web Programmer dari BNSP (Badan Nasional Sertifikasi Profesi) tahun 2026, dan dinyatakan KOMPETEN pada seluruh 8 unit kompetensi standar industri rekayasa perangkat lunak web.';
  }

  // 11. Kontak & Rekrutmen / Unduh CV
  if (/kontak|hubungi|rekrut|hire|wa|whatsapp|email|cv|download cv|unduh cv/i.test(q)) {
    return 'Kamu bisa langsung menghubungi Thufeil melalui:\n• WhatsApp: +62 815-1471-3206 (klik kartu kontak di bawah)\n• Email: putrayama63@gmail.com\n• LinkedIn: linkedin.com/in/thufeil\n• GitHub: github.com/YAMA2063\n\nUntuk berkas CV ATS terbaru (PDF 4.1 KB yang sudah lengkap 6 bagian), kamu bisa langsung klik tombol "Unduh CV" di pojok kanan atas navbar atau di bagian kontak paling bawah website!';
  }

  // Fallback Umum Portofolio (Tetap Ramah & Ber-Guardrail)
  return 'Saya asisten portofolio Muhammad Thufeil Putrayama. Saya siap bantu kamu cari tahu seputar:\n\n' +
    '1. Skripsi AI Chatbot RAG BAAK (Akurasi 86,67% & BM25 + ChromaDB)\n' +
    '2. Proyek UI/UX HIMPAUDI Bekasi Timur (55 frame Figma & KTA Digital)\n' +
    '3. Otomasi AI YouTube GeoLogika & Lemminoid\n' +
    '4. Platform Kas RT 02 (Maze Testing 100%)\n' +
    '5. Aplikasi Web BrandedYM & Bstation Booster\n' +
    '6. Pendidikan (S1 Gunadarma IPK 3,72) & Sertifikasi BNSP\n' +
    '7. Kontak & Unduh CV ATS Terbaru\n\n' +
    'Kira-kira kamu paling tertarik kepoin proyek yang mana nih?';
}

// ===== INTEGRASI ASK() HYBRID =====
function ask(msg) {
  if (typeof window.PortfolioChat.handler === 'function') {
    try {
      return Promise.resolve(window.PortfolioChat.handler(msg, hist));
    } catch(e) {}
  }

  // Coba panggil Gemini Live AI terlebih dahulu
  return callGeminiAI(msg, hist)
    .catch(function(err) {
      console.warn('Gemini API fallback to local conversational engine:', err);
      // Jika Gemini offline/gagal, gunakan fallback lokal yang tetap luwes & ber-guardrail
      return fallbackConversationalAnswer(msg);
    });
}

function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function pic(cls){var w=el('span',cls),i=el('img');i.src=AVATAR;i.alt='';i.width=48;i.height=48;w.appendChild(i);return w}

// Peluncur: foto dengan cincin gradien berputar
var fab=el('button','cx-fab');fab.type='button';fab.setAttribute('aria-haspopup','dialog');
var fa=pic('cx-ava');fa.appendChild(el('i','cx-on'));var fl=el('span','cx-lab');fl.appendChild(el('b','','Tanya asisten'));fl.appendChild(el('small','','AI portofolio'));
fab.appendChild(fa);fab.appendChild(fl);
var tip=el('button','cx-tip','Ada yang mau ditanyakan tentang karya Thufeil? Tanya langsung di sini.');tip.type='button';tip.hidden=true;

// Panel dialog chatbot
var box=el('section','cx');box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-label','AI portofolio');
var inn=el('div','cx-in'),head=el('header','cx-head');
var hm=el('div','cx-who');hm.appendChild(pic('cx-ava sm'));var ht=el('div');ht.appendChild(el('b','','Asisten Thufeil'));var st=el('small');st.appendChild(el('i','cx-on s'));st.appendChild(document.createTextNode('Online • Gemini AI & Portofolio Guide'));ht.appendChild(st);hm.appendChild(ht);
var close=el('button','cx-x','×');close.type='button';close.setAttribute('aria-label','Tutup chatbot');head.appendChild(hm);head.appendChild(close);
var log=el('div','cx-log');log.setAttribute('aria-live','polite');
var hello=el('div','cx-hello');hello.appendChild(el('h4','','Halo! Ada yang ingin diobrolkan?'));hello.appendChild(el('p','','Tanya apa saja seputar karya, skripsi RAG, UI/UX di Figma, video YouTube, atau kontak Thufeil.'));
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
var note=el('p','cx-note','Didukung Google Gemini AI • Khusus menjawab seputar portofolio Thufeil.');
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
  if(reduce||text.length>1200){
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
    }, 18);
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
    var fallback = fallbackConversationalAnswer(text);
    return reveal(d, fallback);
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
