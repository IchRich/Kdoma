(function () {
  'use strict';

  function findScrollContainer() {
    const candidates = [
      document.querySelector('main'),
      document.querySelector('.page'),
      document.querySelector('.cards'),
      document.body,
      document.documentElement,
      window
    ];

    for (const el of candidates) {
      if (!el) continue;
      if (el === window) return window;

      try {
        const clientH = el.clientHeight || (el === document.body ? document.documentElement.clientHeight : 0);
        const scrollH = el.scrollHeight || 0;
        if (scrollH > clientH + 1) {
          return el;
        }
      } catch (e) {}
    }

    return window;
  }

  function init() {
    const header = document.querySelector('.site_header');
    if (!header) return;

    header.classList.add('visible');
    header.classList.remove('hidden');

    const scroller = findScrollContainer();
    let lastY = (scroller === window) ? (window.scrollY || 0) : (scroller.scrollTop || 0);
    let ticking = false;
    const HIDE_THRESHOLD = 80;
    const MIN_DELTA = 5;

    function getScrollY() {
      return scroller === window ? (window.scrollY || 0) : (scroller.scrollTop || 0);
    }

    function doUpdate() {
      const curY = getScrollY();
      const delta = curY - lastY;

      if (Math.abs(delta) < MIN_DELTA) {
        ticking = false;
        return;
      }

      const navToggle = document.getElementById('nav-toggle');
      const menuOpen = navToggle && navToggle.checked;

      if (menuOpen) {
        header.classList.remove('hidden');
        header.classList.add('visible');
        lastY = curY;
        ticking = false;
        return;
      }

      if (curY > lastY && curY > HIDE_THRESHOLD) {
        if (!header.classList.contains('hidden')) {
          header.classList.add('hidden');
          header.classList.remove('visible');
        }
      } else if (curY < lastY) {
        if (header.classList.contains('hidden')) {
          header.classList.remove('hidden');
          header.classList.add('visible');
        }
      }

      lastY = curY <= 0 ? 0 : curY;
      ticking = false;
    }

    function onScrollEvent() {
      if (!ticking) {
        window.requestAnimationFrame(doUpdate);
        ticking = true;
      }
    }

    if (scroller === window) {
      window.addEventListener('scroll', onScrollEvent, { passive: true });
    } else {
      scroller.addEventListener('scroll', onScrollEvent, { passive: true });
      window.addEventListener('wheel', onScrollEvent, { passive: true });
      window.addEventListener('touchmove', onScrollEvent, { passive: true });
    }

    window.addEventListener('resize', () => {
      header.classList.remove('hidden');
      header.classList.add('visible');
      lastY = getScrollY();
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        header.classList.remove('hidden');
        header.classList.add('visible');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();