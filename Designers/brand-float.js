document.addEventListener('DOMContentLoaded', () => {
    // Плавающий блок
    const el = document.getElementById('brandStack');
    // Нижний ограничитель (id переименован с bezsmolova-elena -> bezsmolova_elena)
    const boundEl = document.getElementById('bezsmolova_elena');
    if (!el || !boundEl) return;

    const ease = 0.15;
    let targetY = 0;
    let currentY = 0;
    let ticking = false;

    // Стартовый top задаётся в CSS (position:absolute; right:...; top:...)
    const baseTop = el.offsetTop;

    function getMaxTranslateY() {
        // Низ плавающего блока не должен опуститься ниже низа boundEl
        const pageYOfBoundBottom = boundEl.getBoundingClientRect().bottom + window.scrollY;
        const elHeight = el.offsetHeight;
        // Предел по translateY (относительно baseTop)
        return Math.max(0, pageYOfBoundBottom - elHeight - baseTop);
    }

    function onScroll() {
        const maxY = getMaxTranslateY();
        targetY = Math.min(window.scrollY, maxY);
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

    function onResize() {
        const maxY = getMaxTranslateY();
        targetY = Math.min(targetY, maxY);
        requestTick();
    }

    // Инициализация
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Стартовое положение
    targetY = Math.min(window.scrollY, getMaxTranslateY());
    currentY = 0;
    el.style.transform = 'translateY(0)';
    requestTick();
});
