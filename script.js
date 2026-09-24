/* =========================================================
   BASE ON HOPE — SHARED SCRIPT
   1. Shared navbar component + footer
   2. Language switch (EN / 한국어 / ພາສາລາວ)
   3. Hero slideshow
   4. Videos (YouTube link or mp4 file)
   5. Photo lightbox (click a gallery photo to enlarge)
   6. Missing-photo fallback (shows initials until a photo is uploaded)
   ========================================================= */

/* =========================
   1. SHARED NAVBAR / FOOTER
   Edit navbar.html once to update the navigation on every page.
   ========================= */
const SHARED_COMPONENT_BASE = new URL(
  ".",
  document.currentScript?.src || window.location.href
);

function sectionName(url) {
  const rootPath = SHARED_COMPONENT_BASE.pathname.replace(/\/$/, "");
  let path = new URL(url, window.location.href).pathname;
  if (rootPath && path.startsWith(rootPath)) path = path.slice(rootPath.length);
  path = path.replace(/\/index\.html$/i, "").replace(/\.html$/i, "").replace(/\/$/, "");
  return path.split("/").filter(Boolean)[0] || "index";
}

function resolveNavbarUrls(header, componentBase) {
  header.querySelectorAll("[href]").forEach((element) => {
    const value = element.getAttribute("href");
    if (!value || /^(?:#|mailto:|tel:|https?:)/i.test(value)) return;
    element.setAttribute("href", new URL(value, componentBase).href);
  });

  header.querySelectorAll("[src]").forEach((element) => {
    const value = element.getAttribute("src");
    if (!value || /^(?:data:|https?:)/i.test(value)) return;
    element.setAttribute("src", new URL(value, componentBase).href);
  });
}

function setupHeaderInteractions(header) {
  const toggle = header.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  const languageSwitcher = header.querySelector(".language-switcher");
  const languageToggle = header.querySelector("#languageToggle");
  if (!languageSwitcher || !languageToggle) return;

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

async function buildHeader() {
  const slot = document.getElementById("site-header");
  if (!slot) return null;

  try {
    const navbarUrl = new URL("navbar.html?v=20260925-img", SHARED_COMPONENT_BASE);
    const response = await fetch(navbarUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`Navbar request failed: ${response.status}`);

    const template = document.createElement("template");
    template.innerHTML = (await response.text()).trim();
    const header = template.content.firstElementChild;
    if (!header || !header.classList.contains("site-header")) {
      throw new Error("navbar.html does not contain a valid .site-header element");
    }

    const componentBase = new URL(".", navbarUrl);
    resolveNavbarUrls(header, componentBase);

    const page = sectionName(window.location.href);
    header.querySelectorAll(".nav a").forEach((link) => {
      const linkPage = sectionName(link.href);
      const active = linkPage === page;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    slot.replaceWith(header);
    setupHeaderInteractions(header);

    // The page language may already be applied before the async navbar arrives.
    applyLanguage(document.documentElement.lang || "en");
    return header;
  } catch (error) {
    slot.classList.add("header-load-error");
    console.error("Could not load navbar.html", error);
    return null;
  }
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
  const viewportY = Math.round(window.innerHeight * 0.48);
  const hit = document.elementFromPoint(x, viewportY);

  if (!hit || hit.closest(".site-header")) return null;

  const element =
    hit.closest(
      ".project-block, .team-card, .timeline-item, .card, .project-card, " +
      ".impact-item, .stat-card, .fact-item, .dept-card, .video-card, " +
      ".photo-wall figure, .section, .page-hero, main"
    ) || hit;

  const rect = element.getBoundingClientRect();
  const height = Math.max(rect.height, 1);
  const positionRatio = Math.min(1, Math.max(0, (viewportY - rect.top) / height));
  const bottomGap = Math.max(
    0,
    document.documentElement.scrollHeight - (window.scrollY + window.innerHeight)
  );

  return {
    element,
    viewportY,
    positionRatio,
    bottomGap,
    keepBottom: bottomGap < 32
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

  if (anchor) {
    if (anchor.keepBottom) {
      const targetScrollY = Math.max(
        0,
        root.scrollHeight - window.innerHeight - anchor.bottomGap
      );
      const shift = targetScrollY - window.scrollY;
      if (Math.abs(shift) > 0.5) window.scrollBy(0, shift);
    } else if (document.body.contains(anchor.element)) {
      const newRect = anchor.element.getBoundingClientRect();
      const newAnchorY =
        newRect.top + Math.max(newRect.height, 1) * anchor.positionRatio;
      const shift = newAnchorY - anchor.viewportY;
      if (Math.abs(shift) > 0.5) window.scrollBy(0, shift);
    }
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
   LANDING IMPACT REVEAL
   Keeps the cards in layout, then reveals them on the first downward scroll.
   ========================= */
function initLandingImpactReveal() {
  const impact = document.querySelector(".landing-impact-reveal");
  if (!impact) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    impact.classList.add("is-visible");
    return;
  }

  let touchStartY = null;

  const setVisible = (visible) => {
    impact.classList.toggle("is-visible", visible);
  };

  const syncWithScroll = () => {
    setVisible(window.scrollY > 2);
  };

  const onWheel = (event) => {
    if (event.deltaY > 0) setVisible(true);
    else if (event.deltaY < 0 && window.scrollY <= 2) setVisible(false);
  };

  const onTouchStart = (event) => {
    touchStartY = event.touches[0]?.clientY ?? null;
  };

  const onTouchMove = (event) => {
    const currentY = event.touches[0]?.clientY;
    if (touchStartY === null || currentY === undefined) return;
    if (touchStartY - currentY > 3) setVisible(true);
    else if (currentY - touchStartY > 3 && window.scrollY <= 2) setVisible(false);
  };

  const onKeyDown = (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLElement &&
      (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
    if (isTyping) return;

    if (["ArrowDown", "PageDown", "End", " "].includes(event.key)) setVisible(true);
    if (event.key === "Home" && window.scrollY <= 2) setVisible(false);
  };

  syncWithScroll();
  requestAnimationFrame(syncWithScroll);

  window.addEventListener("wheel", onWheel, { passive: true });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("scroll", syncWithScroll, { passive: true });
  window.addEventListener("pageshow", syncWithScroll);
}

initLandingImpactReveal();

/* =========================
   3. HERO SLIDESHOW
   ========================= */
function loadHeroSlide(slide) {
  if (!slide || slide.getAttribute("src")) return;
  const src = slide.dataset.src;
  if (src) slide.src = src;
}

const heroSlides = document.querySelectorAll(".hero-bg-slide");
let currentHeroSlide = 0;
if (heroSlides.length > 1) {
  const SLIDE_MS = 4500;
  const PREFETCH_MS = 1500;

  window.setTimeout(() => loadHeroSlide(heroSlides[1]), SLIDE_MS - PREFETCH_MS);
  window.setInterval(() => {
    heroSlides[currentHeroSlide].classList.remove("active");
    currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
    loadHeroSlide(heroSlides[currentHeroSlide]);
    heroSlides[currentHeroSlide].classList.add("active");
    const upcoming = heroSlides[(currentHeroSlide + 1) % heroSlides.length];
    window.setTimeout(() => loadHeroSlide(upcoming), SLIDE_MS - PREFETCH_MS);
  }, SLIDE_MS);
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
