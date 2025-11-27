document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-slider]').forEach(initSlider);
});

function initSlider(root) {
    const track   = root.querySelector('.work_slider__track');
    const slides  = Array.from(root.querySelectorAll('.work_slider__slide'));
    const dots    = Array.from(root.querySelectorAll('.dot'));
    const btnPrev = root.querySelector('.nav.prev');
    const btnNext = root.querySelector('.nav.next');

    let index = 0;
    let startX = 0, currentX = 0, touching = false;

    // === ВАЖНО: читаем gap напрямую из CSS ===
    const gapPx = parseFloat(getComputedStyle(track).gap) || 0;

    // Сколько % занимает gap относительно ширины root
    const gapPercent = (gapPx / root.clientWidth) * 100;

    // Каждое смещение = 100% ширина слайда + gap в %
    const step = 100 + gapPercent;

    const update = () => {
        track.style.transform = `translateX(${-index * step}%)`;

        dots.forEach((d, i) => d.classList.toggle('is_active', i === index));
    };

    // Навигация по точкам
    dots.forEach((dot, i) => dot.addEventListener('click', () => { index = i; update(); }));

    // Кнопки prev/next
    if (btnPrev) btnPrev.addEventListener('click', () => {
        index = Math.max(0, index - 1);
        update();
    });
    if (btnNext) btnNext.addEventListener('click', () => {
        index = Math.min(slides.length - 1, index + 1);
        update();
    });

    // Touch-свайпы
    root.addEventListener('touchstart', e => {
        touching = true;
        startX = e.touches[0].clientX;
        track.style.transition = 'none';
    }, { passive: true });

    root.addEventListener('touchmove', e => {
        if (!touching) return;
        currentX = e.touches[0].clientX - startX;
        const percent = currentX / root.clientWidth * step;
        track.style.transform = `translateX(${-(index * step) + percent}%)`;
    }, { passive: true });

    root.addEventListener('touchend', () => {
        if (!touching) return;
        touching = false;
        track.style.transition = '';

        if (Math.abs(currentX) > root.clientWidth * 0.2) {
            index += currentX < 0 ? 1 : -1;
            index = Math.max(0, Math.min(index, slides.length - 1));
        }

        currentX = 0;
        update();
    });

    update();
}
