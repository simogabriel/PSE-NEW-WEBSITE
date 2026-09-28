













(function () {
  "use strict";

  var T = {
    title: {
      fr: "Prestation de services intellectuels et matériels liés aux nouvelles technologies",
      en: "Provision of Professional and Material Services Related to New Technologies"
    },
    sub: {
      fr: "Des experts du numérique à vos côtés pour transformer vos idées en solutions <strong>concrètes et performantes</strong>, de la stratégie jusqu'à la mise en production.",
      en: "Digital experts by your side to turn your ideas into <strong>concrete, high-performing</strong> solutions — from strategy all the way to production."
    },
    cta: {
      fr: "Démarrons votre projet",
      en: "Start your project"
    },
    cta2: {
      fr: "Voir nos références",
      en: "View our references"
    }
  };

  /* Encoding-safe, standard France French for the homepage contact action. */
  var HOME_CONTACT_LABEL = {
    fr: "Contactez-nous",
    en: "Let's Connect"
  };

  
  var STATS = [
    { n: "40+", l: { fr: "Développeurs & experts", en: "Developers & experts" } },
    { n: "78",  l: { fr: "Projets livrés", en: "Projects delivered" } },
    { n: "26",  l: { fr: "Clients accompagnés", en: "Clients served" } },
    { n: "12",  l: { fr: "Partenaires", en: "Partners" } }
  ];

  function getLang() {
    try { var s = localStorage.getItem("pse-lang"); if (s === "fr" || s === "en") return s; } catch (e) {}
    return "fr";
  }
  function reduceMotion() {
    return window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function buildBox(hero) {
    var box = hero.querySelector(".pse-hero");
    if (box) return box;
    box = document.createElement("div");
    box.className = "pse-hero";
    box.innerHTML =
      '<h1 data-pse-h></h1>' +
      '<div class="pse-hero-actions pse-reveal">' +
        '<a class="pse-hero-cta" href="contact.html">' +
          '<span data-pse-cta-text></span>' +
          '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" ' +
          'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>' +
        '</a>' +
        '<a class="pse-hero-cta2" href="references.html">' +
          '<span data-pse-cta2-text></span>' +
        '</a>' +
      '</div>' +
      '<div class="pse-hero-stats pse-reveal">' +
        STATS.map(function (s, i) {
          return '<div class="pse-hero-stat"><strong>' + s.n + '</strong>' +
                 '<span data-pse-st="' + i + '"></span></div>';
        }).join("") +
      '</div>';
    hero.appendChild(box);
    return box;
  }

  function setTitle(box, lang) {
    var h = box.querySelector("[data-pse-h]");
    if (h) h.textContent = T.title[lang];
  }
  function applyCta(box, lang) {
    var c = box.querySelector("[data-pse-cta-text]");
    var c2 = box.querySelector("[data-pse-cta2-text]");
    if (c) c.textContent = HOME_CONTACT_LABEL[lang];
    if (c2) c2.textContent = T.cta2[lang];
    var primary = box.querySelector(".pse-hero-cta");
    if (primary) {
      primary.setAttribute("href", "contact.html");
      primary.setAttribute("data-pse-home-contact", "1");
      primary.setAttribute("aria-label", HOME_CONTACT_LABEL[lang]);
    }
  }

  function wireConnectLinks() {
    var links = document.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      var label = (links[i].textContent || "").replace(/\s+/g, " ").trim();
      if (/^(Let['\u2019]s Connect|Contactez-nous|Get in Touch|Start your project|D\u00e9marrons votre projet)$/i.test(label)) {
        links[i].setAttribute("href", "contact.html");
        links[i].setAttribute("data-pse-home-contact", "1");
      }
    }
  }

  function wireAboutLinks() {
    var links = document.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      var label = (links[i].textContent || "").replace(/\s+/g, " ").trim();
      if (/^(Learn More|En savoir plus)$/i.test(label)) {
        links[i].setAttribute("href", "about.html");
        links[i].setAttribute("data-pse-home-about", "1");
      }
    }
  }
  function applyStats(box, lang) {
    for (var i = 0; i < STATS.length; i++) {
      var el = box.querySelector('[data-pse-st="' + i + '"]');
      if (el) el.textContent = STATS[i].l[lang];
    }
  }
  function revealAll(box) {
    var els = box.querySelectorAll(".pse-reveal");
    for (var i = 0; i < els.length; i++) els[i].classList.add("is-in");
  }
  function removeCaret(box) {
    var c = box.querySelector(".pse-caret");
    if (c && c.parentNode) c.parentNode.removeChild(c);
  }

  
  function animateIn(box, lang) {
    var h = box.querySelector("[data-pse-h]");
    if (!h) return;
    var text = T.title[lang];
    h.innerHTML = '<span class="pse-type"></span><span class="pse-caret" aria-hidden="true"></span>';
    var span = h.querySelector(".pse-type");
    var i = 0;
    (function tick() {
      span.textContent = text.slice(0, i);
      if (i < text.length) {
        i++;
        setTimeout(tick, TYPE_SPEED);
      } else {
        
        var logo = box.querySelector(".pse-hero-logo");
        var actions = box.querySelector(".pse-hero-actions");
        if (logo) logo.classList.add("is-in");
        setTimeout(function () { if (actions) actions.classList.add("is-in"); }, CTA_DELAY);
        window.__pseHeroAnimDone = true;
        setTimeout(function () { removeCaret(box); }, 1100);
      }
    })();
  }

  function run() {
    var hero = document.getElementById("hero-section");
    if (!hero) return;
    hero.classList.add("pse-hero-custom");

    var box = buildBox(hero);
    var lang = getLang();

    
    
    setTitle(box, lang);
    applyCta(box, lang);
    applyStats(box, lang);
    wireConnectLinks();
    wireAboutLinks();
    removeCaret(box);

    if (reduceMotion() || window.__pseHeroAnimDone) {
      revealAll(box);
    } else {
      var logo = box.querySelector(".pse-hero-logo");
      if (logo) logo.classList.add("is-in");
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { revealAll(box); });
      });
    }
    window.__pseHeroAnimDone = true;

    hookLang();
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest('a[data-pse-home-contact="1"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(new URL("contact.html", document.baseURI).href);
  }, true);

  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest('a[data-pse-home-about="1"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(new URL("about.html", document.baseURI).href);
  }, true);

  
  function hookLang() {
    if (window.__pseHeroHooked) return;
    if (typeof window.PSE_setLang === "function") {
      var orig = window.PSE_setLang;
      window.PSE_setLang = function (l) {
        orig(l);
        var lang = (l === "en" ? "en" : "fr");
        var box = document.querySelector(".pse-hero");
        if (box) {
          setTitle(box, lang);
          applyCta(box, lang);
          wireConnectLinks();
          wireAboutLinks();
          applyStats(box, lang);
          revealAll(box);
          removeCaret(box);
          window.__pseHeroAnimDone = true;
        }
      };
      window.__pseHeroHooked = true;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
  window.addEventListener("load", run);
  setTimeout(run, 800);
  setTimeout(run, 2000);

  if (typeof MutationObserver !== "undefined") {
    var pending = false;
    new MutationObserver(function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        var hero = document.getElementById("hero-section");
        if (hero && !hero.querySelector(".pse-hero")) run();
        wireAboutLinks();
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
