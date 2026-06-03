// ── Produktkonfiguration ────────────────────────────────────────────────
const STORAGE_KEY = "rechnungapp_orders";
const PRODUCTS_KEY = "rechnungapp_products";

const DEFAULT_PRODUCTS = [
  { id: "1", name: "Kaffee",    price: 2.50, img: "img/placeholder.svg" },
  { id: "2", name: "Tee",       price: 1.80, img: "img/placeholder.svg" },
  { id: "3", name: "Wasser",    price: 1.20, img: "img/placeholder.svg" },
  { id: "4", name: "Kuchen",    price: 3.50, img: "img/placeholder.svg" },
  { id: "5", name: "Sandwich",  price: 4.90, img: "img/placeholder.svg" },
  { id: "6", name: "Gebäck",    price: 2.20, img: "img/placeholder.svg" },
];

function loadProducts() {
  try { return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || DEFAULT_PRODUCTS; }
  catch { return DEFAULT_PRODUCTS; }
}
function saveProducts() {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(PRODUCTS));
}

let PRODUCTS = loadProducts();

// ── State ───────────────────────────────────────────────────────────────
let quantities = new Array(PRODUCTS.length).fill(0);

// ── Helpers ─────────────────────────────────────────────────────────────
const fmt = (n) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
const total = () => quantities.reduce((s, q, i) => s + q * PRODUCTS[i].price, 0);

function loadOrders() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

// ── Render products ─────────────────────────────────────────────────────
function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  PRODUCTS.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "product-card" + (quantities[i] > 0 ? " active" : "");
    card.innerHTML = `
      <img class="product-icon" src="${p.img}" alt="${p.name}" />
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${fmt(p.price)}</div>
      </div>
      <span class="qty-badge" id="qty-${i}">${quantities[i]}</span>
      <button class="btn-minus" aria-label="${p.name} entfernen" ${quantities[i] === 0 ? "disabled" : ""}>−</button>
    `;
    card.addEventListener("click", () => increment(i));
    card.querySelector(".btn-minus").addEventListener("click", (e) => {
      e.stopPropagation();
      decrement(i);
    });
    grid.appendChild(card);
  });
}

function updateCard(i) {
  const card = document.getElementById("productGrid").children[i];
  const badge = document.getElementById(`qty-${i}`);
  badge.textContent = quantities[i];
  card.className = "product-card" + (quantities[i] > 0 ? " active" : "");
  card.querySelector(".btn-minus").disabled = quantities[i] === 0;
  card.setAttribute("aria-label", `${PRODUCTS[i].name} hinzufügen`);
}

function updateCheckout() {
  const t = total();
  const btn = document.getElementById("btnCheckout");
  btn.textContent = `Gesamt: ${fmt(t)}`;
  btn.disabled = t === 0;
}

// ── Actions ─────────────────────────────────────────────────────────────
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
  showToast("Bestellung gespeichert ✓");
}

// ── Orders Page ─────────────────────────────────────────────────────────
function renderOrders() {
  const orders = loadOrders();
  const list = document.getElementById("ordersList");
  const exportBtn = document.getElementById("btnExport");
  exportBtn.disabled = orders.length === 0;
  if (orders.length === 0) {
    list.innerHTML = '<p class="empty-hint">Noch keine Bestellungen gespeichert.</p>';
    return;
  }
  list.innerHTML = [...orders].reverse().map(o => {
    const date = new Date(o.timestamp).toLocaleString("de-DE");
    const itemsHtml = o.items.map(item =>
      `<div class="order-item">
        <span>${item.quantity}× ${item.name}</span>
        <span>${fmt(item.quantity * item.price)}</span>
      </div>`
    ).join("");
    return `
      <div class="order-card">
        <div class="order-meta">${date}</div>
        <div class="order-items">${itemsHtml}</div>
        <div class="order-total"><span>Gesamt</span><span>${fmt(o.total)}</span></div>
      </div>`;
  }).join("");
}

