const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');
function closeMenu() {
  menu?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Abrir menu');
}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menu?.classList.toggle('open', open);
});
menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width:701px)').addEventListener('change', closeMenu);

// Cascata de texto independente da transição da página: funciona também no F5.
const cascadeRuns = new WeakMap();
function cascadeText(container) {
  if (motionPreference.matches) return;
  const parts = [];
  container.querySelectorAll('h1,h2,h3,p,.button').forEach(element => {
    if (/^H[123]$/.test(element.tagName)) {
      [...element.childNodes].forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const line = document.createElement('span');
          line.className = 'cascade-line';
          node.replaceWith(line);
          line.appendChild(node);
        }
      });
      parts.push(...element.querySelectorAll(':scope > .cascade-line, :scope > em'));
    } else {
      parts.push(element);
    }
  });
  if (!parts.length) parts.push(container);
  parts.forEach((part, index) => {
    cascadeRuns.get(part)?.cancel();
    const animation = part.animate?.([
      { opacity: 0, transform: 'translateY(14px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], {
      duration: 620,
      delay: 70 + Math.min(index, 5) * 110,
      easing: 'cubic-bezier(.16,1,.3,1)',
      fill: 'backwards'
    });
    if (animation) cascadeRuns.set(part, animation);
  });
}
// Entradas repetidas ao rolar nos dois sentidos, sem observar contêineres e filhos juntos.
const revealSelector = '.hero-content,.category-intro,.section-heading,.product,.campaign,.faq>div,.catalog-heading,.catalog-product,.line-card,.catalog-help,.footer-grid>*,.footer-legal,.catalog-filters';
const revealElements = [...new Set([...document.querySelectorAll('.reveal'), ...document.querySelectorAll(revealSelector)])].filter(element => !element.matches('.campaign'));
revealElements.forEach(element => element.classList.add('reveal'));
document.querySelectorAll('.products,.catalog-grid,.line-grid,.footer-grid').forEach(group => {
  [...group.children].forEach((element, index) => element.style.setProperty('--reveal-delay', `${(index % 4) * 45}ms`));
});
let revealObserver;
let bannerObserver;
function updateMotion() {
  revealObserver?.disconnect();
  bannerObserver?.disconnect();
  document.querySelectorAll('.campaign-copy').forEach(copy => copy.classList.remove('banner-motion', 'banner-active'));
  if (motionPreference.matches || !('IntersectionObserver' in window)) {
    document.documentElement.classList.remove('motion-ready');
    revealElements.forEach(element => element.classList.add('visible'));
    return;
  }
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const focused = entry.target.contains(document.activeElement);
      if (entry.isIntersecting || focused) {
        if (!entry.target.classList.contains('visible')) cascadeText(entry.target);
        entry.target.classList.add('visible');
      } else {
        entry.target.style.setProperty('--reveal-y', entry.boundingClientRect.bottom < 0 ? '-14px' : '18px');
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0, rootMargin: '24px 0px' });
  revealElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    element.classList.toggle('visible', rect.bottom >= 0 && rect.top <= window.innerHeight);
    revealObserver.observe(element);
    if (element.classList.contains('visible')) cascadeText(element);
  });
  document.documentElement.classList.add('motion-ready');
  document.querySelectorAll('.campaign-copy').forEach(copy => copy.classList.add('banner-motion'));
  bannerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const copy = entry.target.querySelector('.campaign-copy');
      if (!copy) return;
      if (entry.isIntersecting && entry.intersectionRatio >= .32) {
        if (!copy.classList.contains('banner-active')) {
          copy.classList.add('banner-active');
          cascadeText(copy);
        }
      } else if (!entry.isIntersecting) {
        copy.classList.remove('banner-active');
      }
    });
  }, { threshold: [0, .32], rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.campaign').forEach(banner => bannerObserver.observe(banner));
}
updateMotion();
motionPreference.addEventListener('change', updateMotion);
document.addEventListener('focusin', event => event.target.closest('.reveal')?.classList.add('visible'));

// O navegador mantém URLs, histórico, scroll e voltar/avançar nativos.
const nativePageTransitions = 'onpagereveal' in window;
let navigating = false;
function enterFallback() {
  if (motionPreference.matches || nativePageTransitions) return;
  document.querySelector('main')?.animate?.([
    { opacity: 0, transform: 'translateY(8px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' });
}
window.addEventListener('pageshow', event => {
  navigating = false;
  closeMenu();
  if (event.persisted) updateMotion();
  else revealElements.filter(element => element.classList.contains('visible')).forEach(cascadeText);
  enterFallback();
});
// Navegação com fade curto como alternativa quando a transição nativa não existe.
document.addEventListener('click', event => {
  if (nativePageTransitions || motionPreference.matches || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href]');
  if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
  const next = new URL(link.href, location.href);
  if (next.origin !== location.origin || !/^https?:$/.test(next.protocol) || (next.pathname === location.pathname && next.search === location.search)) return;
  event.preventDefault();
  if (navigating) return;
  navigating = true;
  const main = document.querySelector('main');
  let sent = false;
  const navigate = () => { if (!sent) { sent = true; location.assign(next.href); } };
  const animation = main?.animate?.([{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: 'ease-out' });
  if (animation) animation.finished.then(navigate, navigate); else navigate();
  window.setTimeout(navigate, 220);
});

const filterButtons = document.querySelectorAll('[data-filter]');
const lineCards = document.querySelectorAll('[data-line]');
filterButtons.forEach(button => button.addEventListener('click', () => {
  if (button.getAttribute('aria-pressed') === 'true') return;
  const active = button.dataset.filter;
  filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let index = 0;
  lineCards.forEach(card => {
    const show = active === 'todos' || card.dataset.line === active;
    card.hidden = !show;
    if (!show) return;
    card.classList.add('visible');
    if (!motionPreference.matches) {
      card.getAnimations().forEach(animation => animation.cancel());
      card.animate?.([{ opacity: .25, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], {
        duration: 300, delay: index++ * 35, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards'
      });
    }
  });
}));
