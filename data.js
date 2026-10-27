/* ===== DATA PRESENTASI DAN SERTIFIKAT =====
   Cukup tambah isi array di bawah, tidak perlu menyentuh berkas lain.

   Menambah layar ke proyek yang ada:
     tambah satu baris {img:'./assets/nama-file.png', title:'Judul layar', note:'Catatan untuk klien'} di dalam screens.
   Menambah proyek baru:
     salin satu blok proyek (dari { id: ... sampai }, ), ganti isinya.
     device:'phone' dipakai untuk tampilan ponsel (bingkai tegak), selain itu bingkai browser.
   Menambah sertifikat:
     taruh gambarnya di assets/sertifikat/, lalu tambah satu baris di CERTS. img boleh dikosongkan.
     cat: kelompok untuk tombol filter (misalnya 'Sertifikasi', 'Pelatihan', 'Lomba'). Filter muncul otomatis.
     featured:true menampilkan satu sertifikat sebagai kartu besar (cukup satu, yang paling penting). */
window.SHOWCASE=[
{id:'rt02',name:'Platform Iuran dan Kas RT 02',url:'iuran-kas-rt02 (prototipe Figma)',screens:[
 {img:'./assets/figma_rt02_landing.jpg',title:'Beranda dan heatmap Maze',note:'Beranda diuji di Maze bersama 17 partisipan. Seluruhnya berhasil lanjut dari layar ini, jadi tombol utama sudah tepat sasaran.'},
 {img:'./assets/figma_rt02_dashboard.png',title:'Dashboard warga',note:'Tagihan tertunda, riwayat pembayaran terbaru, grafik tren kas bulanan, dan diagram alokasi dana RT.'},
 {img:'./assets/figma_rt02_admin.png',title:'Dashboard admin',note:'Kontrol kas RT, aksi cepat tambah warga dan buat tagihan, serta verifikasi konfirmasi pembayaran.'},
 {img:'./assets/figma_rt02_pembayaran.png',title:'Alur pembayaran',note:'Pilihan jenis iuran, rincian tagihan, dan scan QRIS instan.'},
 {img:'./assets/figma_rt02_laporan.png',title:'Laporan keuangan',note:'Total pemasukan, pengeluaran, saldo kas akhir, serta grafik dan rincian arus kas agar transparan bagi warga.'},
 {img:'./assets/figma_rt02_riwayat.png',title:'Riwayat transaksi',note:'Status pembayaran (dikonfirmasi atau menunggu), rincian transfer atau QRIS, dan tombol unduh bukti bayar.'}]},
{id:'brandedym',name:'BrandedYM, Sistem Persediaan',url:'brandedym (aplikasi web Laravel)',screens:[
 {img:'./assets/brandedym_real_dashboard.png',title:'Dashboard analitik',note:'KPI stok, grafik stok masuk dan keluar 6 bulan, serta pemantauan stok minimum.'},
 {img:'./assets/brandedym_fitur_barang.png',title:'Master data barang',note:'Tabel kode SKU, kategori, satuan, peringatan batas minimum stok, dan tombol aksi CRUD.'},
 {img:'./assets/brandedym_fitur_persediaan.png',title:'Transaksi persediaan',note:'Kontrol mutasi stok masuk dari supplier dan keluar karena penjualan.'},
 {img:'./assets/brandedym_fitur_laporan.png',title:'Laporan dan ekspor',note:'Filter rentang tanggal dan tipe transaksi, dengan ekspor langsung ke Excel dan PDF.'}]},
{id:'chatbot',name:'Chatbot Akademik BAAK',url:'asisten-akademik (RAG, FastAPI)',screens:[
 {img:'./assets/chatbot_light_beranda.png',title:'Beranda, tema terang',note:'Tombol pintas pertanyaan akademik supaya mahasiswa tidak perlu berpikir mau bertanya apa.'},
 {img:'./assets/chatbot_light_chat.png',title:'Percakapan dengan sitasi',note:'Jawaban menyertakan sumber dokumen kampus, jadi bisa diperiksa ulang oleh penanya.'},
 {img:'./assets/chatbot_light_admin.png',title:'Dashboard admin',note:'Pengelolaan 153 dokumen kampus, unggah PDF, dan incremental indexing ChromaDB.'},
 {img:'./assets/chatbot_v2_beranda.png',title:'Beranda, tema gelap',note:'Layar sambutan dengan pertanyaan cepat seputar KRS, UKT, wisuda, dan jadwal kuliah.'},
 {img:'./assets/chatbot_v2_chat.png',title:'Percakapan, tema gelap',note:'Jawaban jadwal kuliah per kelas, lengkap dengan sumber dokumen di bawah tiap balasan.'},
 {img:'./assets/chatbot_v2_admin_login.png',title:'Masuk admin',note:'Halaman login Admin Panel untuk mengelola dokumen chatbot.'},
 {img:'./assets/chatbot_v2_admin_dashboard.png',title:'Panel admin',note:'Sinkronisasi vektor database, unggah dokumen, dan daftar dokumen dalam satu layar.'},
 {img:'./assets/chatbot_uji_akurasi.png',title:'Hasil uji akurasi',note:'Akurasi jawaban 86,67% dan bebas halusinasi 90% pada 30 skenario, rata-rata respons 4,81 detik.'},
 {img:'./assets/chatbot_uji_ablation.png',title:'Ablation study',note:'Pencarian hybrid BM25 dan vektor mencapai Hit Rate@5 76,7% dan MRR 0,644.'}]},
{id:'jewepe',name:'JeWePe Wedding Organizer',url:'jewepe (website wedding organizer)',screens:[
 {img:'./assets/jewepe_wo_real.png',title:'Beranda',note:'Judul besar, foto panggung pelaminan penuh layar, dan satu tombol jelas: Lihat Paket Wedding. Menu memuat Cek Pesanan dan Login Admin.'},
 {img:'./assets/jewepe_wo_real_paket.png',title:'Daftar paket',note:'Kartu paket dengan harga, daftar fasilitas, serta tombol Lihat Detail dan Pesan Sekarang.'},
 {img:'./assets/1759478104_Silver.jpeg',title:'Foto paket Silver',note:'Dekorasi pelaminan yang ditampilkan pada halaman paket Silver.'},
 {img:'./assets/showcase/paket_gold.jpg',title:'Foto paket Gold',note:'Dekorasi ruang resepsi yang ditampilkan pada halaman paket Gold.'},
 {img:'./assets/showcase/paket_platinum.jpg',title:'Foto paket Platinum',note:'Dekorasi ruang resepsi yang ditampilkan pada halaman paket Platinum.'},
 {img:'./assets/showcase/paket_custom.jpg',title:'Foto paket Custom',note:'Contoh dekorasi untuk paket Custom.'}]}
];
window.CERTS=[
 {title:'Junior Web Programmer',issuer:'Badan Nasional Sertifikasi Profesi (BNSP)',year:'2026',note:'Sertifikat Kompetensi No. Reg. TIK 000 00000 2026. 8 Unit Kompetensi berstatus Kompeten (Pemrograman Terstruktur, Basis Data, Keamanan Web).',img:'./assets/sertifikat/sertifikat_bnsp_junior_web_programmer.jpg',cat:'Sertifikasi',featured:true},
 {title:'Dasar Perancangan Aplikasi Web',issuer:'Universitas Gunadarma',year:'2025',note:'No. 411883. Perancangan antarmuka web modern, wireframing, dan desain interaksi pengguna responsif.',img:'./assets/sertifikat/sertifikat_dasar_perancangan_aplikasi_web.jpg',cat:'Pelatihan'},
 {title:'Membangun Website Menggunakan HTML 5',issuer:'Universitas Gunadarma',year:'2025',note:'No. 333671. Implementasi HTML5 semantik, CSS responsif, struktur DOM, dan integrasi media web.',img:'./assets/sertifikat/sertifikat_html5_website.jpg',cat:'Pelatihan'},
 {title:'Pemrograman Java (J2SE) Tingkat Menengah',issuer:'Universitas Gunadarma',year:'2025',note:'No. 335926. Konsep OOP lanjutan, exception handling, multithreading, dan manipulasi data terstruktur.',img:'./assets/sertifikat/sertifikat_java_intermediate.jpg',cat:'Pelatihan'},
 {title:'Pemrograman Go untuk Pemula',issuer:'Universitas Gunadarma',year:'2024',note:'No. 408262. Dasar sintaks bahasa Go, concurrency model (goroutine & channel), dan arsitektur backend.',img:'./assets/sertifikat/sertifikat_golang_beginner.jpg',cat:'Pelatihan'},
 {title:'Java Programming for Beginner',issuer:'Universitas Gunadarma',year:'2024',note:'No. 406564. Pemrograman berorientasi objek (OOP), kelas, metode, enkapsulasi, dan struktur kontrol.',img:'./assets/sertifikat/sertifikat_java_beginner.jpg',cat:'Pelatihan'},
 {title:'Dasar Pemrograman Berbasis Web',issuer:'Universitas Gunadarma',year:'2023',note:'No. 404870. Pemrograman client-side, manipulasi elemen web interaktif, dan integrasi HTTP/server.',img:'./assets/sertifikat/sertifikat_dasar_pemrograman_web.jpg',cat:'Pelatihan'},
 {title:'Dasar Pemrograman Berbasis Desktop',issuer:'Universitas Gunadarma',year:'2023',note:'No. 402974. Algoritma dasar, pemrograman desktop modular, dan logika komputasi terstruktur.',img:'./assets/sertifikat/sertifikat_dasar_pemrograman_desktop.jpg',cat:'Pelatihan'},
 {title:'Diseminasi Hasil Penelitian Mahasiswa',issuer:'Program Studi Sistem Informasi FIKTI Gunadarma',year:'2025',note:'Pemaparan hasil riset ilmiah di hadapan civitas akademika dan dewan penilai penelitian.',img:'./assets/sertifikat/sertifikat_diseminasi_penelitian_fikti.jpg',cat:'Seminar & Riset'},
 {title:'Workshop Penelitian Ilmiah',issuer:'Program Studi Sistem Informasi FIKTI Gunadarma',year:'2025',note:'Metodologi penelitian ilmiah, penulisan publikasi akademik, dan integritas riset komputasi.',img:'./assets/sertifikat/sertifikat_workshop_penelitian_ilmiah.jpg',cat:'Seminar & Riset'},
 {title:'Seminar Reka UMKM Cerdas: Go Digital UMKM',issuer:'Kemendikbudristek Kedaireka & KemenkopUKM',year:'2022',note:'Series #1: Transformasi digital dan adopsi teknologi bagi UMKM nasional bersama Universitas Gunadarma.',img:'./assets/sertifikat/sertifikat_seminar_reka_umkm_cerdas.jpg',cat:'Seminar & Riset'},
 {title:'Seminar Nasional Ekonomi Syariah 2023',issuer:'Universitas Gunadarma & Bank DKI',year:'2023',note:'Literasi finansial dan inklusi keuangan digital bagi generasi muda.',img:'./assets/sertifikat/sertifikat_seminar_ekonomi_syariah.jpg',cat:'Seminar & Riset'},
 {title:'Piagam Penghargaan Tax Goes to Campus',issuer:'Kanwil DJP Jawa Barat III',year:'2022',note:'No. 01089/WPJ.33/PGM/2022. Partisipasi dan kontribusi aktif edukasi perpajakan bagi mahasiswa.',img:'./assets/sertifikat/sertifikat_penghargaan_djp_pajak.jpg',cat:'Penghargaan'}
];

