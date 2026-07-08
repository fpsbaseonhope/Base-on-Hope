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
