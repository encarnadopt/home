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

  const scrollCarousel = (direction) => {
    track.scrollBy({
      left: direction * track.clientWidth * 0.82,
      behavior: "smooth",
    });
  };

  previous.addEventListener("click", () => scrollCarousel(-1));
  next.addEventListener("click", () => scrollCarousel(1));
});
