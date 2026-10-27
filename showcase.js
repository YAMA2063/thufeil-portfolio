(function(){
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var P=window.SHOWCASE||[],C=window.CERTS||[];
// ===== Ruang presentasi =====
var tabs=document.getElementById('ptabs'),stage=document.getElementById('stage');
if(tabs&&stage&&P.length){
 var pi=0,si=0,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 var frame=el('div','frame'),chrome=el('div','chrome'),addr=el('span','addr'),screen=el('div','screen'),img=el('img');
 ['d1','d2','d3'].forEach(function(c){chrome.appendChild(el('i',c))});chrome.appendChild(addr);screen.appendChild(img);frame.appendChild(chrome);frame.appendChild(screen);
 var side=el('div','notes'),cnt=el('p','kind'),ttl=el('h3'),lab=el('p','lab','Catatan untuk klien'),note=el('p','nt'),ctl=el('div','ctl'),thumbs=el('div','thumbs');
 function btn(t,l,f){var b=el('button','',t);b.type='button';b.setAttribute('aria-label',l);b.addEventListener('click',f);return b}
 ctl.appendChild(btn('←','Layar sebelumnya',function(){go(si-1)}));ctl.appendChild(btn('→','Layar berikutnya',function(){go(si+1)}));
 var fs=btn('Mode presentasi','Tampilkan layar penuh',function(){if(stage.requestFullscreen)stage.requestFullscreen();else if(window.openLightbox)window.openLightbox(img.src,img.alt,ttl.textContent+': '+note.textContent)});fs.className='fs';ctl.appendChild(fs);
 [cnt,ttl,lab,note,ctl,thumbs].forEach(function(n){side.appendChild(n)});stage.appendChild(frame);stage.appendChild(side);
 function go(i){var p=P[pi],n=p.screens.length;si=(i+n)%n;var s=p.screens[si];
  if(!reduce)img.style.opacity=0;img.onload=function(){img.style.opacity=1};img.src=s.img;img.alt=s.title+', '+p.name;
  frame.className='frame'+((s.device||p.device)==='phone'?' phone':'');addr.textContent=p.url||p.name;
  cnt.textContent='Layar '+(si+1)+' dari '+n;ttl.textContent=s.title;note.textContent=s.note||'';
  [].forEach.call(thumbs.children,function(t,k){t.setAttribute('aria-current',k===si)});
  var nx=new Image();nx.src=p.screens[(si+1)%n].img}
 function proj(i){pi=i;[].forEach.call(tabs.children,function(b,k){b.setAttribute('aria-pressed',k===i)});thumbs.textContent='';
  P[i].screens.forEach(function(s,k){var t=el('button');t.type='button';t.setAttribute('aria-label',s.title);var im=el('img');im.src=s.img;im.alt='';im.loading='lazy';t.appendChild(im);t.addEventListener('click',function(){go(k)});thumbs.appendChild(t)});go(0)}
 P.forEach(function(p,i){var b=el('button','',p.name+' ('+p.screens.length+')');b.type='button';b.addEventListener('click',function(){proj(i)});tabs.appendChild(b)});
 stage.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')go(si-1);else if(e.key==='ArrowRight')go(si+1)});
 var x0=null;screen.addEventListener('pointerdown',function(e){x0=e.clientX});
 screen.addEventListener('pointerup',function(e){if(x0==null)return;var d=e.clientX-x0;x0=null;if(Math.abs(d)>50)go(si+(d<0?1:-1));else if(window.openLightbox)window.openLightbox(img.src,img.alt,ttl.textContent+': '+note.textContent)});
 proj(0);
}
// ===== Video: tiap bab .vsheet memakai satu channel dari data.js (data-ch = urutan) =====
var VD=window.VIDEOS||[];
[].forEach.call(document.querySelectorAll('.vsheet'),function(root){
 var c=VD[+root.dataset.ch];if(!c)return;
 var vs=root.querySelector('.vstage'),vl=root.querySelector('.vlist'),vcp=root.querySelector('figcaption'),vj=0;
 function badge(){return el('span','vbadge','Dibuat dengan AI agent')}
 function play(){var v=(c.videos||[])[vj];if(!v)return;vs.textContent='';
  if(v.id){
   var f=el('iframe');f.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(v.id)+'?autoplay=1&rel=0';
   f.title=v.title||'Video';f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;
   vs.appendChild(f);
  }else if(v.src||v.video||v.file){
   var vid=el('video');vid.src=v.src||v.video||v.file;vid.controls=true;vid.autoplay=true;
   vid.playsInline=true;vid.setAttribute('playsinline','');vs.appendChild(vid);vid.play().catch(function(){});
  }
  vs.appendChild(badge())}
 function draw(){var v=(c.videos||[])[vj],has=!!(v&&(v.id||v.src||v.video||v.file));vs.textContent='';
  var src=(v&&(v.thumb||(v.id&&'https://i.ytimg.com/vi/'+v.id+'/hqdefault.jpg')))||c.thumb;
  var host=has?mk('button','vplay','',play):el('div','vstill');
  if(has)host.setAttribute('aria-label','Putar video '+(v.title||c.channel));
  else if(src)host.addEventListener('click',function(){if(window.openLightbox)window.openLightbox(src,(v&&v.title?v.title+', ':'')+'channel '+c.channel,(v&&v.title?v.title+': ':'')+((v&&v.desc)||c.desc||''))});
  var card=el('div','vcard');card.appendChild(el('strong','',c.channel));card.appendChild(el('span','',c.kind||''));host.appendChild(card);
  if(src){var im=el('img');im.src=src;im.alt=(v&&v.title?v.title+', ':'')+'channel '+c.channel;im.onerror=function(){im.remove()};host.appendChild(im)}
  vs.appendChild(host);vs.appendChild(badge());
  vl.textContent='';vl.hidden=(c.videos||[]).length<2;
  (c.videos||[]).forEach(function(x,k){var b=mk('button','',x.title,function(){vj=k;draw()});b.setAttribute('aria-pressed',k===vj);vl.appendChild(b)});
  vcp.textContent='';var curTitle=(v&&v.title)||c.channel;vcp.appendChild(el('strong','',curTitle));
  var txt=[(v&&v.desc)||c.desc].filter(Boolean).join('. ');if(txt)vcp.appendChild(el('span','',txt));
  var lk=el('span','vlinks');
  function a(t,u,cls){var e=el('a','link '+(cls||''),t);e.href=u;e.target='_blank';e.rel='noopener';lk.appendChild(e)}
  if(c.url)a('Kunjungi Channel YouTube @'+c.channel+' ↗',c.url,'yt-chan');
  else if(v&&v.url)a('Lihat di YouTube ↗',v.url);
  if(lk.children.length)vcp.appendChild(lk)}
 draw()});
// ===== Sertifikat =====
var box=document.getElementById('certs'),more=document.getElementById('certmore'),fl=document.getElementById('certfilter'),LIM=8,all=false,cat='Semua';
var L=C.slice().sort(function(a,b){return (b.featured?1:0)-(a.featured?1:0)||(parseInt(b.year)||0)-(parseInt(a.year)||0)});
var cats=['Semua'];L.forEach(function(c){if(c.cat&&cats.indexOf(c.cat)<0)cats.push(c.cat)});
function mk(t,c,x,f){var e=el(t,c,x);if(f){e.type='button';e.addEventListener('click',f)}return e}
var vd=null,vlist=[],vi=0,vim,vcap,vcn;
function meta(c){return c.issuer+(c.year?', '+c.year:'')}
function view(i){var n=vlist.length;vi=(i+n)%n;var c=vlist[vi];vim.src=c.img;vim.alt='Sertifikat '+c.title;vcap.textContent='';
 vcap.appendChild(el('span','cap-t',c.title));vcap.appendChild(el('span','cap-d',meta(c)+(c.note?'. '+c.note:'')));vcn.textContent=(vi+1)+' dari '+n}
function openView(list,i){
 if(!vd){vd=el('dialog','cview');var x=mk('button','x','×',function(){vd.close()});x.setAttribute('aria-label','Tutup');
  var fig=el('div','cvfig');vim=el('img');fig.appendChild(vim);vcap=el('div','capcard');vcn=el('span','cvn');
  var nav=el('div','cvnav');nav.appendChild(mk('button','','←',function(){view(vi-1)}));nav.appendChild(vcn);nav.appendChild(mk('button','','→',function(){view(vi+1)}));
  [x,fig,vcap,nav].forEach(function(n){vd.appendChild(n)});document.body.appendChild(vd);
  vd.addEventListener('click',function(e){if(e.target===vd)vd.close()});
  vd.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')view(vi-1);else if(e.key==='ArrowRight')view(vi+1)})}
 vlist=list;view(i);vd.showModal()}
function certs(){if(!box)return;box.textContent='';
 var f=L.filter(function(c){return cat==='Semua'||c.cat===cat}),withImg=f.filter(function(c){return c.img});
 f.forEach(function(c,i){if(!all&&i>=LIM)return;var has=!!c.img,card=el(has?'button':'div','cert'+(c.featured?' feat':''));if(has)card.type='button';
  var th=el('div','th');if(has){var im=el('img');im.src=c.img;im.alt='Sertifikat '+c.title;im.loading='lazy';th.appendChild(im)}
  else th.appendChild(el('span','ini',c.year||c.title.split(/\s+/).slice(0,2).map(function(w){return w[0]}).join('')));
  card.appendChild(th);var tx=el('div','ct');tx.appendChild(el('strong','',c.title));tx.appendChild(el('span','',meta(c)));if(c.note)tx.appendChild(el('small','',c.note));card.appendChild(tx);
  if(has)card.addEventListener('click',function(){openView(withImg,withImg.indexOf(c))});
  box.appendChild(card)});
 if(more){more.hidden=f.length<=LIM;more.textContent=all?'Tampilkan lebih sedikit':'Lihat semua ('+f.length+')'}}
function chips(){if(!fl)return;fl.textContent='';if(cats.length<3)return;
 cats.forEach(function(k){var b=mk('button','',k,function(){cat=k;all=false;chips();certs()});b.setAttribute('aria-pressed',k===cat);fl.appendChild(b)})}
if(more)more.addEventListener('click',function(){all=!all;certs()});chips();certs();
})();
