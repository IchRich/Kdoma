class StickyBrandStackObserver {
    constructor() {
        this.stickyElement = document.getElementById('brandStack');
        this.container = document.querySelector('.container.content');
        this.cardsContainer = document.querySelector('ul.cards');        
        this.sentinelTop = document.createElement('div');
        this.sentinelBottom = document.createElement('div');
        
        this.init();
    }
    
    init() {
        if (!this.stickyElement || !this.container || !this.cardsContainer) return;
        
        this.setupSentinels();
        this.setupObservers();
    }
    
    setupSentinels() {
        // Верхний маркер - начало контейнера
        this.sentinelTop.className = 'sticky-sentinel-top';
        this.sentinelTop.style.cssText = 'position: absolute; top: 0; left: 0; width: 1px; height: 1px; pointer-events: none;';
        this.container.prepend(this.sentinelTop);
        
        // Нижний маркер - конец контейнера с карточками, минус высота dots
        this.sentinelBottom.className = 'sticky-sentinel-bottom';
        
        // Вычисляем высоту dots элемента
        const dotsHeight = this.dotsElement ? this.dotsElement.offsetHeight : 0;
        
        // Устанавливаем позицию с учетом высоты dots
        this.sentinelBottom.style.cssText = `position: absolute; bottom: ${dotsHeight}px; left: 0; width: 1px; height: 1px; pointer-events: none;`;
        
        // Вставляем маркер в конец контейнера с карточками
        this.cardsContainer.appendChild(this.sentinelBottom);
    }
    
    setupObservers() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0
        };
        
        // Наблюдатель за верхним маркером
        this.topObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.stickyElement.classList.remove('sticky-active');
                } else {
                    this.stickyElement.classList.add('sticky-active');
                }
            });
        }, options);
        
        // Наблюдатель за нижним маркером
        this.bottomObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.stickyElement.classList.remove('sticky-active');
                    this.stickyElement.classList.add('sticky-bottom');
                } else {
                    this.stickyElement.classList.remove('sticky-bottom');
                }
            });
        }, options);
        
        this.topObserver.observe(this.sentinelTop);
        this.bottomObserver.observe(this.sentinelBottom);
    }
    
    // Метод для обновления при изменении размера окна
    updateOnResize() {
        // Пересоздаем маркеры при изменении размера
        this.setupSentinels();
    }
    
    destroy() {
        if (this.topObserver) {
            this.topObserver.disconnect();
        }
        if (this.bottomObserver) {
            this.bottomObserver.disconnect();
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const stickyObserver = new StickyBrandStackObserver();
        
        // Обновляем при изменении размера окна
        window.addEventListener('resize', function() {
            stickyObserver.updateOnResize();
        });
    }
});