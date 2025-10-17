document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('brandStack');            // плавающий баннер
    const boundEl = document.getElementById('bezsmolova_elena'); // нижний ограничитель
    const container = document.querySelector('.container');      // основной контейнер
    const firstRow = document.querySelector('.cards > .row');    // первая строка/карточка
    if (!el || !container || !firstRow) return;

    // Стили, чтобы позиционироваться относительно контейнера
    container.style.position ||= 'relative';
    el.style.position = 'absolute';
    el.style.willChange = 'transform';
    el.style.transform = 'translateY(0)';

    // Прижимаем баннер к правому внутреннему краю контейнера
    function stickRightEdge() {
        const cRect = container.getBoundingClientRect();
        const eRect = el.getBoundingClientRect();
        // Ставим right: 0 внутри контейнера, убираем старые right/left в px
        el.style.right = '0px';
        el.style.left = 'auto';
        // Фикс на случай глобальных паддингов у контейнера: ничего не делаем, right:0 уже учитывает padding.
    }

    // Вычисляем базовую верхнюю позицию по первой .row
    let baseTop = 0;
    function alignToFirstRowTop() {
        const cTop = container.getBoundingClientRect().top + window.scrollY;
        const rTop = firstRow.getBoundingClientRect().top + window.scrollY;
        baseTop = Math.max(0, Math.round(rTop - cTop)); // смещение от верхнего края контейнера
        el.style.top = baseTop + 'px';
    }

    // Ограничиваем нижнюю границу как у вас
    const ease = 0.15;
    let targetY = 0;
    let currentY = 0;
    let ticking = false;

    function getMaxTranslateY() {
        if (!boundEl) return 0;
        const cTop = container.getBoundingClientRect().top + window.scrollY;
        const boundBottom = boundEl.getBoundingClientRect().bottom + window.scrollY;
        const elHeight = el.offsetHeight;
        // низ баннера не ниже низа boundEl; учитываем базовый top
        return Math.max(0, boundBottom - (cTop + baseTop) - elHeight);
    }

    function onScroll() {
        const maxY = getMaxTranslateY();
        // Двигаем плавно, но не выше и не ниже пределов
        targetY = Math.min(window.scrollY - (container.getBoundingClientRect().top + window.scrollY - 0), maxY);
        targetY = Math.max(0, targetY);
        requestTick();
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }

    function update() {
        const delta = targetY - currentY;
        currentY += delta * ease;
        el.style.transform = `translateY(${currentY}px)`;
        if (Math.abs(delta) > 0.5) {
            requestAnimationFrame(update);
        } else {
            ticking = false;
        }
    }

    function recalcAll() {
        // Ставим к правому краю контейнера и выравниваем по верхней кромке первой строки
        stickRightEdge();
        alignToFirstRowTop();
        // Сбрасываем смещение при ресайзе, чтобы не залипало
        currentY = 0;
        targetY = Math.min(0, getMaxTranslateY());
        el.style.transform = 'translateY(0)';
        requestTick();
    }

    // Инициализация
    recalcAll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { recalcAll(); onScroll(); }, { passive: true });

    // На случай изображений/шрифтов — пересчет после загрузки
    window.addEventListener('load', () => { recalcAll(); onScroll(); });

    // Если в контенте внутри карточек меняется высота — наблюдатель
    const mo = new MutationObserver(() => { recalcAll(); onScroll(); });
    mo.observe(document.querySelector('.cards'), { childList: true, subtree: true });
});
