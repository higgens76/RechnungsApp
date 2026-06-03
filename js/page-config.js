function createConfigPage() {
  const el = document.createElement('div');
  el.id = 'pageConfig';
  el.innerHTML = `
    <header>
      <div class="header-left">
        <button class="btn-back" id="btnBackConfig" aria-label="Zurück"></button>
      </div>
      <h1>Produkte</h1>
      <div></div>
    </header>
    <div class="config-list" id="configList"></div>
    <div class="checkout-bar">
      <button class="btn-checkout" id="btnAddProduct">+ Produkt hinzufügen</button>
    </div>
  `;
  return el;
}

function renderConfig() {
  const list = document.getElementById('configList');
  list.innerHTML = '';
  PRODUCTS.forEach((p, i) => {
    const item = document.createElement('div');
    item.className = 'config-item';
    item.innerHTML = `
      <div class="config-drag-handle" aria-label="Reihenfolge ändern">
        <span></span><span></span><span></span>
      </div>
      <label class="config-img-wrap" title="Bild ändern">
        <img class="config-img-preview" src="${p.img}" alt="${p.name}" />
        <input type="file" accept="image/*" class="config-img-input" />
      </label>
      <div class="config-fields">
        <input type="text" class="config-name"  value="${p.name}" placeholder="Name" />
        <input type="text" class="config-price" value="${p.price.toFixed(2).replace('.', ',')}" placeholder="Preis" inputmode="decimal" />
      </div>
      <button class="config-delete" aria-label="${p.name} löschen">✕</button>
    `;

    item.querySelector('.config-img-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        PRODUCTS[i].img = ev.target.result;
        saveProducts();
        item.querySelector('.config-img-preview').src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });

    item.querySelector('.config-name').addEventListener('change', (e) => {
      const val = e.target.value.trim();
      if (val) { PRODUCTS[i].name = val; saveProducts(); }
      else e.target.value = PRODUCTS[i].name;
    });

    item.querySelector('.config-price').addEventListener('change', (e) => {
      const val = parseFloat(e.target.value.replace(',', '.'));
      if (!isNaN(val) && val >= 0) {
        PRODUCTS[i].price = Math.round(val * 100) / 100;
        saveProducts();
      }
      e.target.value = PRODUCTS[i].price.toFixed(2).replace('.', ',');
    });

    item.querySelector('.config-delete').addEventListener('click', () => {
      if (PRODUCTS.length <= 1) { showToast('Mindestens ein Produkt erforderlich.'); return; }
      PRODUCTS.splice(i, 1);
      saveProducts();
      renderConfig();
    });

    list.appendChild(item);
  });
}

function openConfig() {
  renderConfig();
  document.getElementById('pageConfig').classList.add('active');
}
function closeConfig() {
  document.getElementById('pageConfig').classList.remove('active');
  quantities = new Array(PRODUCTS.length).fill(0);
  renderProducts();
  updateCheckout();
}

function initDragDrop() {
  const list = document.getElementById('configList');
  let drag = null;

  list.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('.config-drag-handle')) return;
    e.preventDefault();
    const item      = e.target.closest('.config-item');
    const items     = [...list.querySelectorAll('.config-item')];
    const dragIndex = items.indexOf(item);
    const itemH     = item.offsetHeight + 10;
    item.classList.add('dragging');
    list.setPointerCapture(e.pointerId);
    drag = { item, items, dragIndex, startY: e.clientY, itemH };
  });

  list.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const { item, items, dragIndex, startY, itemH } = drag;
    const dy          = e.clientY - startY;
    item.style.transform = `translateY(${dy}px)`;
    const targetIndex = Math.max(0, Math.min(items.length - 1, dragIndex + Math.round(dy / itemH)));
    items.forEach((el, i) => {
      if (el === item) return;
      if      (targetIndex > dragIndex && i > dragIndex && i <= targetIndex) el.style.transform = `translateY(-${itemH}px)`;
      else if (targetIndex < dragIndex && i >= targetIndex && i < dragIndex) el.style.transform = `translateY(${itemH}px)`;
      else                                                                    el.style.transform = '';
    });
  });

  const endDrag = (e) => {
    if (!drag) return;
    const { item, items, dragIndex, startY, itemH } = drag;
    const targetIndex = Math.max(0, Math.min(items.length - 1, dragIndex + Math.round((e.clientY - startY) / itemH)));
    items.forEach(el => { el.style.transform = ''; el.classList.remove('dragging'); });
    drag = null;
    if (targetIndex !== dragIndex) {
      const [moved] = PRODUCTS.splice(dragIndex, 1);
      PRODUCTS.splice(targetIndex, 0, moved);
      saveProducts();
      renderConfig();
    }
  };

  list.addEventListener('pointerup', endDrag);
  list.addEventListener('pointercancel', () => {
    if (!drag) return;
    drag.items.forEach(el => { el.style.transform = ''; el.classList.remove('dragging'); });
    drag = null;
    renderConfig();
  });
}
