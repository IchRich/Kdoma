document.addEventListener("DOMContentLoaded", () => {

    const sliders = document.querySelectorAll("[data-slider]");

    sliders.forEach((sliderContainer) => {
        const slider = sliderContainer.querySelector(".slider");
        const wrapper = slider.querySelector(".slider-wrapper");
        const slides = slider.querySelectorAll(".slide");

        const btnPrev = slider.querySelector(".btn_slider.prev");
        const btnNext = slider.querySelector(".btn_slider.next");
        const dotsContainer = slider.querySelector(".slider-dots");

        let index = 0;
        const total = slides.length;

        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let dragOffset = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement("div");
            dot.classList.add("slider-dot");
            if (i === 0) dot.classList.add("active");

            dot.addEventListener("click", () => {
                index = i;
                updateSlider();
            });

            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll(".slider-dot");

        function updateSlider(animate = true) {
            if (animate) {
                wrapper.style.transition = "transform 0.35s ease";
            } else {
                wrapper.style.transition = "none";
            }

            wrapper.style.transform = `translateX(-${index * 100}%)`;

            dots.forEach(dot => dot.classList.remove("active"));
            if (dots[index]) {
                dots[index].classList.add("active");
            }
        }

        btnPrev.addEventListener("click", () => {
            index = (index - 1 + total) % total;
            updateSlider();
        });

        btnNext.addEventListener("click", () => {
            index = (index + 1) % total;
            updateSlider();
        });

        function handleTouchStart(e) {
            startX = e.touches ? e.touches[0].clientX : e.clientX;
            currentX = startX;
            isDragging = true;
            dragOffset = 0;
            wrapper.style.transition = "none";
        }

        function handleTouchMove(e) {
            if (!isDragging) return;

            currentX = e.touches ? e.touches[0].clientX : e.clientX;
            dragOffset = currentX - startX;

            const maxOffset = slider.offsetWidth * 0.3;
            dragOffset = Math.max(-maxOffset, Math.min(maxOffset, dragOffset));

            wrapper.style.transform = `translateX(calc(-${index * 100}% + ${dragOffset}px))`;
        }

        function handleTouchEnd() {
            if (!isDragging) return;
            isDragging = false;

            const threshold = slider.offsetWidth * 0.15;

            if (Math.abs(dragOffset) > threshold) {
                if (dragOffset < 0) {
                    index = (index + 1) % total;
                } else {
                    index = (index - 1 + total) % total;
                }
            }

            updateSlider(true);
        }

        slider.addEventListener("touchstart", handleTouchStart, { passive: true });
        slider.addEventListener("touchmove", handleTouchMove, { passive: true });
        slider.addEventListener("touchend", handleTouchEnd);

        slider.addEventListener("mousedown", handleTouchStart);
        slider.addEventListener("mousemove", (e) => {
            if (isDragging) {
                e.preventDefault();
                handleTouchMove(e);
            }
        });
        slider.addEventListener("mouseup", handleTouchEnd);
        slider.addEventListener("mouseleave", handleTouchEnd);

        function handleResize() {
            updateSlider(false);
        }

        window.addEventListener("resize", handleResize);

        // Инициализация
        updateSlider(false);

    });

});