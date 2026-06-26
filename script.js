// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 48);
}, { passive: true });

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Hero slide-up reveal — double rAF ensures initial hidden state is painted first
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.body.classList.add('loaded');
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll([
  '.stats-bar-item',
  '.service-row',
  '.result-item',
  '.product-row',
  '.invest-col',
  '.contact-left',
  '.contact-form',
  '.studio-desc',
  '.invest-lead',
  '.audit-copy',
  '.audit-cta',
].join(', '));

revealEls.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), Math.min(idx * 65, 300));
    io.unobserve(entry.target);
  });
}, { threshold: 0.07, rootMargin: '0px 0px -28px 0px' });

revealEls.forEach(el => io.observe(el));

// Active nav highlighting
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a, .mobile-menu a');

const sectionIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--fg)' : '';
      });
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => sectionIO.observe(s));

// Form submission handled by @formspree/ajax
