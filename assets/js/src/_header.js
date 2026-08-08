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
