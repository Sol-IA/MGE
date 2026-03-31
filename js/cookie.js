/**
 * Bannière cookie RGPD — My Green Event
 * GA4 chargé uniquement après consentement explicite (CNIL)
 */

// ── Remplacer par l'ID GA4 réel de Coralie ──────────────────────
var GA_ID = 'G-XXXXXXXXXX';
// ────────────────────────────────────────────────────────────────

var STORAGE_KEY = 'mge_cookie_consent';

function loadGA4() {
  if (GA_ID === 'G-XXXXXXXXXX') return; // pas encore configuré
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
}

function hideBanner() {
  var b = document.getElementById('cookie-banner');
  if (b) b.remove();
}

function onAccept() {
  localStorage.setItem(STORAGE_KEY, 'accepted');
  hideBanner();
  loadGA4();
}

function onRefuse() {
  localStorage.setItem(STORAGE_KEY, 'refused');
  hideBanner();
}

function showBanner() {
  var banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.innerHTML = [
    '<div class="cb__inner">',
    '  <p class="cb__text">',
    '    Ce site utilise Google Analytics pour mesurer son audience.',
    '    Vos données restent anonymisées et ne sont jamais revendues.',
    '    <a href="mentions-legales.html">En savoir plus</a>',
    '  </p>',
    '  <div class="cb__actions">',
    '    <button id="cb-refuse" class="cb__btn cb__btn--outline">Refuser</button>',
    '    <button id="cb-accept" class="cb__btn cb__btn--accept">Accepter</button>',
    '  </div>',
    '</div>'
  ].join('');

  var style = document.createElement('style');
  style.textContent = [
    '#cookie-banner{',
    '  position:fixed;bottom:0;left:0;right:0;z-index:9999;',
    '  background:#fff;border-top:1px solid #e8e2da;',
    '  padding:1rem 1.5rem;',
    '  box-shadow:0 -4px 24px rgba(0,0,0,.08);',
    '}',
    '.cb__inner{',
    '  max-width:960px;margin:0 auto;',
    '  display:flex;align-items:center;justify-content:space-between;',
    '  gap:1.5rem;flex-wrap:wrap;',
    '}',
    '.cb__text{',
    '  font-size:.8125rem;color:#666;line-height:1.5;flex:1;margin:0;',
    '}',
    '.cb__text a{color:#5c8a3c;text-decoration:underline;}',
    '.cb__actions{display:flex;gap:.625rem;flex-shrink:0;}',
    '.cb__btn{',
    '  font-size:.8125rem;font-weight:500;cursor:pointer;',
    '  padding:.5rem 1.125rem;border-radius:2rem;',
    '  border:1px solid #5c8a3c;transition:all .15s;',
    '}',
    '.cb__btn--outline{background:#fff;color:#5c8a3c;}',
    '.cb__btn--outline:hover{background:#f0f7ea;}',
    '.cb__btn--accept{background:#5c8a3c;color:#fff;border-color:#5c8a3c;}',
    '.cb__btn--accept:hover{background:#4a7230;}',
    '@media(max-width:600px){',
    '  .cb__inner{flex-direction:column;align-items:flex-start;}',
    '  .cb__actions{width:100%;}',
    '  .cb__btn{flex:1;text-align:center;}',
    '}'
  ].join('');

  document.head.appendChild(style);
  document.body.appendChild(banner);

  document.getElementById('cb-accept').addEventListener('click', onAccept);
  document.getElementById('cb-refuse').addEventListener('click', onRefuse);
}

// ── Init ─────────────────────────────────────────────────────────
(function init() {
  var consent = localStorage.getItem(STORAGE_KEY);
  if (consent === 'accepted') {
    loadGA4();
  } else if (!consent) {
    // Afficher la bannière au premier passage
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
  // 'refused' → on ne fait rien
})();
