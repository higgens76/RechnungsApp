function init() {
  const app = document.getElementById('app');

  // Seiten aufbauen und in den DOM einhängen
  app.appendChild(createMainPage());
  app.appendChild(createMenuPage());
  app.appendChild(createConfigPage());
  app.appendChild(createOrdersPage());
  app.appendChild(createQrPage());

  // Hauptseite
  document.getElementById('btnMenu').addEventListener('click', openMenu);
  document.getElementById('btnCheckout').addEventListener('click', checkout);

  // Menü
  document.getElementById('btnBack').addEventListener('click', closeMenu);
  document.getElementById('btnOrders').addEventListener('click', openOrders);
  document.getElementById('btnConfig').addEventListener('click', () => { closeMenu(); openConfig(); });
  document.getElementById('btnQr').addEventListener('click', () => { closeMenu(); openQr(); });
  document.getElementById('btnDeleteAll').addEventListener('click', deleteAllOrders);

  // Bestellungen
  document.getElementById('btnBackOrders').addEventListener('click', closeOrders);
  document.getElementById('btnExport').addEventListener('click', exportOrders);

  // App teilen (QR)
  document.getElementById('btnBackQr').addEventListener('click', closeQr);

  // Konfiguration
  document.getElementById('btnBackConfig').addEventListener('click', closeConfig);
  document.getElementById('btnAddProduct').addEventListener('click', () => {
    PRODUCTS.push({ id: Date.now().toString(), name: 'Neues Produkt', price: 0.00, img: 'img/placeholder.svg' });
    saveProducts();
    renderConfig();
    document.getElementById('configList').lastElementChild?.scrollIntoView({ behavior: 'smooth' });
  });

  // Init
  renderProducts();
  updateCheckout();
  initDragDrop();
}

init();
