(() => {
  const hero = document.querySelector('.lug-hero');
  const stage = hero.querySelector('.lug-stage');
  const slides = [...hero.querySelectorAll('.lug-slide')];
  const headlines = [...hero.querySelectorAll('.lug-headline')];
  const details = hero.querySelector('.lug-details');
  const upcoming = hero.querySelector('.lug-upcoming');
  const cards = [...upcoming.querySelectorAll('.lug-card')];
  const collections = ['cabides', 'bustos', 'manequins', 'expositores'];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let timer;
  let animations = [];

  function upcomingIndex() {
    return (active + 1) % slides.length;
  }

  function cardIndex(offset) {
    return (upcomingIndex() + offset) % slides.length;
  }

  function updateCollections() {
    const current = collections[active];
    details.href = '/' + current;
    details.querySelector('span').textContent = current[0].toUpperCase() + current.slice(1);

    cards.forEach((card, offset) => {
      const index = cardIndex(offset);
      const name = collections[index];
      card.setAttribute('aria-label', 'Exibir ' + name + ' na vitrine');
      card.querySelector('.lug-card-label').textContent = name;
      card.classList.toggle('lug-card-cabides', name === 'cabides');
      card.querySelector('img').src = name === 'cabides'
        ? 'assets/hero-colecoes/cabides-aprovar.webp'
        : `assets/hero-colecoes/${name}-thumb.webp`;
    });
    upcoming.hidden = false;
  }

  function show(index) {
    if (index === active) return;
    for (const animation of animations) animation.cancel();
    const previous = slides[active];
    const previousHeadline = headlines[active];
    const nextHeadline = headlines[index];
    const next = slides[index];
    slides.forEach((slide, position) => slide.setAttribute('aria-hidden', String(position !== index)));
    previousHeadline.setAttribute('aria-hidden', 'true');
    nextHeadline.removeAttribute('aria-hidden');
    active = index;
    updateCollections();

    if (reduced.matches) return;
    const easing = 'cubic-bezier(.22,.75,.25,1)';
    const outgoing = { duration: 300, easing };
    const incoming = { duration: 680, easing, fill: 'backwards' };
    const wordmark = nextHeadline.querySelector('.lug-wordmark');
    const phrase = nextHeadline.querySelector('.lug-phrase');

    animations = [
      previousHeadline.animate([
        { visibility: 'visible', opacity: 1 },
        { visibility: 'visible', opacity: 0, translate: '0 -10px' }
      ], outgoing),
      previous.animate([
        { visibility: 'visible', opacity: 1, transform: 'none' },
        { visibility: 'visible', opacity: 0, transform: 'translateX(-7%) scale(.98)' }
      ], outgoing),
      wordmark.animate([
        { opacity: 0, scale: .96, translate: '0 10px' },
        { opacity: getComputedStyle(wordmark).opacity, scale: 1, translate: '0 0' }
      ], { ...incoming, delay: 45 }),
      next.animate([
        { opacity: 0, transform: 'translateX(8%) scale(.97)' },
        { opacity: 1, transform: 'none' }
      ], { ...incoming, delay: 90 }),
      phrase.animate([
        { opacity: 0, translate: '0 15px' },
        { opacity: 1, translate: '0 0' }
      ], { ...incoming, duration: 510, delay: 210 }),
      details.animate([
        { opacity: 0, translate: '0 8px' },
        { opacity: 1, translate: '0 0' }
      ], { ...incoming, duration: 420, delay: 295 })
    ];
  }

  function schedule() {
    clearTimeout(timer);
    const outsideViewport = document.documentElement.classList.contains('motion-ready') &&
      stage.classList.contains('reveal') && !stage.classList.contains('visible');
    if (!reduced.matches && !document.hidden && !outsideViewport) {
      timer = setTimeout(() => {
        show(upcomingIndex());
        schedule();
      }, 3300);
    }
  }

  cards.forEach((card, offset) => {
    card.addEventListener('click', () => {
      show(cardIndex(offset));
      schedule();
    });
  });
  reduced.addEventListener('change', schedule);
  updateCollections();
  document.addEventListener('visibilitychange', schedule);
  const visibilityObserver = new MutationObserver(schedule);
  visibilityObserver.observe(stage, { attributeFilter: ['class'] });
  schedule();
})();
