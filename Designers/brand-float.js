document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('brandStack');              // плавающий блок
    const boundEl = document.getElementById('bezsmolova-elena');   // низ-ограничитель
    if (!el || !boundEl) return;

    const ease = 0.15;
    let targetY = 0;
    let currentY = 0;
    let ticking = false;

    // Стартовый top, правый край задаются в CSS (position:absolute; right:24px; top:24px)
    const baseTop = el.offsetTop;

    function getMaxTranslateY(){
        // Максимальное смещение: низ плавающего блока не должен опуститься ниже низа boundEl
        const pageYOfBoundBottom = boundEl.getBoundingClientRect().bottom + window.scrollY;
        const elHeight = el.offsetHeight;
        // Предел по translateY (относительно baseTop)
        return Math.max(0, pageYOfBoundBottom - elHeight - baseTop);
    }

    function onScroll(){
        const maxY = getMaxTranslateY();
        targetY = Math.min(window.scrollY, maxY);   // ограничиваем по низу
        requestTick();
    }

    function requestTick(){
        if (!ticking){
            requestAnimationFrame(update);
            ticking = true;
        }
    }

    function update(){
        const delta = targetY - currentY;
        currentY += delta * ease;
        el.style.transform = `translateY(${currentY}px)`;
        if (Math.abs(delta) > 0.5){
            requestAnimationFrame(update);
        } else {
            ticking = false;
        }
    }

    function onResize(){
        // Пересчитываем предел и чуть корректируем позицию, если выехали за границу
        const maxY = getMaxTranslateY();
        targetY = Math.min(targetY, maxY);
        requestTick();
    }

    // Инициализация
    window.addEventListener('scroll', onScroll, { passive:true });   // use passive for perf
    window.addEventListener('resize', onResize, { passive:true });
    // Старт
    targetY = Math.min(window.scrollY, getMaxTranslateY());
    currentY = 0;
    el.style.transform = 'translateY(0)';
    requestTick();
});