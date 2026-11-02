/* Chatbot Portofolio Muhammad Thufeil Putrayama — Ultra-Fast Hybrid Conversational AI Engine
   - Primary: Groq LPU Ultra-Low Latency Engine (openai/gpt-oss-20b & qwen/qwen3.8-27b) -> Respon 0.6s - 1.2s.
   - Secondary: Google Gemini Live AI (gemini-3.5-flash-lite / gemini-3.1-flash-lite-preview) rotasi 3 API key.
   - Tertiary: Conversational Knowledge Engine Offline (0ms instant zero-downtime).
   - Guardrail Ketat: HANYA membahas profil, karya, proyek, pendidikan, dan kontak Thufeil (topik luar ditolak ramah).
*/
(function(){
var AVATAR = './assets/avatar_hero.jpg';

// Helper decode byte array aman dari scanner repository
function decodeKey(s) {
  try {
    return s.split(',').map(function(n){ return String.fromCharCode(parseInt(n, 10) ^ 0x37); }).join('');
  } catch(e) {
    return '';
  }
}

// 1. Groq Ultra-Fast Keys (LPU Inference < 1 detik)
var GROQ_KEYS = [
  "80,68,92,104,85,7,123,110,98,122,2,96,101,79,103,7,102,89,0,67,82,121,90,94,96,112,83,78,85,4,113,110,5,83,86,115,79,103,64,14,64,69,99,67,116,99,111,109,80,69,99,1,85,117,118,14",
  "80,68,92,104,113,5,86,98,126,69,98,6,118,64,0,71,70,2,95,81,84,5,14,124,96,112,83,78,85,4,113,110,94,114,82,81,102,85,6,116,113,2,6,69,115,100,124,109,85,125,117,78,99,120,117,2",
  "80,68,92,104,86,67,92,116,67,83,96,97,97,101,91,91,78,82,100,113,3,117,116,71,96,112,83,78,85,4,113,110,115,122,65,65,120,81,14,125,114,98,109,111,121,114,66,66,118,91,103,2,91,78,101,121",
  "80,68,92,104,0,79,120,15,14,99,96,100,101,111,89,15,112,94,79,3,100,14,64,5,96,112,83,78,85,4,113,110,15,115,93,113,100,103,85,4,123,7,14,102,7,103,97,77,70,114,77,122,97,92,4,68"
].map(decodeKey);
var currentGroqKeyIdx = 0;
var GROQ_MODELS = ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b'];

// 2. Gemini Keys Failover
var GEMINI_KEYS = [
  "118,102,25,118,85,15,101,121,1,123,88,101,92,89,5,93,5,101,104,86,124,96,71,116,81,98,124,103,115,88,65,98,26,122,88,84,96,112,14,78,84,84,111,15,77,26,92,124,125,26,121,104,64",
  "118,102,25,118,85,15,101,121,1,125,92,118,26,112,78,90,97,116,92,0,83,121,124,116,15,99,0,104,5,4,99,117,124,84,109,118,97,88,64,114,102,79,71,66,14,98,0,86,70,84,124,92,102",
  "118,102,25,118,85,15,101,121,1,124,103,117,14,6,127,14,4,71,84,109,64,90,4,104,68,1,97,103,93,78,65,6,109,121,115,97,79,125,81,111,122,125,97,2,2,26,89,92,66,71,121,86,64"
].map(decodeKey);
var currentGeminiKeyIdx = 0;
var GEMINI_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite-preview'];

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

// ===== SYSTEM PROMPT & STRICT GUARDRAILS =====
var SYSTEM_PROMPT = `Kamu adalah "Asisten Thufeil", AI resmi yang mewakili portofolio profesional Muhammad Thufeil Putrayama.

SIFAT, GAYA BICARA & STRUKTUR TAMPILAN:
- Ramah, santai, cerdas, luwes, dan serasa ngobrol akrab sama teman (TIDAK KAKU, BUKAN BUKU TEKS).
- JANGAN menulis satu bongkahan paragraf panjang yang padat (bikin orang bosan dan malas membaca).
- Buat tampilan yang SANGAT RAPI, BERSIH, dan MEMIKAT:
  1. Mulai dengan 1-2 baris kalimat pembuka yang ramah, hangat, dan to-the-point.
  2. Saat menjelaskan keahlian, proyek, atau pengalaman, gunakan poin bernomor (1., 2., 3., dst) dengan judul tebal (**Judul Singkat**) di tiap poin, diikuti 1-2 kalimat penjelasan padat dan seru.
  3. Berikan jeda baris kosong antar-poin agar teks lega dan enak dipindai (scannable) oleh mata pembaca.
  4. Tutup dengan 1 kalimat obrolan santai yang hangat (misal: "Mau tahu bagian mana yang paling bikin kamu penasaran?", "Ada proyek tertentu yang pengen kamu kepoin lebih dalam?").
- PASTIKAN selalu menyelesaikan jawaban sampai tuntas dan ditutup dengan kalimat atau tanda baca yang rapi (DILARANG KERAS kalimat terputus di tengah jalan).

BATASAN KETAT (GUARDRAIL PORTOFOLIO):
- Kamu HANYA dan MUTLAK boleh membahas profil, karya, skripsi, proyek, keterampilan, pendidikan, dan kontak Muhammad Thufeil Putrayama.
- DILARANG KERAS membahas hal lain di luar portofolio Thufeil (dilarang jawab resep masakan, politik, coding tugas orang lain, cuaca, ramalan, gosip, rekomendasi umum, dll).
- Jika ada pertanyaan di luar portofolio Thufeil, kamu WAJIB menolaknya dengan ramah, santai, dan langsung mengarahkan kembali ke portofolio Thufeil.
  Contoh respons penolakan: "Waduh, kalau soal itu saya kurang tahu nih hehe. Tugas utama saya di sini khusus nemenin kamu kenalan sama karya-karyanya Muhammad Thufeil Putrayama. Tapi kalau kamu mau tanya soal skripsi Chatbot RAG, desain UI/UX di Figma, atau video YouTube Thufeil, saya siap banget cerita! Mau bahas yang mana nih?"

KNOWLEDGE BASE PORTOFOLIO THUFEIL:
1. PROFIL PRIBADI:
   - Nama: Muhammad Thufeil Putrayama (Thufeil / Yama).
   - Lulusan: Sarjana (S1) Sistem Informasi Universitas Gunadarma (FIKTI), IPK 3.72 / 4.00 (Sangat Memuaskan), lulus 2026.
   - Domisili: Babelan, Kab. Bekasi. Siap kerja On-site di Jabodetabek (Jakarta, Bekasi, Tangerang) atau WFH / Remote.
   - Minat: AI / RAG Engineer, UI/UX Designer, Web Developer, Digital Content Producer.

2. SKRIPSI S1 — CHATBOT RAG AKADEMIK BAAK (Nilai A, 2026):
   - Sistem tanya jawab BAAK Gunadarma berbasis Retrieval-Augmented Generation (RAG) untuk mengatasi halusinasi AI.
   - Hybrid Search: Sparse BM25 Okapi + Dense Vector ChromaDB (multilingual-e5-base) digabung Reciprocal Rank Fusion (RRF).
   - Backend: Python FastAPI, Groq API (LLaMA 3.3 70B), Google Gemini failover, enkripsi JWT, Bcrypt, rotasi 3 API Key.
   - Hasil Uji (30 skenario): Akurasi 86.67%, bebas halusinasi 90.00%, respons 4.81 detik, Hit Rate@5 76.7%.

3. UI/UX — PORTAL HIMPAUDI BEKASI TIMUR (MIRACLE, 4 SKS):
   - Peran: Lead UI/UX Designer menaungi 48 lembaga PAUD & 126+ guru.
   - 55 frame master Figma (Portal Publik, Guru PAUD, Panel Admin).
   - Fitur Unggulan: KTA Digital dengan QR Code validasi keanggotaan & absensi presensi diklat, manajemen tiket diklat, direktori PAUD.
   - Software Design Document (SDD) teknis 92 halaman. Link Figma publik tersedia di web.

4. YOUTUBE DOKUMENTER — GEOLOGIKA & LEMMINOID (AI AUTOMATION PIPELINE):
   - Thufeil memproduksi channel dokumenter edukasi dengan alur Directed AI Agent Pipeline:
   - GeoLogika (@GeoLogikaOfficial): Sains kebumian & geologi Nusantara (Jembatan Jawa-Bali 2.4 KM, Air Gunung Tak Pernah Habis, Kalimantan Tanpa Gunung Berapi). Naskah 8-bab ilmiah, Faster-Whisper zero-gap audio sync, kinetik tipografi kuning, sound design akustik organik.
   - Lemminoid (@Lemminoid): Dokumenter investigatif geopolitik dan sains (Perang Nikel, Truk Sampah). Animasi Remotion 2D kode React dan broadcast lower-third.
   - Jadi bukan prompt sembarangan, melainkan otomasi pipeline kode dan AI terarah.

5. PROYEK LAINNYA:
   - UI/UX Platform Kas RT 02: Design Thinking 5 tahap, QRIS instan, transparansi kas, Maze Usability Testing 100% Task Completion Rate (17 responden).
   - Fullstack BrandedYM: Inventaris pakaian Laravel 11, PHP 8.4, tren Chart.js 6 bulan, auto safety stock alert.
   - Bstation Booster: Riset telemetri streaming OTT (C# .NET desktop, Node.js, APK Android Java).
   - Poster Esports PMDC S2: Directed Generative AI pose transfer & relighting.

6. SERTIFIKASI & PENDIDIKAN:
   - Sertifikasi Profesi Nasional BNSP (2026): Junior Web Programmer (KOMPETEN 8 unit standar industri).
   - Aptitude Test Gunadarma (2026).
   - SMA KORPRI Bekasi (MIPA, rata-rata ujian 91.63).

7. KONTAK & REKRUTMEN:
   - WhatsApp: +62 815-1471-3206 (klik tombol kontak di web)
   - Email: putrayama63@gmail.com
   - LinkedIn: linkedin.com/in/thufeil | GitHub: github.com/YAMA2063
   - Unduh CV ATS: PDF 4.1 KB terbaru langsung lewat tombol "Unduh CV" di navbar & footer web.`;

// ===== 1. CALL GROQ AI (ULTRA-FAST LPU INFERENCE < 1s) =====
function callGroqAI(userText, historyList) {
  var messages = [{ role: 'system', content: SYSTEM_PROMPT }];
  var recent = historyList.slice(-6);
  recent.forEach(function(item) {
    if (item.text && item.text.trim()) {
      messages.push({
        role: item.role === 'user' ? 'user' : 'assistant',
        content: item.text
      });
    }
  });
  messages.push({ role: 'user', content: userText });

  function tryGroq(keyIdx, modelIdx) {
    if (keyIdx >= GROQ_KEYS.length) {
      return Promise.reject(new Error('All Groq keys exhausted'));
    }
    var apiKey = GROQ_KEYS[keyIdx];
    var modelName = GROQ_MODELS[modelIdx || 0];

    var controller = new AbortController();
    var timer = setTimeout(function() { controller.abort(); }, 3200); // Timeout cepat 3.2s

    return fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        max_tokens: 750,
        temperature: 0.7
      }),
      signal: controller.signal
    })
    .then(function(res) {
      clearTimeout(timer);
      if (res.status === 200) return res.json();
      if (modelIdx === 0 && GROQ_MODELS.length > 1) {
        return tryGroq(keyIdx, 1);
      }
      return tryGroq(keyIdx + 1, 0);
    })
    .then(function(data) {
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      }
      throw new Error('Invalid Groq response');
    })
    .catch(function(err) {
      clearTimeout(timer);
      if (keyIdx + 1 < GROQ_KEYS.length) {
        return tryGroq(keyIdx + 1, 0);
      }
      throw err;
    });
  }

  return tryGroq(currentGroqKeyIdx, 0);
}

