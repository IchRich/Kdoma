// year_toggle.js
(function () {
    console.log('[year_toggle] init');

    const nav = document.getElementById('year_nav');
    if (!nav) {
        console.warn('[year_toggle] not found: #year_nav');
        return;
    }

    const buttons = Array.from(nav.querySelectorAll('a.year'));
    if (!buttons.length) {
        console.warn('[year_toggle] no .year links');
        return;
    }

    function setActive(year) {
        buttons.forEach((btn) => {
            const active = btn.dataset.year === year;
            btn.classList.toggle('is_active', active);
            if (active) btn.setAttribute('aria-current', 'page');
            else btn.removeAttribute('aria-current');
        });
    }

    // Инициализация из hash (если есть)
    const current = (location.hash || '').slice(1);
    if (current) setActive(current);

    nav.addEventListener('click', (e) => {
        const link = e.target.closest('a.year');
        if (!link) return;
        setActive(link.dataset.year);
        // e.preventDefault(); // если нужно отключить переход по якорю
    });
})();
