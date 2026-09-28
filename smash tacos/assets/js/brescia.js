const SAUCES = ["Salsa smash","Ketchup","Maionese","Salsa piccante","BBQ"];
const MENU = {
  tacos: [
    {n:"Smash tacos XL 170g", d:"Tortillas, salsa al formaggio, macinato di manzo, tenders di pollo, pollo al forno, patatine e salsa smash", p:14.50, halal:true, sauceChoice:false, combo:true},
    {n:"Classique tacos XL 170g", d:"Tortillas, salsa al formaggio, patatine, cordon bleu, tenders di pollo e salsa a scelta", p:13.50, halal:false, sauceChoice:true, combo:true},
    {n:"Brixia tacos XL 170g", d:"Tortillas, salsa al formaggio, patatine, macinato di manzo, tenders di pollo e salsa a scelta", p:13.50, halal:false, sauceChoice:true, combo:true},
    {n:"Smash tacos L 140g", d:"Tortillas, salsa al formaggio, patatine, macinato di manzo, tenders di pollo, pollo al forno e salsa smash", p:12.50, halal:true, sauceChoice:false, combo:true},
    {n:"Classique tacos L 140g", d:"Tortillas, salsa al formaggio, cordon bleu, tenders di pollo, patatine e salsa a scelta", p:11.50, halal:true, sauceChoice:true, combo:true},
    {n:"Brixia tacos L 140g", d:"Tortillas, salsa al formaggio, patatine, macinato di manzo, tenders di pollo e salsa a scelta", p:11.50, halal:true, sauceChoice:true, combo:true},
    {n:"Smash tacos M 100g", d:"Tortillas, salsa al formaggio, macinato di manzo, tenders di pollo, pollo al forno e salsa smash", p:11.50, halal:true, sauceChoice:false, combo:true},
  ],
  bowls: [
    {n:"Bowl Smash", d:"Riso, macinato di manzo, insalata, formaggio, salsa smash", p:10.50, halal:true, sauceChoice:false, combo:false},
    {n:"Bowl Pollo", d:"Riso, pollo al forno, insalata, formaggio, salsa a scelta", p:9.50, halal:true, sauceChoice:true, combo:false},
  ],
  fritti: [
    {n:"Patatine", d:"Porzione classica, croccanti", p:3.50, halal:true, sauceChoice:false, combo:false},
    {n:"Tenders di pollo (5pz)", d:"Panati e fritti, con salsa a scelta", p:5.50, halal:true, sauceChoice:true, combo:false},
    {n:"Mozzarella sticks", d:"6 pezzi, salsa a scelta", p:5.00, halal:true, sauceChoice:true, combo:false},
  ],
  bevande: [
    {n:"Coca-Cola 33cl", d:"Lattina", p:2.50, halal:true, sauceChoice:false, combo:false},
    {n:"Fanta 33cl", d:"Lattina", p:2.50, halal:true, sauceChoice:false, combo:false},
    {n:"Acqua naturale 50cl", d:"", p:1.50, halal:true, sauceChoice:false, combo:false},
    {n:"Tè freddo pesca 33cl", d:"Lattina", p:2.50, halal:true, sauceChoice:false, combo:false},
  ]
};
const COMBO_PRICE = 3.50;

let cart = {};

