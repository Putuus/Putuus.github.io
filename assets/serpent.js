/* Serpent Flame Peaks · 文章页增强
   只做四件事：进度、阅读时长、换行块、封面视差。
   没有依赖，不改变正文内容。 */

(function () {
  'use strict';

  if (!document.body || !document.body.classList.contains('is-post')) return;

  var prose = document.querySelector('.post .prose');
  var cover = document.querySelector('.sf-cover');
  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. 阅读进度 */
  var bar = document.createElement('div');
  bar.className = 'sf-progress';
  document.body.appendChild(bar);

  var rafProgress = 0;
  function paintProgress() {
    rafProgress = 0;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? window.scrollY / max : 0;
    p = Math.max(0, Math.min(1, p));
    bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
  }
  function requestProgress() {
    if (!rafProgress) rafProgress = requestAnimationFrame(paintProgress);
  }
  window.addEventListener('scroll', requestProgress, { passive: true });
  window.addEventListener('resize', requestProgress);
  paintProgress();

  /* 2. 阅读时长（中文按 320 字 / 分钟，英文按 180 词 / 分钟） */
  var meta = document.querySelector('.post .meta');
  if (prose && meta) {
    var text = prose.textContent || '';
    var cjk = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    var words = (text.match(/[A-Za-z0-9][A-Za-z0-9._\/-]*/g) || []).length;
    var minutes = Math.max(1, Math.round(cjk / 320 + words / 180));

    var dot = document.createElement('span');
    dot.className = 'sf-meta-dot';
    dot.textContent = '·';

    var label = document.createElement('span');
    label.textContent = '约 ' + minutes + ' 分钟';

    meta.appendChild(dot);
    meta.appendChild(label);
  }

  /* 3. 用换行直接写出来的配置 / 示意，给它们一个“行块”的外形 */
  if (prose) {
    var paragraphs = prose.querySelectorAll('p');
    for (var i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].querySelectorAll('br').length >= 2) {
        paragraphs[i].classList.add('is-lines');
      }
    }
  }

  /* 4. 列表里的多行命令：第一行留在正文里，后面的行收成行块 */
  if (prose) {
    var items = prose.querySelectorAll('li');
    for (var j = 0; j < items.length; j++) {
      var li = items[j];
      var brs = li.querySelectorAll('br');
      if (brs.length < 2) continue;
      var firstBr = brs[0];
      var box = document.createElement('span');
      box.className = 'sf-li-lines';
      var node = firstBr.nextSibling;
      while (node) {
        var next = node.nextSibling;
        box.appendChild(node);
        node = next;
      }
      li.appendChild(box);
      if (firstBr.parentNode) firstBr.parentNode.removeChild(firstBr);
    }
  }

  /* 5. 封面视差：只让画面动，正文不动 */
  var img = cover && cover.querySelector('img');
  if (img && !reduce) {
    var rafShift = 0;
    function paintShift() {
      rafShift = 0;
      var rect = cover.getBoundingClientRect();
      if (rect.bottom < -60 || rect.top > window.innerHeight) return;
      var travelled = Math.max(0, -rect.top);
      var limit = cover.offsetHeight + 140;
      travelled = Math.min(travelled, limit);
      img.style.setProperty('--sf-shift', (travelled * 0.12).toFixed(1) + 'px');
    }
    window.addEventListener('scroll', function () {
      if (!rafShift) rafShift = requestAnimationFrame(paintShift);
    }, { passive: true });
    paintShift();
  }
})();
