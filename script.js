
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
