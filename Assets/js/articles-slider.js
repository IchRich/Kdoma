const slides = document.querySelector('.slides');
const images = document.querySelectorAll('.slides img');
const prevBtn = document.querySelector('.btn-prev');
const nextBtn = document.querySelector('.btn-next');
const dotsContainer = document.querySelector('.slider-dots');
let currentIndex = 0;
let startX = 0, moveX = 0;

const slidesHeight = document.querySelector('.slides').offsetHeight;
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => btn.style.height = slidesHeight + 'px');

function drawDots() {
  dotsContainer.innerHTML = '';
  images.forEach((_,i) => {
    let dot = document.createElement('span');
    if (i === currentIndex) dot.classList.add('active');
    dotsContainer.appendChild(dot);
    dot.addEventListener('click', () => goToSlide(i));
  });
}

function goToSlide(index) {
  currentIndex = Math.max(0, Math.min(index, images.length-1));
  slides.style.transform = `translateX(-${currentIndex*100}%)`;
  drawDots();
}

function nextSlide() { goToSlide(currentIndex+1); }
function prevSlide() { goToSlide(currentIndex-1); }

nextBtn.onclick = nextSlide;
prevBtn.onclick = prevSlide;

function handleResize() {
  if (window.innerWidth > 1024) {
    prevBtn.style.display = '';
    nextBtn.style.display = '';
  } else {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }
}
handleResize();
window.addEventListener('resize', handleResize);

slides.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
}, {passive:true});
slides.addEventListener('touchmove', e => {
  moveX = e.touches[0].clientX;
}, {passive:true});
slides.addEventListener('touchend', () => {
  if (Math.abs(moveX - startX) > 60) {
    if (moveX < startX) nextSlide();
    else prevSlide();
  }
  startX = moveX = 0;
});

drawDots();
goToSlide(0);
