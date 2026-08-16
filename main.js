/* ============================================================
   MAIN JS — Navigation, Scroll Animations, Interactions
   ============================================================ */

(function () {
  'use strict';

  /* ── Navigation ─────────────────────────────────────────── */

  const nav         = document.querySelector('.nav');
  const hamburger   = document.querySelector('.nav__hamburger');
  const mobileNav   = document.querySelector('.nav__mobile');
  const navLinks    = document.querySelectorAll('.nav__link');
  const scrollTopBtn = document.querySelector('.scroll-top');

  // Scroll-based nav shadow + scroll-to-top visibility
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 20;
    nav?.classList.toggle('scrolled', scrolled);
    scrollTopBtn?.classList.toggle('visible', window.scrollY > 400);

    // Active link highlighting based on section in view
    updateActiveNavLink();
  }, { passive: true });

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav?.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile nav on link click
  document.querySelectorAll('.nav__mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileNav?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navHeight = nav?.offsetHeight || 80;
    let currentId = '';

    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY >= sectionTop - navHeight - 20) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });

    document.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }

  /* ── Scroll Animations (IntersectionObserver) ───────────── */

  const animatedEls = document.querySelectorAll('.fade-up, .fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    animatedEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Scroll To Top ──────────────────────────────────────── */

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Animated Number Counters ───────────────────────────── */

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  if ('IntersectionObserver' in window && counterEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => counterObserver.observe(el));
  }

  /* ── Skill Bar Animations ───────────────────────────────── */

  const skillBars = document.querySelectorAll('.skill-bar__fill');
  if ('IntersectionObserver' in window && skillBars.length) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target.getAttribute('data-width');
          entry.target.style.width = target;
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => barObserver.observe(bar));
  }

  /* ── Current Year in Footer ─────────────────────────────── */

  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
