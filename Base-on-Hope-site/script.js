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
      <button id="enBtn" class="lang-btn" onclick="setLanguage('en')">EN</button>
      <button id="koBtn" class="lang-btn" onclick="setLanguage('ko')">한국어</button>
      <button id="loBtn" class="lang-btn" onclick="setLanguage('lo')">ລາວ</button>
    </div>
  </header>`;

  const header = document.querySelector(".site-header");
  const toggle = header.querySelector(".menu-toggle");
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
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
function setLanguage(language) {
  document.querySelectorAll("[data-en]").forEach((element) => {
    const text = element.getAttribute(`data-${language}`) || element.getAttribute("data-en");
    element.textContent = text;
  });

  document.documentElement.lang = language;
  try { localStorage.setItem("selectedLanguage", language); } catch (e) {}

  document.querySelectorAll(".lang-btn").forEach((b) => b.classList.remove("active"));
  const activeButton = document.getElementById(`${language}Btn`);
  if (activeButton) activeButton.classList.add("active");
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
const zoomable = document.querySelectorAll(".gallery-grid img, .photo-wall img, .project-photos img");
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
