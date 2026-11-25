/* Hermes 风格文章页：进度、目录高亮、页眉吸顶。无依赖。 */
(() => {
  'use strict';

  const boot = () => {
    if (!document.body || !document.body.classList.contains('hermes-post')) return;

    const header = document.querySelector('[data-post-header]');
    const bar = document.querySelector('[data-post-progress]');
    const links = [...document.querySelectorAll('[data-post-toc-link]')];
    const headings = [...document.querySelectorAll('.post-prose h2, .post-prose h3')];
    const byId = new Map(links.map((link) => [link.getAttribute('href')?.slice(1), link]));

    const setActive = () => {
      if (!headings.length || !links.length) return;
      let active = null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= 120) {
          active = byId.get(heading.id) || active;
        }
      }
      if (!active && window.scrollY < 80) active = links[0];
      links.forEach((link) => link.classList.toggle('is-active', link === active));
    };

    const paint = () => {
      if (header) header.classList.toggle('is-stuck', window.scrollY > 8);
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const value = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
        bar.style.transform = `scaleX(${value.toFixed(4)})`;
      }
      setActive();
    };

    window.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', paint);
    paint();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
