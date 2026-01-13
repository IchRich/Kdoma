class StickyBrandStackObserver {
    constructor() {
        this.stickyElement = document.getElementById('brandStack');
        this.designerFlexElement = document.querySelector('.Designer_Flex');
        this.designInfoElement = document.querySelector('.Design_Info');
        this.footerElement = document.querySelector('.site_footer');

        this.currentState = 'default';
        this.init();
    }

    init() {
        if (!this.stickyElement || !this.designerFlexElement || !this.designInfoElement || !this.footerElement) return;
        this.setupObservers();
    }

    setupObservers() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: [0, 0.1, 0.5, 1]
        };


        this.observer = new IntersectionObserver((entries) => {
            this.handleIntersections(entries);
        }, options);


        this.observer.observe(this.designerFlexElement);
        this.observer.observe(this.designInfoElement);
        this.observer.observe(this.footerElement);


        this.checkCurrentState();
    }

    handleIntersections(entries) {
        let designerFlexVisible = false;
        let designInfoVisible = false;
        let footerVisible = false;


        entries.forEach(entry => {
            if (entry.target === this.designerFlexElement && entry.intersectionRatio > 0) {
                designerFlexVisible = true;
            }
            if (entry.target === this.designInfoElement && entry.intersectionRatio > 0) {
                designInfoVisible = true;
            }
            if (entry.target === this.footerElement && entry.intersectionRatio > 0) {
                footerVisible = true;
            }
        });


        if (entries.length < 3) {
            this.checkCurrentState();
            return;
        }

        console.log('Visibility:', {
            designerFlex: designerFlexVisible,
            designInfo: designInfoVisible,
            footer: footerVisible
        });


        if (designerFlexVisible) {

            this.setState('default');
        } else if (footerVisible) {

            this.setState('bottom');
        } else if (designInfoVisible) {

            this.setState('active');
        } else {

            this.setState('default');
        }
    }

    setState(state) {
        if (this.currentState === state) return;

        console.log('Changing state from', this.currentState, 'to', state);


        this.stickyElement.classList.remove('sticky-active', 'sticky-bottom');


        switch(state) {
            case 'active':
                this.stickyElement.classList.add('sticky-active');
                break;
            case 'bottom':
                this.stickyElement.classList.add('sticky-bottom');
                break;
            case 'default':

                break;
        }

        this.currentState = state;
    }


    checkCurrentState() {
        const designerFlexRect = this.designerFlexElement.getBoundingClientRect();
        const designInfoRect = this.designInfoElement.getBoundingClientRect();
        const footerRect = this.footerElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const designerFlexVisible = designerFlexRect.top < windowHeight && designerFlexRect.bottom > 0;
        const designInfoVisible = designInfoRect.top < windowHeight && designInfoRect.bottom > 0;
        const footerVisible = footerRect.top < windowHeight && footerRect.bottom > 0;

        console.log('Current visibility check:', {
            designerFlex: designerFlexVisible,
            designInfo: designInfoVisible,
            footer: footerVisible,
            windowHeight,
            designerFlexTop: designerFlexRect.top,
            designerFlexBottom: designerFlexRect.bottom,
            designInfoTop: designInfoRect.top,
            designInfoBottom: designInfoRect.bottom,
            footerTop: footerRect.top,
            footerBottom: footerRect.bottom
        });

        if (designerFlexVisible) {
            this.setState('default');
        } else if (footerVisible) {
            this.setState('bottom');
        } else if (designInfoVisible) {
            this.setState('active');
        } else {
            this.setState('default');
        }
    }

    updateOnResize() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.currentState = 'default';
        this.init();
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
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

        window.addEventListener('load', () => {
            setTimeout(() => {
                stickyObserver.checkCurrentState();
            }, 300);
        });

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                stickyObserver.checkCurrentState();
            }, 100);
        });
    } else {
        console.warn('IntersectionObserver не поддерживается в этом браузере');

        const stickyElement = document.getElementById('brandStack');
        if (stickyElement) {
            window.addEventListener('scroll', () => {
                const designerFlex = document.querySelector('.Designer_Flex');
                const designInfo = document.querySelector('.Design_Info');
                const footer = document.querySelector('.site_footer');

                if (!designerFlex || !designInfo || !footer) return;

                const designerFlexRect = designerFlex.getBoundingClientRect();
                const designInfoRect = designInfo.getBoundingClientRect();
                const footerRect = footer.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                const designerFlexVisible = designerFlexRect.top < windowHeight && designerFlexRect.bottom > 0;
                const designInfoVisible = designInfoRect.top < windowHeight && designInfoRect.bottom > 0;
                const footerVisible = footerRect.top < windowHeight && footerRect.bottom > 0;

                stickyElement.classList.remove('sticky-active', 'sticky-bottom');

                if (designerFlexVisible) {
                } else if (footerVisible) {
                    stickyElement.classList.add('sticky-bottom');
                } else if (designInfoVisible) {
                    stickyElement.classList.add('sticky-active');
                }
            });
        }
    }
});