// /js/section-why.js
window.initWhy = function initWhy() {
  const root = document.getElementById('why');
  if (!root) return;

  const singleMode = root.dataset.accordion === 'single';
  const items = root.querySelectorAll('.acc-item');

  function closeAll(except = null) {
    items.forEach((it) => {
      if (it === except) return;
      const btn = it.querySelector('.acc-trigger');
      const panel = it.querySelector('.panel') || it.querySelector('.acc-panel');
      if (!btn || !panel) return;
      btn.setAttribute('aria-expanded', 'false');
      panel.classList.remove('open');
      panel.style.maxHeight = '0px';
    });
  }

  items.forEach((it) => {
    // 「画像クリックで開閉」したいなら .acc-trigger ボタンを用意する
    let btn = it.querySelector('.acc-trigger');
    let panel = it.querySelector('.panel') || it.querySelector('.acc-panel');

    // .acc-trigger が無いカードは「カード全面クリック」で開閉
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'acc-trigger sr-only';
      btn.setAttribute('aria-expanded', 'false');
      it.prepend(btn);
    }
    if (!panel) {
      panel = document.createElement('div');
      panel.className =
        'panel max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out px-4 mb-4';
      it.append(panel);
    }

    function toggle() {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if (singleMode && !expanded) closeAll(it);
      if (expanded) {
        btn.setAttribute('aria-expanded', 'false');
        panel.classList.remove('open');
        panel.style.maxHeight = '0px';
      } else {
        btn.setAttribute('aria-expanded', 'true');
        panel.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    }

    // 画像がトリガの場合は .acc-trigger を画像の手前に置く（今回はカード全体をクリック可能に）
    it.addEventListener('click', (e) => {
      // ボタンやリンクのクリックは除外
      if (
        (e.target.closest('a') || e.target.closest('button')) &&
        !e.target.classList.contains('acc-trigger')
      )
        return;
      toggle();
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
};
