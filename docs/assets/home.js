/* 首页视差：鼠标一动，透视原点跟着走，远近的层自然错开 */
(() => {
  const scene = document.querySelector('.scene');
  const hint = document.querySelector('.hero__hint');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (hint) {
    const onScroll = () => hint.classList.toggle('is-hidden', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (!scene || reduce || window.innerWidth < 760) return;

  let tx = 0;
  let ty = 0;
  let cx = 0;
  let cy = 0;
  let raf = 0;

  const tick = () => {
    cx += (tx - cx) * 0.075;
    cy += (ty - cy) * 0.075;
    scene.style.perspectiveOrigin = `${(50 + cx * 7).toFixed(2)}% ${(50 + cy * 7).toFixed(2)}%`;
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.0008 ? requestAnimationFrame(tick) : 0;
  };

  window.addEventListener('mousemove', (e) => {
    tx = (e.clientX / window.innerWidth - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });
})();
