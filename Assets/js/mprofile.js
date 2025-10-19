// mprofile.js
// Изолированная логика раскрытия мобильного профиля (360–767 px).
// Не трогает десктопный .profile и любую другую разметку.

(function () {
    'use strict';

    // Диапазон, в котором работает мобильный профиль
    var MQ = '(min-width:360px) and (max-width:767px)';
    var mq = window.matchMedia(MQ);

    var state = {
        bound: false,
        btn: null,
        panel: null
    };

    function qs(selector, ctx) {
        return (ctx || document).querySelector(selector);
    }

    function mount() {
        if (state.bound) return;

        var root = qs('.mprofile');
        if (!root) return; // мобильный блок не размечен

        state.btn = qs('.mprofile__morebtn', root);
        state.panel = qs('#mprofile_more', root);

        if (!state.btn || !state.panel) return;

        // Начальное состояние на мобилке
        state.panel.hidden = true;
        state.btn.setAttribute('aria-expanded', 'false');
        state.btn.textContent = 'ДОП. ИНФОРМАЦИЯ';

        state.btn.addEventListener('click', onToggle);
        state.bound = true;
    }

    function unmount() {
        if (!state.bound) return;

        // Удаляем только мобильные биндинги; десктоп не трогаем
        state.btn.removeEventListener('click', onToggle);
        // Не меняем видимость: CSS сам скрывает .mprofile вне диапазона
        state.bound = false;
    }

    function onToggle() {
        var expanded = state.btn.getAttribute('aria-expanded') === 'true';

        if (expanded) {
            // Закрыть
            state.panel.classList.remove('mprofile__more--open');
            state.btn.setAttribute('aria-expanded', 'false');
            state.btn.textContent = 'Доп. информация';
            // скрыть семантически после анимации
            window.setTimeout(function () {
                state.panel.hidden = true;
            }, 350);
        } else {
            // Открыть
            state.panel.hidden = false;
            // ждём кадр, чтобы transition сработал
            window.requestAnimationFrame(function () {
                state.panel.classList.add('mprofile__more--open');
            });
            state.btn.setAttribute('aria-expanded', 'true');
            state.btn.textContent = 'Скрыть';
        }
    }

    function apply(e) {
        if (e.matches) {
            mount();
        } else {
            unmount();
        }
    }

    // Инициализация
    apply(mq);

    // Поддержка старых браузеров
    if (mq.addEventListener) {
        mq.addEventListener('change', apply);
    } else if (mq.addListener) {
        mq.addListener(apply);
    }
})();
