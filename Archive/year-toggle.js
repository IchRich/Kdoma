// year-toggle.js
(function () {
    console.log('[year-toggle] init'); // увидеть в консоли

    const nav = document.getElementById('year-nav');
    if (!nav) {
        console.warn('[year-toggle] not found: #year-nav');
        return;
    }

    const buttons = Array.from(nav.querySelectorAll('a.year'));
    if (!buttons.length) {
        console.warn('[year-toggle] no .year links');
        return;
    }

    function setActive(year) {
        buttons.forEach((btn) => {
            const active = btn.dataset.year === year;
            btn.classList.toggle('is-active', active);
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
        // Не мешаем якорю; если нужно — раскомментируйте:
        // e.preventDefault();
    });
})();
