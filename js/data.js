const STORAGE_KEY  = 'rechnungapp_orders';
const PRODUCTS_KEY = 'rechnungapp_products';

const DEFAULT_PRODUCTS = [
  { id: '1', name: 'Kaffee',    price: 2.50, img: 'img/placeholder.svg' },
  { id: '2', name: 'Tee',       price: 1.80, img: 'img/placeholder.svg' },
  { id: '3', name: 'Wasser',    price: 1.20, img: 'img/placeholder.svg' },
  { id: '4', name: 'Kuchen',    price: 3.50, img: 'img/placeholder.svg' },
  { id: '5', name: 'Sandwich',  price: 4.90, img: 'img/placeholder.svg' },
  { id: '6', name: 'Gebäck',    price: 2.20, img: 'img/placeholder.svg' },
];

function loadProducts() {
  try { return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || DEFAULT_PRODUCTS; }
  catch { return DEFAULT_PRODUCTS; }
}
function saveProducts() {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(PRODUCTS));
}

let PRODUCTS  = loadProducts();
let quantities = new Array(PRODUCTS.length).fill(0);

function loadOrders() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}
