
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* Scroll reveals */
const animated = document.querySelectorAll(
  '.reveal, .reveal-right, .reveal-left, .reveal-scale, .stagger'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    } else if (entry.target.dataset.repeat === 'true') {
      entry.target.classList.remove('is-visible');
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -8% 0px'
});

animated.forEach(el => observer.observe(el));

/* Give existing blocks richer directions without changing HTML */
document.querySelectorAll('.section-head').forEach((el, i) => {
  if (!el.classList.contains('reveal')) el.classList.add(i % 2 ? 'reveal-right' : 'reveal-left');
});
document.querySelectorAll('.review-layout > *').forEach((el, i) => {
  if (![...el.classList].some(c => c.startsWith('reveal'))) {
    el.classList.add(i % 2 ? 'reveal-right' : 'reveal-left');
    observer.observe(el);
  }
});

/* Scroll-linked effects */
const heroBg = document.querySelector('.hero-bg');
const processSection = document.querySelector('.process-section');
const processProgress = document.querySelector('.process-progress');
const whyImage = document.querySelector('.why-image');
const projects = document.querySelectorAll('.project');

let ticking = false;

function updateScrollEffects() {
  const y = window.scrollY;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduced && heroBg) {
    const move = Math.min(y * 0.14, 80);
    const scale = 1.04 + Math.min(y / 12000, .035);
    heroBg.style.transform = `scale(${scale}) translateY(${move}px)`;
  }

  if (!reduced && whyImage) {
    const rect = whyImage.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.bottom > 0 && rect.top < vh) {
      const progress = (vh - rect.top) / (vh + rect.height);
      const move = (progress - .5) * 34;
      whyImage.style.backgroundPosition = `center calc(50% + ${move}px)`;
    }
  }

  if (processSection && processProgress) {
    const rect = processSection.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * .82;
    const end = -rect.height * .12;
    const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
    processProgress.style.width = `${progress * 100}%`;
  }

  if (!reduced) {
    projects.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const center = rect.top + rect.height / 2;
        const delta = (center - window.innerHeight / 2) / window.innerHeight;
        card.style.transform = `translateY(${delta * -7}px)`;
      } else {
        card.style.transform = '';
      }
    });
  }

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}, { passive: true });

window.addEventListener('resize', updateScrollEffects);
updateScrollEffects();


/* v0.11 — two-stage scroll-aware roller header */
const siteHeader = document.querySelector('.site-header');
const conceptBar = document.querySelector('.concept-bar');

let lastHeaderScrollY = Math.max(window.scrollY, 0);
let headerDirectionDistance = 0;
let headerLastDirection = null;

function setHeaderState() {
  if (!siteHeader) return;

  const y = Math.max(window.scrollY, 0);
  const delta = y - lastHeaderScrollY;
  const mobileMenuOpen = nav && nav.classList.contains('open');

  if (y <= 18) {
    document.body.classList.remove('header-has-scrolled');
    siteHeader.classList.remove('header-compact', 'header-hidden', 'header-returning');
    headerDirectionDistance = 0;
    headerLastDirection = null;
    lastHeaderScrollY = y;
    return;
  }

  document.body.classList.add('header-has-scrolled');
  siteHeader.classList.add('header-compact');

  if (mobileMenuOpen) {
    siteHeader.classList.remove('header-hidden');
    lastHeaderScrollY = y;
    return;
  }

  const direction = delta > 0 ? 'down' : delta < 0 ? 'up' : headerLastDirection;

  if (direction && direction !== headerLastDirection) {
    headerDirectionDistance = 0;
    headerLastDirection = direction;
  }

  headerDirectionDistance += Math.abs(delta);

  /* A small hysteresis prevents jitter from trackpads / momentum scrolling. */
  if (direction === 'down' && y > 150 && headerDirectionDistance > 26) {
    siteHeader.classList.remove('header-returning');
    siteHeader.classList.add('header-hidden');
    headerDirectionDistance = 0;
  }

  if (direction === 'up' && headerDirectionDistance > 10) {
    const wasHidden = siteHeader.classList.contains('header-hidden');
    siteHeader.classList.remove('header-hidden');

    if (wasHidden) {
      siteHeader.classList.remove('header-returning');
      void siteHeader.offsetWidth;
      siteHeader.classList.add('header-returning');
      window.setTimeout(() => siteHeader.classList.remove('header-returning'), 480);
    }

    headerDirectionDistance = 0;
  }

  lastHeaderScrollY = y;
}

let headerTicking = false;
window.addEventListener('scroll', () => {
  if (!headerTicking) {
    window.requestAnimationFrame(() => {
      setHeaderState();
      headerTicking = false;
    });
    headerTicking = true;
  }
}, { passive:true });

setHeaderState();

if (menuBtn && nav && siteHeader) {
  menuBtn.addEventListener('click', () => {
    window.requestAnimationFrame(() => {
      const open = nav.classList.contains('open');
      siteHeader.classList.toggle('menu-active', open);
      if (open) siteHeader.classList.remove('header-hidden');
    });
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteHeader.classList.remove('menu-active');
    });
  });
}
