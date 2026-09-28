













(function () {
  "use strict";

  var T = {
    eyebrow: { fr: "Nos services", en: "Our services" },
    title:   { fr: "Ce que nous faisons", en: "What we do" }
  };

  
  var SERVICES = [
    { t: { fr: "Développement de logiciels", en: "Software development" },
      d: { fr: "De la conception à la maintenance post-production : applications web, mobiles et systèmes métiers sur mesure.",
           en: "From design to post-production maintenance: bespoke web, mobile and business applications." } },
    { t: { fr: "Ingénierie, analyse & conseil", en: "Engineering, analysis & consulting" },
      d: { fr: "Étude approfondie, cadrage et recommandations pour sécuriser vos projets technologiques.",
           en: "In-depth study, scoping and recommendations to secure your technology projects." } },
    { t: { fr: "Gestion de projets informatiques", en: "IT project management" },
      d: { fr: "Planification, pilotage et supervision de bout en bout, avec maîtrise des coûts et des ressources.",
           en: "End-to-end planning, steering and oversight, with control of costs and resources." } },
    { t: { fr: "Vente, installation & maintenance", en: "Hardware, installation & support" },
      d: { fr: "Fourniture de matériel, installation, maintenance et assistance technique.",
           en: "Equipment supply, installation, maintenance and technical assistance." } },
    { t: { fr: "Exploration & valorisation des données", en: "Data mining & analytics" },
      d: { fr: "Extraction, analyse et visualisation pour transformer vos données en décisions.",
           en: "Extraction, analysis and visualisation to turn your data into decisions." } },
    { t: { fr: "Gestion du changement", en: "Change management" },
      d: { fr: "Accompagnement des transitions pour adopter vos nouveaux systèmes sans friction.",
           en: "Supporting transitions so your teams adopt new systems without friction." } }
  ];

  function getLang() {
    try { var s = localStorage.getItem("pse-lang"); if (s === "fr" || s === "en") return s; } catch (e) {}
    return "fr";
  }
  function L(o, lang) { return (o && o[lang]) || (o && o.fr) || ""; }
  function pad(i) { return (i < 9 ? "0" : "") + (i + 1); }

  function injectStyles() {
    if (document.getElementById("pse-acc-style")) return;
    var st = document.createElement("style");
    st.id = "pse-acc-style";
    
    
    st.textContent =
      ".pse-acc{padding:clamp(56px,7vw,104px) clamp(16px,4vw,56px);background:#fff;" +
      "font-family:'Geist','Geist Placeholder',Inter,system-ui,-apple-system,sans-serif}" +
      ".pse-acc__in{max-width:1240px;margin:0 auto}" +
      ".pse-acc__eyebrow{font-size:clamp(20px,2.2vw,30px);font-weight:700;letter-spacing:.04em;text-transform:uppercase;" +
      "color:#348ace;margin:0 auto 16px;text-align:center;line-height:1.15}" +
      ".pse-acc__t{font-weight:500;font-size:clamp(28px,3.6vw,46px);letter-spacing:-.04em;" +
      "color:#1e1e1f;line-height:1.15;margin:0 auto 40px;text-align:center}" +
      ".pse-acc__list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;border:0}" +
      ".pse-acc__item{min-width:0;min-height:240px;border:1px solid rgba(52,138,206,.18);" +
      "border-radius:20px;background:linear-gradient(155deg,#fff 0%,#f7fbff 100%);" +
      "box-shadow:0 14px 38px rgba(20,42,70,.08);overflow:hidden;" +
      "transition:transform .28s ease,box-shadow .28s ease,border-color .28s ease}" +
      ".pse-acc__item:hover{transform:translateY(-5px);border-color:rgba(52,138,206,.38);" +
      "box-shadow:0 22px 48px rgba(20,42,70,.14)}" +
      ".pse-acc__item.is-open{border-color:rgba(52,138,206,.48);background:#fff}" +
      ".pse-acc__head{display:grid;grid-template-columns:38px minmax(0,1fr);align-items:start;" +
      "gap:14px;width:100%;background:none;border:0;text-align:left;font-family:inherit;" +
      "padding:26px 24px 20px;color:#1e1e1f}" +
      ".pse-acc__num{display:flex;align-items:center;justify-content:center;width:38px;height:38px;" +
      "border-radius:50%;background:rgba(52,138,206,.10);font-size:14px;font-weight:700;color:#348ace}" +
      ".pse-acc__label{flex:1;font-weight:500;letter-spacing:-.04em;line-height:1.2;color:#1e1e1f!important;" +
      "font-size:clamp(20px,2.3vw,29px);transition:color .25s ease}" +
      ".pse-acc__sign{display:none;align-items:center;justify-content:center;width:28px;height:28px;" +
      "border:1px solid rgba(52,138,206,.25);border-radius:50%;font-size:22px;font-weight:400;color:#348ace;line-height:1;" +
      "transition:transform .3s ease,color .25s ease}" +
      ".pse-acc__item.is-open .pse-acc__label{color:#1e1e1f!important}" +
      ".pse-acc__item.is-open .pse-acc__sign{color:#348ace}" +
      ".pse-acc__body{overflow:visible;max-height:none;opacity:1}" +
      ".pse-acc__d{margin:0;padding:0 24px 28px 76px;max-width:none;" +
      "font-size:clamp(15px,1.2vw,17px);line-height:1.6;color:#56555f}" +
      "@media(max-width:900px){.pse-acc__list{grid-template-columns:repeat(2,minmax(0,1fr))}}" +
      "@media(max-width:600px){.pse-acc{padding-inline:16px}.pse-acc__list{grid-template-columns:1fr;gap:16px}" +
      ".pse-acc__item{min-height:0}.pse-acc__head{padding:22px 18px 18px;grid-template-columns:36px minmax(0,1fr)}" +
      ".pse-acc__num{width:36px;height:36px}.pse-acc__d{padding:0 18px 24px 68px}}";
    (document.head || document.documentElement).appendChild(st);
  }

  function render(lang) {
    var sec = document.createElement("section");
    sec.className = "pse-acc";
    sec.id = "pse-services";
    sec.setAttribute("data-framer-name", "Section Services PSE");

    var rows = "";
    for (var i = 0; i < SERVICES.length; i++) {
      rows +=
        '<div class="pse-acc__item' + (i === 0 ? " is-open" : "") + '" data-acc-item>' +
          '<div class="pse-acc__head">' +
            '<span class="pse-acc__num">' + pad(i) + '</span>' +
            '<span class="pse-acc__label" data-acc="t" data-i="' + i + '">' + L(SERVICES[i].t, lang) + '</span>' +
          '</div>' +
          '<div class="pse-acc__body">' +
            '<p class="pse-acc__d" data-acc="d" data-i="' + i + '">' + L(SERVICES[i].d, lang) + '</p>' +
          '</div>' +
        '</div>';
    }
    sec.innerHTML =
      '<div class="pse-acc__in">' +
        '<p class="pse-acc__eyebrow" data-acc="eyebrow">' + L(T.eyebrow, lang) + '</p>' +
        '<h2 class="pse-acc__t" data-acc="title">' + L(T.title, lang) + '</h2>' +
        '<div class="pse-acc__list">' + rows + '</div>' +
      '</div>';

    return sec;
  }

  function relang(lang) {
    document.querySelectorAll(".pse-acc").forEach(function (sec) {
    var q = sec.querySelector('[data-acc="eyebrow"]'); if (q) q.textContent = L(T.eyebrow, lang);
    q = sec.querySelector('[data-acc="title"]'); if (q) q.textContent = L(T.title, lang);
    var ts = sec.querySelectorAll('[data-acc="t"]');
    for (var i = 0; i < ts.length; i++) ts[i].textContent = L(SERVICES[ts[i].getAttribute("data-i")].t, lang);
    var ds = sec.querySelectorAll('[data-acc="d"]');
    for (var j = 0; j < ds.length; j++) ds[j].textContent = L(SERVICES[ds[j].getAttribute("data-i")].d, lang);
    });
  }

  function mount() {
    var anchors = document.querySelectorAll('[data-framer-name="Section Solutions Header"]');
    if (!anchors.length) return false;
    injectStyles();
    anchors.forEach(function (anchor, index) {
      if (!anchor.parentNode || (anchor.nextElementSibling && anchor.nextElementSibling.classList.contains("pse-acc"))) return;
      var section = render(getLang());
      section.id = index === 0 ? "pse-services" : "pse-services-" + index;
      anchor.parentNode.insertBefore(section, anchor.nextSibling);
    });
    return true;
  }

  function hookLang() {
    if (window.__pseSrvHooked) return;
    if (typeof window.PSE_setLang === "function") {
      var orig = window.PSE_setLang;
      window.PSE_setLang = function (l) { orig(l); relang(l === "en" ? "en" : "fr"); };
      window.__pseSrvHooked = true;
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
