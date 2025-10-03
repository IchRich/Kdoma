// slider.js — touch‑свайп фикс
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-slider]').forEach(initSlider);
});

function initSlider(root){
    const track  = root.querySelector('.work-slider__track');
    const slides = Array.from(root.querySelectorAll('.work-slider__slide'));
    const dots   = Array.from(root.querySelectorAll('.dot'));
    const btnPrev = root.querySelector('.nav.prev');
    const btnNext = root.querySelector('.nav.next');
    let index = 0;
    let startX = 0, currentX = 0, touching = false;

    const update = ()=>{
        track.style.transform = `translateX(${-index*100}%)`;
        dots.forEach((d,i)=> d.classList.toggle('is-active', i===index));
    };

    // Навигация по точкам
    dots.forEach((dot,i)=> dot.addEventListener('click', ()=>{ index=i; update(); }));

    // Кнопки prev/next
    if (btnPrev) btnPrev.addEventListener('click', ()=>{
        index = Math.max(0, index-1);
        update();
    });
    if (btnNext) btnNext.addEventListener('click', ()=>{
        index = Math.min(slides.length-1, index+1);
        update();
    });

    // Touch-свайпы (если нужны)
    root.addEventListener('touchstart', e=> { touching=true; startX=e.touches[0].clientX; track.style.transition='none'; }, {passive:true});
    root.addEventListener('touchmove',  e=> {
        if(!touching) return;
        currentX = e.touches[0].clientX - startX;
        const percent = currentX / root.clientWidth * 100;
        track.style.transform = `translateX(${-(index*100) + percent}%)`;
    }, {passive:true});
    root.addEventListener('touchend', ()=>{
        if(!touching) return;
        touching=false;
        track.style.transition='';
        if(Math.abs(currentX) > root.clientWidth*0.2){
            index += currentX<0 ? 1 : -1;
            index = Math.max(0, Math.min(index, slides.length-1));
        }
        currentX=0;
        update();
    });

    update();
}