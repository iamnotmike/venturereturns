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

// Custom cursor
const cursor = document.querySelector('.cursor');
if (cursor) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  }, { passive: true });

  const hoverEls = document.querySelectorAll('a, button, .service-row, .product-row, .invest-col');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
  });

  // Hide cursor when it leaves the window
  document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
  document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
}

// Form submission handled by @formspree/ajax

// Parallax depth on ghost section numerals (--p = how far scrolled into section)
(function () {
  const pSections = ['consulting', 'studio', 'investing']
    .map(id => document.getElementById(id)).filter(Boolean);
  function tick() {
    pSections.forEach(el => {
      el.style.setProperty('--p', `${-el.getBoundingClientRect().top}px`);
    });
  }
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

// Cursor accent color shifts per section — set backgroundColor directly (CSS var
// doesn't override mix-blend-mode context reliably; inline style always wins)
(function () {
  const cur = document.querySelector('.cursor');
  if (!cur || !matchMedia('(pointer: fine)').matches) return;
  const acc = { consulting: '#6b9fff', studio: '#3dfcc7', investing: '#ffaa3c' };
  let accentColor = '#fff';
  document.addEventListener('mousemove', e => {
    const id = document.elementFromPoint(e.clientX, e.clientY)?.closest('section[id]')?.id;
    accentColor = acc[id] || '#fff';
    if (!cur.classList.contains('is-hovering')) cur.style.backgroundColor = accentColor;
    cur.style.borderColor = accentColor;
  }, { passive: true });
  // Keep accent on hover state (transparent bg, accent border)
  cur.addEventListener('transitionstart', () => {
    if (cur.classList.contains('is-hovering')) cur.style.backgroundColor = 'transparent';
    else cur.style.backgroundColor = accentColor;
  });
})();

// Stats bar progress bars — fill width animates in sync with count-up
(function () {
  document.querySelectorAll('.stats-bar-item').forEach(item => {
    const bar = document.createElement('div');
    bar.className = 'sbn-bar';
    bar.innerHTML = '<div class="sbn-bar-fill"></div>';
    item.appendChild(bar);
  });

  const barIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      requestAnimationFrame(() => e.target.querySelector('.sbn-bar-fill')?.classList.add('active'));
      barIO.unobserve(e.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stats-bar-item').forEach(el => barIO.observe(el));
})();

// Section heading line-reveal — split on <br>, wrap each line, reveal on scroll
(function () {
  document.querySelectorAll('.section-hl').forEach(el => {
    const lines = el.innerHTML.trim().split(/<br\s*\/?>/i);
    el.innerHTML = lines.map(line =>
      `<span class="line-wrap"><span class="line-inner">${line.trim()}</span></span>`
    ).join('');
  });

  const headingIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('lines-in');
      headingIO.unobserve(entry.target);
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.section-hl').forEach(el => headingIO.observe(el));
})();

// Count-up animation for stats and result metrics
(function () {
  function countUp(el) {
    const target = +el.dataset.count;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = prefix + Math.round(ease(t) * target) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      countUp(entry.target);
      countIO.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));
})();
