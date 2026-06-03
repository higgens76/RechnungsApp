function createMenuPage() {
  const el = document.createElement('div');
  el.id = 'pageMenu';
  el.innerHTML = `
    <header>
      <div class="header-left">
        <button class="btn-back" id="btnBack" aria-label="Zurück"></button>
      </div>
      <h1>Menü</h1>
      <div></div>
    </header>
    <div class="menu-content">
      <div class="menu-section">
        <button class="menu-item" id="btnOrders">
          <span>Bestellungen</span>
          <span class="menu-chevron">›</span>
        </button>
        <button class="menu-item" id="btnConfig">
          <span>Produkte konfigurieren</span>
          <span class="menu-chevron">›</span>
        </button>
        <button class="menu-item" id="btnQr">
          <span>App teilen</span>
          <span class="menu-chevron">›</span>
        </button>
      </div>
      <div class="menu-section">
        <button class="menu-item menu-item--danger" id="btnDeleteAll">
          <span>Alle Warenkörbe löschen</span>
        </button>
      </div>
    </div>
  `;
  return el;
}

function openMenu()  { document.getElementById('pageMenu').classList.add('active');    }
function closeMenu() { document.getElementById('pageMenu').classList.remove('active'); }

function deleteAllOrders() {
  const orders = loadOrders();
  if (orders.length === 0) { showToast('Keine Bestellungen vorhanden.'); return; }
  if (!confirm(`Alle ${orders.length} Bestellung(en) unwiderruflich löschen?`)) return;
  localStorage.removeItem(STORAGE_KEY);
  showToast('Alle Bestellungen gelöscht.');
  closeMenu();
  renderOrders();
}
