/* --- sfondo: cielo notturno con stelle che si illuminano + braci leggere --- */
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W,H;
function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function rand(a,b){ return a + Math.random()*(b-a); }

class Star{
  constructor(){ this.reset(); }
  reset(){
    this.x = rand(0, W);
    this.y = rand(0, H);
    this.r = rand(.6, 2.2);
    this.baseAlpha = rand(.15, .55);
    this.speed = rand(.5, 1.6);
    this.phase = rand(0, Math.PI*2);
    this.warm = Math.random() > .8;
  }
  draw(t){
    const twinkle = .5 + .5*Math.sin(t*.001*this.speed + this.phase);
    const alpha = this.baseAlpha + twinkle*.45;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fillStyle = this.warm
      ? `rgba(255,200,150,${alpha.toFixed(2)})`
      : `rgba(246,236,217,${alpha.toFixed(2)})`;
    ctx.shadowBlur = this.r > 1.6 ? 6 : 0;
    ctx.shadowColor = this.warm ? 'rgba(255,180,120,.8)' : 'rgba(246,236,217,.6)';
    ctx.fill();
  }
}
class Ember{
  constructor(){ this.reset(true); }
  reset(initial){
    this.x = rand(0, W);
    this.y = initial ? rand(0, H) : H + rand(0,40);
    this.r = rand(1, 2.6);
    this.speed = rand(.2, .6);
    this.drift = rand(-.3,.3);
    this.flicker = rand(0, Math.PI*2);
  }
  step(){
    this.y -= this.speed;
    this.x += Math.sin(performance.now()*.001 + this.flicker) * this.drift;
    if(this.y < -10) this.reset(false);
  }
  draw(){
    const alpha = .25 + .35*Math.abs(Math.sin(this.flicker + performance.now()*.002));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,138,61,${alpha.toFixed(2)})`;
    ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(255,138,61,.8)';
    ctx.fill();
  }
}
const stars = Array.from({length: reduceMotion ? 60 : 140}, ()=>new Star());
const embers = Array.from({length: reduceMotion ? 0 : 18}, ()=>new Ember());

function drawSky(){
  const g = ctx.createRadialGradient(W*0.5,H*0.05,0, W*0.5,H*0.4,Math.max(W,H)*0.9);
  g.addColorStop(0,'#1a1109');
  g.addColorStop(1,'#0a0705');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,W,H);
}

function loop(t){
  drawSky();
  stars.forEach(s=>s.draw(t));
  embers.forEach(e=>{ e.step(); e.draw(); });
  if(!reduceMotion) requestAnimationFrame(loop);
}
drawSky();
stars.forEach(s=>s.draw(0));
if(!reduceMotion) requestAnimationFrame(loop);

/* --- orologio --- */
function tickClock(){
  const d = new Date();
  document.getElementById('clock').textContent = d.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'});
}
tickClock(); setInterval(tickClock, 15000);

/* --- coda ordini --- */
function loadOrders(){
  try{ return JSON.parse(localStorage.getItem('smashOrders')||'[]'); }catch(err){ return []; }
}
function saveOrders(orders){
  try{ localStorage.setItem('smashOrders', JSON.stringify(orders)); }catch(err){}
}
function fmtElapsed(ts){
  const s = Math.max(0, Math.floor((Date.now()-ts)/1000));
  const m = Math.floor(s/60), r = s%60;
  return `${m}:${r.toString().padStart(2,'0')}`;
}
function render(){
  const orders = loadOrders();
  const prep = orders.filter(o=>o.status!=='pronto').sort((a,b)=>a.ts-b.ts);
  const ready = orders.filter(o=>o.status==='pronto').sort((a,b)=>b.ts-a.ts);
  document.getElementById('prepCount').textContent = prep.length;
  document.getElementById('readyCount').textContent = ready.length;

  const prepEl = document.getElementById('prepQueue');
  prepEl.innerHTML = prep.length ? prep.map(o=>{
    const elapsed = Date.now()-o.ts;
    const late = elapsed > 15*60*1000;
    return `<div class="order">
      <div class="num">#${o.num}</div>
      <div class="body">
        <div class="name">${o.name}</div>
        <div class="items">${o.items.join(' · ')}</div>
        <div class="meta"><span class="timer ${late?'late':''}" data-ts="${o.ts}">${fmtElapsed(o.ts)}</span></div>
      </div>
      <button class="donebtn" onclick="markReady(${o.num})">Pronto ✓</button>
    </div>`;
  }).join('') : '<div class="empty">Nessun ordine in preparazione</div>';

  const readyEl = document.getElementById('readyQueue');
  readyEl.innerHTML = ready.length ? ready.map(o=>`
    <div class="order ready">
      <div class="num">#${o.num}</div>
      <div class="body">
        <div class="name">${o.name}</div>
        <div class="items">${o.items.join(' · ')}</div>
      </div>
      <button class="donebtn" style="background:transparent; border:1px solid var(--line); color:var(--tortilla);" onclick="markPicked(${o.num})">Ritirato</button>
    </div>`).join('') : '<div class="empty">Nessun ordine pronto</div>';
}
function markReady(num){
  const orders = loadOrders();
  const o = orders.find(x=>x.num===num);
  if(o){ o.status='pronto'; saveOrders(orders); render(); broadcast(); }
}
function markPicked(num){
  let orders = loadOrders();
  orders = orders.filter(x=>x.num!==num);
  saveOrders(orders); render(); broadcast();
}
function broadcast(){
  try{ const bc = new BroadcastChannel('smashOrders'); bc.postMessage({type:'update'}); bc.close(); }catch(err){}
}
render();
setInterval(()=>{
  document.querySelectorAll('.timer').forEach(el=>{
    const ts = parseInt(el.dataset.ts,10);
    el.textContent = fmtElapsed(ts);
    el.classList.toggle('late', (Date.now()-ts) > 15*60*1000);
  });
}, 1000);

window.addEventListener('storage', (e)=>{ if(e.key==='smashOrders') render(); });
try{
  const bc = new BroadcastChannel('smashOrders');
  bc.onmessage = ()=> render();
}catch(err){}
