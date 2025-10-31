(() => {
  const els = document.querySelectorAll(".reveal");
  const BASE_DURATION = 1200;

  els.forEach((el) => {
    const dur = Number(el.dataset.duration) || BASE_DURATION;
    const delay = Number(el.dataset.delay) || 0;

    el.classList.add(
      "opacity-0",
      "transition",
      "will-change-[transform,opacity,filter]",
      "ease-out"
    );
    el.style.transitionDuration = dur + "ms";
    el.style.transitionDelay = delay + "ms";

    if (el.classList.contains("fade-up")) el.classList.add("translate-y-6");
    if (el.classList.contains("slide-left")) el.classList.add("-translate-x-6");
    if (el.classList.contains("zoom-in")) el.classList.add("scale-95");
    if (el.classList.contains("flip-up")) el.classList.add("rotate-x-6", "origin-bottom");
    if (el.classList.contains("blur-in")) el.classList.add("blur-sm");
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.remove(
          "opacity-0",
          "translate-y-6",
          "-translate-x-6",
          "scale-95",
          "rotate-x-6",
          "blur-sm"
        );
        el.classList.add(
          "opacity-100",
          "translate-y-0",
          "translate-x-0",
          "scale-100",
          "rotate-x-0",
          "blur-0"
        );
        io.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -20% 0px" }
  );
  els.forEach((el) => io.observe(el));

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach((el) => {
      el.classList.remove("transition");
      el.style.transition = "none";
    });
  }
})();
