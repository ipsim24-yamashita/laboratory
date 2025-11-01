// section-reasons.js
window.initReasons = function initReasons() {
  const root = document.getElementById('reasons');
  if (!root) return;
  const singleMode = root.dataset.accordion === 'single';
  const items = root.querySelectorAll('.acc-item');

  function closeAll(except = null) {
    items.forEach((it) => {
      if (it === except) return;
      const btn = it.querySelector('.acc-trigger');
      const panel = it.querySelector('.acc-panel');
      btn.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
    });
  }

  items.forEach((it) => {
    const btn = it.querySelector('.acc-trigger');
    const panel = it.querySelector('.acc-panel');
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if (singleMode) closeAll(it);
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
  });

  console.log('✅ Reasons section initialized');
};
