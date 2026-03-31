/**
 * Bannière cookie RGPD + Google Tag Manager Consent Mode v2
 * My Green Event — GTM-T9FZDWHT
 */

var GTM_ID      = 'GTM-T9FZDWHT';
var STORAGE_KEY = 'mge_cookie_consent';

// ── Consent Mode v2 : défaut REFUSÉ avant tout consentement ─────
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('consent', 'default', {
  analytics_storage:  'denied',
  ad_storage:         'denied',
  ad_user_data:       'denied',
  ad_personalization: 'denied',
  wait_for_update:    500
});

// ── Chargement GTM ───────────────────────────────────────────────
(function(w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var f = d.getElementsByTagName(s)[0];
  var j = d.createElement(s);
  var dl = l !== 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', GTM_ID);

// ── Fonctions de consentement ────────────────────────────────────
function grantConsent() {
  gtag('consent', 'update', {
    analytics_storage:  'granted',
    ad_storage:         'denied',  // pub refusée par défaut (modifier si besoin)
    ad_user_data:       'denied',
    ad_personalization: 'denied'
  });
  dataLayer.push({ event: 'cookie_consent_granted' });
}

function hideBanner() {
  var b = document.getElementById('cookie-banner');
  if (b) b.remove();
}

function onAccept() {
  localStorage.setItem(STORAGE_KEY, 'accepted');
  hideBanner();
  grantConsent();
}

function onRefuse() {
  localStorage.setItem(STORAGE_KEY, 'refused');
  hideBanner();
}

function showBanner() {
  var banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Gestion des cookies');
  banner.innerHTML = [
    '<div class="cb__inner">',
    '  <p class="cb__text">',
    '    Ce site utilise des cookies de mesure d\'audience (Google Analytics) pour améliorer votre expérience.',
    '    Vos données sont anonymisées et ne sont jamais revendues.',
    '    <a href="/mentions-legales.html">En savoir plus</a>',
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
    '.cb__text{font-size:.8125rem;color:#666;line-height:1.5;flex:1;margin:0;}',
    '.cb__text a{color:#5c8a3c;text-decoration:underline;}',
    '.cb__actions{display:flex;gap:.625rem;flex-shrink:0;}',
    '.cb__btn{',
    '  font-size:.8125rem;font-weight:500;cursor:pointer;',
    '  padding:.5rem 1.125rem;border-radius:2rem;',
    '  border:1px solid #5c8a3c;transition:all .15s;',
    '}',
    '.cb__btn--outline{background:#fff;color:#5c8a3c;}',
    '.cb__btn--outline:hover{background:#f0f7ea;}',
    '.cb__btn--accept{background:#5c8a3c;color:#fff;}',
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
    grantConsent();
  } else if (!consent) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
