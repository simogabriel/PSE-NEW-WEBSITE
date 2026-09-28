








(function () {
  "use strict";

  

  var BASE = (function () {
    var ss = document.getElementsByTagName("script");
    for (var i = 0; i < ss.length; i++) {
      var src = ss[i].src || "";
      if (/pse-custom\/nav\.js(\?|$)/.test(src)) {
        return src.replace(/pse-custom\/nav\.js.*$/, "");
      }
    }
    return "";
  })();

  var LINKS = [
    { href: "index.html",     fr: "Accueil",   en: "Home" },
    { href: "about.html",     fr: "À propos",  en: "About" },
    { href: "solutions.html", fr: "Solutions", en: "Solutions" },
    { href: "team.html",      fr: "Équipe",    en: "Team" },
    { href: "references.html", fr: "Références", en: "References" },
    { href: "contact.html",   fr: "Contact",   en: "Contact" }
  ];
  var CTA = { href: "contact.html", fr: "Nous contacter", en: "Get in Touch" };
  var THEME_KEY = "pse-theme";

  function storedTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch (e) {}
    return null;
  }

  function preferredTheme() {
    var saved = storedTheme();
    if (saved) return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark" : "light";
  }

  function applyTheme(theme, persist) {
    theme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-pse-theme", theme);
    document.documentElement.style.colorScheme = theme;
    if (persist) {
      try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    }
    var button = document.querySelector("[data-pse-theme-toggle]");
    if (button) {
      var next = theme === "dark" ? "light" : "dark";
      button.setAttribute("aria-label", next === "dark" ? "Enable dark mode" : "Enable light mode");
      button.setAttribute("title", next === "dark" ? "Dark mode" : "Light mode");
      button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      button.setAttribute("data-theme", theme);
    }
  }

  applyTheme(preferredTheme(), false);

  
  
  var legacyCleanup;
  function disableLegacyOfflineNavigation() {
    if (legacyCleanup) return legacyCleanup;
    legacyCleanup = Promise.resolve().then(function () {
      if (!/^https?:$/.test(location.protocol) || !("serviceWorker" in navigator)) return;
      var expectedWorker = new URL("pse-carousel-sw.js", BASE).href;
      return navigator.serviceWorker.getRegistrations().then(function (registrations) {
        return Promise.all(registrations.map(function (registration) {
          if (registration.scope !== BASE) return;
          var workers = [registration.active, registration.waiting, registration.installing];
          if (!workers.some(function (worker) { return worker && worker.scriptURL === expectedWorker; })) return;
          workers.forEach(function (worker) {
            if (worker && worker.scriptURL === expectedWorker) {
              worker.postMessage({ type: "PSE_DISABLE_OFFLINE_CACHE" });
            }
          });
          return registration.unregister();
        }));
      });
    }).catch(function () {});
    return legacyCleanup;
  }
  window.PSE_clearLegacyPageCache = disableLegacyOfflineNavigation;

  function getLang() {
    try { var s = localStorage.getItem("pse-lang"); if (s === "fr" || s === "en") return s; } catch (e) {}
    return "fr";
  }

  function currentFile() {
    return (location.pathname.split("/").pop() || "index.html");
  }

  function injectCSS() {
    if (document.querySelector("link[data-pse-enhance]")) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = BASE + "pse-custom/enhance.css?v=101";
    l.setAttribute("data-pse-enhance", "");
    document.head.appendChild(l);
  }

  
  function hideFramerNav() {
    var navs = document.querySelectorAll('nav[data-framer-name="Primary"]');
    for (var i = 0; i < navs.length; i++) navs[i].classList.add("pse-framer-hidden");
  }

  
  function updateNavLang(lang) {
    var nav = document.querySelector(".pse-nav");
    if (!nav) return;
    var labels = nav.querySelectorAll("[data-fr][data-en]");
    for (var i = 0; i < labels.length; i++) {
      var v = labels[i].getAttribute("data-" + lang);
      if (v != null) labels[i].textContent = v;
    }
    var btns = nav.querySelectorAll("[data-pse-lang]");
    for (var j = 0; j < btns.length; j++) {
      var active = btns[j].getAttribute("data-pse-lang") === lang;
      btns[j].classList.toggle("is-active", active);
      btns[j].setAttribute("aria-pressed", active ? "true" : "false");
    }
  }

  
  function hookLang() {
    if (window.__pseNavHooked) return;
    if (typeof window.PSE_setLang === "function") {
      var orig = window.PSE_setLang;
      window.PSE_setLang = function (l) { orig(l); updateNavLang(l); };
      window.__pseNavHooked = true;
    }
  }

  function setLang(lang) {
    if (typeof window.PSE_setLang === "function") {
      window.PSE_setLang(lang);
    } else {
      try { localStorage.setItem("pse-lang", lang); } catch (e) {}
      updateNavLang(lang);
    }
  }

  function build() {
    var existingNav = document.querySelector(".pse-nav");
    if (existingNav && existingNav.dataset.pseBound === "true") return;
    var lang = getLang();
    var cur = currentFile();

    var html = "";
    
    html += '<a class="pse-nav__brand" href="' + BASE + 'index.html" aria-label="PSE Consulting">' +
            '<img src="' + BASE + 'pse-custom/pse-logo.webp" alt="PSE Consulting"></a>';

    
    html += '<button class="pse-nav__burger" type="button" aria-label="Menu" aria-expanded="false"><span></span></button>';

    
    html += '<ul class="pse-nav__links">';
    for (var i = 0; i < LINKS.length; i++) {
      var L = LINKS[i];
      var cls = (L.href === cur) ? ' class="is-active"' : '';
      html += '<li><a' + cls + ' href="' + BASE + L.href + '" data-fr="' + L.fr + '" data-en="' + L.en + '">' +
              (lang === "en" ? L.en : L.fr) + '</a></li>';
    }
    html += '</ul>';

    
    
    html += '<div class="pse-nav__right">' +
              '<button class="pse-nav__theme" type="button" data-pse-theme-toggle aria-label="Toggle colour theme">' +
                '<span class="pse-nav__theme-sun" aria-hidden="true">☀</span>' +
                '<span class="pse-nav__theme-moon" aria-hidden="true">☾</span>' +
              '</button>' +
              '<div class="pse-nav__lang" role="group" aria-label="Langue / Language">' +
                '<button type="button" data-pse-lang="fr">FR</button>' +
                '<button type="button" data-pse-lang="en">EN</button>' +
              '</div>' +
            '</div>';

    var nav = existingNav || document.createElement("header");
    if (!existingNav) {
      nav.className = "pse-nav";
      nav.innerHTML = html;
      document.body.insertBefore(nav, document.body.firstChild);
    }
    nav.dataset.pseBound = "true";

    
    nav.addEventListener("click", function (e) {
      var themeBtn = e.target.closest("[data-pse-theme-toggle]");
      if (themeBtn) {
        applyTheme(document.documentElement.getAttribute("data-pse-theme") === "dark" ? "light" : "dark", true);
        return;
      }
      var langBtn = e.target.closest("[data-pse-lang]");
      if (langBtn) { setLang(langBtn.getAttribute("data-pse-lang")); return; }

      var burger = e.target.closest(".pse-nav__burger");
      if (burger) {
        var open = nav.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        return;
      }
      var navLink = e.target.closest(".pse-nav__links a");
      if (navLink) {
        nav.classList.remove("is-open");
        if (!e.defaultPrevented && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
          e.preventDefault();
          var destination = navLink.href;
          
          
          disableLegacyOfflineNavigation();
          window.location.assign(destination);
        }
      }
    });

    window.addEventListener("scroll", function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 10);
    }, { passive: true });

    hookLang();
    updateNavLang(lang);
    applyTheme(preferredTheme(), false);

    
    var floating = document.querySelector(".pse-lang-switch");
    if (floating) floating.parentNode.removeChild(floating);
  }

  function run() {
    document.documentElement.classList.add("pse-has-nav");
    disableLegacyOfflineNavigation();
    injectCSS();
    hideFramerNav();
    build();
    hookLang();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
  
  window.addEventListener("load", run);
  setTimeout(run, 800);
  setTimeout(run, 2000);

  if (window.matchMedia) {
    var systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    var syncSystemTheme = function (event) {
      if (!storedTheme()) applyTheme(event.matches ? "dark" : "light", false);
    };
    if (systemTheme.addEventListener) systemTheme.addEventListener("change", syncSystemTheme);
    else if (systemTheme.addListener) systemTheme.addListener(syncSystemTheme);
  }

  
  if (typeof MutationObserver !== "undefined") {
    var pending = false;
    new MutationObserver(function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        hideFramerNav();
        if (!document.querySelector(".pse-nav")) build();
        var f = document.querySelector(".pse-lang-switch");
        if (f) f.parentNode.removeChild(f);
      });
    }).observe(document.body, { childList: true, subtree: true });
  }
})();