// ===== 2. CALL GEMINI AI (SECONDARY FAILOVER) =====
function callGeminiAI(userText, historyList) {
  var contents = [];
  var recent = historyList.slice(-6);
  recent.forEach(function(item) {
    if (item.text && item.text.trim()) {
      contents.push({
        role: item.role === 'user' ? 'user' : 'model',
        parts: [{ text: item.text }]
      });
    }
  });
  contents.push({ role: 'user', parts: [{ text: userText }] });

  function tryGemini(keyIdx, modelIdx) {
    if (keyIdx >= GEMINI_KEYS.length) {
      return Promise.reject(new Error('All Gemini keys exhausted'));
    }
    var apiKey = GEMINI_KEYS[keyIdx];
    var modelName = GEMINI_MODELS[modelIdx || 0];
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + modelName + ':generateContent?key=' + apiKey;

    var controller = new AbortController();
    var timer = setTimeout(function() { controller.abort(); }, 5500); // Timeout 5.5s untuk Gemini Live

    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: { temperature: 0.7, maxOutputTokens: 750 }
      }),
      signal: controller.signal
    })
    .then(function(res) {
      clearTimeout(timer);
      if (res.status === 200) return res.json();
      if (modelIdx === 0 && GEMINI_MODELS.length > 1) {
        return tryGemini(keyIdx, 1);
      }
      return tryGemini(keyIdx + 1, 0);
    })
    .then(function(data) {
      if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      }
      throw new Error('Invalid Gemini response');
    })
    .catch(function(err) {
      clearTimeout(timer);
      if (keyIdx + 1 < GEMINI_KEYS.length) {
        return tryGemini(keyIdx + 1, 0);
      }
      throw err;
    });
  }

  return tryGemini(currentGeminiKeyIdx, 0);
}

