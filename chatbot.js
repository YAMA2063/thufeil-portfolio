/* Chatbot portofolio: hanya antarmuka. Otaknya Anda sambungkan sendiri.
   Ada dua cara menyambungkannya:
   1) Isi CHAT_API_URL di bawah. Halaman akan POST {message, history} dan mengharapkan balasan {reply}.
   2) Atau, dari kode lain: window.PortfolioChat.handler = async function(message, history){ return 'teks balasan'; }
   history = array {role:'user'|'bot', text}. */
(function(){
var CHAT_API_URL=''; // contoh: 'https://domain-anda.com/api/chat'
window.PortfolioChat={handler:null};
var hist=[],busy=false;
function localAnswer(msg){
 var s=(msg||'').toLowerCase();
 if(s.includes('karya')||s.includes('proyek')||s.includes('portfolio')||s.includes('buat apa')){
  return 'Karya unggulan Muhammad Thufeil Putrayama:\n1. 🎓 Chatbot Informasi Akademik BAAK (Skripsi S1: FastAPI, Hybrid BM25 + HuggingFace E5, Groq & Gemini, 153 dokumen resmi, akurasi 86,67%).\n2. 🏢 BrandedYM (Sistem Informasi Persediaan Toko Pakaian berbasis Laravel 11 & MySQL).\n3. 🏘️ Platform Kas RT 02 (Desain UI/UX Figma dengan pengujian Maze tingkat penyelesaian 100%).\n4. 🎮 Desain Visual & Poster FMVP PUBG Mobile Season 2.';
 }
 if(s.includes('skripsi')||s.includes('akurasi')||s.includes('rag')||s.includes('chatbot')){
  return 'Chatbot RAG Gunadarma adalah proyek penelitian skripsi S1 Thufeil di Sistem Informasi (IPK 3,72). Menggabungkan BM25 Okapi dan HuggingFace Multilingual E5 via Reciprocal Rank Fusion (RRF), serta Query Transformation otomatis (Gemini 3 & Groq LLaMA 3.3). Hasil pengujian 30 skenario BAAK membuktikan akurasi jawaban 86,67% dan 90,00% bebas halusinasi. Evaluasi retrieval membuktikan Hit Rate@5 mencapai 76,7% (+13,4 pt), MRR 0,644, sitasi transparan dokumen resmi, dan panel admin dokumen.';
 }
 if(s.includes('kontak')||s.includes('hubungi')||s.includes('email')||s.includes('wa')||s.includes('whatsapp')){
  return 'Hubungi Thufeil melalui:\n📧 Email: putrayama63@gmail.com\n💬 WhatsApp: +62 815-1471-3206\n📍 Domisili: Bekasi / Jabodetabek (Terbuka untuk On-site & Remote).';
 }
 if(s.includes('pendidikan')||s.includes('kuliah')||s.includes('ipk')||s.includes('lulusan')||s.includes('bnsp')){
  return 'Thufeil adalah lulusan S1 Sistem Informasi Universitas Gunadarma (IPK 3,72 dari 4,00) serta memiliki sertifikasi kompetensi resmi BNSP Junior Web Programmer.';
 }
 return 'Halo! Saya asisten portofolio Thufeil. Thufeil berfokus pada AI Engineering (RAG Chatbot), Fullstack Web Development (Laravel & FastAPI), serta UI/UX Design di Figma. Silakan lihat rincian proyek di bagian Karya atau tanyakan lebih lanjut!';
}
function ask(msg){
 if(typeof window.PortfolioChat.handler==='function')return Promise.resolve(window.PortfolioChat.handler(msg,hist));
 if(CHAT_API_URL)return fetch(CHAT_API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg,history:hist})}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()}).then(function(d){return d.reply}).catch(function(){return localAnswer(msg)});
 return Promise.resolve(localAnswer(msg));
}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x)e.textContent=x;return e}
var open=el('button','cb-open','Tanya chatbot');open.setAttribute('aria-haspopup','dialog');
var box=el('section','cb');box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-label','Chatbot portofolio');
var head=el('header');head.appendChild(el('span','','Tanya soal portofolio ini'));var close=el('button','','×');close.setAttribute('aria-label','Tutup chatbot');head.appendChild(close);
var log=el('div','cb-log');log.setAttribute('aria-live','polite');
var chips=el('div','cb-chips');
var form=el('form');var inp=el('input');inp.placeholder='Tulis pertanyaan';inp.setAttribute('aria-label','Pertanyaan');inp.autocomplete='off';var send=el('button','','Kirim');send.type='submit';form.appendChild(inp);form.appendChild(send);
box.appendChild(head);box.appendChild(log);box.appendChild(chips);box.appendChild(form);document.body.appendChild(open);document.body.appendChild(box);
function add(role,text){var m=el('div','m '+(role==='user'?'u':''),text);log.appendChild(m);log.scrollTop=log.scrollHeight;return m}
function submit(text){text=(text||'').trim();if(!text||busy)return;busy=true;chips.hidden=true;add('user',text);hist.push({role:'user',text:text});
 var dots=el('div','m dots');dots.appendChild(el('i'));dots.appendChild(el('i'));dots.appendChild(el('i'));log.appendChild(dots);log.scrollTop=log.scrollHeight;
 ask(text).then(function(r){dots.remove();add('bot',r);hist.push({role:'bot',text:r});if(window.sfxBeep)window.sfxBeep(880,.08)})
 .catch(function(){dots.remove();add('bot','Maaf, chatbot sedang tidak bisa dijangkau. Coba lagi sebentar.')}).then(function(){busy=false;inp.focus()})}
['Apa karya utama Thufeil?','Seberapa akurat chatbot skripsinya?','Bagaimana cara menghubungi Thufeil?'].forEach(function(q){var b=el('button','',q);b.type='button';b.addEventListener('click',function(){submit(q)});chips.appendChild(b)});
add('bot','Halo! Saya asisten portofolio Thufeil. Tanyakan soal karya, skripsi, sertifikasi, atau cara menghubunginya.');
form.addEventListener('submit',function(e){e.preventDefault();var v=inp.value;inp.value='';submit(v)});
function toggle(s){box.hidden=!s;open.hidden=s;if(s)inp.focus();else open.focus()}
open.addEventListener('click',function(){toggle(true)});close.addEventListener('click',function(){toggle(false)});
box.addEventListener('keydown',function(e){if(e.key==='Escape')toggle(false)});
})();
