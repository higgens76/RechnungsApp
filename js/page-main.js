function createMainPage() {
  const el = document.createElement('div');
  el.id = 'pageMain';
  el.innerHTML = `
    <header>
      <div class="header-left">
        <button class="btn-hamburger" id="btnMenu" aria-label="Menü öffnen">
          <span></span><span></span><span></span>
        </button>
      </div>
      <h1>RechnungApp</h1>
      <div></div>
    </header>
    <main>
      <div class="product-grid" id="productGrid"></div>
    </main>
    <div class="checkout-bar">
      <button class="btn-checkout" id="btnCheckout" disabled>Gesamt: 0,00 €</button>
    </div>
  `;
  return el;
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  PRODUCTS.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card' + (quantities[i] > 0 ? ' active' : '');
    card.innerHTML = `
      <img class="product-icon" src="${p.img}" alt="${p.name}" />
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${fmt(p.price)}</div>
      </div>
      <span class="qty-badge" id="qty-${i}">${quantities[i]}</span>
      <button class="btn-minus" aria-label="${p.name} entfernen" ${quantities[i] === 0 ? 'disabled' : ''}>−</button>
    `;
    card.addEventListener('click', () => increment(i));
    card.querySelector('.btn-minus').addEventListener('click', (e) => {
      e.stopPropagation();
      decrement(i);
    });
    grid.appendChild(card);
  });
}

function updateCard(i) {
  const card = document.getElementById('productGrid').children[i];
  const badge = document.getElementById(`qty-${i}`);
  badge.textContent = quantities[i];
  card.className = 'product-card' + (quantities[i] > 0 ? ' active' : '');
  card.querySelector('.btn-minus').disabled = quantities[i] === 0;
  card.setAttribute('aria-label', `${PRODUCTS[i].name} hinzufügen`);
}

function updateCheckout() {
  const t = total();
  const btn = document.getElementById('btnCheckout');
  btn.textContent = `Gesamt: ${fmt(t)}`;
  btn.disabled = t === 0;
}

function increment(i) {
  quantities[i]++;
  updateCard(i);
  updateCheckout();
}

function decrement(i) {
  if (quantities[i] === 0) return;
  quantities[i]--;
  updateCard(i);
  updateCheckout();
}

function checkout() {
  const t = total();
  if (t === 0) return;

  const order = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    items: PRODUCTS
      .map((p, i) => ({ name: p.name, price: p.price, quantity: quantities[i] }))
      .filter(item => item.quantity > 0),
    total: t,
  };

  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);

  quantities = new Array(PRODUCTS.length).fill(0);
  renderProducts();
  updateCheckout();
  showToast('Bestellung gespeichert ✓');
}
