/* =========================================================
   LANGUAGE SWITCH
   This file controls the EN / Korean button.
   You usually do not need to edit this.
   ========================================================= */

function setLanguage(language) {
  const elements = document.querySelectorAll("[data-en][data-ko]");

  elements.forEach((element) => {
    element.textContent = element.getAttribute(`data-${language}`);
  });

  document.documentElement.lang = language;
  localStorage.setItem("selectedLanguage", language);

  const enBtn = document.getElementById("enBtn");
  const koBtn = document.getElementById("koBtn");

  if (enBtn && koBtn) {
    enBtn.classList.toggle("active", language === "en");
    koBtn.classList.toggle("active", language === "ko");
  }
}

const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
setLanguage(savedLanguage);
