const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

document.querySelectorAll(".photo-carousel").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const previous = carousel.querySelector(".carousel-button-prev");
  const next = carousel.querySelector(".carousel-button-next");

  if (!track || !previous || !next) {
    return;
  }

  const getStep = () => {
    const slide = track.querySelector("img");
    if (!slide) {
      return track.clientWidth * 0.82;
    }

    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0");
    return slide.getBoundingClientRect().width + gap;
  };

  const scrollCarousel = (direction) => {
    track.scrollBy({
      left: direction * getStep(),
      behavior: "smooth",
    });
  };

  const goNext = () => {
    const maxScroll = track.scrollWidth - track.clientWidth - 4;

    if (track.scrollLeft >= maxScroll) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    scrollCarousel(1);
  };

  previous.addEventListener("click", () => scrollCarousel(-1));
  next.addEventListener("click", goNext);

  let autoPlay = window.setInterval(goNext, 3600);

  const pauseAutoPlay = () => {
    window.clearInterval(autoPlay);
  };

  const resumeAutoPlay = () => {
    window.clearInterval(autoPlay);
    autoPlay = window.setInterval(goNext, 3600);
  };

  carousel.addEventListener("mouseenter", pauseAutoPlay);
  carousel.addEventListener("mouseleave", resumeAutoPlay);
  carousel.addEventListener("touchstart", pauseAutoPlay, { passive: true });
  carousel.addEventListener("touchend", resumeAutoPlay);
});
