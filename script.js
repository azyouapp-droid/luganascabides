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
const cascadeRuns = new Map();
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
  if (!parts.length) return;
  const animations = parts.map((part, index) => {
    return part.animate?.([
      { opacity: 0, transform: 'translateY(14px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], {
      duration: 560,
      delay: 35 + Math.min(index, 5) * 90,
      easing: 'cubic-bezier(.16,1,.3,1)',
      fill: 'backwards'
    });
  }).filter(Boolean);
  cascadeRuns.set(container, animations);
  Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
    if (cascadeRuns.get(container) === animations) cascadeRuns.delete(container);
  });
}

const revealSelector = '.reveal,.hero-content,.lug-stage,.lug-upcoming,.category-intro,.section-heading,.product,.faq>div,.catalog-heading,.catalog-product,.line-card,.catalog-help,.footer-grid>*,.footer-legal,.catalog-filters';
const revealElements = [...document.querySelectorAll(revealSelector)].filter(element => !element.matches('.campaign'));
const banners = [...document.querySelectorAll('.campaign')];
revealElements.forEach(element => element.classList.add('reveal'));
document.querySelectorAll('.products,.catalog-grid,.line-grid,.footer-grid').forEach(group => {
  [...group.children].forEach((element, index) => element.style.setProperty('--reveal-delay', `${(index % 4) * 45}ms`));
});

let revealObserver;
let exitObserver;
function setRevealed(element, visible, animate = false) {
  const copy = element.matches('.campaign') ? element.querySelector('.campaign-copy') : element;
  const visibleClass = copy === element ? 'visible' : 'banner-active';
  if (!copy || copy.classList.contains(visibleClass) === visible) return;
  if (visible && animate) cascadeText(copy);
  copy.classList.toggle(visibleClass, visible);
  if (!visible) cascadeRuns.get(copy)?.forEach(animation => animation.cancel());
}

// Ao ativar um banner, termina a entrada antes da navegação capturar a página.
function stabilizeBanner(banner) {
  const copy = banner.querySelector('.campaign-copy');
  if (!copy) return;
  copy.classList.add('banner-active');
  cascadeRuns.get(copy)?.forEach(animation => animation.cancel());
  cascadeRuns.delete(copy);
}
banners.forEach(banner => {
  banner.addEventListener('pointerdown', () => stabilizeBanner(banner));
  banner.addEventListener('keydown', event => {
    if (event.key === 'Enter') stabilizeBanner(banner);
  });
});

function updateMotion() {
  revealObserver?.disconnect();
  exitObserver?.disconnect();
  const enabled = !motionPreference.matches && 'IntersectionObserver' in window;
  document.documentElement.classList.toggle('motion-ready', enabled);
  banners.forEach(banner => banner.querySelector('.campaign-copy')?.classList.toggle('banner-motion', enabled));
  if (!enabled) {
    cascadeRuns.forEach(animations => animations.forEach(animation => animation.cancel()));
    return;
  }

  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting, intersectionRatio }) => {
      const isBanner = target.matches('.campaign');
      if (isIntersecting && (!isBanner || intersectionRatio >= .32)) setRevealed(target, true, true);
      if (!isIntersecting && target.matches('.lug-stage,.lug-upcoming')) setRevealed(target, false);
    });
  }, { threshold: [0, .32] });

  // A margem de saída evita disparos repetidos na borda durante a rolagem.
  exitObserver = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) setRevealed(target, false);
    });
  }, { rootMargin: '40px 0px' });

  [...revealElements, ...banners].forEach(element => {
    revealObserver.observe(element);
    if (!element.matches('.lug-stage,.lug-upcoming')) exitObserver.observe(element);
  });
}

motionPreference.addEventListener('change', updateMotion);
document.addEventListener('focusin', event => {
  const element = event.target.closest('.reveal');
  if (element) setRevealed(element, true);
});

updateMotion();
window.addEventListener('pageshow', closeMenu);

// Antecipar apenas páginas internas apontadas pelo visitante acelera a troca
// sem interferir no histórico nem no carregamento inicial.
const prefetchedPages = new Set();
const prefetchRoutes = new Set(['/inicio', '/cabides', '/bustos', '/manequins', '/expositores']);
function prefetchPage(link) {
  if (!link || link.target || link.hasAttribute('download') || navigator.connection?.saveData) return;
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || !prefetchRoutes.has(url.pathname) || url.pathname === location.pathname) return;
  url.hash = '';
  if (prefetchedPages.has(url.href)) return;
  prefetchedPages.add(url.href);
  const hint = document.createElement('link');
  hint.rel = 'prefetch';
  hint.as = 'document';
  hint.href = url.href;
  document.head.append(hint);
}
document.addEventListener('pointerover', event => {
  if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
    prefetchPage(event.target.closest?.('a[href]'));
  }
});
document.addEventListener('focusin', event => {
  if (event.target.matches?.(':focus-visible')) prefetchPage(event.target.closest?.('a[href]'));
});

document.querySelector('.header .brand')?.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const destination = new URL(event.currentTarget.href);
  if (destination.pathname !== location.pathname || destination.search !== location.search) return;
  event.preventDefault();
  if (location.hash) history.replaceState(history.state, '', destination.href);
  window.scrollTo({ top: 0, behavior: motionPreference.matches ? 'instant' : 'smooth' });
});

