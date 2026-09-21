/* =========================================================
   BASE ON HOPE — SHARED SCRIPT
   1. Header + footer (edit the menu ONCE here, every page updates)
   2. Language switch (EN / 한국어 / ພາສາລາວ)
   3. Hero slideshow
   4. Videos (YouTube link or mp4 file)
   5. Photo lightbox (click a gallery photo to enlarge)
   6. Missing-photo fallback (shows initials until a photo is uploaded)
   ========================================================= */

/* =========================
   1. HEADER / FOOTER
   To add or rename a menu item, edit NAV_LINKS below.
   ========================= */
const NAV_LINKS = [
  { href: "about.html",      en: "Laos National Team", ko: "라오스 국가대표팀", lo: "ທີມຊາດລາວ" },
  { href: "commitment.html", en: "Commitment",         ko: "목표",            lo: "ຄໍາຫມັ້ນສັນຍາ" },
  { href: "projects.html",   en: "Projects",           ko: "프로젝트",         lo: "ໂຄງການ" },
  { href: "impact.html",     en: "Impact",             ko: "성과",            lo: "ຜົນກະທົບ" },
  { href: "gallery.html",    en: "Gallery",            ko: "갤러리",           lo: "ຄັງຮູບ" },
  { href: "support.html",    en: "Support",            ko: "후원",            lo: "ສະຫນັບສະຫນູນ" }
];

function currentPage() {
  const file = window.location.pathname.split("/").pop();
  return file === "" ? "index.html" : file;
}

function buildHeader() {
  const slot = document.getElementById("site-header");
  if (!slot) return;

  const page = currentPage();
  const links = NAV_LINKS.map((link) => {
    const active = link.href === page ? ' class="active" aria-current="page"' : "";
    return `<a href="${link.href}"${active} data-en="${link.en}" data-ko="${link.ko}" data-lo="${link.lo}">${link.en}</a>`;
  }).join("");

  slot.outerHTML = `
  <header class="site-header">
    <a class="logo" href="index.html">
      <img src="favicon.png" alt="" width="36" height="36" />
      <span>Base on Hope</span>
    </a>
    <button class="menu-toggle" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <nav class="nav" aria-label="Main navigation">${links}</nav>
    <div class="header-actions">
      <div class="language-switcher">
        <button id="languageToggle" class="language-toggle" type="button"
                aria-haspopup="true" aria-expanded="false" aria-controls="languageMenu"
                aria-label="Change language">
          <svg class="language-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/>
            <path d="M3.5 12h17M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21M12 3C9.6 5.5 8.4 8.5 8.4 12s1.2 6.5 3.6 9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          <span id="currentLanguage">EN</span>
          <svg class="language-chevron" viewBox="0 0 20 20" aria-hidden="true">
            <path d="m5 7.5 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div id="languageMenu" class="language-menu" role="menu">
          <button class="lang-option" type="button" role="menuitem" data-language="en" onclick="setLanguage('en')">English</button>
          <button class="lang-option" type="button" role="menuitem" data-language="ko" onclick="setLanguage('ko')">한국어</button>
          <button class="lang-option" type="button" role="menuitem" data-language="lo" onclick="setLanguage('lo')">ພາສາລາວ</button>
        </div>
      </div>
    </div>
  </header>`;

  const header = document.querySelector(".site-header");
  const toggle = header.querySelector(".menu-toggle");
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  const languageSwitcher = header.querySelector(".language-switcher");
  const languageToggle = header.querySelector("#languageToggle");

  function closeLanguageMenu() {
    languageSwitcher.classList.remove("open");
    languageToggle.setAttribute("aria-expanded", "false");
  }

  languageToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = languageSwitcher.classList.toggle("open");
    languageToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  languageSwitcher.addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("click", closeLanguageMenu);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLanguageMenu();
      languageToggle.focus();
    }
  });
}

