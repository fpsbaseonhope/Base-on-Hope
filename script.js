/* =========================================================
   LANGUAGE SWITCH
   Supports English, Korean, and Lao.
   ========================================================= */

function setLanguage(language) {
  const elements = document.querySelectorAll("[data-en]");

  elements.forEach((element) => {
    const translatedText = element.getAttribute(`data-${language}`);

    // If a translation does not exist yet, keep English as fallback.
    if (translatedText) {
      element.textContent = translatedText;
    } else {
      element.textContent = element.getAttribute("data-en");
    }
  });

  document.documentElement.lang = language;
  localStorage.setItem("selectedLanguage", language);

  const buttons = document.querySelectorAll(".lang-btn");
  buttons.forEach((button) => button.classList.remove("active"));

  const activeButton = document.getElementById(`${language}Btn`);
  if (activeButton) {
    activeButton.classList.add("active");
  }
}

const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
setLanguage(savedLanguage);

/* =========================
   HERO IMAGE SLIDESHOW
   ========================= */

let currentSlide = 0;
const slides = document.querySelectorAll(".hero-slider .slide");

function showNextSlide() {
  if (slides.length === 0) return;

  slides[currentSlide].classList.remove("active");

  currentSlide = (currentSlide + 1) % slides.length;

  slides[currentSlide].classList.add("active");
}

// Change image every 3 seconds
setInterval(showNextSlide, 3000);
