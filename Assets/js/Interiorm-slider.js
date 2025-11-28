document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.work_slider[data-slider]').forEach(initSlider);
});

function initSlider(root){
    const viewport = root.querySelector('.slider__viewport');
    const track    = root.querySelector('.slider__track');
    const slides   = Array.from(root.querySelectorAll('.slide'));
    const prevBtn  = root.querySelector('.nav.prev');
    const nextBtn  = root.querySelector('.nav.next');
    const dotsWrap = root.querySelector('.slider__dots');

    if (!viewport || !track || !slides.length) return;

    // Точки
    let dots = [];
    if (dotsWrap){
        dotsWrap.innerHTML = '';
        slides.forEach((_, i) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'dot';
            b.setAttribute('aria-label', `Слайд ${i+1}`);
            dotsWrap.appendChild(b);
        });
        dots = Array.from(dotsWrap.children);
    }

    let index = 0;
    let startX = 0, dx = 0, touching = false;

    const clamp = (i) => Math.max(0, Math.min(i, slides.length - 1));

    function set(i, anim = true){
        index = clamp(i);
        track.style.transition = anim ? 'transform .35s ease' : 'none';
        track.style.transform  = `translateX(${-index * 100}%)`;
        dots.forEach((d, j) => d.classList.toggle('is_active', j === index));
    }

    function layout(){
        const w = viewport.clientWidth;
        // Жестко синхронизируем ширины: один слайд == ширина viewport
        slides.forEach(s => {
            s.style.minWidth = `${w}px`;
            s.style.flex = `0 0 ${w}px`;
        });
        set(index, false);
    }

    prevBtn?.addEventListener('click', () => set(index - 1));
    nextBtn?.addEventListener('click', () => set(index + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => set(i)));

    // Свайп
    root.addEventListener('touchstart', e => {
        touching = true; startX = e.touches[0].clientX; dx = 0; track.style.transition = 'none';
    }, { passive: true });

    root.addEventListener('touchmove', e => {
        if (!touching) return;
        dx = e.touches[0].clientX - startX;
        const percent = dx / viewport.clientWidth * 100;
        track.style.transform = `translateX(${-(index * 100) + percent}%)`;
    }, { passive: true });

    root.addEventListener('touchend', () => {
        if (!touching) return; touching = false;
        const threshold = viewport.clientWidth * 0.2;
        if (Math.abs(dx) > threshold) set(index + (dx < 0 ? 1 : -1));
        else set(index);
        dx = 0;
    });

    window.addEventListener('resize', layout);
    window.addEventListener('orientationchange', layout);

    layout();
    set(0, false);
}
