// /js/section-access-inagawa.js
window.initAccessInagawa = function initAccessInagawa() {
  const sec = document.getElementById('inagawa');
  if (!sec) return;

  console.log('✅ Access Inagawa section initialized');

  // Google Map iframe の遅延読み込み
  const iframe = sec.querySelector('iframe');
  if (iframe && !iframe.src.includes('output=embed')) {
    const src = iframe.dataset.src || iframe.src;
    iframe.src = src;
  }

  // Reveal animation
  const reveals = sec.querySelectorAll('.reveal');
  reveals.forEach((el) => {
    el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    },
    { threshold: 0.1 }
  );

  reveals.forEach((el) => observer.observe(el));
};