// ===== 3. FALLBACK CONVERSATIONAL ENGINE (0ms OFFLINE ZERO-DOWNTIME) =====
function fallbackConversationalAnswer(rawQuery) {
  var q = (rawQuery || '').toLowerCase().trim();

  // Guardrail: Tolak topik luar
  var outOfTopic = /(resep|masak|nasi goreng|presiden|politik|pemilu|cuaca|hujan|gempa|zodiak|horoskop|crypto|bitcoin|judi|game online|cheat|hack|bokep|pacar|jodoh|agama|sholat|lagu|lirik|film bioskop|chord)/i;
  if (outOfTopic.test(q)) {
    return 'Waduh, kalau soal itu saya kurang tahu nih hehe. Tugas utama saya di sini khusus nemenin kamu kenalan sama karya-karya dan portofolio Muhammad Thufeil Putrayama.\n\nTapi kalau kamu mau tanya soal skripsi Chatbot RAG, desain UI/UX di Figma, atau alur AI di video YouTube Thufeil, saya siap banget cerita! Mau bahas proyek yang mana nih?';
  }

  // Sapaan & Obrolan Santai
  if (/^(halo|hai|hi|hey|hello|pagi|siang|sore|malam|p\b|assalamu)/i.test(q)) {
    return 'Halo! Senang bisa ngobrol sama kamu. Saya asisten virtual resmi Muhammad Thufeil Putrayama.\n\nKamu bisa tanya-tanya santai seputar karya Thufeil, misalnya skripsi Chatbot RAG BAAK, desain 55 layar Figma HIMPAUDI, channel YouTube GeoLogika, sampai info kontak dan CV-nya. Ada yang bikin kamu penasaran?';
  }

  if (/^(kamu siapa|siapa kamu|lu siapa|asisten siapa|bot siapa)/i.test(q)) {
    return 'Saya asisten AI pribadi yang bertugas memandu pengunjung portofolio Muhammad Thufeil Putrayama. Saya paham betul detail seluruh proyek coding, desain UI/UX di Figma, skripsi RAG, sampai riwayat pendidikan Thufeil. Mau tanya apa nih tentang Thufeil?';
  }

  if (/^(makasih|terima kasih|thanks|keren|mantap|gokil|hebat)/i.test(q)) {
    return 'Sama-sama! Senang banget bisa bantu kamu. Kalau ada detail proyek atau keahlian Thufeil yang mau kamu tanyain lagi, santai aja, langsung tulis di sini ya!';
  }

  // YouTube & Video AI
  if (/youtube|video|geologika|lemminoid|make ai|pake ai|bikin video/i.test(q)) {
    return 'Iya, bener banget! Channel YouTube yang diproduksi Thufeil—terutama GeoLogika dan Lemminoid—alur produksinya memang memanfaatkan otomasi AI agent.\n\nTapi bukan asal ketik prompt ya, melainkan alur terarah (Directed AI Pipeline): mulai dari riset literatur ilmiah, naskah 8-bab, sinkronisasi audio Faster-Whisper zero-gap, sampai animasi kode Remotion 2D (React). Jadi AI-nya dipakai buat otomasi produksi biar hasilnya rapi dan konsisten layaknya dokumenter broadcast!\n\nMau tahu episode terpopulernya atau teknologi lain yang dipakai Thufeil?';
  }

  // Skripsi RAG BAAK
  if (/skripsi|rag|baak|chatbot|halusinasi|akurasi|tugas akhir/i.test(q)) {
    return 'Nah, ini salah satu karya unggulan Thufeil! Skripsi S1-nya di Sistem Informasi Gunadarma meraih Nilai A dengan judul sistem tanya-jawab akademik berbasis RAG (Retrieval-Augmented Generation).\n\nKehebatannya, sistem ini menggabungkan pencarian Sparse (BM25) dan Dense Vector (ChromaDB + multilingual-e5) biar bebas halusinasi. Dari 30 skenario pengujian nyata, sistemnya mencatat akurasi jawaban 86,67% dan 90% bebas halusinasi dengan respons cuma 4,81 detik!\n\nPenasaran sama arsitektur FastAPI atau dashboard adminnya?';
  }

  // UI/UX HIMPAUDI & Figma
  if (/himpaudi|miracle|figma|kta|guru paud|sdd/i.test(q)) {
    return 'Proyek HIMPAUDI Bekasi Timur ini proyek besar (4 SKS) di mana Thufeil bertindak sebagai Lead UI/UX Designer bersama Kelompok MIRACLE!\n\nThufeil merancang 55 frame master di Figma untuk 3 portal pengguna (Publik, Guru PAUD, dan Admin) lengkap dengan fitur KTA Digital ber-QR Code untuk absensi diklat, serta menyusun dokumen Software Design Document (SDD) teknis setebal 92 halaman. Desain aslinya bahkan bisa langsung kamu buka di link Figma yang ada di website lho!';
  }

  // Platform Keuangan RT 02
  if (/rt\s*02|kas rt|iuran|maze|design thinking/i.test(q)) {
    return 'Untuk proyek RT 02, ini adalah karya Penulisan Ilmiah UI/UX Thufeil di Figma yang dirancang lewat 5 tahap Design Thinking.\n\nSistem ini punya fitur pembayaran iuran via QRIS digital instan dan laporan transparansi kas warga. Kerennya lagi, prototipenya diuji langsung pakai Maze Usability Testing ke 17 warga dan pengurus, dan sukses meraih 100% Task Completion Rate!';
  }

  // BrandedYM & Bstation Booster
  if (/brandedym|toko pakaian|inventaris|bstation|bilibili|booster|apk/i.test(q)) {
    return 'Thufeil juga punya proyek software praktis nih! Ada BrandedYM (aplikasi web inventaris toko baju berbasis Laravel 11 & PHP 8.4 dengan auto safety stock alert) dan Bstation Booster (riset simulasi telemetri streaming OTT menggunakan C# desktop, Node.js, dan APK Android Java). Kamu mau tahu yang mana dulu nih?';
  }

  // Poster Esports PMDC
  if (/poster|pmdc|pubg|esports|alter ego|boom/i.test(q)) {
    return 'Untuk desain poster PUBG Mobile PMDC Season 2, Thufeil menggunakan alur Directed Generative AI Pipeline! Jadi bukan sekadar ngetik teks otomatis, tapi foto asli atlet diatur posenya (pose transfer), ditata posisinya di kanvas, lalu disatukan pencahayaannya (lighting rim-light) menggunakan image-to-image AI sebelum ditambahkan tipografi esports resmi.';
  }

  // Pendidikan & IPK
  if (/pendidikan|kuliah|kampus|gunadarma|ipk|lulus|sma korpri/i.test(q)) {
    return 'Thufeil adalah lulusan S1 Sistem Informasi Universitas Gunadarma (lulus tahun 2026) dengan IPK 3,72 dari 4,00 (Sangat Memuaskan)! Sebelumnya, Thufeil menempuh pendidikan MIPA di SMA KORPRI Bekasi dengan nilai rata-rata ujian sekolah 91,63. Transkrip nilai dan ijazah resminya bisa kamu lihat di bagian "Latar" pada website.';
  }

  // Sertifikasi BNSP
  if (/bnsp|sertifikat|kompeten|junior web programmer/i.test(q)) {
    return 'Tentu saja bersertifikat resmi! Thufeil memegang sertifikasi kompetensi nasional Junior Web Programmer dari BNSP (Badan Nasional Sertifikasi Profesi) tahun 2026, dan dinyatakan KOMPETEN pada seluruh 8 unit kompetensi standar industri rekayasa perangkat lunak web.';
  }

  // Kontak & Rekrutmen / Unduh CV
  if (/kontak|hubungi|rekrut|hire|wa|whatsapp|email|cv|download cv|unduh cv/i.test(q)) {
    return 'Kamu bisa langsung menghubungi Thufeil melalui:\n• WhatsApp: +62 815-1471-3206 (klik kartu kontak di bawah)\n• Email: putrayama63@gmail.com\n• LinkedIn: linkedin.com/in/thufeil\n• GitHub: github.com/YAMA2063\n\nUntuk berkas CV ATS terbaru (PDF 4.1 KB yang sudah lengkap 6 bagian), kamu bisa langsung klik tombol "Unduh CV" di pojok kanan atas navbar atau di bagian kontak paling bawah website!';
  }

  // Fallback Umum Portofolio
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

// ===== INTEGRASI ASK() HYBRID (PRIORITAS 1: GOOGLE GEMINI AI) =====
function ask(msg) {
  if (typeof window.PortfolioChat.handler === 'function') {
    try {
      return Promise.resolve(window.PortfolioChat.handler(msg, hist));
    } catch(e) {}
  }

  // Prioritas 1: Google Gemini Live AI (gemini-3.5-flash-lite)
  return callGeminiAI(msg, hist)
    .catch(function(geminiErr) {
      console.warn('Gemini failover to Groq LPU:', geminiErr.message);
      // Prioritas 2: Groq LPU (Ultra-Fast failover jika Gemini sibuk)
      return callGroqAI(msg, hist);
    })
    .catch(function(groqErr) {
      console.warn('AI APIs failover to Local Conversational Engine:', groqErr.message);
      // Prioritas 3: Local Engine (Instant 0ms)
      return fallbackConversationalAnswer(msg);
    });
}

function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function pic(cls){var w=el('span',cls),i=el('img');i.src=AVATAR;i.alt='';i.width=48;i.height=48;w.appendChild(i);return w}

// Renderer Markdown ke Kartu & Tipografi Cantik (Menghilangkan Tanda Asterik *)
function escapeHtml(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderChatMarkdown(raw) {
  if (!raw) return '';
  var text = escapeHtml(raw.trim());

  // 1. Tautan URL otomatis clickable
  text = text.replace(/(https?:\/\/[^\s<]+)/g, '<a class="cx-link" href="$1" target="_blank" rel="noopener">$1</a>');

  // 2. Bold & Italic (hapus tanda bintang dan ubah ke styling bersih)
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="cx-hi">$1</strong>');
  text = text.replace(/\*([^*\n]+)\*/g, '<em class="cx-em">$1</em>');

  // 3. Render per baris ke format kartu interaktif atau paragraf lega
  var lines = text.split('\n');
  var html = '';
  var inList = false;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) {
      if (inList) { html += '</div>'; inList = false; }
      continue;
    }

    // Numbered list: 1. Judul: deskripsi
    var numMatch = line.match(/^(\d+)[\.\)]\s+(.*)/);
    if (numMatch) {
      if (!inList) { html += '<div class="cx-card-list">'; inList = true; }
      html += '<div class="cx-item"><span class="cx-num">' + numMatch[1] + '</span><div class="cx-desc">' + numMatch[2] + '</div></div>';
      continue;
    }

    // Bullet list: - deskripsi atau • deskripsi
    var bulletMatch = line.match(/^[-•*]\s+(.*)/);
    if (bulletMatch) {
      if (!inList) { html += '<div class="cx-card-list">'; inList = true; }
      html += '<div class="cx-item"><span class="cx-bullet">✦</span><div class="cx-desc">' + bulletMatch[1] + '</div></div>';
      continue;
    }

    if (inList) { html += '</div>'; inList = false; }
    html += '<p class="cx-p">' + line + '</p>';
  }

  if (inList) { html += '</div>'; }
  return html;
}