/* ===== VIDEO =====
   Satu blok = satu channel, dan tiap channel tampil sebagai bab sendiri (urutan pertama = GeoLogika, kedua = Lemminoid). */
window.VIDEOS=[
 {channel:'GeoLogika',kind:'Video dokumenter sains dan geologi',desc:'Seluruh produksinya memakai alur kerja AI agent: riset mendalam, naskah geologi presisi, kinetic typography, dan sinkronisasi audio-visual zero-gap.',url:'https://www.youtube.com/@GeoLogika',thumb:'./assets/geologika/geologika_jembatan_bali.jpg',videos:[
  {title:'Kenapa Tidak Ada Jembatan Selat Bali?',thumb:'./assets/geologika/geologika_jembatan_bali.jpg',src:'./assets/geologika/geologika_jembatan_bali.mp4',url:'https://www.youtube.com/@GeoLogika',desc:'Investigasi geologi tektonik busur Sunda dan aspek sosio-kultural di balik ketiadaan jembatan penghubung Jawa dan Bali.'},
  {title:'Mengalir Tiap Hari Kenapa Tak Habis?',thumb:'./assets/geologika/geologika_air_gunung.jpg',src:'./assets/geologika/geologika_air_gunung.mp4',url:'https://www.youtube.com/@GeoLogika',desc:'Misteri siklus hidrogeologi akuifer vulkanik pegunungan Indonesia yang tak pernah kering.'}
 ]},
 {channel:'Lemminoid',kind:'Footage nyata dan animasi 2D berbasis kode',desc:'Channel dokumenter investigatif yang memadukan footage arsip nyata dengan animasi 2D berbasis kode Remotion. Menerapkan standar broadcast lower-third, provenance footnote, serta visualisasi data geospasial presisi.',url:'https://www.youtube.com/@Lemminoid',thumb:'./assets/lemminoid/lemminoid_perang_nikel_thumb.jpg',videos:[
  {title:'Perang Nikel Dunia: Indonesia 62% Nikel Dunia Terancam?',thumb:'./assets/lemminoid/lemminoid_perang_nikel_thumb.jpg',src:'./assets/lemminoid/lemminoid_perang_nikel.mp4',url:'https://www.youtube.com/@Lemminoid',desc:'Investigasi geopolitik hilirisasi nikel Indonesia, dinamika perang harga nikel global, dan rantai pasok baterai EV dunia.'},
  {title:'Ke Mana Sebenarnya Perginya Sampah Kita?',thumb:'./assets/lemminoid/lemminoid_sampah_thumb.jpg',src:'./assets/lemminoid/lemminoid_sampah.mp4',url:'https://www.youtube.com/@Lemminoid',desc:'Penelusuran investigatif alur rantai limbah, pemilahan material, dan realitas daur ulang plastik perkotaan.'}
 ]}
];

