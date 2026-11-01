/* Chatbot portofolio: hanya antarmuka. Otaknya Anda sambungkan sendiri.
   Ada dua cara menyambungkannya:
   1) Isi CHAT_API_URL di bawah. Halaman akan POST {message, history} dan mengharapkan balasan {reply}.
   2) Atau, dari kode lain: window.PortfolioChat.handler = async function(message, history){ return 'teks balasan'; }
   history = array {role:'user'|'bot', text}. */
(function(){
var CHAT_API_URL=''; // contoh: 'https://domain-anda.com/api/chat'
var AVATAR='./assets/avatar_hero.jpg';
var PROMPTS=[['Karya terbaik','Apa karya terbaik Thufeil?'],['Skripsi chatbot','Seberapa akurat chatbot skripsinya?'],['GeoLogika dan Lemminoid','Apa itu GeoLogika dan Lemminoid?'],['Cara menghubungi','Bagaimana cara menghubungi Thufeil?']];
window.PortfolioChat={handler:null};
var hist=[],busy=false,tipShown=false,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function ask(msg){
 if(typeof window.PortfolioChat.handler==='function')return Promise.resolve(window.PortfolioChat.handler(msg,hist));
 if(CHAT_API_URL)return fetch(CHAT_API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg,history:hist})}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()}).then(function(d){return d.reply});
 return Promise.resolve('Maaf, chatbot ini belum tersambung ke sistem jawabannya, jadi belum bisa menjawab. (Untuk pengembang: isi CHAT_API_URL atau window.PortfolioChat.handler di chatbot.js.)');
}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function pic(cls){var w=el('span',cls),i=el('img');i.src=AVATAR;i.alt='';i.width=48;i.height=48;w.appendChild(i);return w}
// peluncur: foto dengan cincin gradien berputar
var fab=el('button','cx-fab');fab.type='button';fab.setAttribute('aria-haspopup','dialog');
var fa=pic('cx-ava');fa.appendChild(el('i','cx-on'));var fl=el('span','cx-lab');fl.appendChild(el('b','','Tanya asisten'));fl.appendChild(el('small','','AI portofolio'));
fab.appendChild(fa);fab.appendChild(fl);
var tip=el('button','cx-tip','Ingin tahu karya terbaiknya? Tanya langsung di sini.');tip.type='button';tip.hidden=true;
// panel
var box=el('section','cx');box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-label','AI portofolio');
var inn=el('div','cx-in'),head=el('header','cx-head');
var hm=el('div','cx-who');hm.appendChild(pic('cx-ava sm'));var ht=el('div');ht.appendChild(el('b','','Asisten Thufeil'));var st=el('small');st.appendChild(el('i','cx-on s'));st.appendChild(document.createTextNode('Online, dijawab oleh AI'));ht.appendChild(st);hm.appendChild(ht);
var close=el('button','cx-x','×');close.type='button';close.setAttribute('aria-label','Tutup chatbot');head.appendChild(hm);head.appendChild(close);
var log=el('div','cx-log');log.setAttribute('aria-live','polite');
var hello=el('div','cx-hello');hello.appendChild(el('h4','','Ada yang ingin ditanyakan?'));hello.appendChild(el('p','','Tanya soal karya, skripsi, sertifikat, atau cara menghubungi Thufeil.'));
var grid=el('div','cx-grid');PROMPTS.forEach(function(p){var b=el('button','cx-card');b.type='button';b.appendChild(el('b','',p[0]));b.appendChild(el('span','','→'));b.addEventListener('click',function(){submit(p[1])});grid.appendChild(b)});hello.appendChild(grid);log.appendChild(hello);
var form=el('form','cx-form'),inp=el('input');inp.placeholder='Tulis pertanyaan Anda';inp.setAttribute('aria-label','Pertanyaan');inp.autocomplete='off';inp.maxLength=500;
var send=el('button','cx-send','↑');send.type='submit';send.setAttribute('aria-label','Kirim');form.appendChild(inp);form.appendChild(send);
var note=el('p','cx-note','Jawaban dibuat oleh AI dan bisa keliru. Untuk hal penting, hubungi langsung.');
[head,log,form,note].forEach(function(n){inn.appendChild(n)});box.appendChild(inn);
document.body.appendChild(fab);document.body.appendChild(tip);document.body.appendChild(box);
function row(role){var r=el('div','cx-row '+(role==='user'?'u':'b'));if(role!=='user')r.appendChild(pic('cx-ava xs'));var m=el('div','cx-msg');r.appendChild(m);log.appendChild(r);log.scrollTop=log.scrollHeight;return m}
function reveal(node,text){
 if(reduce||text.length>900){node.textContent=text;log.scrollTop=log.scrollHeight;return Promise.resolve()}
 var w=text.split(/(\s+)/),i=0,step=Math.max(2,Math.ceil(w.length/60))*2;
 return new Promise(function(res){var t=setInterval(function(){i+=step;node.textContent=w.slice(0,i).join('');log.scrollTop=log.scrollHeight;if(i>=w.length){clearInterval(t);node.textContent=text;res()}},26)})}
function submit(text){text=(text||'').trim();if(!text||busy)return;busy=true;if(hello.parentNode)hello.remove();
 row('user').textContent=text;hist.push({role:'user',text:text});
 var d=row('bot');d.classList.add('dots');for(var k=0;k<3;k++)d.appendChild(el('i'));log.scrollTop=log.scrollHeight;
 ask(text).then(function(r){d.classList.remove('dots');d.textContent='';hist.push({role:'bot',text:r});if(window.sfxBeep)window.sfxBeep(880,.08);return reveal(d,r)})
 .catch(function(){d.classList.remove('dots');d.textContent='Maaf, chatbot sedang tidak bisa dijangkau. Coba lagi sebentar.'}).then(function(){busy=false;inp.focus()})}
form.addEventListener('submit',function(e){e.preventDefault();var v=inp.value;inp.value='';submit(v)});
function toggle(s){box.hidden=!s;fab.hidden=s;tip.hidden=true;if(s){inp.focus()}else fab.focus()}
fab.addEventListener('click',function(){toggle(true)});close.addEventListener('click',function(){toggle(false)});tip.addEventListener('click',function(){toggle(true)});
box.addEventListener('keydown',function(e){if(e.key==='Escape')toggle(false)});
setTimeout(function(){if(box.hidden&&!tipShown){tipShown=true;tip.hidden=false;setTimeout(function(){tip.hidden=true},9000)}},4500);
})();
