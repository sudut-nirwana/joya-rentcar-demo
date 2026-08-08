(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('armadaGrid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.armada-card'));
    const filterBtns = document.querySelectorAll('.filter-btn');
    const toggleWrapper = document.querySelector('.armada-toggle-wrapper');
    const toggleBtn = document.getElementById('armadaToggleBtn');
    const toggleBtnText = toggleBtn ? toggleBtn.querySelector('.btn-text') : null;

    let currentFilter = 'all';
    let isExpanded = false;

    /* Get Limit Threshold based on Screen Width */
    function getDisplayLimit() {
      const width = window.innerWidth;
      if (width <= 768) return 6;       // Mobile
      if (width <= 1200) return 9;      // Tablet
      return Infinity;                  // Desktop (Show All)
    }

    /* Apply Filter and Limit Rules */
    function updateVisibility() {
      const limit = getDisplayLimit();
      
      // Filter matching cards
      const matchedCards = cards.filter(card => {
        const category = card.getAttribute('data-category');
        return currentFilter === 'all' || category === currentFilter;
      });

      // Hide all cards first
      cards.forEach(card => card.classList.add('is-hidden'));

      // Display cards based on limit/expand state
      matchedCards.forEach((card, index) => {
        if (isExpanded || index < limit) {
          card.classList.remove('is-hidden');
        }
      });

      // Manage Toggle Button Visibility
      if (toggleWrapper) {
        if (matchedCards.length > limit && limit !== Infinity) {
          toggleWrapper.classList.remove('is-hidden');
        } else {
          toggleWrapper.classList.add('is-hidden');
        }
      }
    }

    /* Category Filter Click Event */
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentFilter = btn.getAttribute('data-filter');
        isExpanded = false;

        if (toggleBtn) {
          toggleBtn.classList.remove('is-expanded');
          toggleBtn.setAttribute('aria-expanded', 'false');
          if (toggleBtnText) toggleBtnText.textContent = 'Lihat Semua Armada';
        }

        updateVisibility();
      });
    });

    /* Toggle Show All / Collapsed Event */
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        toggleBtn.classList.toggle('is-expanded', isExpanded);
        toggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        
        if (toggleBtnText) {
          toggleBtnText.textContent = isExpanded ? 'Sembunyikan Armada' : 'Lihat Semua Armada';
        }

        updateVisibility();
      });
    }

    /* Recalculate on Resize */
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateVisibility, 150);
    });

    /* Initial Render */
    updateVisibility();
  });
})();
