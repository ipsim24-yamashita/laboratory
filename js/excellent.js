(() => {
  // -------------------- DOM util --------------------
  const $ = (sel, root = document) => root.querySelector(sel);

  // -------------------- Card template --------------------
  function cardHTML(c) {
    const grade = c.grade ?? "";
    const type = c.type ?? "";
    const subj = c.subject ?? "";
    const before = c.before ?? "";
    const after = c.after ?? "";
    const diff = c.diff ?? "";

    return `
      <article class="rounded-xl bg-gradient-to-b from-white to-yellow-100 shadow p-3">
        <header class="flex items-center gap-2 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M3 21V5M3 21h18" />
            <polyline points="6,15 11,10 15,13 21,7" />
          </svg>
          <h5 class="whitespace-nowrap">${grade}</h5>
        </header>

        <p class="text-gray-600 text-shadow-gray text-lg md:text-xl font-semibold text-center whitespace-nowrap">
          ${type} ${subj}
        </p>

        <div class="mt-1 text-center whitespace-nowrap leading-none">
          <span class="text-blue-600 text-shadow-blue text-2xl md:text-3xl font-semibold align-middle">${before}</span>
          <span class="text-gray-600 text-shadow-gray text-2xl md:text-3xl font-semibold align-middle">→</span>
          <span class="text-red-600 text-shadow-red text-4xl md:text-5xl font-extrabold align-middle">${after} !</span>
        </div>

        <div class="mt-1 text-center leading-none">
          <span class="text-blue-600 text-shadow-blue font-semibold text-2xl align-middle">偏差値</span>
          <br class="sm:hidden" />
          <span class="text-red-600 text-shadow-red text-4xl md:text-5xl font-extrabold align-middle whitespace-nowrap">${diff} UP</span>
        </div>
      </article>
    `;
  }

  // -------------------- Breakpoint logic --------------------
  const mqSM = window.matchMedia("(min-width: 640px)");
  const mqLG = window.matchMedia("(min-width: 1024px)");

  function computeCounts() {
    if (mqLG.matches) return { initial: 20, more1: 24 }; // lg以上：4列
    if (mqSM.matches) return { initial: 18, more1: 24 }; // sm, md：3列
    return { initial: 20, more1: 22 }; // スマホ：2列
  }

  // -------------------- Accordion helpers --------------------
  function setBtnColor(btn, expanded) {
    const clsOn = ["bg-orange-500", "hover:bg-orange-600"];
    const clsOff = ["bg-lime-500"];
    btn.classList.remove(...clsOn, ...clsOff);
    btn.classList.add(...(expanded ? clsOn : clsOff));
  }

  function expand(wrapper) {
    wrapper.style.maxHeight = wrapper.scrollHeight + "px";
  }

  function collapse(wrapper) {
    wrapper.style.maxHeight = "0px";
  }

  function syncAccordion(wrapper, btn, expanded) {
    if (expanded) {
      expand(wrapper);
      btn.setAttribute("aria-expanded", "true");
      btn.textContent = "とじる";
    } else {
      collapse(wrapper);
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = btn.id === "btn-more2" ? "もっともっと見る" : "もっと見る";
    }
    setBtnColor(btn, expanded);
  }

  // -------------------- State --------------------
  const state = {
    counts: computeCounts(),
    expanded1: false,
    expanded2: false,
    cards: [],
  };

  // -------------------- Render --------------------
  async function ensureData() {
    if (state.cards.length) return;
    const res = await fetch("Excellent_JSON.json", { cache: "no-store" });
    const data = await res.json();

    state.cards = (Array.isArray(data.cards) ? data.cards : []).map((c) => {
      const before = parseFloat(c.before);
      const after = parseFloat(c.after);
      const diff = !isNaN(before) && !isNaN(after) ? Math.round(after - before) : c.diff ?? "";
      return { ...c, diff };
    });
  }

  function sliceByCounts() {
    const { initial, more1 } = state.counts;
    const first = state.cards.slice(0, initial);
    const second = state.cards.slice(initial, initial + more1);
    const rest = state.cards.slice(initial + more1);
    return { first, second, rest };
  }

  function renderGrids() {
    const initialWrap = $("#excellent-initial");
    const more1Outer = $("#excellent-more1");
    const more1Grid = $("#excellent-more1 > div");
    const more2Outer = $("#excellent-more2");
    const more2Grid = $("#excellent-more2 > div");
    const btnMore = $("#btn-more");
    const btnMore2 = $("#btn-more2");

    const { first, second, rest } = sliceByCounts();

    initialWrap.innerHTML = first.map(cardHTML).join("");
    more1Grid.innerHTML = second.map(cardHTML).join("");
    more2Grid.innerHTML = rest.map(cardHTML).join("");

    btnMore.classList.toggle("hidden", second.length === 0);
    btnMore2.classList.toggle("hidden", rest.length === 0);

    syncAccordion(more1Outer, btnMore, state.expanded1);
    syncAccordion(more2Outer, btnMore2, state.expanded2);

    setTimeout(() => {
      if (state.expanded1) expand(more1Outer);
      if (state.expanded2) expand(more2Outer);
    }, 0);
  }

  async function renderAll() {
    await ensureData();
    renderGrids();
  }

  // -------------------- Events --------------------
  function wireButtons() {
    const more1Outer = $("#excellent-more1");
    const more2Outer = $("#excellent-more2");
    const btnMore = $("#btn-more");
    const btnMore2 = $("#btn-more2");

    btnMore.onclick = () => {
      state.expanded1 = !state.expanded1;
      syncAccordion(more1Outer, btnMore, state.expanded1);
    };
    btnMore2.onclick = () => {
      state.expanded2 = !state.expanded2;
      syncAccordion(more2Outer, btnMore2, state.expanded2);
    };

    new ResizeObserver(() => {
      if (state.expanded1) expand(more1Outer);
    }).observe($("#excellent-more1 > div"));
    new ResizeObserver(() => {
      if (state.expanded2) expand(more2Outer);
    }).observe($("#excellent-more2 > div"));
  }

  function wireBreakpointReflow() {
    const reflow = () => {
      const old = state.counts;
      const next = computeCounts();
      if (old.initial !== next.initial || old.more1 !== next.more1) {
        state.counts = next;
        renderGrids();
      }
    };
    mqSM.addEventListener("change", reflow);
    mqLG.addEventListener("change", reflow);
  }

  // -------------------- Init --------------------
  if (document.getElementById("Excellent")) {
    renderAll().then(() => {
      wireButtons();
      wireBreakpointReflow();
    });
  }
})();
