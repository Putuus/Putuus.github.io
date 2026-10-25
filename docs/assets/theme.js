/* 白天 / 夜晚：把选择记在 localStorage，没选过就跟着系统走。 */
(() => {
  const root = document.documentElement;
  const KEY = 'theme';
  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const meta = document.querySelector('meta[name="theme-color"]');

  const current = () => (root.getAttribute('data-theme') === 'night' ? 'night' : 'day');

  function sync(theme) {
    const next = theme === 'night' ? '白天' : '夜晚';
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-label', `切换到${next}模式`);
      btn.setAttribute('title', `切换到${next}模式`);
      btn.setAttribute('aria-pressed', theme === 'night' ? 'true' : 'false');
    });
    if (meta) {
      const color = getComputedStyle(root).getPropertyValue('--meta').trim();
      if (color) meta.setAttribute('content', color);
    }
  }

  let shiftTimer = 0;

  function apply(theme, persist) {
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme === 'night' ? 'dark' : 'light';
    if (persist) {
      try { localStorage.setItem(KEY, theme); } catch (e) { /* 无痕模式 */ }
      root.classList.add('theme-shift');
      window.clearTimeout(shiftTimer);
      shiftTimer = window.setTimeout(() => root.classList.remove('theme-shift'), 700);
    }
    sync(theme);
  }

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  sync(current());

  document.addEventListener('click', (e) => {
    const el = e.target;
    if (!el || !el.closest) return;
    if (el.closest('.sc-sun')) { apply('night', true); return; }
    if (el.closest('.sc-moon')) { apply('day', true); return; }
    const btn = el.closest('[data-theme-toggle]');
    if (!btn) return;
    apply(current() === 'night' ? 'day' : 'night', true);
  });

  if (mq) {
    const onChange = (e) => {
      const choice = saved();
      if (choice !== 'day' && choice !== 'night') apply(e.matches ? 'night' : 'day', false);
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }
})();
