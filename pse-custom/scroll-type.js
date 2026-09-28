














(function () {
  "use strict";

  var SEL = "h1, h2, h3";
  
  var SKIP = '#hero-section, .pse-hero, .pse-nav, ' +
             '[data-framer-name*="Footer"], [data-framer-name*="Nav"]';

  function reduce() {
    return window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function ensureStyle() {
    if (document.getElementById("pse-sr-style")) return;
    var st = document.createElement("style");
    st.id = "pse-sr-style";
    st.textContent =
      ".pse-sr{opacity:0;will-change:opacity;" +
      "transition:opacity .7s cubic-bezier(.22,.61,.36,1)}" +
      ".pse-sr.pse-sr-in{opacity:1;transform:none}";
    (document.head || document.documentElement).appendChild(st);
  }

  var io = null;
  var seen = (typeof WeakSet !== "undefined") ? new WeakSet() : null;

  function reveal(el) { el.classList.add("pse-sr-in"); }

  function register(el) {
    if (!el || (seen && seen.has(el))) return;
    if (el.closest && el.closest(SKIP)) return;
    if (!(el.textContent || "").trim()) return;
    if (seen) seen.add(el);
    if (reduce()) return;                 
    el.classList.add("pse-sr");
    if (io) io.observe(el);
    else reveal(el);                      
  }

  function scan() {
    ensureStyle();
    var els = document.querySelectorAll(SEL);
    for (var i = 0; i < els.length; i++) register(els[i]);
  }

  function boot() {
    if (!reduce() && typeof IntersectionObserver !== "undefined" && !io) {
      io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            reveal(entries[i].target);
            io.unobserve(entries[i].target);
          }
        }
      }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    }
    scan();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
  window.addEventListener("load", boot);
  setTimeout(boot, 800);
  setTimeout(boot, 2000);

  
  
  setTimeout(function () {
    var els = document.querySelectorAll(".pse-sr:not(.pse-sr-in)");
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect();
      if (r.top < (window.innerHeight || 0) && r.bottom > 0) reveal(els[i]);
    }
  }, 2600);

  if (typeof MutationObserver !== "undefined") {
    var pend = false;
    new MutationObserver(function () {
      if (pend) return;
      pend = true;
      requestAnimationFrame(function () { pend = false; scan(); });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