function buildFooter() {
  const slot = document.getElementById("site-footer");
  if (!slot) return;
  slot.outerHTML = `
  <footer class="footer">
    <div class="footer-inner">
      <div>
        <strong>Base on Hope</strong>
        <p data-en="A student-led club founded at Fayston Preparatory School of Suji."
           data-ko="페이스튼 국제학교 학생들이 설립한 학생 주도형 클럽입니다."
           data-lo="ສະໂມສອນນຳໂດຍນັກຮຽນ ທີ່ສ້າງຕັ້ງຂຶ້ນທີ່ Fayston Preparatory School of Suji.">A student-led club founded at Fayston Preparatory School of Suji.</p>
      </div>
      <div class="footer-links">
        <a href="mailto:fps.baseonhope@gmail.com">fps.baseonhope@gmail.com</a>
        <a href="https://instagram.com/base.on.hope" target="_blank" rel="noopener">Instagram @base.on.hope</a>
      </div>
    </div>
    <p class="footer-copy">© 2026 Base on Hope. All rights reserved.</p>
  </footer>`;
}

buildHeader();
buildFooter();

/* =========================
   2. LANGUAGE SWITCH
   Any element with data-en / data-ko / data-lo gets translated.
   If a translation is missing, English is used.
   ========================= */
let activeLanguageAnimations = [];
let languageTransitionId = 0;

function cancelLanguageAnimations() {
  activeLanguageAnimations.forEach((animation) => animation.cancel());
  activeLanguageAnimations = [];
}

function applyLanguage(language) {
  document.querySelectorAll("[data-en]").forEach((element) => {
    const text = element.getAttribute(`data-${language}`) || element.getAttribute("data-en");
    element.textContent = text;
  });

  document.documentElement.lang = language;
  try { localStorage.setItem("selectedLanguage", language); } catch (e) {}

  const languageLabels = { en: "EN", ko: "한국어", lo: "ລາວ" };
  const currentLanguage = document.getElementById("currentLanguage");
  if (currentLanguage) currentLanguage.textContent = languageLabels[language] || "EN";

  document.querySelectorAll(".lang-option").forEach((button) => {
    const active = button.dataset.language === language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "true" : "false");
  });
}

function captureViewportAnchor() {
  if (window.scrollY < 2) return null;

  const x = Math.round(window.innerWidth / 2);
  const y = Math.round(window.innerHeight * 0.48);
  const element = document.elementFromPoint(x, y);

  if (!element || element.closest(".site-header")) return null;
  return {
    element,
    top: element.getBoundingClientRect().top
  };
}

function applyLanguageWithoutLayoutShift(language) {
  const anchor = captureViewportAnchor();
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  const previousOverflowAnchor = root.style.overflowAnchor;

  root.style.scrollBehavior = "auto";
  root.style.overflowAnchor = "none";

  applyLanguage(language);

  if (anchor && document.body.contains(anchor.element)) {
    const newTop = anchor.element.getBoundingClientRect().top;
    const shift = newTop - anchor.top;
    if (Math.abs(shift) > 0.5) window.scrollBy(0, shift);
  }

  requestAnimationFrame(() => {
    root.style.scrollBehavior = previousScrollBehavior;
    root.style.overflowAnchor = previousOverflowAnchor;
  });
}

async function setLanguage(language) {
  const languageSwitcher = document.querySelector(".language-switcher");
  const languageToggle = document.getElementById("languageToggle");
  if (languageSwitcher) languageSwitcher.classList.remove("open");
  if (languageToggle) languageToggle.setAttribute("aria-expanded", "false");

  const firstRender = document.documentElement.dataset.languageReady !== "true";
  const currentLanguage = document.documentElement.lang || "en";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!firstRender && currentLanguage === language) return;

  const transitionId = ++languageTransitionId;
  cancelLanguageAnimations();

  if (firstRender || reduceMotion) {
    if (firstRender) applyLanguage(language);
    else applyLanguageWithoutLayoutShift(language);
    document.documentElement.dataset.languageReady = "true";
    return;
  }

  const elements = Array.from(document.querySelectorAll("[data-en]"));
  activeLanguageAnimations = elements.map((element) =>
    element.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(2px)" }
      ],
      {
        duration: 180,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        fill: "forwards"
      }
    )
  );

  await Promise.all(activeLanguageAnimations.map((animation) => animation.finished.catch(() => {})));
  if (transitionId !== languageTransitionId) return;

  cancelLanguageAnimations();
  applyLanguageWithoutLayoutShift(language);

  activeLanguageAnimations = elements.map((element) =>
    element.animate(
      [
        { opacity: 0, transform: "translateY(-2px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      {
        duration: 280,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)"
      }
    )
  );

  Promise.all(activeLanguageAnimations.map((animation) => animation.finished.catch(() => {})))
    .then(() => {
      if (transitionId === languageTransitionId) activeLanguageAnimations = [];
    });
}

