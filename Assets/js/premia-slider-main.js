class UniversalSlider {
  constructor({
    slidesSelector,
    imgSelector,
    prevBtnSelector,
    nextBtnSelector,
    dotsContainerSelector,
    btnSelector
  }) {
    this.slides = document.querySelector(slidesSelector);
    this.images = document.querySelectorAll(imgSelector);
    this.prevBtn = document.querySelector(prevBtnSelector);
    this.nextBtn = document.querySelector(nextBtnSelector);
    this.dotsContainer = document.querySelector(dotsContainerSelector);
    this.buttons = document.querySelectorAll(btnSelector);
    this.currentIndex = 0;
    this.startX = 0;
    this.moveX = 0;

    this.init();
  }

  init() {
    const slidesHeight = this.slides.offsetHeight;
    this.buttons.forEach(btn => btn.style.height = slidesHeight  + 'px');
    this.drawDots();
    this.goToSlide(0);
    this.prevBtn.onclick = () => this.prevSlide();
    this.nextBtn.onclick = () => this.nextSlide();
    window.addEventListener('resize', () => this.handleResize());
    this.handleResize();

    this.slides.addEventListener('touchstart', e => {
      this.startX = e.touches[0].clientX;
    }, {passive:true});
    this.slides.addEventListener('touchmove', e => {
      this.moveX = e.touches[0].clientX;
    }, {passive:true});
    this.slides.addEventListener('touchend', () => {
      if (Math.abs(this.moveX - this.startX) > 60) {
        if (this.moveX < this.startX) this.nextSlide();
        else this.prevSlide();
      }
      this.startX = this.moveX = 0;
    });
  }

  drawDots() {
    this.dotsContainer.innerHTML = '';
    this.images.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === this.currentIndex) dot.classList.add('active');
      this.dotsContainer.appendChild(dot);
      dot.addEventListener('click', () => this.goToSlide(i));
    });
  }

  goToSlide(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.images.length - 1));
    this.slides.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    this.drawDots();
  }

  nextSlide() { this.goToSlide(this.currentIndex + 1); }
  prevSlide() { this.goToSlide(this.currentIndex - 1); }

  handleResize() {
    if (window.innerWidth >= 768) {
      this.prevBtn.style.display = '';
      this.nextBtn.style.display = '';
    } else {
      this.prevBtn.style.display = 'none';
      this.nextBtn.style.display = 'none';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
      const slider1 = new UniversalSlider({
        slidesSelector: '.slider .slides',
        imgSelector: '.slider .slides img',
        prevBtnSelector: '.slider .btn-prev',
        nextBtnSelector: '.slider .btn-next',
        dotsContainerSelector: '.slider .slider-dots',
        btnSelector: '.slider .btn-prev, .slider .btn-next'
      });

      const slider2 = new UniversalSlider({
        slidesSelector: '.slider2 .slides',
        imgSelector: '.slider2 .slides img',
        prevBtnSelector: '.slider2 .btn-prev',
        nextBtnSelector: '.slider2 .btn-next',
        dotsContainerSelector: '.slider2 .slider-dots',
        btnSelector: '.slider2 .btn-prev, .slider2 .btn-next'
      });

      const slider3 = new UniversalSlider({
        slidesSelector: '.slider3 .slides',
        imgSelector: '.slider3 .slides img',
        prevBtnSelector: '.slider3 .btn-prev',
        nextBtnSelector: '.slider3 .btn-next',
        dotsContainerSelector: '.slider3 .slider-dots',
        btnSelector: '.slider3 .btn-prev, .slider3 .btn-next'
      });

      const slider4 = new UniversalSlider({
        slidesSelector: '.slider4 .slides',
        imgSelector: '.slider4 .slides img',
        prevBtnSelector: '.slider4 .btn-prev',
        nextBtnSelector: '.slider4 .btn-next',
        dotsContainerSelector: '.slider4 .slider-dots',
        btnSelector: '.slider4 .btn-prev, .slider4 .btn-next'
      });
    });