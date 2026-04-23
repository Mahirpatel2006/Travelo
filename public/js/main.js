// public/js/main.js — Global UI behaviors

document.addEventListener('DOMContentLoaded', function () {
  // ── Mobile Navbar Toggle ──
  const navbar = document.querySelector('.header .navbar');
  const menuBtn = document.querySelector('#menu-btn');
  const closeBtn = document.querySelector('#close-navbar');

  if (menuBtn && navbar) {
    menuBtn.addEventListener('click', () => navbar.classList.add('active'));
  }
  if (closeBtn && navbar) {
    closeBtn.addEventListener('click', () => navbar.classList.remove('active'));
  }

  // Close mobile nav on scroll
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.remove('active');
  });

  // ── About Page: Image Switcher ──
  const controlBtns = document.querySelectorAll('.about .controls .control-btn');
  const aboutImage = document.querySelector('.about .image-container .image');
  if (controlBtns.length && aboutImage) {
    controlBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-src');
        if (src) aboutImage.src = src;
      });
    });
  }

  // ── Review Slider (home page only) ──
  const slides = document.querySelectorAll('.book .slide');
  if (slides.length > 0) {
    let index = 0;

    function nextSlide() {
      slides[index].classList.remove('active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('active');
    }

    function prevSlide() {
      slides[index].classList.remove('active');
      index = (index - 1 + slides.length) % slides.length;
      slides[index].classList.add('active');
    }

    // Expose to global scope for inline onclick handlers
    window.next = nextSlide;
    window.prev = prevSlide;

    // Auto-scroll reviews every 5 seconds
    setInterval(nextSlide, 5000);
  }
});