/* --- sfondo animato: stelline + braci brand --- */
(function(){
  const canvas = document.getElementById('bgstars');
  const ctx = canvas.getContext('2d');
  let W,H;
  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (a,b)=> a + Math.random()*(b-a);

  class Star{
    constructor(){ this.reset(); }
    reset(){
      this.x = rand(0,W); this.y = rand(0,H);
      this.r = rand(.6,2.1); this.base = rand(.12,.5);
      this.speed = rand(.5,1.6); this.phase = rand(0,Math.PI*2);
      this.warm = Math.random() > .82;
    }
    draw(t){
      const tw = .5 + .5*Math.sin(t*.001*this.speed + this.phase);
      const a = this.base + tw*.45;
      ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle = this.warm ? `rgba(196,217,74,${a.toFixed(2)})` : `rgba(246,236,217,${a.toFixed(2)})`;
      ctx.shadowBlur = this.r > 1.5 ? 6 : 0;
      ctx.shadowColor = this.warm ? 'rgba(196,217,74,.7)' : 'rgba(246,236,217,.5)';
      ctx.fill();
    }
  }
  class Ember{
    constructor(){ this.reset(true); }
    reset(init){
      this.x = rand(0,W); this.y = init ? rand(0,H) : H + rand(0,40);
      this.r = rand(1,2.4); this.speed = rand(.15,.5);
      this.drift = rand(-.25,.25); this.flicker = rand(0,Math.PI*2);
    }
    step(){
      this.y -= this.speed;
      this.x += Math.sin(performance.now()*.001 + this.flicker) * this.drift;
      if(this.y < -10) this.reset(false);
    }
    draw(){
      const a = .18 + .3*Math.abs(Math.sin(this.flicker + performance.now()*.002));
      ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(217,79,43,${a.toFixed(2)})`;
      ctx.shadowBlur = 7; ctx.shadowColor = 'rgba(217,79,43,.7)';
      ctx.fill();
    }
  }
  const stars = Array.from({length: reduceMotion ? 70 : 150}, ()=>new Star());
  const embers = Array.from({length: reduceMotion ? 0 : 14}, ()=>new Ember());
  function sky(){
    const g = ctx.createRadialGradient(W*.5,H*.05,0, W*.5,H*.4,Math.max(W,H)*.9);
    g.addColorStop(0,'#241812'); g.addColorStop(1,'#150e0a');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  }
  function loop(t){
    sky(); stars.forEach(s=>s.draw(t)); embers.forEach(e=>{ e.step(); e.draw(); });
    if(!reduceMotion) requestAnimationFrame(loop);
  }
  sky(); stars.forEach(s=>s.draw(0));
  if(!reduceMotion) requestAnimationFrame(loop);
})();


function renderMenu(cat){
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = '';
  MENU[cat].forEach((item,i)=>{
    const id = cat+'-'+i;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      ${item.halal ? '<span class="halal">Halal</span>' : ''}
      <h3>${item.n}</h3>
      <div class="desc">${item.d}</div>
      <div class="row">
        <span class="price">da ${item.p.toFixed(2)}€</span>
        <button class="addbtn" aria-label="Personalizza ${item.n}" onclick="openCustomize('${cat}',${i},event)">+</button>
      </div>`;
    grid.appendChild(card);
  });
}

document.querySelectorAll('.tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    renderMenu(tab.dataset.cat);
  });
});

/* --- personalizzazione ordine --- */
let customizeState = null;
function openCustomize(cat,i,evt){
  const item = MENU[cat][i];
  customizeState = { cat, i, item, qty:1, sauce: item.sauceChoice ? SAUCES[0] : null, isMenu:false, fritto:0, bevanda:0, sourceEl: evt ? evt.target.closest('.addbtn') : null };
  renderCustomizeModal();
  document.getElementById('customizeOverlay').classList.add('show');
  document.getElementById('customizeModal').classList.add('show');
}
function closeCustomize(){
  document.getElementById('customizeOverlay').classList.remove('show');
  document.getElementById('customizeModal').classList.remove('show');
}
function custQty(delta){
  customizeState.qty = Math.max(1, customizeState.qty + delta);
  renderCustomizeModal();
}
function custSauce(s){ customizeState.sauce = s; renderCustomizeModal(); }
function custToggleMenu(on){ customizeState.isMenu = on; renderCustomizeModal(); }
function custFritto(i){ customizeState.fritto = i; renderCustomizeModal(); }
function custBevanda(i){ customizeState.bevanda = i; renderCustomizeModal(); }

