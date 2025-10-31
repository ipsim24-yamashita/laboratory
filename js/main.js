(() => {
  const $ = (sel, root = document) => root.querySelector(sel);

  function cardHTML(c) {
    const { grade = "", type = "", subject = "", before = "", after = "", diff = "" } = c;
    return `
      <article class="rounded-xl bg-gradient-to-b from-white to-yellow-100 shadow p-3">
        <header class="flex items-center gap-2 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 21V5M3 21h18" />
            <polyline points="6,15 11,10 15,13 21,7" />
          </svg>
          <h5 class="whitespace-nowrap">${grade}</h5>
        </header>
        <p class="text-gray-600 text-shadow-gray text-lg md:text-xl font-semibold text-center whitespace-nowrap">
          ${type} ${subject}
        </p>
        <div class="mt-1 text-center whitespace-nowrap leading-none">
          <span class="text-blue-600 text-shadow-blue text-2xl md:text-3xl font-semibold">${before}</span>
          <span class="text-gray-600 text-shadow-gray text-2xl md:text-3xl font-semibold">→</span>
          <span class="text-red-600 text-shadow-red text-4xl md:text-5xl font-extrabold">${after} !</span>
        </div>
        <div class="mt-1 text-center leading-none">
          <span class="text-blue-600 text-shadow-blue font-semibold text-2xl">偏差値</span>
          <br class="sm:hidden" />
          <span class="text-red-600 text-shadow-red text-4xl md:text-5xl font-extrabold whitespace-nowrap">${diff} UP</span>
        </div>
      </article>
    `;
  }

  const mqSM = window.matchMedia("(min-width: 640px)");
  const mqLG = window.matchMedia("(min-width: 1024px)");

  function computeCounts() {
    if (mqLG.matches) return { initial: 20, more1: 24 };
    if (mqSM.matches) return { initial: 18, more1: 24 };
    return { initial: 20, more1: 22 };
  }

  const state = { counts: computeCounts(), expanded1: false, expanded2: false, cards: [] };

  async function ensureData() {
    if (state.cards.length) return;
    const res = await fetch("Excellent_JSON.json", { cache: "no-store" });
    const data = await res.json();
    state.cards = (data.cards || []).map((c) => {
      const before = parseFloat(c.before);
      const after = parseFloat(c.after);
      const diff = !isNaN(before) && !isNaN(after) ? Math.round(after - before) : c.diff ?? "";
      return { ...c, diff };
    });
  }

  function renderGrids() {
    const { initial, more1 } = state.counts;
    const first = state.cards.slice(0, initial);
    const second = state.cards.slice(initial, initial + more1);
    const rest = state.cards.slice(initial + more1);

    $("#excellent-initial").innerHTML = first.map(cardHTML).join("");
    $("#excellent-more1 > div").innerHTML = second.map(cardHTML).join("");
    $("#excellent-more2 > div").innerHTML = rest.map(cardHTML).join("");

    $("#btn-more").classList.toggle("hidden", !second.length);
    $("#btn-more2").classList.toggle("hidden", !rest.length);
  }

  async function renderAll() {
    await ensureData();
    renderGrids();
  }

  document.addEventListener("DOMContentLoaded", () => {
    if ($("#Excellent")) renderAll();
  });
})();
