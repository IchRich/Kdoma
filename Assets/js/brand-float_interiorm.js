class StickyBrandStackObserver {
    constructor() {
        this.stickyElement = document.getElementById('brandStack');
        this.container = document.querySelector('.Design_Info');
        this.cardsContainer = document.querySelector('ul.cards');
        this.designerFlexElement = document.querySelector('.Designer_Flex');

        this.sentinelTop = document.createElement('div');
        this.sentinelBottom = document.createElement('div');
        this.sentinelTopEnd = document.createElement('div');
        this.sentinelDesignerFlexBottom = document.createElement('div'); // Новая точка отслеживания

        this.init();
    }

    init() {
        if (!this.stickyElement || !this.container || !this.cardsContainer || !this.designerFlexElement) return;
        this.setupSentinels();
        this.setupObservers();
    }

    setupSentinels() {
        this.sentinelTop.className = 'sticky-sentinel-top';
        this.sentinelTop.style.cssText = `
            position: absolute; top: 0; left: 0; 
            width: 1px; height: 1px; pointer-events: none;
        `;
        this.container.prepend(this.sentinelTop);

        this.sentinelDesignerFlexBottom.className = 'sticky-sentinel-designer-bottom';
        const designerFlexRect = this.designerFlexElement.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        const designerFlexBottomPosition = designerFlexRect.bottom - containerRect.top;

        this.sentinelDesignerFlexBottom.style.cssText = `
            position: absolute; 
            top: ${designerFlexBottomPosition}px; left: 0; 
            width: 1px; height: 1px; pointer-events: none;
        `;
        this.container.appendChild(this.sentinelDesignerFlexBottom);

        this.sentinelTopEnd.className = 'sticky-sentinel-top-end';
        const containerHeight = this.container.offsetHeight;
        this.sentinelTopEnd.style.cssText = `
            position: absolute; 
            top: ${containerHeight}px; left: 0; 
            width: 1px; height: 1px; pointer-events: none;
        `;
        this.container.appendChild(this.sentinelTopEnd);

        this.sentinelBottom.className = 'sticky-sentinel-bottom';
        const dotsElement = document.querySelector('.slider__dots');
        const dotsHeight = dotsElement ? dotsElement.offsetHeight : 0;
        this.sentinelBottom.style.cssText = `
            position: absolute; bottom: ${dotsHeight}px; left: 0; 
            width: 1px; height: 1px; pointer-events: none;
        `;
        this.cardsContainer.appendChild(this.sentinelBottom);
    }

    setupObservers() {
        const options = { root: null, rootMargin: '0px', threshold: 0 };


        this.topObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    this.stickyElement.classList.add('sticky-active');
                } else {
                    this.stickyElement.classList.remove('sticky-active', 'sticky-top');
                }
            });
        }, options);


        this.designerFlexObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {

                    if (this.stickyElement.classList.contains('sticky-active')) {
                        this.stickyElement.classList.add('sticky-top');
                    }
                } else {

                    this.stickyElement.classList.remove('sticky-top');
                }
            });
        }, options);


        this.topEndObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.stickyElement.classList.remove('sticky-active', 'sticky-top');
                }
            });
        }, options);

        this.bottomObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.stickyElement.classList.remove('sticky-active', 'sticky-top');
                    this.stickyElement.classList.add('sticky-bottom');
                } else {
                    this.stickyElement.classList.remove('sticky-bottom');
                }
            });
        }, options);

        this.topObserver.observe(this.sentinelTop);
        this.designerFlexObserver.observe(this.sentinelDesignerFlexBottom);
        this.topEndObserver.observe(this.sentinelTopEnd);
        this.bottomObserver.observe(this.sentinelBottom);
    }

    updateOnResize() {
        this.destroy();

        if (this.sentinelTop && this.sentinelTop.parentNode) {
            this.sentinelTop.parentNode.removeChild(this.sentinelTop);
        }
        if (this.sentinelDesignerFlexBottom && this.sentinelDesignerFlexBottom.parentNode) {
            this.sentinelDesignerFlexBottom.parentNode.removeChild(this.sentinelDesignerFlexBottom);
        }
        if (this.sentinelTopEnd && this.sentinelTopEnd.parentNode) {
            this.sentinelTopEnd.parentNode.removeChild(this.sentinelTopEnd);
        }
        if (this.sentinelBottom && this.sentinelBottom.parentNode) {
            this.sentinelBottom.parentNode.removeChild(this.sentinelBottom);
        }

        this.sentinelTop = document.createElement('div');
        this.sentinelDesignerFlexBottom = document.createElement('div');
        this.sentinelTopEnd = document.createElement('div');
        this.sentinelBottom = document.createElement('div');

        this.init();
    }

    destroy() {
        if (this.topObserver) this.topObserver.disconnect();
        if (this.designerFlexObserver) this.designerFlexObserver.disconnect();
        if (this.topEndObserver) this.topEndObserver.disconnect();
        if (this.bottomObserver) this.bottomObserver.disconnect();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if ('IntersectionObserver' in window) {
        const stickyObserver = new StickyBrandStackObserver();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                stickyObserver.updateOnResize();
            }, 250);
        });
    }
});