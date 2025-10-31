(() => {
  const topBtn = document.getElementById("backToTop");
  if (!topBtn) return;

  function isSmallScreen() {
    return window.matchMedia("(max-width: 767px)").matches;
  }

  function toggleButton() {
    if (!isSmallScreen()) {
      topBtn.classList.add("opacity-0", "pointer-events-none");
      return;
    }

    if (window.scrollY > 4000) {
      topBtn.classList.remove("opacity-0", "pointer-events-none");
      topBtn.classList.add("opacity-100");
    } else {
      topBtn.classList.add("opacity-0", "pointer-events-none");
      topBtn.classList.remove("opacity-100");
    }
  }

  window.addEventListener("scroll", toggleButton);
  window.addEventListener("resize", toggleButton);

  topBtn.addEventListener("click", () => {
    if (isSmallScreen()) window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
