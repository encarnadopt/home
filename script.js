const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const cookieConsentKey = "encarnado-cookie-consent";

const getStoredCookieConsent = () => {
  try {
    return localStorage.getItem(cookieConsentKey);
  } catch {
    return null;
  }
};

const storeCookieConsent = (choice) => {
  try {
    localStorage.setItem(cookieConsentKey, choice);
  } catch {
    // The banner still closes when browser storage is unavailable.
  }
};

const createCookieBanner = () => {
  if (getStoredCookieConsent()) {
    return;
  }

  const isEnglish = document.documentElement.lang.startsWith("en");
  const banner = document.createElement("section");
  banner.className = "cookie-banner";
  banner.setAttribute("aria-label", isEnglish ? "Cookie notice" : "Aviso de cookies");

  banner.innerHTML = `
    <div class="cookie-copy">
      <strong>${isEnglish ? "Cookie notice" : "Aviso de cookies"}</strong>
      <p>${
        isEnglish
          ? "We use only essential technical storage to keep this website working properly. You can manage cookies in your browser settings."
          : "Usamos apenas armazenamento técnico essencial para o bom funcionamento do site. Pode gerir os cookies nas definições do seu navegador."
      }</p>
    </div>
    <div class="cookie-actions">
      <a href="${isEnglish ? "cookie-policy-en.html" : "politica-cookies.html"}">${
        isEnglish ? "Cookie Policy" : "Política de Cookies"
      }</a>
      <button class="cookie-button cookie-button-secondary" type="button" data-cookie-choice="rejected">${
        isEnglish ? "Decline" : "Recusar"
      }</button>
      <button class="cookie-button cookie-button-primary" type="button" data-cookie-choice="accepted">${
        isEnglish ? "Accept" : "Aceitar"
      }</button>
    </div>
  `;

  banner.querySelectorAll("[data-cookie-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      storeCookieConsent(button.dataset.cookieChoice);
      banner.classList.add("is-hidden");
      window.setTimeout(() => banner.remove(), 220);
    });
  });

  document.body.appendChild(banner);
};

createCookieBanner();

document.querySelectorAll(".photo-carousel").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const previous = carousel.querySelector(".carousel-button-prev");
  const next = carousel.querySelector(".carousel-button-next");
  const originalSlides = Array.from(track?.querySelectorAll("img") || []);

  if (!track || !previous || !next || originalSlides.length === 0) {
    return;
  }

  const beforeClones = document.createDocumentFragment();
  const afterClones = document.createDocumentFragment();

  originalSlides.forEach((slide) => {
    const beforeClone = slide.cloneNode(true);
    const afterClone = slide.cloneNode(true);

    beforeClone.setAttribute("aria-hidden", "true");
    afterClone.setAttribute("aria-hidden", "true");
    beforeClones.appendChild(beforeClone);
    afterClones.appendChild(afterClone);
  });

  track.insertBefore(beforeClones, track.firstChild);
  track.appendChild(afterClones);

  const slides = Array.from(track.querySelectorAll("img"));
  const slideCount = originalSlides.length;
  let activeIndex = slideCount;
  let autoPlay;
  let scrollTimer;

  const normalizeIndex = (index) => {
    if (index < slideCount) {
      return index + slideCount;
    }

    if (index >= slideCount * 2) {
      return index - slideCount;
    }

    return index;
  };

  const centerSlide = (index, behavior = "smooth") => {
    activeIndex = index;
    const slide = slides[activeIndex];
    const left = slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2;

    track.scrollTo({
      left,
      behavior,
    });
  };

  const resetIfNeeded = () => {
    const normalizedIndex = normalizeIndex(activeIndex);

    if (normalizedIndex !== activeIndex) {
      centerSlide(normalizedIndex, "auto");
    }
  };

  const updateActiveFromScroll = () => {
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = slideCount;
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
    resetIfNeeded();
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

  centerSlide(slideCount, "auto");
  resumeAutoPlay();
});
