(function() {
  'use strict';

  /* ==========================================================================
     SN UI KIT v1.0 - utilities-sn.js (Production Ready)
     ========================================================================== */

  /* --------------------------------------------------------------------------
     1. SN-ICON LOADER (WITH FALLBACK & SINGLETON FETCH)
     Cara pake di HTML : <i class="sn-icon" data-icon="nama_icon"></i>
     Cara panggil AJAX : window.renderIcons(document.querySelector('#konten-baru'));
     -------------------------------------------------------------------------- */
  let iconPromise = null;

  // Fallback SVG (Icon help-circle) jika fetch gagal atau iconName tidak ditemukan
  const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.3em" height="1.3em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;

  function loadAndRenderIcons(targetContainer = document) {
    // Hanya proses elemen yang belum dirender
    const iconElements = targetContainer.querySelectorAll('[data-icon]:not([data-icon-loaded])');
    if (!iconElements.length) return;

    const iconJsonUrl = '/assets/data-icon/icon.json';

    // Singleton Promise: Fetch JSON hanya 1x secara efisien
    if (!iconPromise) {
      iconPromise = fetch(iconJsonUrl)
        .then(res => {
          if (!res.ok) throw new Error('Gagal memuat icon.json');
          return res.json();
        })
        .catch(err => {
          iconPromise = null; // Reset promise jika ada kesalahan jaringan
          console.error('SN-Icon Fetch Error:', err);
          return null; // Return null agar catch ter-handle di langkah berikutnya
        });
    }

    iconPromise.then(iconData => {
      iconElements.forEach(el => {
        const iconName = el.getAttribute('data-icon');

        // Tandai elemen agar tidak diproses ulang
        el.setAttribute('data-icon-loaded', 'true');

        // Kasus 1: Fetch JSON gagal
        if (!iconData) {
          el.innerHTML = FALLBACK_SVG;
          return;
        }

        const val = iconData[iconName];

        // Kasus 2: Icon ditemukan
        if (val) {
          if (typeof val === 'string' && val.trim().startsWith('<svg')) {
            el.innerHTML = val;
          } else {
            el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.3em" height="1.3em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${val}"></path></svg>`;
          }
        } 
        // Kasus 3: Key icon tidak ada di JSON (Typo / Missing)
        else {
          console.warn(`SN-Icon Warning: Icon "${iconName}" tidak ditemukan di icon.json`);
          el.innerHTML = FALLBACK_SVG;
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     2. SN-ANIMATE ON SCROLL
     Cara pake di HTML : <div class="sn-animate-slideup">...</div>
     Cara panggil AJAX : window.snInitAnimate(document.querySelector('#konten-baru'));
     -------------------------------------------------------------------------- */
  function initAnimate(targetContainer = document) {
    // Abaikan elemen yang sudah terlihat
    const animateElements = targetContainer.querySelectorAll('[class*="sn-animate-"]:not(.is-visible)');
    if (!animateElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -15% 0px', threshold: 0.1 });

    animateElements.forEach(el => observer.observe(el));
  }

  /* --------------------------------------------------------------------------
     3. SN-COUNTER (FLUID 60FPS VIA REQUESTANIMATIONFRAME)
     Cara pake di HTML : <span class="sn-counter" data-target="15000">0</span>
     Cara panggil AJAX : window.snInitCounter(document.querySelector('#konten-baru'));
     -------------------------------------------------------------------------- */
  function initCounter(targetContainer = document) {
    // Abaikan counter yang sudah selesai diproses
    const counterElements = targetContainer.querySelectorAll('.sn-counter:not(.is-counted)');
    if (!counterElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('is-counted');

          const target = +el.getAttribute('data-target') || 0;
          const duration = 2000;
          let startTime = null;

          const easeOutQuad = t => t * (2 - t);

          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easedProgress = easeOutQuad(progress);

            const currentCount = Math.floor(easedProgress * target);
            el.innerText = currentCount.toLocaleString('id-ID');

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              el.innerText = target.toLocaleString('id-ID');
            }
          };

          requestAnimationFrame(animate);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => observer.observe(el));
  }

  /* --------------------------------------------------------------------------
     4. EXPOSE GLOBAL APIS (DUKUNGAN AJAX & DYNAMIC CONTENT)
     -------------------------------------------------------------------------- */
  window.renderIcons = loadAndRenderIcons;
  window.snInitAnimate = initAnimate;
  window.snInitCounter = initCounter;

  /* --------------------------------------------------------------------------
     5. INITIALIZE ALL ON LOAD
     -------------------------------------------------------------------------- */
  function initAll() {
    loadAndRenderIcons();
    initAnimate();
    initCounter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

})();
