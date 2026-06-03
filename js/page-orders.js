function createOrdersPage() {
  const el = document.createElement('div');
  el.id = 'pageOrders';
  el.innerHTML = `
    <header>
      <div class="header-left">
        <button class="btn-back" id="btnBackOrders" aria-label="Zurück"></button>
      </div>
      <h1>Bestellungen</h1>
      <div></div>
    </header>
    <div class="orders-list" id="ordersList"></div>
    <div class="checkout-bar">
      <button class="btn-checkout" id="btnExport" disabled>Als JSON exportieren</button>
    </div>
  `;
  return el;
}

function renderOrders() {
  const orders   = loadOrders();
  const list      = document.getElementById('ordersList');
  const exportBtn = document.getElementById('btnExport');
  exportBtn.disabled = orders.length === 0;
  if (orders.length === 0) {
    list.innerHTML = '<p class="empty-hint">Noch keine Bestellungen gespeichert.</p>';
    return;
  }
  list.innerHTML = [...orders].reverse().map(o => {
    const date      = new Date(o.timestamp).toLocaleString('de-DE');
    const itemsHtml = o.items.map(item =>
      `<div class="order-item">
        <span>${item.quantity}× ${item.name}</span>
        <span>${fmt(item.quantity * item.price)}</span>
      </div>`
    ).join('');
    return `
      <div class="order-card">
        <div class="order-meta">${date}</div>
        <div class="order-items">${itemsHtml}</div>
        <div class="order-total"><span>Gesamt</span><span>${fmt(o.total)}</span></div>
      </div>`;
  }).join('');
}

function exportOrders() {
  const orders = loadOrders();
  if (orders.length === 0) return;
  const blob = new Blob([JSON.stringify(orders, null, 2)], { type: 'application/json' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = `rechnungapp_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('Export gestartet.');
}

function openOrders()  {
  renderOrders();
  document.getElementById('pageOrders').classList.add('active');
}
function closeOrders() { document.getElementById('pageOrders').classList.remove('active'); }
