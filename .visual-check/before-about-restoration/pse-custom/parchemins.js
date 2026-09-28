













(function () {
  "use strict";

  var SECTION_SEL = '[data-framer-name="Section Our Values"]';

  var T = {
    eyebrow: { fr: "Parchemins d'honneur", en: "Honours & Awards" },
    title: { fr: "L'excellence de nos équipes, distinguée", en: "Our Teams' Excellence, Recognised" },
    sub: {
      fr: "Lors de notre cérémonie d'excellence, PSE Consulting a remis ses parchemins d'honneur — Prix du PDG, Prix d'Excellence, Prix du meilleur employé — pour saluer le talent, l'engagement et la contribution remarquable de ses collaborateurs.",
      en: "At our excellence ceremony, PSE Consulting presented its honours — CEO Award, Excellence Award, Best Employee — celebrating the talent, commitment and outstanding contribution of its people."
    }
  };

  var SHOTS = [
    { img: "parchemin-1.jpeg", cap: { fr: "C?r?monie d?excellence PSE Consulting", en: "PSE Consulting excellence ceremony" } },
    { img: "parchemin-2.jpeg", cap: { fr: "C?r?monie d?excellence PSE Consulting", en: "PSE Consulting excellence ceremony" } },
    { img: "parchemin-3.jpeg", cap: { fr: "C?r?monie d?excellence PSE Consulting", en: "PSE Consulting excellence ceremony" } },
    { img: "parchemin-4.jpeg", cap: { fr: "C?r?monie d?excellence PSE Consulting", en: "PSE Consulting excellence ceremony" } },
    { img: "parchemin-5.jpeg", cap: { fr: "C?r?monie d?excellence PSE Consulting", en: "PSE Consulting excellence ceremony" } }
  ];

  function getLang() {
    try { var s = localStorage.getItem("pse-lang"); if (s === "fr" || s === "en") return s; } catch (e) {}
    return "fr";
  }
  function L(o, lang) { return (o && o[lang]) || (o && o.fr) || ""; }
  function BASE() {
    var ss = document.getElementsByTagName("script");
    for (var i = 0; i < ss.length; i++) {
      var s = ss[i].src || "";
      if (/pse-custom\/parchemins\.js(\?|$)/.test(s)) return s.replace(/pse-custom\/parchemins\.js.*$/, "");
    }
    return "";
  }

  function injectStyles() {
    if (document.getElementById("pse-parch-style")) return;
    var st = document.createElement("style");
    st.id = "pse-parch-style";
    st.textContent =
      
      ".pse-parch{width:100%;font-family:'Geist','Geist Placeholder',Inter,system-ui,-apple-system,sans-serif}" +
      ".pse-parch__head{width:min(100%,780px);margin:0 auto 40px;text-align:center}" +
      ".pse-parch__eyebrow{font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;" +
      "color:#348ace;margin:0 0 12px}" +
      ".pse-parch__t{font-family:'Geist','Geist Placeholder',Inter,sans-serif;font-weight:500;" +
      "font-size:clamp(26px,3.4vw,44px);letter-spacing:-.04em;color:#1e1e1f;margin:0 0 16px;line-height:1.15}" +
      ".pse-parch__s{font-size:clamp(15px,1.4vw,18px);line-height:1.65;color:#5b5b6b;margin:0}" +
      ".pse-parch__grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}" +
      ".pse-parch__fig{margin:0;border-radius:18px;overflow:hidden;background:#0c1424;position:relative;" +
      "box-shadow:0 12px 34px rgba(12,20,36,.16);transition:transform .3s ease,box-shadow .3s ease}" +
      ".pse-parch__fig:hover{transform:translateY(-5px);box-shadow:0 22px 48px rgba(12,20,36,.24)}" +
      ".pse-parch__fig img{display:block;width:100%;height:100%;aspect-ratio:3/2;object-fit:cover}" +
      ".pse-parch__cap{position:absolute;left:0;right:0;bottom:0;margin:0;padding:34px 18px 14px;" +
      "font-size:14px;font-weight:600;color:#fff;line-height:1.3;" +
      "background:linear-gradient(to top,rgba(8,16,28,.82),rgba(8,16,28,0))}" +
      "@media(max-width:760px){.pse-parch__grid{grid-template-columns:1fr}}" +
      "[data-pse-parch-hidden]{display:none !important}";
    (document.head || document.documentElement).appendChild(st);
  }

  function build(lang) {
    var base = BASE();
    var wrap = document.createElement("div");
    wrap.className = "pse-parch";
    wrap.setAttribute("data-pse-parch", "1");
    var cards = "";
    for (var i = 0; i < SHOTS.length; i++) {
      cards +=
        '<figure class="pse-parch__fig">' +
          '<img loading="lazy" src="' + base + 'pse-custom/about/' + SHOTS[i].img + '" alt="' + L(SHOTS[i].cap, lang) + '">' +
          '<figcaption class="pse-parch__cap" data-parch="cap" data-i="' + i + '">' + L(SHOTS[i].cap, lang) + '</figcaption>' +
        '</figure>';
    }
    wrap.innerHTML =
      '<div class="pse-parch__head">' +
        '<p class="pse-parch__eyebrow" data-parch="eyebrow">' + L(T.eyebrow, lang) + '</p>' +
        '<h2 class="pse-parch__t" data-parch="title">' + L(T.title, lang) + '</h2>' +
        '<p class="pse-parch__s" data-parch="sub">' + L(T.sub, lang) + '</p>' +
      '</div>' +
      '<div class="pse-parch__grid">' + cards + '</div>';
    return wrap;
  }

  function relangSection(w, lang) {
    if (!w) return;
    var q;
    q = w.querySelector('[data-parch="eyebrow"]'); if (q) q.textContent = L(T.eyebrow, lang);
    q = w.querySelector('[data-parch="title"]'); if (q) q.textContent = L(T.title, lang);
    q = w.querySelector('[data-parch="sub"]'); if (q) q.textContent = L(T.sub, lang);
    var caps = w.querySelectorAll('[data-parch="cap"]');
    for (var i = 0; i < caps.length; i++) caps[i].textContent = L(SHOTS[caps[i].getAttribute("data-i")].cap, lang);
  }

  function relang(lang) {
    document.querySelectorAll('[data-pse-parch]').forEach(function (w) { relangSection(w, lang); });
  }

  function hideOriginals(holder, mine) {
    var kids = holder.children;
    for (var i = 0; i < kids.length; i++) {
      if (kids[i] !== mine && !kids[i].hasAttribute("data-pse-parch")) {
        kids[i].setAttribute("data-pse-parch-hidden", "1");
      }
    }
  }

  function mountSection(section) {
    if (!section) return false;
    injectStyles();
    var holder = section.querySelector('[data-framer-name="Content Wrap"]') ||
                 section.querySelector('[data-framer-name="Container"]') || section;
    
    holder.style.opacity = "1"; holder.style.transform = "none";

    var mine = holder.querySelector('[data-pse-parch]');
    if (mine) return true;

    mine = build(getLang());
    holder.appendChild(mine);

    return true;
  }

  function mount() {
    var sections = document.querySelectorAll(SECTION_SEL);
    for (var i = 0; i < sections.length; i++) mountSection(sections[i]);
    return sections.length > 0;
  }

  function hookLang() {
    if (window.__pseParchHooked) return;
    if (typeof window.PSE_setLang === "function") {
      var orig = window.PSE_setLang;
      window.PSE_setLang = function (l) { orig(l); relang(l === "en" ? "en" : "fr"); };
      window.__pseParchHooked = true;
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
      window.requestAnimationFrame(function () {
        pend = false;
        var section = document.querySelector(SECTION_SEL);
        if (section) mount();
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
