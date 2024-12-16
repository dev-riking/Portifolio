let currentIndex = 0;
const slides = document.querySelectorAll('.frase');
const totalSlides = slides.length;

function updateCarousel() {
    const carrossel = document.querySelector('.carrossel');
    carrossel.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function moveSlide(step) {
    currentIndex += step;

    if (currentIndex < 0) {
        currentIndex = totalSlides - 1;
    } else if (currentIndex >= totalSlides) {
        currentIndex = 0;
    }

    updateCarousel();
}

// Muda a frase a cada 10 segundos (10000 milissegundos)
setInterval(() => {
    moveSlide(1);  // Passa para o próximo slide
}, 10000);