let savedLanguage = "en";
try { savedLanguage = localStorage.getItem("selectedLanguage") || "en"; } catch (e) {}
setLanguage(savedLanguage);

/* =========================
   3. HERO SLIDESHOW
   ========================= */
const heroSlides = document.querySelectorAll(".hero-bg-slide");
let currentHeroSlide = 0;
if (heroSlides.length > 1) {
  setInterval(() => {
    heroSlides[currentHeroSlide].classList.remove("active");
    currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
    heroSlides[currentHeroSlide].classList.add("active");
  }, 4500);
}

/* =========================
   4. VIDEOS
   In the HTML, a video card looks like:
     <div class="video-embed" data-youtube="https://youtu.be/XXXX"></div>
     <div class="video-embed" data-mp4="videos/club-day.mp4"></div>
   Leave the value empty ("") to show a "Coming soon" box.
   ========================= */
function youtubeId(value) {
  if (!value) return "";
  const patterns = [
    /youtu\.be\/([\w-]{6,})/,
    /youtube\.com\/shorts\/([\w-]{6,})/,
    /youtube\.com\/embed\/([\w-]{6,})/,
    /[?&]v=([\w-]{6,})/
  ];
  for (const p of patterns) {
    const m = value.match(p);
    if (m) return m[1];
  }
  return /^[\w-]{6,}$/.test(value) ? value : "";
}

document.querySelectorAll(".video-embed").forEach((box) => {
  const yt = youtubeId(box.dataset.youtube);
  const mp4 = box.dataset.mp4;

  if (yt) {
    const vertical = (box.dataset.youtube || "").includes("/shorts/");
    if (vertical) box.classList.add("vertical");
    box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${yt}" title="Base on Hope video" loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  } else if (mp4) {
    const poster = box.dataset.poster ? ` poster="${box.dataset.poster}"` : "";
    box.innerHTML = `<video controls playsinline preload="metadata"${poster}><source src="${mp4}" type="video/mp4" /></video>`;
  } else {
    box.classList.add("empty");
    box.innerHTML = `<div class="video-placeholder"><span class="play-icon" aria-hidden="true"></span>
      <p data-en="Video coming soon" data-ko="영상 준비 중" data-lo="ວິດີໂອກຳລັງມາ">Video coming soon</p></div>`;
    setLanguage(document.documentElement.lang || "en");
  }
});

/* =========================
   5. LIGHTBOX
   Any <img> inside .gallery-grid or .photo-wall opens large on click.
   ========================= */
const zoomable = document.querySelectorAll(".gallery-grid img, .photo-wall img, .project-photos img, .stop-photos img, .zoomable");
if (zoomable.length) {
  const box = document.createElement("div");
  box.className = "lightbox";
  box.innerHTML = `<button class="lightbox-close" aria-label="Close">×</button><img alt="" /><p class="lightbox-caption"></p>`;
  document.body.appendChild(box);
  const big = box.querySelector("img");
  const caption = box.querySelector(".lightbox-caption");

  zoomable.forEach((img) => {
    img.addEventListener("click", () => {
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      caption.textContent = img.alt;
      box.classList.add("open");
    });
  });
  box.addEventListener("click", (e) => {
    if (e.target !== big) box.classList.remove("open");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") box.classList.remove("open");
  });
}

/* =========================
   6. MISSING PHOTO FALLBACK
   <img data-initials="GJ" ...> shows a circle with initials
   if the photo file isn't uploaded yet.
   ========================= */
document.querySelectorAll("img[data-initials]").forEach((img) => {
  const swap = () => {
    const div = document.createElement("div");
    div.className = img.className + " initials-fallback";
    div.textContent = img.dataset.initials;
    img.replaceWith(div);
  };
  if (img.complete && img.naturalWidth === 0) swap();
  else img.addEventListener("error", swap);
});
