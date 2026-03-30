/* ============================================
   MY GREEN EVENT — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Header scroll effect ---
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('header--scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Mobile menu ---
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.header__nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
    // Close on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-item__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasActive = item.classList.contains('active');
      // Close all
      document.querySelectorAll('.faq-item.active').forEach(el => {
        el.classList.remove('active');
      });
      // Toggle current
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });

  // --- Scroll animations ---
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  }

  // --- Active nav link ---
  const currentPage = window.location.pathname.split('/').filter(Boolean).pop() || 'index';
  document.querySelectorAll('.header__nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage + '.html' || (currentPage === 'index' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Testimonial slider (simple auto-rotate) ---
  const slider = document.querySelector('.testimonial-slider');
  if (slider) {
    const items = slider.querySelectorAll('.testimonial');
    let current = 0;
    if (items.length > 1) {
      items.forEach((item, i) => {
        item.style.display = i === 0 ? 'block' : 'none';
      });
      setInterval(() => {
        items[current].style.display = 'none';
        current = (current + 1) % items.length;
        items[current].style.display = 'block';
      }, 5000);
    }
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
