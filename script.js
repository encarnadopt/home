const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

document.querySelectorAll(".photo-carousel").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const previous = carousel.querySelector(".carousel-button-prev");
  const next = carousel.querySelector(".carousel-button-next");
  const slides = Array.from(track?.querySelectorAll("img") || []);

  if (!track || !previous || !next || slides.length === 0) {
    return;
  }

  let activeIndex = 0;
  let autoPlay;
  let scrollTimer;

  const clampIndex = (index) => (index + slides.length) % slides.length;

  const centerSlide = (index, behavior = "smooth") => {
    activeIndex = clampIndex(index);
    const slide = slides[activeIndex];
    const left = slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2;

    track.scrollTo({
      left,
      behavior,
    });
  };

  const updateActiveFromScroll = () => {
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
      const distance = Math.abs(trackCenter - slideCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    activeIndex = closestIndex;
  };

  const goNext = () => {
    updateActiveFromScroll();
    centerSlide(activeIndex + 1);
  };

  const goPrevious = () => {
    updateActiveFromScroll();
    centerSlide(activeIndex - 1);
  };

  previous.addEventListener("click", goPrevious);
  next.addEventListener("click", goNext);

  const pauseAutoPlay = () => {
    window.clearInterval(autoPlay);
  };

  const resumeAutoPlay = () => {
    window.clearInterval(autoPlay);
    autoPlay = window.setInterval(goNext, 3600);
  };

  track.addEventListener(
    "scroll",
    () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(updateActiveFromScroll, 120);
    },
    { passive: true },
  );

  carousel.addEventListener("mouseenter", pauseAutoPlay);
  carousel.addEventListener("mouseleave", resumeAutoPlay);
  carousel.addEventListener("touchstart", pauseAutoPlay, { passive: true });
  carousel.addEventListener("touchend", () => {
    window.setTimeout(resumeAutoPlay, 1200);
  });
  carousel.addEventListener("pointerdown", pauseAutoPlay);
  carousel.addEventListener("pointerup", () => {
    window.setTimeout(resumeAutoPlay, 1200);
  });

  centerSlide(0, "auto");
  resumeAutoPlay();
});
