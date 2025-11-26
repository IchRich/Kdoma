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

        /* --- Создаём точки --- */
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

        /* --- Функция обновления слайда --- */
        function updateSlider() {
            wrapper.style.transform = `translateX(-${index * 100}%)`;

            dots.forEach(dot => dot.classList.remove("active"));
            dots[index].classList.add("active");
        }

        /* --- Клик назад --- */
        btnPrev.addEventListener("click", () => {
            index = (index - 1 + total) % total;
            updateSlider();
        });

        /* --- Клик вперёд --- */
        btnNext.addEventListener("click", () => {
            index = (index + 1) % total;
            updateSlider();
        });

    });

});
