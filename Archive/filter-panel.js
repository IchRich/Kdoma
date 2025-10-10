(function(){
    const btn = document.getElementById('filter-trigger-mobile');
    const dd = document.getElementById('years-dropdown');
    const ddList = document.getElementById('years-dropdown-list');
    const desktopYears = document.querySelectorAll('#year-nav .year');
    if(!btn || !dd || !ddList || !desktopYears.length) return;

    // Показ кнопки только на 360–767
    const mq = window.matchMedia('(min-width:360px) and (max-width:767px)');
    const applyMQ = () => {
        btn.hidden = !mq.matches;
        if(!mq.matches) dd.hidden = true;
    };
    applyMQ();
    mq.addEventListener?.('change', applyMQ);

    // Построить пункты из десктопных ссылок
    function buildList(){
        ddList.innerHTML = '';
        desktopYears.forEach(a=>{
            const li = document.createElement('li');
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'yd-item' + (a.classList.contains('is-active') ? ' is-active' : '');
            b.dataset.year = a.dataset.year;
            b.textContent = a.textContent.trim();
            li.appendChild(b);
            ddList.appendChild(li);
        });
    }
    buildList();

    // Синхронизация активного состояния между десктопом и дропдауном
    function setActive(year){
        // десктоп
        desktopYears.forEach(a=>{
            const active = a.dataset.year === year;
            a.classList.toggle('is-active', active);
            if(active) a.setAttribute('aria-current','page');
            else a.removeAttribute('aria-current');
        });
        // мобильный
        ddList.querySelectorAll('.yd-item').forEach(b=>{
            b.classList.toggle('is-active', b.dataset.year === year);
        });
        // обновить hash
        if(year) history.replaceState(null,'','#'+year);
    }

    // Клик по кнопке
    btn.addEventListener('click', ()=>{
        const willOpen = dd.hidden;
        dd.hidden = !willOpen;
        btn.setAttribute('aria-expanded', String(willOpen));
        if(willOpen){
            const r = btn.getBoundingClientRect();
            dd.style.left = Math.max(16, Math.min(window.innerWidth - 260, r.right - 240)) + 'px';
            dd.style.top = (r.bottom + 8 + window.scrollY) + 'px';
            buildList(); // актуализировать активность
        }
    });

    // Выбор года в дропдауне
    dd.addEventListener('click', (e)=>{
        const item = e.target.closest('.yd-item');
        if(!item) return;
        setActive(item.dataset.year);
        dd.hidden = true;
        btn.setAttribute('aria-expanded','false');
    });

    // Закрытие по клику вне/по Esc
    document.addEventListener('click', (e)=>{
        if(dd.hidden) return;
        if(e.target.closest('#years-dropdown') || e.target.closest('#filter-trigger-mobile')) return;
        dd.hidden = true;
        btn.setAttribute('aria-expanded','false');
    });
    document.addEventListener('keydown', (e)=>{
        if(e.key === 'Escape' && !dd.hidden){
            dd.hidden = true;
            btn.setAttribute('aria-expanded','false');
        }
    });

    // Инициализация из hash
    const initial = (location.hash || '').slice(1);
    if(initial) setActive(initial);
})();