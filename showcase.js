(function(){
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var P=window.SHOWCASE||[],C=window.CERTS||[];
// ===== Ruang presentasi =====
var tabs=document.getElementById('ptabs'),stage=document.getElementById('stage');
if(tabs&&stage&&P.length){
 var pi=0,si=0,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 var frame=el('div','frame'),chrome=el('div','chrome'),addr=el('span','addr'),screen=el('div','screen'),img=el('img');
 ['d1','d2','d3'].forEach(function(c){chrome.appendChild(el('i',c))});chrome.appendChild(addr);screen.appendChild(img);frame.appendChild(chrome);frame.appendChild(screen);
 var side=el('div','notes'),cnt=el('p','kind'),ttl=el('h3'),lab=el('p','lab','Catatan desain'),note=el('p','nt'),ctl=el('div','ctl'),thumbs=el('div','thumbs');
 function btn(t,l,f){var b=el('button','',t);b.type='button';b.setAttribute('aria-label',l);b.addEventListener('click',f);return b}
 ctl.appendChild(btn('←','Layar sebelumnya',function(){go(si-1)}));ctl.appendChild(btn('→','Layar berikutnya',function(){go(si+1)}));
 function openPres(){
  var p=P[pi];if(!p||!p.screens||!p.screens[si])return;
  if(window.openLightbox){
   window.openLightbox(p.screens[si].img, p.screens[si].title+', '+p.name, (p.screens[si].title?p.screens[si].title+': ':'')+(p.screens[si].note||''), {
    screens: p.screens,
    index: si,
    onNavigate: function(k){ go(k); }
   });
  }
 }
 var fs=btn('Layar penuh','Tampilkan presentasi layar penuh',openPres);fs.className='fs';ctl.appendChild(fs);
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
 screen.addEventListener('pointerup',function(e){if(x0==null)return;var d=e.clientX-x0;x0=null;if(Math.abs(d)>50)go(si+(d<0?1:-1));else openPres()});
 proj(0);
}
// ===== Video: tiap bab .vsheet memakai satu channel dari data.js (data-ch = urutan) =====
var VD=window.VIDEOS||[];
var vpop=null,vpopStage=null,vpopTitle=null,vpopTag=null,vpopDesc=null,vpopActions=null;
function initVideoPop(){
 if(vpop)return;
 vpop=el('dialog','cview vpop');
 var x=mk('button','x modal-close','×',function(){vpop.close()});
 x.setAttribute('aria-label','Tutup');
 vpopStage=el('div','vpop-stage');
 var info=el('div','vpop-info');
 vpopTag=el('span','vpop-tag');
 vpopTitle=el('h3','vpop-title');
 vpopDesc=el('p','vpop-desc');
 vpopActions=el('div','vpop-actions');
 [vpopTag,vpopTitle,vpopDesc,vpopActions].forEach(function(n){info.appendChild(n)});
 [x,vpopStage,info].forEach(function(n){vpop.appendChild(n)});
 document.body.appendChild(vpop);
 vpop.addEventListener('click',function(e){if(e.target===vpop)vpop.close()});
 vpop.addEventListener('close',function(){
  vpopStage.textContent='';
  if(window.sfxBeep)window.sfxBeep(420,.05);
 });
}
function openVideoPop(v,c){
 initVideoPop();
 vpopStage.textContent='';
 if(v.id){
  var f=el('iframe');
  f.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(v.id)+'?autoplay=1&rel=0&modestbranding=1&enablejsapi=1';
  f.title=v.title||'Video YouTube';
  f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
  f.allowFullscreen=true;
  vpopStage.appendChild(f);
 }else if(v.src||v.video||v.file){
  var vid=el('video');
  vid.src=v.src||v.video||v.file;
  vid.controls=true;
  vid.autoplay=true;
  vid.playsInline=true;
  vid.setAttribute('playsinline','');
  vpopStage.appendChild(vid);
  vid.play().catch(function(){});
 }
 vpopTag.textContent=(c.handle||('@'+c.channel))+' • '+(c.kind||'Video Dokumenter');
 vpopTitle.textContent=v.title||c.channel;
 vpopDesc.textContent=v.desc||c.desc||'';
 vpopActions.textContent='';
 var u=v.url||(v.id?'https://www.youtube.com/watch?v='+v.id:c.url);
 if(u){
  var ab=el('a','vpop-btn yt-watch','Tonton di YouTube ↗');
  ab.href=u;ab.target='_blank';ab.rel='noopener';
  vpopActions.appendChild(ab);
 }
 if(c.url){
  var ac=el('a','vpop-btn yt-channel','Channel '+(c.handle||('@'+c.channel))+' ↗');
  ac.href=c.url;ac.target='_blank';ac.rel='noopener';
  vpopActions.appendChild(ac);
 }
 vpop.showModal();
 if(window.sfxBeep)window.sfxBeep(750,.05);
}

[].forEach.call(document.querySelectorAll('.vsheet'),function(root){
 var c=VD[+root.dataset.ch];if(!c)return;
 var vs=root.querySelector('.vstage'),vl=root.querySelector('.vlist'),vcp=root.querySelector('figcaption'),vj=0;
 function badge(){return el('span','vbadge','Dibuat dengan AI agent')}
 function play(){var v=(c.videos||[])[vj];if(!v)return;openVideoPop(v,c)}
 function thumbOf(x){return x.thumb||(x.id?'https://i.ytimg.com/vi/'+x.id+'/hqdefault.jpg':c.thumb)}
 function short(t){t=(t||'').replace(/\s+/g,' ').trim();var i=t.search(/[.!?](\s|$)/),r=i>0?t.slice(0,i+1):t;return r.length>150?r.slice(0,147).replace(/\s+\S*$/,'')+'…':r}
 function draw(){var v=(c.videos||[])[vj],has=!!(v&&(v.id||v.src||v.video||v.file));vs.textContent='';
  var src=(v&&thumbOf(v))||c.thumb;
  var host=has?mk('button','vplay','',play):el('div','vstill');
  if(has)host.setAttribute('aria-label','Putar video '+(v.title||c.channel));
  else if(src)host.addEventListener('click',function(){if(window.openLightbox)window.openLightbox(src,(v&&v.title?v.title+', ':'')+'channel '+c.channel,(v&&v.title?v.title+': ':'')+((v&&v.desc)||c.desc||''))});
  var card=el('div','vcard');card.appendChild(el('strong','',c.channel));card.appendChild(el('span','',c.kind||''));host.appendChild(card);
  if(src){var im=el('img');im.src=src;im.alt=(v&&v.title?v.title+', ':'')+'channel '+c.channel;im.onerror=function(){im.remove()};host.appendChild(im)}
  vs.appendChild(host);vs.appendChild(badge());
  vl.textContent='';vl.hidden=(c.videos||[]).length<2;
  (c.videos||[]).forEach(function(x,k){var b=mk('button','vth','',function(){vj=k;draw()});b.setAttribute('aria-pressed',k===vj);b.setAttribute('aria-label','Pilih video '+(k+1)+': '+(x.title||''));
   var t=thumbOf(x);if(t){var i2=el('img');i2.src=t;i2.alt='';i2.loading='lazy';b.appendChild(i2)}b.appendChild(el('i','',String(k+1)));vl.appendChild(b)});
  vcp.textContent='';vcp.appendChild(el('strong','',(v&&v.title)||c.channel));
  var sd=short((v&&v.desc)||c.desc);if(sd)vcp.appendChild(el('span','',sd));
  var u=v&&(v.url||(v.id&&'https://www.youtube.com/watch?v='+v.id));
  if(u){var ex=el('a','link','Tonton di YouTube ↗');ex.href=u;ex.target='_blank';ex.rel='noopener';vcp.appendChild(ex)}}
 var rw=root.closest('.row'),cn=rw&&rw.querySelector('[data-vcount]'),hd=rw&&rw.querySelector('[data-handle]');
 if(cn)cn.textContent=(c.videos||[]).length;if(hd&&c.handle)hd.textContent=c.handle;
 draw()});
// ===== Sertifikat =====
var box=document.getElementById('certs'),more=document.getElementById('certmore'),fl=document.getElementById('certfilter'),LIM=8,all=false,cat='Semua';
var L=C.slice().sort(function(a,b){return (b.featured?1:0)-(a.featured?1:0)||(parseInt(b.year)||0)-(parseInt(a.year)||0)});
var cats=['Semua'];L.forEach(function(c){if(c.cat&&cats.indexOf(c.cat)<0)cats.push(c.cat)});
function mk(t,c,x,f){var e=el(t,c,x);if(f){e.type='button';e.addEventListener('click',f)}return e}
var vd=null,vlist=[],vi=0,vpi=0,vim,vcap,vcn,vpagesBar=null,vfull=null;
function meta(c){return c.issuer+(c.year?', '+c.year:'')}
function getPages(c){
 if(c.pages&&c.pages.length)return c.pages;
 if(c.img)return [c.img];
 return [];
}
function showPage(pIndex){
 var c=vlist[vi], pgs=getPages(c);
 if(!pgs.length)return;
 vpi=(pIndex+pgs.length)%pgs.length;
 vim.src=pgs[vpi];
 vim.alt=(c.kind||'Sertifikat')+' '+c.title+', halaman '+(vpi+1);
 if(vfull){vfull.href=pgs[vpi]}
 if(vpagesBar){
  vpagesBar.textContent='';
  if(pgs.length>1){
   pgs.forEach(function(p,k){
    var pb=mk('button','',(c.pageLabels&&c.pageLabels[k])||(k===0?'Halaman 1 (Depan)':'Halaman '+(k+1)+' (Materi & Kurikulum)'),function(e){
     e.stopPropagation();
     showPage(k);
     if(window.sfxBeep)window.sfxBeep(600,.04);
    });
    pb.setAttribute('aria-selected',k===vpi);
    vpagesBar.appendChild(pb);
   });
   vpagesBar.hidden=false;
  }else{
   vpagesBar.hidden=true;
  }
 }
 var n=vlist.length;
 vcn.textContent=(vi+1)+' dari '+n+(pgs.length>1?' • Hal '+(vpi+1)+'/'+pgs.length:'');
}
function view(i){
 var n=vlist.length;vi=(i+n)%n;var c=vlist[vi];vcap.textContent='';
 vcap.appendChild(el('span','cap-t',c.title));
 vcap.appendChild(el('span','cap-d',meta(c)+(c.note?'. '+c.note:'')));
 showPage(0);
}
function openView(list,i){
 if(!vd){
  vd=el('dialog','cview');
  var x=mk('button','x modal-close','×',function(){vd.close()});
  x.setAttribute('aria-label','Tutup');
  var fig=el('div','cvfig');
  vim=el('img');
  vim.title='Klik untuk melihat halaman berikutnya';
  vim.addEventListener('click',function(){
   var c=vlist[vi], pgs=getPages(c);
   if(pgs.length>1){
    showPage(vpi+1);
    if(window.sfxBeep)window.sfxBeep(600,.04);
   }
  });
  vpagesBar=el('div','cvpages');
  fig.appendChild(vim);
  fig.appendChild(vpagesBar);
  vfull=el('a','cvfull','Buka halaman ini ukuran penuh ↗');vfull.target='_blank';vfull.rel='noopener';fig.appendChild(vfull);
  vcap=el('div','capcard');
  vcn=el('span','cvn');
  var nav=el('div','cvnav');
  nav.appendChild(mk('button','','←',function(){view(vi-1);if(window.sfxBeep)window.sfxBeep(520,.04)}));
  nav.appendChild(vcn);
  nav.appendChild(mk('button','','→',function(){view(vi+1);if(window.sfxBeep)window.sfxBeep(520,.04)}));
  [x,fig,vcap,nav].forEach(function(n){vd.appendChild(n)});
  document.body.appendChild(vd);
  vd.addEventListener('click',function(e){if(e.target===vd)vd.close()});
  vd.addEventListener('close',function(){if(window.sfxBeep)window.sfxBeep(420,.05)});
  vd.addEventListener('keydown',function(e){
   if(e.key==='ArrowLeft')view(vi-1);
   else if(e.key==='ArrowRight')view(vi+1);
   else if(e.key==='ArrowDown'||e.key==='ArrowUp'){
    var c=vlist[vi], pgs=getPages(c);
    if(pgs.length>1)showPage(vpi+(e.key==='ArrowDown'?1:-1));
   }
  });
 }
 vlist=list;
 view(i);
 vd.showModal();
 if(window.sfxBeep)window.sfxBeep(750,.05);
}
window.openDoc=function(k){var x=(window.DOCS||{})[k];if(x)openView([x],0)};
document.addEventListener('click',function(e){var b=e.target.closest('[data-doc]');if(b)window.openDoc(b.dataset.doc)});
function certs(){if(!box)return;box.textContent='';
 var f=L.filter(function(c){return cat==='Semua'||c.cat===cat}),withImg=f.filter(function(c){return c.img});
 f.forEach(function(c,i){if(!all&&i>=LIM)return;var has=!!c.img,card=el(has?'button':'div','cert'+(c.featured?' feat':''));if(has)card.type='button';
  var th=el('div','th');if(has){
   var im=el('img');im.src=c.img;im.alt='Sertifikat '+c.title;im.loading='lazy';th.appendChild(im);
   if(c.pages&&c.pages.length>1){
    var pb=el('span','cert-page-badge',c.pages.length+' Halaman');
    th.appendChild(pb);
   }
  }
  else th.appendChild(el('span','ini',c.year||c.title.split(/\s+/).slice(0,2).map(function(w){return w[0]}).join('')));
  card.appendChild(th);var tx=el('div','ct');tx.appendChild(el('strong','',c.title));tx.appendChild(el('span','',meta(c)));if(c.note)tx.appendChild(el('small','',c.note));card.appendChild(tx);
  if(has)card.addEventListener('click',function(){openView(withImg,withImg.indexOf(c))});
  box.appendChild(card)});
 if(more){more.hidden=f.length<=LIM;more.textContent=all?'Tampilkan lebih sedikit':'Lihat semua ('+f.length+')'}}
function chips(){if(!fl)return;fl.textContent='';if(cats.length<3)return;
 cats.forEach(function(k){var b=mk('button','',k,function(){cat=k;all=false;chips();certs()});b.setAttribute('aria-pressed',k===cat);fl.appendChild(b)})}
if(more)more.addEventListener('click',function(){all=!all;certs()});chips();certs();
})();