const filterButtons = document.querySelectorAll('[data-filter]');
const lineCards = document.querySelectorAll('[data-line]');
filterButtons.forEach(button => button.addEventListener('click', () => {
  if (button.getAttribute('aria-pressed') === 'true') return;
  const active = button.dataset.filter;
  filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  lineCards.forEach(card => {
    card.hidden = active !== 'todos' && !card.dataset.line.split(/\s+/).includes(active);
  });
}));

const photoViewer = document.createElement('dialog');
photoViewer.className = 'photo-viewer';
photoViewer.setAttribute('aria-label', 'Visualização da foto');
photoViewer.innerHTML = `
  <button type="button" class="photo-viewer-close" aria-label="Fechar foto" autofocus></button>
  <div class="photo-viewer-frame"><img alt=""></div>
  <div class="photo-viewer-controls" role="group" aria-label="Navegação pelas fotos" hidden>
    <button type="button" data-viewer-step="-1" aria-label="Foto anterior"></button>
    <span class="photo-viewer-count" aria-live="polite" aria-atomic="true"></span>
    <button type="button" data-viewer-step="1" aria-label="Próxima foto"></button>
  </div>
`;
document.body.append(photoViewer);

const fullPhoto = photoViewer.querySelector('img');
const viewerControls = photoViewer.querySelector('.photo-viewer-controls');
const viewerCount = photoViewer.querySelector('.photo-viewer-count');
let viewerPhotos = [];
let viewerIndex = 0;

function showViewerPhoto(index) {
  viewerIndex = (index + viewerPhotos.length) % viewerPhotos.length;
  const photo = viewerPhotos[viewerIndex];
  fullPhoto.alt = photo.alt;
  fullPhoto.src = photo.currentSrc || photo.src;
  viewerCount.textContent = `Foto ${viewerIndex + 1} de ${viewerPhotos.length}`;
}

photoViewer.querySelector('.photo-viewer-close').addEventListener('click', () => photoViewer.close());
viewerControls.querySelectorAll('[data-viewer-step]').forEach(button => {
  button.addEventListener('click', () => showViewerPhoto(viewerIndex + Number(button.dataset.viewerStep)));
});
photoViewer.addEventListener('keydown', event => {
  if (viewerPhotos.length < 2 || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  showViewerPhoto(viewerIndex + (event.key === 'ArrowLeft' ? -1 : 1));
});
photoViewer.addEventListener('click', event => {
  if (event.target === photoViewer) photoViewer.close();
});
photoViewer.addEventListener('close', () => {
  if (photoViewer.open) return;
  viewerPhotos = [];
  fullPhoto.removeAttribute('src');
});

document.querySelectorAll('.product-photo, .catalog-photo, .line-photo').forEach(frame => {
  const expand = document.createElement('button');
  expand.type = 'button';
  expand.className = 'photo-expand';
  const title = frame.closest('.product, .catalog-product, .line-card')?.querySelector('h3')?.textContent;
  expand.setAttribute('aria-label', title ? 'Ampliar foto: ' + title : 'Ampliar foto');
  expand.setAttribute('aria-haspopup', 'dialog');
  expand.addEventListener('click', () => {
    const photos = [...frame.querySelectorAll('img')];
    const visiblePhotos = photos.filter(photo => !photo.hidden);
    const active = visiblePhotos.find(photo => photo.style.zIndex === '1') ?? visiblePhotos[0];
    if (!active || photoViewer.open) return;
    viewerPhotos = photos;
    viewerControls.hidden = photos.length < 2;
    photoViewer.classList.toggle('photo-viewer-gallery', photos.length > 1);
    showViewerPhoto(photos.indexOf(active));
    photoViewer.showModal();
  });
  frame.append(expand);
});

document.querySelectorAll('.line-carousel-card').forEach(carousel => {
  const photos = [...carousel.querySelectorAll('img')];
  const controls = carousel.querySelector('.line-carousel-controls');
  const count = carousel.querySelector('.line-carousel-count');
  const dots = carousel.querySelectorAll('.line-carousel-dots i');
  let current = 0;
  let fade;
  let lastChange = performance.now();

  function changePhoto(step, manual = false) {
    fade?.cancel();
    const previous = photos[current];
    photos.forEach(photo => {
      photo.hidden = photo !== previous;
      photo.style.zIndex = '';
    });
    current = (current + step + photos.length) % photos.length;
    photos[current].hidden = false;
    count.setAttribute('aria-live', manual ? 'polite' : 'off');
    count.textContent = `Foto ${current + 1} de ${photos.length}`;
    dots.forEach((dot, index) => dot.classList.toggle('is-current', index === current));
    const next = photos[current];
    if (motionPreference.matches || !next.animate) {
      previous.hidden = true;
    } else {
      next.style.zIndex = '1';
      const animation = next.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 620,
        easing: 'ease-in-out',
      });
      fade = animation;
      animation.onfinish = () => {
        if (fade !== animation) return;
        previous.hidden = true;
        next.style.zIndex = '';
        fade = undefined;
      };
    }
    lastChange = performance.now();
  }

  controls.querySelectorAll('[data-step]').forEach(button => {
    button.addEventListener('click', () => changePhoto(Number(button.dataset.step), true));
  });

  window.setInterval(() => {
    if (motionPreference.matches || document.hidden || photoViewer.open || carousel.closest('[hidden]')) return;
    const rect = carousel.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight && performance.now() - lastChange >= 5000) {
      changePhoto(1);
    }
  }, 500);

  controls.hidden = false;
});