function exportOrders() {
  const orders = loadOrders();
  if (orders.length === 0) return;
  const blob = new Blob([JSON.stringify(orders, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `rechnungapp_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast("Export gestartet.");
}

function openOrders() {
  renderOrders();
  document.getElementById("pageOrders").classList.add("active");
}
function closeOrders() {
  document.getElementById("pageOrders").classList.remove("active");
}

function deleteAllOrders() {
  const orders = loadOrders();
  if (orders.length === 0) { showToast("Keine Bestellungen vorhanden."); return; }
  if (!confirm(`Alle ${orders.length} Bestellung(en) unwiderruflich löschen?`)) return;
  localStorage.removeItem(STORAGE_KEY);
  showToast("Alle Bestellungen gelöscht.");
  closeMenu();
  renderOrders();
}

// ── Config Page ─────────────────────────────────────────────────────────
function renderConfig() {
  const list = document.getElementById("configList");
  list.innerHTML = "";
  PRODUCTS.forEach((p, i) => {
    const item = document.createElement("div");
    item.className = "config-item";
    item.innerHTML = `
      <div class="config-drag-handle" aria-label="Reihenfolge ändern">
        <span></span><span></span><span></span>
      </div>
      <label class="config-img-wrap" title="Bild ändern">
        <img class="config-img-preview" src="${p.img}" alt="${p.name}" />
        <input type="file" accept="image/*" class="config-img-input" />
      </label>
      <div class="config-fields">
        <input type="text" class="config-name" value="${p.name}" placeholder="Name" />
        <input type="text" class="config-price" value="${p.price.toFixed(2).replace('.', ',')}" placeholder="Preis" inputmode="decimal" />
      </div>
      <button class="config-delete" aria-label="${p.name} löschen">✕</button>
    `;

    item.querySelector(".config-img-input").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        PRODUCTS[i].img = ev.target.result;
        saveProducts();
        item.querySelector(".config-img-preview").src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });

    item.querySelector(".config-name").addEventListener("change", (e) => {
      const val = e.target.value.trim();
      if (val) { PRODUCTS[i].name = val; saveProducts(); }
      else e.target.value = PRODUCTS[i].name;
    });

    item.querySelector(".config-price").addEventListener("change", (e) => {
      const val = parseFloat(e.target.value.replace(',', '.'));
      if (!isNaN(val) && val >= 0) {
        PRODUCTS[i].price = Math.round(val * 100) / 100;
        saveProducts();
      }
      e.target.value = PRODUCTS[i].price.toFixed(2).replace('.', ',');
    });

    item.querySelector(".config-delete").addEventListener("click", () => {
      if (PRODUCTS.length <= 1) { showToast("Mindestens ein Produkt erforderlich."); return; }
      PRODUCTS.splice(i, 1);
      saveProducts();
      renderConfig();
    });

    list.appendChild(item);
  });
}

function openConfig() {
  renderConfig();
  document.getElementById("pageConfig").classList.add("active");
}
function closeConfig() {
  document.getElementById("pageConfig").classList.remove("active");
  quantities = new Array(PRODUCTS.length).fill(0);
  renderProducts();
  updateCheckout();
}

function openMenu() {
  document.getElementById("pageMenu").classList.add("active");
}
function closeMenu() {
  document.getElementById("pageMenu").classList.remove("active");
}

// ── Event listeners ──────────────────────────────────────────────────────
document.getElementById("btnCheckout").addEventListener("click", checkout);

document.getElementById("btnMenu").addEventListener("click", openMenu);
document.getElementById("btnBack").addEventListener("click", closeMenu);
document.getElementById("btnDeleteAll").addEventListener("click", deleteAllOrders);

document.getElementById("btnOrders").addEventListener("click", openOrders);
document.getElementById("btnBackOrders").addEventListener("click", closeOrders);
document.getElementById("btnExport").addEventListener("click", exportOrders);

document.getElementById("btnConfig").addEventListener("click", () => { closeMenu(); openConfig(); });
document.getElementById("btnBackConfig").addEventListener("click", closeConfig);
document.getElementById("btnAddProduct").addEventListener("click", () => {
  PRODUCTS.push({ id: Date.now().toString(), name: "Neues Produkt", price: 0.00, img: "img/placeholder.svg" });
  saveProducts();
  renderConfig();
  document.getElementById("configList").lastElementChild?.scrollIntoView({ behavior: "smooth" });
});

// ── Drag & Drop (Config) ─────────────────────────────────────────────────
function initDragDrop() {
  const list = document.getElementById("configList");
  let drag = null;

  list.addEventListener("pointerdown", (e) => {
    if (!e.target.closest(".config-drag-handle")) return;
    e.preventDefault();

    const item = e.target.closest(".config-item");
    const items = [...list.querySelectorAll(".config-item")];
    const dragIndex = items.indexOf(item);
    const itemH = item.offsetHeight + 10;

    item.classList.add("dragging");
    list.setPointerCapture(e.pointerId);

    drag = { item, items, dragIndex, startY: e.clientY, itemH };
  });

  list.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const { item, items, dragIndex, startY, itemH } = drag;

    const dy = e.clientY - startY;
    item.style.transform = `translateY(${dy}px)`;

    const targetIndex = Math.max(0, Math.min(items.length - 1, dragIndex + Math.round(dy / itemH)));
    items.forEach((el, i) => {
      if (el === item) return;
      if (targetIndex > dragIndex && i > dragIndex && i <= targetIndex)
        el.style.transform = `translateY(-${itemH}px)`;
      else if (targetIndex < dragIndex && i >= targetIndex && i < dragIndex)
        el.style.transform = `translateY(${itemH}px)`;
      else
        el.style.transform = "";
    });
  });

  const endDrag = (e) => {
    if (!drag) return;
    const { item, items, dragIndex, startY, itemH } = drag;
    const targetIndex = Math.max(0, Math.min(items.length - 1, dragIndex + Math.round((e.clientY - startY) / itemH)));

    items.forEach(el => { el.style.transform = ""; el.classList.remove("dragging"); });
    drag = null;

    if (targetIndex !== dragIndex) {
      const [moved] = PRODUCTS.splice(dragIndex, 1);
      PRODUCTS.splice(targetIndex, 0, moved);
      saveProducts();
      renderConfig();
    }
  };

  list.addEventListener("pointerup", endDrag);
  list.addEventListener("pointercancel", () => {
    if (!drag) return;
    drag.items.forEach(el => { el.style.transform = ""; el.classList.remove("dragging"); });
    drag = null;
    renderConfig();
  });
}

// ── Init ─────────────────────────────────────────────────────────────────
renderProducts();
updateCheckout();
initDragDrop();
