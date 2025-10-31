document.addEventListener("DOMContentLoaded", () => {
  const iframes = document.querySelectorAll("#yamashita iframe, #inagawa iframe");
  if (iframes.length === 0) return;

  iframes.forEach((iframe) => {
    const mapSrc = iframe.getAttribute("src");
    iframe.removeAttribute("src");

    const loadIframe = () => {
      if (iframe.dataset.loaded === "1") return;
      iframe.dataset.loaded = "1";
      iframe.src = mapSrc;
    };

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadIframe();
              obs.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "400px", threshold: 0.01 }
      );
      io.observe(iframe);
    } else {
      loadIframe(); // fallback
    }
  });
});
