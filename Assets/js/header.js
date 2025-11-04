// Assets/js/header.js — автоматически ищет реальный скролл-контейнер и управляет хедером
(function () {
  'use strict';

  const DEBUG = true; // после проверки поставить false

  function findScrollContainer() {
    // Кандидаты — от самого конкретного к общему
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
      // window special-case: считаем валидным как fallback
      if (el === window) return window;

      // Используем свойства элементов; для body/documentElement проверяем scrollHeight too
      try {
        const clientH = el.clientHeight || (el === document.body ? document.documentElement.clientHeight : 0);
        const scrollH = el.scrollHeight || 0;
        if (DEBUG) console.log('header.js: candidate', el.tagName || el, { clientH, scrollH });
        if (scrollH > clientH + 1) {
          return el;
        }
      } catch (e) {
        // игнорируем
      }
    }

    // Если ничего не найдено — fallback на window
    return window;
  }

  function init() {
    const header = document.querySelector('.site_header');
    if (!header) {
      console.error('header.js: .site_header not found');
      return;
    }

    // Ensure header visible initially
    header.classList.add('visible');
    header.classList.remove('hidden');

    // Найдём скролл-контейнер
    const scroller = findScrollContainer();
    if (DEBUG) console.log('header.js: chosen scroller ->', scroller === window ? 'window' : scroller, scroller);

    let lastY = (scroller === window) ? (window.scrollY || 0) : (scroller.scrollTop || 0);
    let ticking = false;
    const HIDE_THRESHOLD = 80; // px
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

      // если мобильное меню открыто — не прятать
      const navToggle = document.getElementById('nav-toggle');
      const menuOpen = navToggle && navToggle.checked;

      if (menuOpen) {
        header.classList.remove('hidden');
        header.classList.add('visible');
        lastY = curY;
        ticking = false;
        if (DEBUG) console.log('header.js: menu open -> keep visible');
        return;
      }

      if (curY > lastY && curY > HIDE_THRESHOLD) {
        // scroll down -> hide
        if (!header.classList.contains('hidden')) {
          header.classList.add('hidden');
          header.classList.remove('visible');
          if (DEBUG) console.log('header.js: hide (down)', { curY, lastY, delta });
        }
      } else if (curY < lastY) {
        // scroll up -> show
        if (header.classList.contains('hidden')) {
          header.classList.remove('hidden');
          header.classList.add('visible');
          if (DEBUG) console.log('header.js: show (up)', { curY, lastY, delta });
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

    // Привязываем слушатель к найденному scroller
    if (scroller === window) {
      window.addEventListener('scroll', onScrollEvent, { passive: true });
    } else {
      scroller.addEventListener('scroll', onScrollEvent, { passive: true });
      // Дополнительно: колесо/тач на document, чтобы поймать жесты, если scroller не ловит
      window.addEventListener('wheel', onScrollEvent, { passive: true });
      window.addEventListener('touchmove', onScrollEvent, { passive: true });
    }

    // На resize/visibilitychange — показываем хедер
    window.addEventListener('resize', () => {
      header.classList.remove('hidden');
      header.classList.add('visible');
      lastY = getScrollY();
      if (DEBUG) console.log('header.js: resize -> show');
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        header.classList.remove('hidden');
        header.classList.add('visible');
        if (DEBUG) console.log('header.js: visibility -> show');
      }
    });

    if (DEBUG) {
      console.log('header.js: init done, scroller:', scroller === window ? 'window' : scroller);
      // короткий статус-лог
      setInterval(() => {
        console.log('header.js: status', header.className, 'scrollY=', getScrollY());
      }, 2500);
    }
  }

  // Запуск после DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
