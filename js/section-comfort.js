// /js/section-comfort.js
window.initComfort = function initComfort() {
  const sec = document.getElementById('comfort');
  if (!sec) return;

  console.log('✅ Comfort section initialized');

  // スクロール時にフェードインする例（必要なら）
  const reveals = sec.querySelectorAll('.reveal');
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

  reveals.forEach((el) => {
    el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700');
    observer.observe(el);
  });
};
