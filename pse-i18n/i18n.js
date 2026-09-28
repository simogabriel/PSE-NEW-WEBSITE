












(function () {
  "use strict";

  var DEFAULT = "fr";
  var SUPPORTED = ["fr", "en"];
  var STORAGE_KEY = "pse-lang";
  var T = window.PSE_T || {};
  var B = window.PSE_BLOCK || {};

  var currentLang = DEFAULT;
  var registry = [];           
  var seen = (typeof WeakSet !== "undefined") ? new WeakSet() : null;
  var ATTRIBUTES = ["placeholder", "aria-label", "title"];

  function normalize(s) {
    return s.replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();
  }

  function getLang() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      if (s && SUPPORTED.indexOf(s) !== -1) return s;
    } catch (e) {}
    return DEFAULT;
  }

  
  function scan(root, lang) {
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var n;
    while ((n = walker.nextNode())) {
      if (seen && seen.has(n)) continue;
      var raw = n.nodeValue;
      if (!raw || !raw.trim()) continue;
      var key = normalize(raw);
      var entry = T[key];
      if (!entry) continue;

      if (seen) seen.add(n);
      var lead = (raw.match(/^\s*/) || [""])[0];
      var trail = (raw.match(/\s*$/) || [""])[0];
      registry.push({ node: n, key: key, lead: lead, trail: trail });

      if (entry[lang] != null) n.nodeValue = lead + entry[lang] + trail;
    }
  }

  
  
  
  function translateBlocks(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT;
    var els = document.querySelectorAll("h1, h2, h3, p, [data-pse-block]");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var key = el.getAttribute("data-pse-block") || normalize(el.textContent || "");
      var entry = B[key];
      if (!entry) continue;
      el.setAttribute("data-pse-block", key);
      var val = entry[lang] != null ? entry[lang] : key;
      if (normalize(el.textContent || "") !== normalize(val)) {
        el.textContent = val;
        el.style.opacity = "1";
        el.style.transform = "none";
      }
    }
  }

  
  
  
  function translateAttributes(lang) {
    var elements = document.querySelectorAll("[placeholder], [aria-label], [title]");
    for (var i = 0; i < elements.length; i++) {
      for (var j = 0; j < ATTRIBUTES.length; j++) {
        var attribute = ATTRIBUTES[j];
        if (!elements[i].hasAttribute(attribute)) continue;
        var dataAttribute = "data-pse-i18n-" + attribute;
        var key = elements[i].getAttribute(dataAttribute) || normalize(elements[i].getAttribute(attribute) || "");
        var entry = T[key];
        if (!entry) continue;
        if (!elements[i].hasAttribute(dataAttribute)) elements[i].setAttribute(dataAttribute, key);
        if (entry[lang] != null) elements[i].setAttribute(attribute, entry[lang]);
      }
    }

    var titleKey = document.documentElement.getAttribute("data-pse-i18n-title") || normalize(document.title || "");
    var titleEntry = T[titleKey];
    if (titleEntry) {
      document.documentElement.setAttribute("data-pse-i18n-title", titleKey);
      if (titleEntry[lang] != null) document.title = titleEntry[lang];
    }
  }

  
  function apply(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT;
    currentLang = lang;
    document.documentElement.setAttribute("lang", lang);

    for (var i = 0; i < registry.length; i++) {
      var r = registry[i];
      var val = T[r.key] && T[r.key][lang];
      if (val != null) {
        try { r.node.nodeValue = r.lead + val + r.trail; } catch (e) {}
      }
    }

    translateBlocks(lang);
    translateAttributes(lang);

    var btns = document.querySelectorAll("[data-pse-lang]");
    for (var j = 0; j < btns.length; j++) {
      var active = btns[j].getAttribute("data-pse-lang") === lang;
      btns[j].classList.toggle("is-active", active);
      btns[j].setAttribute("aria-pressed", active ? "true" : "false");
    }

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function buildSwitcher() {
    if (document.querySelector(".pse-lang-switch")) return;

    var box = document.createElement("div");
    box.className = "pse-lang-switch";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Langue / Language");
    box.innerHTML =
      '<button type="button" data-pse-lang="fr">FR</button>' +
      '<button type="button" data-pse-lang="en">EN</button>';
    document.body.appendChild(box);

    box.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-pse-lang]");
      if (btn) apply(btn.getAttribute("data-pse-lang"));
    });

    var style = document.createElement("style");
    style.textContent =
      ".pse-lang-switch{position:fixed;top:16px;right:16px;z-index:2147483000;" +
      "display:flex;gap:2px;background:rgba(255,255,255,.92);-webkit-backdrop-filter:blur(8px);" +
      "backdrop-filter:blur(8px);border:1px solid rgba(0,0,0,.08);border-radius:999px;padding:3px;" +
      "box-shadow:0 6px 22px rgba(0,0,0,.14);font-family:Inter,system-ui,-apple-system,sans-serif}" +
      ".pse-lang-switch button{border:0;background:transparent;color:#555;font-size:12px;" +
      "font-weight:700;padding:6px 11px;border-radius:999px;cursor:pointer;line-height:1;transition:.2s}" +
      ".pse-lang-switch button:hover{color:#4527a4}" +
      ".pse-lang-switch button.is-active{background:#4527a4;color:#fff}";
    document.head.appendChild(style);
  }

  
  
  
  
  function footerBrandStyle() {
    if (document.getElementById("pse-footer-brand-style")) return;
    var st = document.createElement("style");
    st.id = "pse-footer-brand-style";
    st.textContent =
      "footer h2{--framer-font-size:clamp(34px,7vw,84px)!important;" +
      "font-size:clamp(34px,7vw,84px)!important;line-height:1.04!important;" +
      "letter-spacing:-.02em!important;text-wrap:balance}";
    (document.head || document.documentElement).appendChild(st);
  }

  function init() {
    currentLang = getLang();
    footerBrandStyle();
    scan(document.body, currentLang);
    buildSwitcher();
    apply(currentLang);

    
    if (typeof MutationObserver !== "undefined") {
      var pending = false;
      var observer = new MutationObserver(function (mutations) {
        if (pending) return;
        pending = true;
        requestAnimationFrame(function () {
          pending = false;
          for (var i = 0; i < mutations.length; i++) {
            var m = mutations[i];
            if (m.type === "characterData") {
              scan(m.target.parentNode, currentLang);
            } else {
              for (var k = 0; k < m.addedNodes.length; k++) {
                scan(m.addedNodes[k], currentLang);
              }
            }
          }
          translateBlocks(currentLang);
          translateAttributes(currentLang);
        });
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    
    window.addEventListener("load", function () { scan(document.body, currentLang); translateBlocks(currentLang); translateAttributes(currentLang); });
    setTimeout(function () { scan(document.body, currentLang); translateBlocks(currentLang); translateAttributes(currentLang); }, 1200);
    setTimeout(function () { translateBlocks(currentLang); translateAttributes(currentLang); }, 2500);
  }

  window.PSE_setLang = apply;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
