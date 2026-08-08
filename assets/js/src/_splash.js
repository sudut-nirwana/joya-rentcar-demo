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
