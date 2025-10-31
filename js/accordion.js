(() => {
  const root = document.getElementById("reasons");
  const singleMode = root?.dataset.accordion === "single";
  const items = document.querySelectorAll(".acc-item");

  function closeAll(except = null) {
    items.forEach((it) => {
      if (it === except) return;
      const btn = it.querySelector(".acc-trigger");
      const panel = it.querySelector(".panel");
      if (!btn || !panel) return;
      btn.setAttribute("aria-expanded", "false");
      panel.classList.remove("open");
      panel.style.maxHeight = "0px";
    });
  }

  items.forEach((it) => {
    const btn = it.querySelector(".acc-trigger");
    const panel = it.querySelector(".panel");
    if (!btn || !panel) return;
    btn.type = "button";

    function toggle() {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      if (singleMode && !expanded) closeAll(it);
      if (expanded) {
        btn.setAttribute("aria-expanded", "false");
        panel.classList.remove("open");
        panel.style.maxHeight = "0px";
      } else {
        btn.setAttribute("aria-expanded", "true");
        panel.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    }

    btn.addEventListener("click", toggle);
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });

    btn.setAttribute("aria-expanded", "false");
    panel.style.maxHeight = "0px";
  });

  window.addEventListener("resize", () => {
    document.querySelectorAll(".panel.open").forEach((panel) => {
      panel.style.maxHeight = panel.scrollHeight + "px";
    });
  });
})();
