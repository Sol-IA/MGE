/**
 * MGE Lightbox — vanilla JS, zero dependencies
 * Opens any .article-content img on click (excluding .article-hero)
 */
(function () {
  'use strict';

  function createLightbox() {
    const overlay = document.createElement('div');
    overlay.id = 'mge-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image agrandie');
    overlay.innerHTML = `
      <div class="mge-lb-inner">
        <button class="mge-lb-close" aria-label="Fermer">&times;</button>
        <img class="mge-lb-img" src="" alt="">
        <p class="mge-lb-caption"></p>
      </div>`;
    document.body.appendChild(overlay);

    const img = overlay.querySelector('.mge-lb-img');
    const caption = overlay.querySelector('.mge-lb-caption');
    const closeBtn = overlay.querySelector('.mge-lb-close');

    function open(src, alt) {
      img.src = src;
      img.alt = alt || '';
      caption.textContent = alt || '';
      caption.style.display = alt ? 'block' : 'none';
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function close() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      img.src = '';
    }

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });

    return { open };
  }

  function init() {
    const lb = createLightbox();
    const articleContent = document.querySelector('.article-content');
    if (!articleContent) return;

    articleContent.querySelectorAll('img:not(.article-hero)').forEach(function (img) {
      if (!img.src || img.src === window.location.href) return;
      img.classList.add('mge-lb-trigger');
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'Agrandir : ' + (img.alt || 'image'));

      function trigger() { lb.open(img.src, img.alt); }
      img.addEventListener('click', trigger);
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