function renderCustomizeModal(){
  const s = customizeState;
  const item = s.item;
  const unit = item.p + (s.isMenu ? COMBO_PRICE : 0);
  const total = unit * s.qty;
  let html = `
    <div class="cm-head">
      <h3>${item.n}</h3>
      <button class="closebtn" onclick="closeCustomize()" aria-label="Chiudi">&times;</button>
    </div>
    <div class="cm-body">
      <p class="cm-desc">${item.d}</p>

      <div class="cm-block">
        <div class="cm-label">Quantità</div>
        <div class="qtybtns" style="gap:14px;">
          <button onclick="custQty(-1)" aria-label="Meno">−</button>
          <span style="min-width:18px; text-align:center; font-weight:700;">${s.qty}</span>
          <button onclick="custQty(1)" aria-label="Più">+</button>
        </div>
      </div>`;

  if(item.sauceChoice){
    html += `
      <div class="cm-block">
        <div class="cm-label">Salsa a scelta</div>
        <div class="cm-options">
          ${SAUCES.map(sc=>`<button class="cm-chip ${s.sauce===sc?'active':''}" onclick="custSauce('${sc}')">${sc}</button>`).join('')}
        </div>
      </div>`;
  }

  if(item.combo){
    html += `
      <div class="cm-block">
        <div class="cm-label">Solo taco o menu completo?</div>
        <div class="cm-options">
          <button class="cm-chip ${!s.isMenu?'active':''}" onclick="custToggleMenu(false)">Solo taco</button>
          <button class="cm-chip ${s.isMenu?'active':''}" onclick="custToggleMenu(true)">Menu completo (+${COMBO_PRICE.toFixed(2)}€)</button>
        </div>
      </div>`;
    if(s.isMenu){
      html += `
      <div class="cm-block">
        <div class="cm-label">Scegli il fritto</div>
        <div class="cm-options">
          ${MENU.fritti.map((f,fi)=>`<button class="cm-chip ${s.fritto===fi?'active':''}" onclick="custFritto(${fi})">${f.n}</button>`).join('')}
        </div>
      </div>
      <div class="cm-block">
        <div class="cm-label">Scegli la bibita</div>
        <div class="cm-options">
          ${MENU.bevande.map((b,bi)=>`<button class="cm-chip ${s.bevanda===bi?'active':''}" onclick="custBevanda(${bi})">${b.n}</button>`).join('')}
        </div>
      </div>`;
    }
  }

  html += `
    </div>
    <div class="cm-foot">
      <div class="cm-total">${total.toFixed(2)}€</div>
      <button class="btn primary" style="border:none;" onclick="confirmCustomize()">Aggiungi al carrello</button>
    </div>`;

  document.getElementById('customizeModal').innerHTML = html;
}

function confirmCustomize(){
  const s = customizeState;
  const item = s.item;
  let label = item.n;
  const details = [];
  if(item.sauceChoice) details.push(`Salsa: ${s.sauce}`);
  if(item.combo && s.isMenu){
    details.push(`Menu: ${MENU.fritti[s.fritto].n} + ${MENU.bevande[s.bevanda].n}`);
  }
  const unit = item.p + (item.combo && s.isMenu ? COMBO_PRICE : 0);
  const sig = `${s.cat}-${s.i}|${s.sauce}|${s.isMenu}|${s.fritto}|${s.bevanda}`;
  const fullName = details.length ? `${label} (${details.join(', ')})` : label;

  if(!cart[sig]) cart[sig] = { name: fullName, price: unit, qty:0 };
  cart[sig].qty += s.qty;
  renderCart();
  flyToCartFrom(s.sourceEl);
  const cartBtn = document.getElementById('cartBtn');
  cartBtn.classList.remove('bump'); void cartBtn.offsetWidth; cartBtn.classList.add('bump');
  closeCustomize();
  openCart();
}

function flyToCartFrom(sourceEl){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cartBtn = document.getElementById('cartBtn');
  if(reduce || !cartBtn || !sourceEl) return;
  const start = sourceEl.getBoundingClientRect();
  const end = cartBtn.getBoundingClientRect();
  const dot = document.createElement('div');
  dot.className = 'fly-dot';
  dot.style.left = (start.left + start.width/2 - 7) + 'px';
  dot.style.top = (start.top + start.height/2 - 7) + 'px';
  document.body.appendChild(dot);
  requestAnimationFrame(()=>{
    dot.style.transform = `translate(${end.left - start.left}px, ${end.top - start.top}px) scale(.3)`;
    dot.style.opacity = '0';
  });
  setTimeout(()=>dot.remove(), 600);
}

