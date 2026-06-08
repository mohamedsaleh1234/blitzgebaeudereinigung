/* Blitzgebäudereinigung — Interaktionen */
(function () {
  "use strict";

  /* ---- Mobile-Menü ---- */
  const toggle = document.querySelector(".nav__toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      const open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("menu-open"); });
    });
  }

  /* ---- Scroll-Fortschrittsbalken (oben) ---- */
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  /* ---- Header-Schatten beim Scrollen + Fortschritt ---- */
  const header = document.querySelector(".site-header");
  const waFab = document.querySelector(".wa-fab");
  const onScroll = function () {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 8);
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    /* WhatsApp-Button erst nach 25 % Scroll sanft einblenden */
    if (waFab) waFab.classList.toggle("is-visible", max > 0 && y / max >= 0.25);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  /* ---- Scroll-Reveal ---- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Zähler-Animation ---- */
  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    const cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const dur = 1400; const start = performance.now();
        const step = function (now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = Math.round(target * eased);
          el.textContent = val.toLocaleString("de-DE") + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- Accordion ---- */
  document.querySelectorAll(".acc__q").forEach(function (q) {
    q.addEventListener("click", function () {
      const item = q.closest(".acc__item");
      const ans = item.querySelector(".acc__a");
      const open = item.classList.toggle("open");
      q.setAttribute("aria-expanded", open ? "true" : "false");
      ans.style.maxHeight = open ? ans.scrollHeight + "px" : "0px";
    });
  });

  /* ---- Bild-Fallback: wenn Stockbild nicht lädt, eleganter Verlauf ---- */
  document.querySelectorAll(".ph[data-src]").forEach(function (el) {
    const url = el.getAttribute("data-src");
    const img = new Image();
    img.onload = function () { el.style.backgroundImage = "url('" + url + "')"; };
    img.onerror = function () { el.classList.add("is-fallback"); };
    img.src = url;
  });

  /* ---- Dateiname im Upload-Feld anzeigen ---- */
  document.querySelectorAll('input[type="file"]').forEach(function (inp) {
    inp.addEventListener("change", function () {
      const label = inp.closest(".file") && inp.closest(".file").querySelector(".file__name");
      if (label) label.textContent = inp.files.length ? inp.files[0].name : "";
    });
  });

  /* ---- Formular-Demo (Platzhalter, kein echter Versand) ---- */
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      const ok = form.querySelector(".form__success");
      if (ok) {
        ok.classList.add("show");
        ok.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
      form.querySelectorAll(".file__name").forEach(function (n) { n.textContent = ""; });
    });
  });

  /* ---- Jahr im Footer ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
