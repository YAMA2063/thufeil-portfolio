(function(){
// Heatmap: kursor "membakar" judul, lalu memudar
var c=document.getElementById('heat'),x=c.getContext('2d'),pts=[],run=false,W,H,dpr=Math.min(devicePixelRatio||1,2);
var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
function size(){var r=c.parentNode.getBoundingClientRect();W=r.width;H=r.height;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0)}
size();addEventListener('resize',size);
c.parentNode.addEventListener('pointermove',function(e){
 if(still)return;var r=c.getBoundingClientRect();
 pts.push({x:e.clientX-r.left,y:e.clientY-r.top,t:performance.now()});
 if(!run){run=true;requestAnimationFrame(draw)}});
function draw(now){
 x.clearRect(0,0,W,H);
 pts=pts.filter(function(p){return now-p.t<1800});
 pts.forEach(function(p){
  var a=1-(now-p.t)/1800,R=70+a*60,g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,R);
  g.addColorStop(0,'rgba(255,59,31,'+(.7*a)+')');
  g.addColorStop(.45,'rgba(255,210,31,'+(.5*a)+')');
  g.addColorStop(1,'rgba(255,210,31,0)');
  x.fillStyle=g;x.fillRect(p.x-R,p.y-R,R*2,R*2)});
 if(pts.length)requestAnimationFrame(draw);else{run=false;x.clearRect(0,0,W,H)}}