function changeQty(id,delta){
  if(!cart[id]) return;
  cart[id].qty += delta;
  if(cart[id].qty <= 0) delete cart[id];
  renderCart();
}
function renderCart(){
  const wrap = document.getElementById('drawerItems');
  const ids = Object.keys(cart);
  let count = 0, total = 0;
  if(ids.length === 0){
    wrap.innerHTML = '<div class="empty-msg">Il carrello è vuoto — aggiungi qualcosa dal menu.</div>';
  } else {
    wrap.innerHTML = ids.map(id=>{
      const it = cart[id];
      count += it.qty; total += it.qty*it.price;
      return `<div class="ditem">
        <div><div class="name">${it.name}</div><div style="opacity:.6">${it.price.toFixed(2)}€</div></div>
        <div class="qtybtns">
          <button onclick="changeQty('${id}',-1)" aria-label="Togli uno">−</button>
          <span>${it.qty}</span>
          <button onclick="changeQty('${id}',1)" aria-label="Aggiungi uno">+</button>
        </div>
      </div>`;
    }).join('');
  }
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = total.toFixed(2)+'€';
}
function openCart(){
  document.getElementById('drawer').classList.add('show');
  document.getElementById('overlay').classList.add('show');
}
function closeCart(){
  document.getElementById('drawer').classList.remove('show');
  document.getElementById('overlay').classList.remove('show');
}

function submitOrder(e){
  e.preventDefault();
  const ids = Object.keys(cart);
  if(ids.length === 0) return;
  const name = document.getElementById('custName').value;
  const phone = document.getElementById('custPhone').value;
  const note = document.getElementById('custNote').value;
  const items = ids.map(id=>`${cart[id].qty}x ${cart[id].name}`);
  const total = ids.reduce((s,id)=>s+cart[id].qty*cart[id].price,0);

  let orders = [];
  try{ orders = JSON.parse(localStorage.getItem('smashOrders')||'[]'); }catch(err){ orders = []; }
  let seq = 0;
  try{ seq = parseInt(localStorage.getItem('smashOrderSeq')||'0',10) || 0; }catch(err){}
  seq += 1;
  const order = { num: seq, name, phone, note, items, total, status:'in_preparazione', time: new Date().toLocaleString('it-IT'), ts: Date.now() };
  orders.unshift(order);
  try{
    localStorage.setItem('smashOrders', JSON.stringify(orders));
    localStorage.setItem('smashOrderSeq', String(seq));
  }catch(err){}
  try{
    const bc = new BroadcastChannel('smashOrders');
    bc.postMessage({type:'new-order', order});
    bc.close();
  }catch(err){}

  document.getElementById('checkoutForm').style.display='none';
  document.getElementById('confirmMsg').textContent = `Ordine #${seq} ricevuto! Ritira tra 15-20 minuti al banco.`;
  document.getElementById('confirmMsg').style.display='block';
  cart = {};
  renderCart();
  renderOrders();
  setTimeout(()=>{
    document.getElementById('checkoutForm').style.display='block';
    document.getElementById('confirmMsg').style.display='none';
    document.getElementById('custName').value='';
    document.getElementById('custPhone').value='';
    document.getElementById('custNote').value='';
    closeCart();
  }, 2500);
}

function renderOrders(){
  const list = document.getElementById('ordersList');
  let orders = [];
  try{ orders = JSON.parse(localStorage.getItem('smashOrders')||'[]'); }catch(err){ orders = []; }
  if(orders.length === 0){
    list.innerHTML = '<div class="empty-msg">Nessun ordine ricevuto ancora su questo dispositivo.</div>';
    return;
  }
  list.innerHTML = orders.map(o=>`
    <div class="order-row">
      <div class="top"><b>#${o.num||'—'} · ${o.name} — ${o.phone}</b><span class="badge">${o.time}</span></div>
      <ul>${o.items.map(i=>`<li>${i}</li>`).join('')}</ul>
      ${o.note ? `<div style="margin-top:6px; opacity:.7;">Nota: ${o.note}</div>` : ''}
      <div style="margin-top:8px; font-family:'Archivo Black'; color:var(--lime);">${o.total.toFixed(2)}€</div>
    </div>`).join('');
}
function clearOrders(){
  try{ localStorage.removeItem('smashOrders'); }catch(err){}
  renderOrders();
}
function toggleAdmin(e){
  e.preventDefault();
  const admin = document.getElementById('admin');
  admin.classList.toggle('show');
  if(admin.classList.contains('show')){
    renderOrders();
    admin.scrollIntoView({behavior:'smooth'});
  }
}

renderMenu('tacos');
renderCart();

requestAnimationFrame(()=>{
  document.getElementById('smashStage').classList.add('play');
  document.getElementById('heroSection').classList.add('play');
});
