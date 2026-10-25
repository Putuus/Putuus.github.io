/* 首页：把太阳/月亮点击区对准画里的日月，外加列表入场 */
(() => {
  const hint = document.querySelector('.hero__hint');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 两张画里日、月的实际比例 */
  const ORBS = [
    { orb: '.scene__orb--sun', img: '.scene__img--day', x: 0.4975, y: 0.4615, d: 0.0400, f: 1.7 },
    { orb: '.scene__orb--moon', img: '.scene__img--night', x: 0.5140, y: 0.1600, d: 0.0278, f: 2.2 },
  ];

  function place(o) {
    const orb = document.querySelector(o.orb);
    const img = document.querySelector(o.img);
    if (!orb || !img) return;
    const w = img.clientWidth;
    const h = img.clientHeight;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    if (!w || !h || !nw || !nh) return;

    /* object-fit: cover 的换算，并把 object-position 算进去 */
    const pos = getComputedStyle(img).objectPosition.split(/\s+/);
    const px = parseFloat(pos[0]) / 100 || 0;
    const py = parseFloat(pos[1]) / 100 || 0;
    const scale = Math.max(w / nw, h / nh);
    const dw = nw * scale;
    const dh = nh * scale;
    const size = Math.max(50, o.d * nw * scale * o.f);

    orb.style.left = `${(w - dw) * px + o.x * dw}px`;
    orb.style.top = `${(h - dh) * py + o.y * dh}px`;
    orb.style.width = `${size}px`;
    orb.style.height = `${size}px`;
  }

  function placeAll() { ORBS.forEach(place); }

  placeAll();
  ['.scene__img--day', '.scene__img--night'].forEach((sel) => {
    const img = document.querySelector(sel);
    if (img) img.addEventListener('load', placeAll);
  });
  window.addEventListener('resize', placeAll);

  if (hint) {
    const onScroll = () => hint.classList.toggle('is-hidden', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* 文章列表滑进视野时淡入 */
  const list = document.querySelector('.entries');
  if (list && !reduce && 'IntersectionObserver' in window) {
    const items = [...list.children].filter((el) => el.classList.contains('entry'));
    if (items.length) {
      items.forEach((el, i) => el.style.setProperty('--i', String(i)));
      list.classList.add('fx');
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
      items.forEach((el) => io.observe(el));
    }
  }
})();
