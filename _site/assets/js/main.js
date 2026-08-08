// 1. CORE & SYSTEM FOUNDATIONS
(function() {
  'use strict';

  /* Cache data icon agar fetch hanya terjadi 1x */
  let iconCache = null;

  /* Fungsi utama render icon */
  function loadAndRenderIcons(targetContainer = document) {
    const iconElements = targetContainer.querySelectorAll('[data-icon]');
    if (!iconElements.length) return;

    const iconJsonUrl = '/assets/data-icon/icon.json';

    /* Gunakan cache jika data sudah pernah di-fetch */
    const fetchPromise = iconCache 
      ? Promise.resolve(iconCache)
      : fetch(iconJsonUrl).then(res => {
          if (!res.ok) throw new Error('Gagal memuat icon.json');
          return res.json();
        });

    fetchPromise
      .then(iconData => {
        iconCache = iconData; /* Simpan ke cache */

        iconElements.forEach(el => {
          const iconName = el.getAttribute('data-icon');
          const val = iconData[iconName];

          if (val) {
            // Jika val sudah berupa tag <svg>, langsung masukkan
            if (typeof val === 'string' && val.trim().startsWith('<svg')) {
              el.innerHTML = val;
            } else {
              // Jika val berupa path string ("M..."), bungkus dengan tag SVG bergaris tipis & auto 1em
              el.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" 
                     viewBox="0 0 24 24" 
                     width="1.3em" 
                     height="1.3em" 
                     fill="none" 
                     stroke="currentColor" 
                     stroke-width="1.5" 
                     stroke-linecap="round" 
                     stroke-linejoin="round">
                  <path d="${val}"></path>
                </svg>
              `.trim();
            }
          }
        });
      })
      .catch(err => console.error('Icon Loader Error:', err));
  }

  /* Expose ke global window agar bisa dipanggil saat ada elemen dinamis baru */
  window.renderIcons = loadAndRenderIcons;

  /* Auto run saat halaman pertama selesai di-load */
  document.addEventListener('DOMContentLoaded', () => {
    loadAndRenderIcons();
  });
})();


// 2. INTERACTIVE COMPONENTS & UTILITIES
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('splash-screen');
    const logoImg = document.getElementById('splash-logo-img');

    if (!splash || !logoImg) return;

    /* 1. Preload Logo terlebih dahulu agar tidak terkesan patah/kosong */
    const imgLoader = new Image();
    imgLoader.src = logoImg.src;

    const startSequence = () => {
      /* Step 1: Layar Hitam + Siluet Tawon sudah standby, Munculkan Garis Cahaya */
      setTimeout(() => {
        splash.classList.add('start-line');
      }, 200);

      /* Step 2: Redupkan Garis Cahaya */
      setTimeout(() => {
        splash.classList.add('fade-line');
      }, 1000);

      /* Step 3: Munculkan Logo Emas */
      setTimeout(() => {
        splash.classList.add('show-logo');
      }, 1400);

      /* Step 4: Dispersi Kunang-kunang + Logo Membesar Melayang Menghilang */
      setTimeout(() => {
        splash.classList.add('disperse-exit');
      }, 3000);

      /* Step 5: Hapus Element dari DOM setelah animasi selesai total */
      setTimeout(() => {
        splash.remove();
      }, 4000);
    };

    /* Eksekusi alur begitu gambar logo terkonfirmasi tuntas ter-load */
    if (imgLoader.complete) {
      startSequence();
    } else {
      imgLoader.onload = startSequence;
      /* Fallback antisipasi koneksi lambat */
      imgLoader.onerror = startSequence;
    }
  });
})();

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    const siteHeader = document.getElementById('siteHeader');
    const menuToggle = document.getElementById('menuToggle');
    const sidebarDrawer = document.getElementById('sidebarDrawer');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarClose = document.getElementById('sidebarClose');

    /* ===== 1. SIDEBAR DRAWER TOGGLE ===== */
    function openSidebar() {
      if (sidebarDrawer) sidebarDrawer.classList.add('is-active');
      if (sidebarOverlay) sidebarOverlay.classList.add('is-active');
      if (menuToggle) menuToggle.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      if (sidebarDrawer) sidebarDrawer.classList.remove('is-active');
      if (sidebarOverlay) sidebarOverlay.classList.remove('is-active');
      if (menuToggle) menuToggle.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    if (menuToggle) {
      menuToggle.addEventListener('click', function() {
        if (sidebarDrawer && sidebarDrawer.classList.contains('is-active')) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });
    }

    if (sidebarClose) {
      sidebarClose.addEventListener('click', closeSidebar);
    }

    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', closeSidebar);
    }

    /* ===== 2. SIDEBAR LINK CLICK & SMOOTH SCROLL ===== */
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');

        // Cek apakah link mengarah ke anchor internal halaman (diawali '#')
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();

          // Set kelas active untuk link yang diklik
          sidebarLinks.forEach(l => l.classList.remove('active'));
          this.classList.add('active');

          // 1. Tutup sidebar terlebih dahulu
          closeSidebar();

          // 2. Beri jeda (300ms) agar animasi sidebar menutup selesai, baru jalankan smooth scroll
          setTimeout(() => {
            if (targetId === '#') {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            } else {
              const targetElement = document.querySelector(targetId);
              if (targetElement) {
                // Hitung posisi target dikurangi tinggi header agar tidak tertutup header
                const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
                });
              }
            }
          }, 300); // 300ms menyesuaikan durasi transisi CSS sidebar
        }
      });
    });

    /* ===== 3. HEADER SCROLL BACKDROP EFFECT ===== */
    window.addEventListener('scroll', function() {
      if (window.scrollY > 30) {
        if (siteHeader) siteHeader.classList.add('is-scrolled');
      } else {
        if (siteHeader) siteHeader.classList.remove('is-scrolled');
      }
    });

    /* ===== 4. DESKTOP NAVIGATION HOVER & DIM INTERACTION ===== */
    const desktopNavList = document.getElementById('desktopNavList');
    if (desktopNavList) {
      const navLinks = desktopNavList.querySelectorAll('.nav-link');

      navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
          navLinks.forEach(otherLink => {
            if (otherLink !== link) {
              otherLink.classList.add('is-dimmed');
            } else {
              otherLink.classList.remove('is-dimmed');
            }
          });
        });
      });

      desktopNavList.addEventListener('mouseleave', function() {
        navLinks.forEach(link => {
          link.classList.remove('is-dimmed');
        });
      });
    }
  });

})();

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

