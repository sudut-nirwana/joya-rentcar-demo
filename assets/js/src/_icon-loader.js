(function() {
  'use strict';

  /* Cache data icon agar fetch hanya terjadi 1x */
  let iconCache = null;

  /* Fungsi utama render icon */
  function loadAndRenderIcons(targetContainer = document) {
    const iconElements = targetContainer.querySelectorAll('[data-icon]');
    if (!iconElements.length) return;

    /* DIBERSIHKAN: Menggunakan filter relative_url agar URL tidak 404 saat di-deploy */
    const iconJsonUrl = "{{ '/assets/data-icon/icon.json' | relative_url }}";

    /* Gunakan cache jika data sudah pernah di-fetch */
    const fetchPromise = iconCache 
      ? Promise.resolve(iconCache)
      : fetch(iconJsonUrl).then(res => {
          if (!res.ok) throw new Error('Gagal memuat icon.json dari: ' + iconJsonUrl);
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
              // Jika val berupa path string ("M..."), bungkus dengan tag SVG bergaris tipis
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

  /* DIBERSIHKAN: Penanganan fleksibel jika script selesai dieksekusi setelah DOMReady */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => loadAndRenderIcons());
  } else {
    loadAndRenderIcons();
  }
})();