// Pemilih layar tab interaktif (Figma RT 02 & BrandedYM)
document.querySelectorAll('.sheet.shot').forEach(function(sheet){
 var tabs=sheet.querySelectorAll('.tabs button'),img=sheet.querySelector('img'),cap=sheet.querySelector('figcaption');
 if(!tabs.length||!img)return;
 tabs.forEach(function(b){b.addEventListener('click',function(){
  tabs.forEach(function(t){t.setAttribute('aria-selected',t===b)});
  img.src=b.dataset.img;if(b.dataset.alt)img.alt=b.dataset.alt;if(cap&&b.dataset.cap)cap.textContent=b.dataset.cap})})});
})();
// ===== Fitur yang dikembalikan: glow kursor, tilt + gyro, SFX, filter, modal =====
(function(){
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(pointer:fine)').matches;
// SFX (selalu on)
var ac=null;
function beep(f,d){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();
 var o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.setValueAtTime(f,ac.currentTime);o.frequency.exponentialRampToValueAtTime(f/3,ac.currentTime+d);
 g.gain.setValueAtTime(.06,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
window.sfxBeep=beep;
document.addEventListener('click',function(e){if(e.target.closest('a,button'))beep(620,.05)});
// Glow kursor
var glow=document.getElementById('glow');
if(fine&&!reduce){addEventListener('pointermove',function(e){glow.style.opacity=1;glow.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)'});document.addEventListener('mouseleave',function(){glow.style.opacity=0})}
// Tilt + gyro (bisa dinyalakan dan dimatikan lewat tombol)
var T=[].slice.call(document.querySelectorAll('.sheet:not(.vsheet)'));T.forEach(function(t){t.classList.add('tilt')});
var hero=document.getElementById('atas'),photo=hero.querySelector('.photo'),h1=hero.querySelector('h1');
var gyroOn=fine&&!reduce,gb=document.getElementById('gyrobtn'),sensor=false;
function clamp(v){return Math.max(-1,Math.min(1,v))}
function par(mx,my){photo.style.transform='perspective(1000px) rotateY('+mx*16+'deg) rotateX('+(-my*12)+'deg)';h1.style.transform='translate('+(-mx*18)+'px,'+(-my*10)+'px)'}
function tilt(t,rx,ry){t.style.transform='perspective(900px) rotateX('+rx+'deg) rotateY('+ry+'deg)'}
function rest(){par(0,0);T.forEach(function(t){t.style.transform=''})}
function label(){if(!gb)return;gb.setAttribute('aria-pressed',gyroOn);gb.textContent='Gyro: '+(gyroOn?'nyala':'mati')}
function onOrient(e){if(!gyroOn||e.gamma==null)return;var mx=clamp(e.gamma/25),my=clamp(((e.beta||0)-45)/25);par(mx,my);
 T.forEach(function(t){var r=t.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)tilt(t,-my*8,mx*8)})}
function enable(){
 if(fine){gyroOn=true;label();return}
 if(!window.DeviceOrientationEvent){gb.textContent='Gyro tidak didukung perangkat ini';gb.disabled=true;return}
 function go(){gyroOn=true;if(!sensor){addEventListener('deviceorientation',onOrient);sensor=true}label()}
 if(typeof DeviceOrientationEvent.requestPermission==='function')DeviceOrientationEvent.requestPermission().then(function(s){if(s==='granted')go();else gb.textContent='Izin gyro ditolak'}).catch(function(){gb.textContent='Gyro tidak tersedia'});
 else go()}
function disable(){gyroOn=false;rest();label()}
if(gb){if(reduce)gb.hidden=true;else{gb.hidden=false;label();gb.addEventListener('click',function(){gyroOn?disable():enable()})}}
if(fine&&!reduce){
 hero.addEventListener('pointermove',function(e){if(!gyroOn)return;var r=hero.getBoundingClientRect();par(((e.clientX-r.left)/r.width-.5)*2,((e.clientY-r.top)/r.height-.5)*2)});
 hero.addEventListener('pointerleave',function(){par(0,0)});
 T.forEach(function(t){
  t.addEventListener('pointermove',function(e){if(!gyroOn||e.pointerType!=='mouse')return;var r=t.getBoundingClientRect();tilt(t,((e.clientY-r.top)/r.height-.5)*-8,((e.clientX-r.left)/r.width-.5)*8)});
  t.addEventListener('pointerleave',function(){t.style.transform=''})})}
// Filter
var fb=document.querySelectorAll('.filters button'),items=document.querySelectorAll('[data-cat]');
fb.forEach(function(b){b.addEventListener('click',function(){fb.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
 items.forEach(function(i){i.hidden=b.dataset.f!=='all'&&i.dataset.cat!==b.dataset.f})})});
// Modal detail
var D={
rag:{k:'Skripsi S1 Sistem Informasi, 2026 — AI Engineering & Fullstack RAG',t:'Chatbot Informasi Akademik BAAK Universitas Gunadarma',s:'Sistem tanya jawab akademik cerdas berbasis Retrieval-Augmented Generation (RAG) untuk layanan informasi Biro Administrasi Akademik & Kemahasiswaan (BAAK) Universitas Gunadarma. Mengimplementasikan Hybrid Search Engine (BM25 Okapi + Dense Vector multilingual-e5-base) dengan Reciprocal Rank Fusion (RRF), Query Transformation otomatis (Groq LLaMA 3.3 70B & Google Gemini), transparansi sitasi dokumen resmi, panel admin incremental indexing, serta perlindungan keamanan stateless JWT.',m:[['Akurasi Jawaban','86,67% (Valid BAAK)'],['Bebas Halusinasi','90,00% (Tanpa Halusinasi)'],['Hit Rate@5 Hybrid','76,7% (+13,4 pt)'],['Mean Reciprocal Rank','0,644 (Tertinggi)'],['Waktu Respons','4,81 detik'],['Retrieval Latency','175 ms']],h:['Pengujian Akurasi Skripsi: Diuji pada 30 skenario pertanyaan akademik resmi BAAK, menghasilkan akurasi jawaban 86,67%, 90,00% bebas halusinasi, dan rata-rata waktu respons 4,81 detik.','Ablation Study Retrieval: Pengujian kuantitatif 4 skenario membuktikan integrasi hybrid BM25 + Vektor menaikkan Hit Rate@5 menjadi 76,7% dan MRR 0,644 dengan retrieval latency hanya 175 ms.','Hybrid Search Engine: Menggabungkan Sparse Search (BM25 Okapi) dan Dense Vector Search (ChromaDB + multilingual-e5-base) menggunakan Reciprocal Rank Fusion (RRF) untuk menjamin akurasi nama dosen dan kode kelas spesifik.','Query Transformation Otomatis: Mentransformasikan pertanyaan bahasa alami mahasiswa menjadi query pencarian formal terstruktur menggunakan model LLM sebelum proses retrieval.','Multi-LLM & Key Rotation Resilience: Integrasi Groq (LLaMA 3.3 70B) dengan failover ke Google Gemini API yang dilengkapi rotasi dinamis 3 API Key dan model cascade fallback.','Transparansi Sitasi Sumber: Setiap bubble jawaban secara transparan menyematkan badge dokumen resmi kampus ([Sumber: ...]) untuk menjamin akurasi faktual.','Incremental Indexing Admin: Panel kontrol administrator kampus untuk mengunggah PDF/TXT secara otomatis dengan ekstraksi tabel pintar, serta sinkronisasi vektor instan berbasis MD5 hash tanpa rebuild total.','Keamanan Terstandarisasi: Dilindungi otentikasi Stateless JWT (HS256) dengan in-memory blacklist, hashing password Bcrypt (12 rounds), reset password OTP via email, dan Rate Limiting (SlowAPI).'],x:'Python 3.11, FastAPI, ChromaDB, BM25 Okapi, HuggingFace (multilingual-e5-base), Groq API, Google Gemini, PyJWT, Bcrypt, SlowAPI, JavaScript, HTML5/CSS3'},
rt:{k:'Penulisan Ilmiah, UI/UX dan web',t:'Platform iuran dan kas RT 02 di Figma',s:'Perancangan UI/UX website tata kelola iuran warga dan laporan kas yang transparan. Dilengkapi portal Warga dan Admin RT, alur pembayaran QRIS, transparansi arus kas, dan riwayat transaksi. Prototipe high-fidelity di Figma (FILE ASLI - 2), diuji lewat Maze.',m:[['Penyelesaian tugas','100%'],['Partisipan','17 warga dan pengurus'],['Metode','Design Thinking, 5 tahap']],h:['Empathize, Define, Ideate, Prototype, Test, membagi antarmuka menjadi mode Warga dan Admin RT.','Dashboard Admin memuat kontrol kas, aksi cepat tambah warga & buat tagihan, serta verifikasi konfirmasi pembayaran warga.','Uji Maze pada alur navigasi beranda, verifikasi kas masuk, dan pembayaran iuran QRIS.'],x:'Figma, Design Thinking, Maze, Wireframing, Prototyping',link:'https://www.figma.com/design/MJfDGNE7hkUOc93Ey9SGgQ/FILE-ASLI--2-?node-id=0-1&p=f&t=LynvMIPhusCoYndW-0',linkText:'Buka prototipe di Figma ↗'},
brandedym:{k:'Aplikasi Web Fullstack, Laravel 11 & MySQL',t:'BrandedYM — Sistem Informasi Persediaan Toko Pakaian',s:'Aplikasi web fullstack terintegrasi untuk manajemen inventaris dan rantai pasok toko pakaian. Menangani mutasi stok masuk dari supplier dan keluar untuk penjualan, monitoring batas minimum stok otomatis, hingga pencetakan laporan siap cetak (PDF dan Excel).',m:[['Framework','Laravel 11 / PHP 8.4'],['Monitoring','Safety Stock Alert'],['Laporan Cetak','Export PDF & Excel']],h:['Dashboard analitik dark mode dengan visualisasi Chart.js untuk tren arus barang masuk dan keluar selama 6 bulan.','Pencatatan mutasi persediaan otomatis (stok masuk dan keluar) yang memperbarui kartu stok secara real-time.','Manajemen master barang pakaian lengkap dengan kode SKU, kategori, harga modal/jual, dan batas minimum stok aman.','Fitur ekspor laporan persediaan ke format PDF siap cetak dan Microsoft Excel dengan filter tanggal dinamis.','Sistem keamanan dan kontrol hak akses pengguna terbagi dua peran: Administrator dan Staff/Pimpinan.'],x:'Laravel 11, PHP 8.4, MySQL, Blade Engine, Bootstrap 5 (Dark Glassmorphism), Chart.js, DomPDF, FastExcel'},
fmvp:{k:'PUBG Mobile Design Challenge Season 2',t:'Poster FMVP untuk BOOM Esports',s:'Karya digital untuk perayaan Final MVP 2026 PMPL ID Spring, dengan komposisi dinamis, kontras cahaya, dan tipografi esports.',m:[['Ajang','PMDC Season 2'],['Subjek','BOOM Esports FMVP'],['Gaya','Dark fantasy sinematik']],h:['Subjek pemain digabung dengan latar hutan malam dan supercar secara berlapis.','Grading ungu gelap, merah tua, dan emas yang selaras.','Statistik pertandingan (damage, elims, knockouts) ditata sebagai tipografi.'],x:'Canva, komposisi visual, color grading, esports branding'},
geologika:{k:'Video Dokumenter Sains & Geologi, Alur Kerja AI Agent',t:'GeoLogika',s:'Channel YouTube dokumenter investigatif sains dan geologi kebumian Nusantara. Seluruh produksinya dieksekusi dengan pipeline otomatisasi AI agent: riset literatur ilmiah, penulisan naskah edukatif, tata letak visual mixed media, kinetic typography tersinkronisasi, dan desain suara organik zero-gap.',m:[['Investigasi','Geologi & Sains Nusantara'],['Sinkronisasi','Faster-Whisper Zero-Gap'],['Alur Kerja','AI Agent Automation']],h:['Saya mengarahkan perumusan topik, struktur 8-bab narasi ilmiah, prompt engineering, dan verifikasi fakta geologi.','AI agent mengeksekusi ekstraksi beat fonemik audio, subtitle karaoke DP phoneme-alignment, dan animasi kinetic typography.','Episode unggulan: "Kenapa Tidak Ada Jembatan Selat Bali?" dan "Mengalir Tiap Hari Kenapa Tak Habis?".'],x:'Prompt engineering, AI agent automation, Faster-Whisper, Python, MoviePy/FFmpeg, Kinetic typography'},
lemminoid:{k:'Dokumenter Investigatif & Animasi Remotion 2D Berbasis Kode',t:'Lemminoid',s:'Channel YouTube dokumenter investigatif mendalam yang memadukan footage arsip nyata dengan animasi 2D berbasis kode deterministik (React & Remotion). Menerapkan standar broadcast lower-third, provenance footnote, serta visualisasi data geospasial presisi.',m:[['Format','Investigasi & Analisis Geopolitik'],['Animasi','Remotion 2D (Code-driven)'],['Standar Visual','Broadcast Lower-Third & Provenance']],h:['Saya memimpin riset data rantai pasok global, narasi investigatif, arsitektur alur cerita, dan arahan visual motion.','AI agent mengompilasi kode animasi 2D berbasis TypeScript/React untuk menghasilkan grafik data dan peta geospasial akurat.','Episode unggulan: "Perang Nikel Dunia: Indonesia 62% Nikel Dunia Terancam?" dan "Ke Mana Sebenarnya Perginya Sampah Kita?".'],x:'React, Remotion 2D, TypeScript, Python, Prompt engineering, Broadcast motion design, FFmpeg'}};
var dlg=document.getElementById('dlg'),body=document.getElementById('dbody');
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x)e.textContent=x;return e}
document.addEventListener('click',function(e){var b=e.target.closest('.detail[data-p]');if(!b)return;var d=D[b.dataset.p];body.textContent='';
 body.appendChild(el('p','kind',d.k));var h3=el('h3','',d.t);h3.id='dt';body.appendChild(h3);body.appendChild(el('p','',d.s));
 var mx=el('div','mx');d.m.forEach(function(m){var v=el('div');v.appendChild(el('b','',m[1]));v.appendChild(document.createTextNode(m[0]));mx.appendChild(v)});body.appendChild(mx);
 var ul=el('ul');d.h.forEach(function(x){ul.appendChild(el('li','',x))});body.appendChild(ul);
 body.appendChild(el('p','meta',d.x)).style.marginTop='1.2rem';
 if(d.link){var lk=el('a','link',d.linkText||'Buka di Figma ↗');lk.href=d.link;lk.target='_blank';lk.rel='noopener';lk.style.display='inline-block';lk.style.marginTop='1.4rem';lk.style.fontWeight='700';lk.style.fontSize='1.05rem';body.appendChild(lk)}
 dlg.showModal()});
document.getElementById('dx').addEventListener('click',function(){dlg.close()});
dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
})();

// ===== Lightbox Fullscreen Preview (Mosaic / Frosted Glass Blur) =====
(function(){
  var lb=document.getElementById('lightbox');
  if(!lb)return;
  var lbImg=document.getElementById('lbImg'),lbCap=document.getElementById('lbCap'),lbClose=document.getElementById('lbClose');
  function setCap(t){if(!lbCap)return;lbCap.textContent='';if(!t){lbCap.style.display='none';return}
    var i=t.indexOf(': '),a=(i>0&&i<=48)?t.slice(0,i):'',b=a?t.slice(i+2):t,s;b=b.charAt(0).toUpperCase()+b.slice(1);
    if(a){s=document.createElement('span');s.className='cap-t';s.textContent=a;lbCap.appendChild(s)}
    s=document.createElement('span');s.className='cap-d';s.textContent=b;lbCap.appendChild(s);lbCap.style.display='block'}
  function openLb(src,alt,cap){
    if(!src)return;
    lbImg.src=src;lbImg.alt=alt||'Pratinjau gambar';
    setCap(cap||alt||'');
    lb.hidden=false;document.body.style.overflow='hidden';
    requestAnimationFrame(function(){lb.classList.add('open');if(lbClose)lbClose.focus()});
    if(window.sfxBeep)window.sfxBeep(750,.05);
  }
  window.openLightbox=openLb;
  function closeLb(){
    lb.classList.remove('open');document.body.style.overflow='';
    setTimeout(function(){lb.hidden=true;lbImg.src=''},250);
    if(window.sfxBeep)window.sfxBeep(420,.05);
  }
  document.addEventListener('click',function(e){
    if(e.target.closest('.tabs, a, button, dialog, .cb'))return;
    var img=e.target.closest('.sheet img, .portrait img');
    if(!img)return;
    var sheet=img.closest('.sheet'),cap='';
    if(sheet){
      var activeTab=sheet.querySelector('.tabs button[aria-selected="true"]');
      if(activeTab&&activeTab.dataset.cap)cap=activeTab.dataset.cap;
      else{var figcap=sheet.querySelector('figcaption');if(figcap)cap=figcap.textContent}
    }else if(img.closest('.photo')){
      cap='Muhammad Thufeil Putrayama — S1 Sistem Informasi Universitas Gunadarma, IPK 3,72';
    }
    openLb(img.currentSrc||img.src,img.alt,cap);
  });
  if(lbClose)lbClose.addEventListener('click',closeLb);
  lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('lightbox-content'))closeLb()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!lb.hidden)closeLb()});
})();
