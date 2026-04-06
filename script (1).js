const products = [
  { id:1, team:'MI', name:'Mumbai Indians Home Jersey', price:899, original:1199, emoji:'🔵', badge:'Hot', size:'M', color:'#0078b4' },
  { id:2, team:'CSK', name:'Chennai Super Kings Fan Tee', price:699, original:999, emoji:'🟡', badge:'New', size:'L', color:'#f7d116' },
  { id:3, team:'RCB', name:'Royal Challengers Bengaluru Jersey', price:999, original:1299, emoji:'🔴', badge:'Hot', size:'M', color:'#d4202a' },
  { id:4, team:'KKR', name:'Kolkata Knight Riders Official Tee', price:749, original:999, emoji:'🟣', badge:'', size:'XL', color:'#552583' },
  { id:5, team:'DC', name:'Delhi Capitals Fan Edition', price:649, original:899, emoji:'🔷', badge:'Sale', size:'S', color:'#1764c0' },
  { id:6, team:'PBKS', name:'Punjab Kings Home Shirt', price:699, original:899, emoji:'🩷', badge:'New', size:'L', color:'#d4182b' },
  { id:7, team:'RR', name:'Rajasthan Royals Premium Jersey', price:849, original:1099, emoji:'🩵', badge:'', size:'M', color:'#254aa5' },
  { id:8, team:'SRH', name:'Sunrisers Hyderabad Match Tee', price:799, original:1099, emoji:'🟠', badge:'Hot', size:'XL', color:'#f26522' },
  { id:9, team:'GT', name:'Gujarat Titans Official Jersey', price:749, original:999, emoji:'🔵', badge:'New', size:'L', color:'#1c4587' },
  { id:10, team:'LSG', name:'Lucknow Super Giants Fan Shirt', price:699, original:899, emoji:'🩵', badge:'', size:'M', color:'#75d5f0' },
];

const teams = ['All', ...new Set(products.map(p => p.team))];
let activeFilter = 'All';
let cart = [];
let selectedSizes = {};

const tickerItems = ['FREE DELIVERY ON ₹999+', 'IPLWIN20 — 20% OFF ABOVE ₹1499', 'NEW ARRIVALS — IPL 2025 SEASON', 'AUTHENTIC LICENSED MERCHANDISE', 'ALL 10 TEAMS AVAILABLE', 'COD ACCEPTED PAN INDIA'];
const ticker = document.getElementById('ticker-inner');
const doubled = [...tickerItems, ...tickerItems];
ticker.innerHTML = doubled.map(t => `<span class="ticker-item">★ ${t}</span>`).join('');

function renderFilters() {
  const container = document.getElementById('filter-btns');
  container.innerHTML = teams.map(t => `
    <button class="filter-btn ${t === activeFilter ? 'active' : ''}" onclick="setFilter('${t}')">${t}</button>
  `).join('');
}

function setFilter(team) {
  activeFilter = team;
  renderFilters();
  renderProducts();
}

function renderProducts() {
  const filtered = activeFilter === 'All' ? products : products.filter(p => p.team === activeFilter);
  const grid = document.getElementById('products-grid');
  grid.innerHTML = filtered.map(p => {
    const sizes = ['S','M','L','XL','XXL'];
    const selected = selectedSizes[p.id] || 'M';
    const inCart = cart.find(c => c.id === p.id);
    return `
    <div class="product-card">
      <div class="product-img" style="background: linear-gradient(135deg, ${p.color}22, ${p.color}44)">
        <span>${p.emoji}</span>
        ${p.badge ? `<span class="product-badge ${p.badge==='New'?'new':''}">${p.badge}</span>` : ''}
      </div>
      <div class="product-info">
        <div class="product-team">${p.team}</div>
        <div class="product-name">${p.name}</div>
        <div class="sizes">
          ${sizes.map(s => `<span class="size-chip ${selected===s?'active':''}" onclick="selectSize(${p.id},'${s}')">${s}</span>`).join('')}
        </div>
        <div class="product-bottom">
          <div class="product-price">₹${p.price.toLocaleString('en-IN')} <span class="original">₹${p.original.toLocaleString('en-IN')}</span></div>
          <button class="add-btn ${inCart?'added':''}" id="btn-${p.id}" onclick="addToCart(${p.id})">
            ${inCart ? '✓ Added' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function selectSize(id, size) {
  selectedSizes[id] = size;
  renderProducts();
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const size = selectedSizes[id] || 'M';
  const existing = cart.find(c => c.id === id && c.size === size);
  if (existing) { existing.qty++; }
  else { cart.push({ ...product, size, qty: 1 }); }
  updateCartCount();
  renderProducts();
  showToast(`${product.team} tee (${size}) added to cart!`);
}

function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.reduce((s,i) => s+i.qty, 0);
}

function toggleCart() {
  const modal = document.getElementById('cart-modal');
  modal.classList.toggle('open');
  if (modal.classList.contains('open')) renderCart();
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('cart-modal')) toggleCart();
}

function renderCart() {
  const itemsEl = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');
  if (!cart.length) {
    itemsEl.innerHTML = `<div class="empty-cart"><div class="icon">🛒</div><div>Your cart is empty</div><div style="font-size:0.8rem;margin-top:0.5rem">Add some IPL tees!</div></div>`;
    footerEl.innerHTML = '';
    return;
  }
  itemsEl.innerHTML = cart.map((item,i) => `
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji}</div>
      <div style="flex:1">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-team">${item.team} · Size: ${item.size} · Qty: ${item.qty}</div>
      </div>
      <div>
        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
        <button onclick="removeFromCart(${i})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:0.75rem;display:block;margin-top:4px;">Remove</button>
      </div>
    </div>`).join('');
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  footerEl.innerHTML = `
    <div class="cart-total">
      <div class="cart-total-label">Total</div>
      <div class="cart-total-amount">₹${total.toLocaleString('en-IN')}</div>
    </div>
    ${total >= 1499 ? '<p style="color:#20b060;font-size:0.8rem;margin-top:0.5rem">🎉 IPLWIN20 applied — 20% discount!</p>' : `<p style="color:var(--muted);font-size:0.8rem;margin-top:0.5rem">Add ₹${(1499-total).toLocaleString('en-IN')} more for 20% off</p>`}
    <button class="checkout-btn" onclick="checkout()">Proceed to Checkout →</button>`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCart();
  renderProducts();
}

function checkout() {
  showToast('Order placed! You will receive a confirmation SMS.');
  cart = [];
  updateCartCount();
  toggleCart();
  renderProducts();
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

renderFilters();
renderProducts();
