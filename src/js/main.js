async function loadComponent(id, url, onLoad) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
    highlightActiveNav();
    if (typeof onLoad === "function") onLoad();
  } catch (e) {
    console.warn(`Could not load component: ${url}`, e);
  }
}

function highlightActiveNav() {
  const currentPage = document.body.dataset.page;
  if (!currentPage) return;
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.remove("text-slate-300");
      link.classList.add("text-[#AF9880]", "font-bold", "border-b", "border-[#AF9880]", "pb-1");
    }
  });
}

function initProgressBar() {
  const bar = document.createElement("div");
  bar.id = "page-loader";
  document.body.prepend(bar);
}

function startProgress() {
  const bar = document.getElementById("page-loader");
  if (!bar) return;
  bar.style.width = "15%";
  requestAnimationFrame(() => { bar.style.width = "65%"; });
}

function finishProgress() {
  const bar = document.getElementById("page-loader");
  if (!bar || bar.style.width === "0px" || !bar.style.width) return;
  bar.style.width = "100%";
  setTimeout(() => {
    bar.style.width = "0";
    bar.style.transition = "none";
    requestAnimationFrame(() => {
      bar.style.transition = "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
    });
  }, 400);
}

function cascadeSections() {
  const sections = document.querySelectorAll("body > section, main > section");
  if (!("IntersectionObserver" in window)) {
    sections.forEach((el) => el.classList.remove("cascade-section"));
    return;
  }
  sections.forEach((el, i) => {
    if (i !== 0) el.classList.add("cascade-section");
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("cascade-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );
  sections.forEach((el, i) => {
    if (i !== 0) io.observe(el);
  });
}

function smoothAnchorScroll(e) {
  const link = e.target.closest("a");
  if (!link || !link.hash || !link.href.includes("#")) return;
  if (link.getAttribute("href").startsWith("#") || link.href.split("#")[0] === window.location.href.split("#")[0]) {
    const target = document.querySelector(link.hash);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
      history.pushState(null, "", link.hash);
    }
  }
}

function initSmartNav() {
  let lastY = window.scrollY;
  let idleTimer = null;
  let hovering = false;

  function hideNav() {
    const nav = document.querySelector("#navbar nav");
    if (nav) nav.classList.add("nav-hidden");
  }

  function showNav() {
    const nav = document.querySelector("#navbar nav");
    if (nav) nav.classList.remove("nav-hidden");
  }

  function disarmIdle() {
    clearTimeout(idleTimer);
  }

  function armIdle() {
    disarmIdle();
    idleTimer = setTimeout(() => {
      if (!hovering && window.scrollY >= 100) hideNav();
    }, 2500);
  }

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y < 100) {
      disarmIdle();
      showNav();
    } else if (y > lastY + 4) {
      disarmIdle();
      hideNav();
    } else if (y < lastY - 4) {
      showNav();
      armIdle();
    }
    lastY = y;
  }, { passive: true });

  document.addEventListener("mouseover", (e) => {
    const nav = document.querySelector("#navbar nav");
    if (!nav) return;
    if (nav.contains(e.target)) {
      hovering = true;
      disarmIdle();
      showNav();
    } else if (hovering) {
      hovering = false;
      if (window.scrollY >= 100) armIdle();
    }
  });
}

function initMobileMenu() {
  const toggle = document.getElementById("nav-mobile-toggle");
  const menu = document.getElementById("nav-mobile-menu");
  if (!toggle || !menu || toggle.dataset.bound) return;
  toggle.dataset.bound = "true";
  toggle.addEventListener("click", () => {
    const open = menu.classList.contains("hidden");
    menu.classList.toggle("hidden", !open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.addEventListener("click", (e) => {
    if (menu.classList.contains("hidden")) return;
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.add("hidden");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initProgressBar();
  finishProgress();
  initSmartNav();
  loadComponent("navbar", "/camila-odontologa/src/components/navbar.html", initMobileMenu);
  loadComponent("footer", "/camila-odontologa/src/components/footer.html");

  cascadeSections();
});

document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link || !link.href) return;
  if (!link.href.startsWith(window.location.origin) && !link.href.startsWith("#") && !link.getAttribute("href")?.startsWith("#")) return;
  if (link.target === "_blank") return;

  if (link.hash) {
    const isSamePage = link.getAttribute("href").startsWith("#") || link.href.split("#")[0] === window.location.href.split("#")[0];
    if (isSamePage) {
      smoothAnchorScroll(e);
      return;
    }
  }

  if (!link.href.startsWith(window.location.origin)) return;
  e.preventDefault();

  startProgress();
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      window.location.href = link.href;
    });
  } else {
    window.location.href = link.href;
  }
});
