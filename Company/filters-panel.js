// filters_panel.js — версия для компактного дропдауна (snake_case)
(() => {
    const tDesktop = document.getElementById('filter_trigger_desktop');
    const tMobile  = document.getElementById('filter_trigger_mobile');
    const dd       = document.getElementById('filter_dropdown');
    const overlay  = document.getElementById('filter_overlay');
    if (!dd) return;

    const btnClose = dd.querySelector('.filter_dropdown__close');
    const countNode= dd.querySelector('.filter_dropdown__count');

    function open(from){
        dd.hidden = false;
        overlay.hidden = false;
        (from === 'desktop' ? tDesktop : tMobile)?.setAttribute('aria-expanded','true');
    }
    function close(){
        dd.hidden = true;
        overlay.hidden = true;
        tDesktop?.setAttribute('aria-expanded','false');
        tMobile?.setAttribute('aria-expanded','false');
    }

    tDesktop?.addEventListener('click', (e) => { e.stopPropagation(); open('desktop'); });
    tMobile?.addEventListener('click', (e) => { e.stopPropagation(); open('mobile'); });
    btnClose?.addEventListener('click', close);
    overlay?.addEventListener('click', close);
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !dd.hidden) close(); });

    // Счётчик и "выбрать все"
    function updateCount(){
        const checked = dd.querySelectorAll('input[type="checkbox"]:checked:not([data-filter-all])').length;
        if (countNode) countNode.textContent = `(${checked})`;
    }

    dd.querySelectorAll('[data-filter-all]').forEach(all => {
        const group = all.getAttribute('data-filter-all');
        all.addEventListener('change', (e) => {
            const on = e.currentTarget.checked;
            dd.querySelectorAll(`input[data-filter-group="${group}"]`).forEach(cb => cb.checked = on);
            updateCount();
        });
    });

    dd.querySelectorAll('input[type="checkbox"][data-filter-group]').forEach(cb => {
        cb.addEventListener('change', () => {
            const group = cb.getAttribute('data-filter-group');
            const all = dd.querySelector(`[data-filter-all="${group}"]`);
            if (all){
                const items = dd.querySelectorAll(`input[data-filter-group="${group}"]`);
                all.checked = Array.from(items).every(x => x.checked);
            }
            updateCount();
        });
    });

    dd.querySelector('.filter_dropdown__reset')?.addEventListener('click', () => {
        dd.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        dd.querySelectorAll('[data-filter-all]').forEach(cb => cb.checked = false);
        updateCount();
    });

    dd.querySelector('.filter_dropdown__apply')?.addEventListener('click', () => {
        dd.dispatchEvent(new CustomEvent('filter:apply', { bubbles:true }));
        close();
    });

    updateCount();
})();
