// /js/include-loader.js
(() => {
  const cache = new Map(); // URL -> Promise<string>

  async function fetchText(url) {
    if (!cache.has(url)) {
      cache.set(
        url,
        fetch(`${url}?v=20251031`, { cache: 'no-cache' }).then((r) => {
          if (!r.ok) throw new Error(`${url} -> ${r.status}`);
          return r.text();
        })
      );
    }
    return cache.get(url);
  }

  function execInlineScripts(container) {
    container.querySelectorAll('script').forEach((old) => {
      const s = document.createElement('script');
      [...old.attributes].forEach((a) => s.setAttribute(a.name, a.value));
      s.textContent = old.textContent ?? '';
      old.replaceWith(s);
    });
  }

  async function processHost(el) {
    const src = el.getAttribute('data-include');
    const initName = el.getAttribute('data-init');
    const html = await fetchText(src);

    const tmp = document.createElement('div');
    tmp.innerHTML = html;

    // ネストした include にも対応
    const nested = [...tmp.querySelectorAll('[data-include]')];

    el.replaceWith(...tmp.childNodes);
    execInlineScripts(document);

    await Promise.all(nested.map(processHost));

    if (initName && typeof window[initName] === 'function') {
      window[initName]();
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const hosts = [...document.querySelectorAll('[data-include]')];
    await Promise.all(hosts.map(processHost));
  });
})();
