/* 首页：画中日月热区定位 + 页眉滚动底线 */
(() => {
  const ORBS = [
    { orb: '.h-orb--sun', img: '.scene__img--day', x: 0.4975, y: 0.4615, d: 0.0400, f: 1.7 },
    { orb: '.h-orb--moon', img: '.scene__img--night', x: 0.5140, y: 0.1600, d: 0.0278, f: 2.2 },
  ];

  function placeOne(o) {
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
    const size = Math.max(36, o.d * nw * scale * o.f);

    orb.style.left = `${(w - dw) * px + o.x * dw}px`;
    orb.style.top = `${(h - dh) * py + o.y * dh}px`;
    orb.style.width = `${size}px`;
    orb.style.height = `${size}px`;
  }

  function placeOrbs() {
    ORBS.forEach(placeOne);
    const active = document.documentElement.getAttribute('data-theme') === 'day'
      ? '.h-orb--sun'
      : '.h-orb--moon';
    document.querySelectorAll('.h-orb').forEach((el) => {
      el.tabIndex = el.matches(active) ? 0 : -1;
    });
  }

  placeOrbs();
  document.querySelectorAll('.scene__img').forEach((img) => {
    if (img.complete) placeOrbs();
    img.addEventListener('load', placeOrbs);
  });
  window.addEventListener('resize', placeOrbs);
  window.addEventListener('orientationchange', placeOrbs);

  /* 右上角按钮和画中日月都会切主题；等 theme.js 换完图再量一次 */
  document.addEventListener('click', (e) => {
    if (e.target.closest && e.target.closest('[data-theme-toggle]')) {
      window.setTimeout(placeOrbs, 80);
    }
  });

  const hdr = document.querySelector('.h-header');
  const onScroll = () => hdr && hdr.classList.toggle('is-stuck', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