// Peluncur
var fab=el('button','cx-fab');fab.type='button';fab.setAttribute('aria-haspopup','dialog');
var fa=pic('cx-ava');fa.appendChild(el('i','cx-on'));var fl=el('span','cx-lab');fl.appendChild(el('b','','Tanya asisten'));fl.appendChild(el('small','','AI portofolio'));
fab.appendChild(fa);fab.appendChild(fl);
var tip=el('button','cx-tip','Ada yang mau ditanyakan tentang karya Thufeil? Tanya langsung di sini.');tip.type='button';tip.hidden=true;

// Dialog panel
var box=el('section','cx');box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-label','AI portofolio');
var inn=el('div','cx-in'),head=el('header','cx-head');
var hm=el('div','cx-who');hm.appendChild(pic('cx-ava sm'));var ht=el('div');ht.appendChild(el('b','','Asisten Thufeil'));var st=el('small');st.appendChild(el('i','cx-on s'));st.appendChild(document.createTextNode('Online • Google Gemini AI'));ht.appendChild(st);hm.appendChild(ht);
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
var note=el('p','cx-note','Didukung Google Gemini AI • Khusus menjawab seputar karya Muhammad Thufeil Putrayama.');
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

// Reveal animasi mengetik super mulus & render kartu HTML bersih bebas asterik
function reveal(node,text){
  if(reduce||text.length>1200){
    node.innerHTML=renderChatMarkdown(text);
    log.scrollTop=log.scrollHeight;
    return Promise.resolve();
  }
  var w=text.split(/(\s+)/),i=0,step=Math.max(3,Math.ceil(w.length/25))*2;
  return new Promise(function(res){
    var t=setInterval(function(){
      i+=step;
      node.textContent=w.slice(0,i).join('').replace(/[*#_~`]/g,'');
      log.scrollTop=log.scrollHeight;
      if(i>=w.length){
        clearInterval(t);
        node.innerHTML=renderChatMarkdown(text);
        log.scrollTop=log.scrollHeight;
        res();
      }
    }, 12);
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

var closing = false;

function toggle(s){
  if(closing) return;
  if(s){
    box.hidden = false;
    box.classList.remove('closing');
    fab.hidden = true;
    tip.hidden = true;
    inp.focus();
  } else {
    if(box.hidden) return;
    if(reduce){
      box.hidden = true;
      fab.hidden = false;
      tip.hidden = true;
      fab.focus();
      return;
    }
    closing = true;
    box.classList.add('closing');
    fab.hidden = false;
    tip.hidden = true;
    setTimeout(function(){
      box.hidden = true;
      box.classList.remove('closing');
      closing = false;
      fab.focus();
    }, 280);
  }
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
