










(function () {
  "use strict";

  var STATS = [
    { n: 40, suffix: "+", l: { fr: "Développeurs & experts", en: "Developers & experts" } },
    { n: 78, suffix: "",  l: { fr: "Projets livrés",          en: "Projects delivered" } },
    { n: 26, suffix: "",  l: { fr: "Clients accompagnés",     en: "Clients supported" } },
    { n: 12, suffix: "",  l: { fr: "Partenaires",             en: "Partners" } }
  ];

  var DURATION = 1600;  

  function getLang() {
    try { var s = localStorage.getItem("pse-lang"); if (s === "fr" || s === "en") return s; } catch (e) {}
    return "fr";
  }
  function reduce() {
    return window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function L(o, lang) { return (o && o[lang]) || (o && o.fr) || ""; }

  function injectStyles() {
    if (document.getElementById("pse-stats-style")) return;
    var st = document.createElement("style");
    st.id = "pse-stats-style";
    st.textContent =
      ".pse-stats{padding:clamp(48px,6vw,76px) clamp(16px,4vw,56px);" +
      "background:linear-gradient(135deg,#1a0f3a 0%,#2a1656 55%,#1f1147 100%);" +
      "font-family:'Geist','Geist Placeholder',Inter,system-ui,-apple-system,sans-serif}" +
      ".pse-stats__in{max-width:1180px;margin:0 auto;display:grid;" +
      "grid-template-columns:repeat(4,1fr);gap:clamp(20px,3vw,40px)}" +
      ".pse-stat{text-align:center;position:relative;opacity:0;transform:translateY(18px);" +
      "transition:opacity .6s ease,transform .6s cubic-bezier(.22,.61,.36,1)}" +
      ".pse-stats.is-in .pse-stat{opacity:1;transform:none}" +
      ".pse-stats.is-in .pse-stat:nth-child(2){transition-delay:.08s}" +
      ".pse-stats.is-in .pse-stat:nth-child(3){transition-delay:.16s}" +
      ".pse-stats.is-in .pse-stat:nth-child(4){transition-delay:.24s}" +
      ".pse-stat__n{font-family:'Archivo','Archivo Placeholder',sans-serif;font-weight:700;" +
      "font-size:clamp(42px,5.4vw,66px);line-height:1;letter-spacing:-.03em;color:#fff;" +
      "display:flex;align-items:baseline;justify-content:center;gap:1px;" +
      "text-shadow:0 2px 30px rgba(122,168,230,.28)}" +
      ".pse-stat__suf{background:linear-gradient(180deg,#9ec2f0,#5f92da);-webkit-background-clip:text;" +
      "background-clip:text;-webkit-text-fill-color:transparent;color:#7aa8e6}" +
      ".pse-stat__l{position:relative;margin:20px 0 0;padding-top:16px;" +
      "font-size:clamp(13px,1.3vw,15.5px);font-weight:500;" +
      "letter-spacing:.02em;color:rgba(255,255,255,.74);line-height:1.45}" +
      ".pse-stat__l::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);" +
      "width:28px;height:2px;border-radius:2px;background:linear-gradient(90deg,#348ace,#7aa8e6)}" +
      ".pse-stat:not(:last-child)::after{content:'';position:absolute;top:14%;right:calc(-1*clamp(10px,1.5vw,20px));" +
      "height:72%;width:1px;background:linear-gradient(180deg,transparent,rgba(255,255,255,.14),transparent)}" +
      "@media(max-width:760px){.pse-stats__in{grid-template-columns:repeat(2,1fr);gap:34px 20px}" +
      ".pse-stat:nth-child(2)::after{display:none}}" +
      "@media(max-width:380px){.pse-stats__in{grid-template-columns:1fr}" +
      ".pse-stat::after{display:none}}";
    (document.head || document.documentElement).appendChild(st);
  }

  function render(lang) {
    var sec = document.createElement("section");
    sec.className = "pse-stats";
    sec.id = "pse-stats";
    sec.setAttribute("data-framer-name", "Section Stats PSE");

    var cells = "";
    for (var i = 0; i < STATS.length; i++) {
      cells +=
        '<div class="pse-stat">' +
          '<div class="pse-stat__n">' +
            '<span class="pse-stat__v" data-stat-v="' + i + '">0</span>' +
            '<span class="pse-stat__suf">' + STATS[i].suffix + '</span>' +
          '</div>' +
          '<p class="pse-stat__l" data-stat-l="' + i + '">' + L(STATS[i].l, lang) + '</p>' +
        '</div>';
    }
    sec.innerHTML = '<div class="pse-stats__in">' + cells + '</div>';
    return sec;
  }

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function countUp(sec) {
    if (sec.getAttribute("data-counted") === "1") return;
    sec.setAttribute("data-counted", "1");
    sec.classList.add("is-in");
    var vals = sec.querySelectorAll("[data-stat-v]");
    if (reduce()) {
      for (var k = 0; k < vals.length; k++)
        vals[k].textContent = STATS[vals[k].getAttribute("data-stat-v")].n;
      return;
    }
    var start = null;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / DURATION, 1);
      var e = easeOut(p);
      for (var i = 0; i < vals.length; i++) {
        var target = STATS[vals[i].getAttribute("data-stat-v")].n;
        vals[i].textContent = Math.round(e * target);
      }
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function watch(sec) {
    if (typeof IntersectionObserver === "undefined") { countUp(sec); return; }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { countUp(sec); io.disconnect(); }
      }
    }, { threshold: 0.35 });
    io.observe(sec);
  }

  function relang(lang) {
    var sec = document.getElementById("pse-stats");
    if (!sec) return;
    var ls = sec.querySelectorAll("[data-stat-l]");
    for (var i = 0; i < ls.length; i++)
      ls[i].textContent = L(STATS[ls[i].getAttribute("data-stat-l")].l, lang);
  }

  function mount() {
    if (document.getElementById("pse-stats")) return true;
    var anchor = document.getElementById("hero-section");
    if (!anchor || !anchor.parentNode) return false;
    injectStyles();
    var sec = render(getLang());
    anchor.parentNode.insertBefore(sec, anchor.nextSibling);  
    watch(sec);
    return true;
  }

  function hookLang() {
    if (window.__pseStatsHooked) return;
    if (typeof window.PSE_setLang === "function") {
      var orig = window.PSE_setLang;
      window.PSE_setLang = function (l) { orig(l); relang(l === "en" ? "en" : "fr"); };
      window.__pseStatsHooked = true;
    }
  }

  function boot() { if (mount()) hookLang(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
  window.addEventListener("load", boot);
  setTimeout(boot, 800);
  setTimeout(boot, 2200);

  if (typeof MutationObserver !== "undefined") {
    var pend = false;
    new MutationObserver(function () {
      if (pend) return;
      pend = true;
      window.requestAnimationFrame(function () { pend = false; boot(); });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
