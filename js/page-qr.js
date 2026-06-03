const APP_URL = 'https://higgens76.github.io/RechnungsApp/';

function createQrPage() {
  const el = document.createElement('div');
  el.id = 'pageQr';
  el.innerHTML = `
    <header>
      <div class="header-left">
        <button class="btn-back" id="btnBackQr" aria-label="Zurück"></button>
      </div>
      <h1>App teilen</h1>
      <div></div>
    </header>
    <div class="qr-content">
      <p class="qr-hint">QR-Code scannen, um die App zu öffnen</p>
      <div class="qr-box">
        <div id="qrCode"></div>
      </div>
      <p class="qr-url">${APP_URL}</p>
    </div>
  `;
  return el;
}

function openQr() {
  document.getElementById('pageQr').classList.add('active');
  const container = document.getElementById('qrCode');
  container.innerHTML = '';
  new QRCode(container, {
    text: APP_URL,
    width: 240,
    height: 240,
    colorDark: '#1d1d1f',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.M,
  });
}

function closeQr() {
  document.getElementById('pageQr').classList.remove('active');
}
