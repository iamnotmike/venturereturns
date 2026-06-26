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

// Scroll reveal with stagger
const revealEls = document.querySelectorAll([
  '.stat-item', '.service-row', '.result-item',
  '.product-row', '.invest-col',
  '.contact-left', '.contact-form',
].join(', '));

revealEls.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), Math.min(idx * 70, 320));
    io.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

revealEls.forEach(el => io.observe(el));

// Active nav highlighting
const sections = document.querySelectorAll('section[id], div[id]');
const navAnchors = document.querySelectorAll('.nav-links a:not(.btn), .mobile-menu a');

const sectionIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--fg)' : '';
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionIO.observe(s));

// Reduce motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const line = document.querySelector('.hero-scroll-line');
  if (line) line.style.animation = 'none';
}

// Form submission handled by @formspree/ajax (see script tags in index.html)

// Decorative numbering — no semantic value beyond visual structure
document.querySelectorAll('.svc-num, .svc-arrow, .invest-num').forEach(el => {
  el.setAttribute('aria-hidden', 'true');
});
