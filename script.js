(() => {
  const frames = Array.from(document.querySelectorAll("[data-parallax-speed]"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let animationFrame = 0;

  const update = () => {
    animationFrame = 0;

    frames.forEach((frame) => {
      const image = frame.querySelector(".parallax-image");
      if (!image) return;

      if (reducedMotion.matches) {
        image.style.transform = "translate3d(0, 0, 0)";
        return;
      }

      const rect = frame.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.bottom < 0 || rect.top > viewportHeight) return;

      const scrollSection = frame.parentElement || frame;
      const sectionRect = scrollSection.getBoundingClientRect();
      const sectionTop = window.scrollY + sectionRect.top;
      const scrollStart = sectionTop - viewportHeight;
      const scrollEnd = sectionTop + sectionRect.height;
      const rawProgress = (window.scrollY - scrollStart) / (scrollEnd - scrollStart);
      const progress = Math.min(1, Math.max(0, rawProgress));
      const speed = Number(frame.dataset.parallaxSpeed || 54);
      const offset = (progress - 0.5) * speed * 2;

      image.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  };

  const requestUpdate = () => {
    if (!animationFrame) animationFrame = window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  reducedMotion.addEventListener("change", requestUpdate);
})();
