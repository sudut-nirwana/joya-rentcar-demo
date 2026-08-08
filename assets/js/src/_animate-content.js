(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    /* Selector membaca semua class yang mengandung 'animate-' */
    const animateElements = document.querySelectorAll('[class*="animate-"]');

    if (!animateElements.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -15% 0px',
      threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animateElements.forEach(el => animationObserver.observe(el));
  });
})();
