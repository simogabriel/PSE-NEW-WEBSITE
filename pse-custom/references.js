









(function () {
  "use strict";

  var T = {
    eyebrow: { fr: "Réalisations", en: "Track Record" },
    title: { fr: "Nos références", en: "Our References" },
    sub: {
      fr: "Ensemble, nous bâtissons l'avenir en menant à bien des projets d'envergure.",
      en: "Together we build the future by delivering ambitious, large-scale projects."
    },
    trust: { fr: "Ils nous font confiance", en: "Trusted by" }
  };
 
  var REFS = [
    { t: { fr: "Ministère de la Santé Publique — Cameroun, 2023", en: "Ministry of Public Health — Cameroon, 2023" },
      d: { fr: "Mise en place du site web du CSU/CTN : une plateforme numérique pour accéder facilement à l'ensemble des services de santé de qualité, de la promotion à la prévention et au traitement.",
           en: "Delivery of the CSU/CTN website: a digital platform giving easy access to the full range of quality health services, from promotion to prevention and treatment." } },
    { t: { fr: "Ministère des Transports — Cameroun, 2022", en: "Ministry of Transport — Cameroon, 2022" },
      d: { fr: "Plateforme multidimensionnelle d'échanges, de sensibilisation, d'éducation, d'information, d'interaction et d'analyse sur la sécurité routière au Cameroun.",
           en: "A multidimensional platform for exchange, awareness, education, information, interaction and analysis on road safety in Cameroon." } },
    { t: { fr: "Fonds Routier — Cameroun, 2022", en: "Road Fund — Cameroon, 2022" },
      d: { fr: "Développement d'une plateforme électronique pour l'authentification des déclarations et des dépôts au Fonds routier.",
           en: "Development of an electronic platform for authenticating declarations and deposits to the Road Fund." } },
    { t: { fr: "MINEPAT — Cameroun, 2016-2021", en: "MINEPAT — Cameroon, 2016-2021" },
      d: { fr: "Système de gestion automatique des processus de programmation, en lien avec le maillon planification de la chaîne PPBS du MINEPAT.",
           en: "Automatic management system for programming processes, linked to the planning component of MINEPAT's PPBS chain." } },
    { t: { fr: "Port Autonome de Douala — Cameroun, 2020", en: "Port Authority of Douala — Cameroon, 2020" },
      d: { fr: "Plateforme web pour automatiser la base de données des projets indispensables à la planification et à la programmation du budget du Port Autonome de Douala.",
           en: "Web platform automating the database of projects essential to planning and budgeting for the Port Authority of Douala." } },
    { t: { fr: "MINEPAT — Cameroun, 2016", en: "MINEPAT — Cameroon, 2016" },
      d: { fr: "Système de reporting des données sur la mise en œuvre du BIP au Cameroun, pour le suivi des ressources budgétaires physiques et financières.",
           en: "Data reporting system on BIP implementation in Cameroon, tracking physical and financial budget resources." } },
    { t: { fr: "Canton de Genève — Suisse, 2011", en: "Canton of Geneva — Switzerland, 2011" },
      d: { fr: "Développement d'un système informatique pour la remontée des données radar dans le canton de Genève.",
           en: "Development of an IT system for collecting radar data in the canton of Geneva." } },
    { t: { fr: "Blue infinity — Suisse", en: "Blue infinity — Switzerland" },
      d: { fr: "Application pour le département Marketing de Blue-infinity à Genève : analyse du comportement et des habitudes d'achat des consommateurs pour mieux répondre à leurs attentes.",
           en: "Application for Blue-infinity's Marketing department in Geneva: analyzing consumer behaviour and buying habits to better meet their expectations." } }
  ];

  var CLIENTS = [
    { name: "Nestlé", logo: "pse-custom/clients/nestle.png" },
    { name: "Philip Morris International", logo: "pse-custom/clients/philip-morris.png" },
    { name: "Pictet", logo: "pse-custom/clients/pictet.png" },
    { name: "Canton de Vaud", logo: "pse-custom/clients/canton-de-vaud.png" },
    { name: "Nespresso", logo: "pse-custom/clients/nespresso.png" },
    { name: "République et Canton de Genève", logo: "pse-custom/clients/republic-canton-geneve.png" },
    { name: "Blue Infinity", logo: "pse-custom/clients/blue-infinity.png" },
    { name: "BC PME", logo: "pse-custom/clients/bc-pme.png" },
    { name: "MINEPAT — Cameroun", logo: "pse-custom/clients/minepat.png" },
    { name: "Ministère de la Santé Publique — Cameroun", logo: "pse-custom/clients/minessante.png" },
    { name: "Ministère des Transports — Cameroun", logo: "pse-custom/clients/minetransport.png" },
    { name: "Fonds Routier — Cameroun", logo: "pse-custom/clients/fond-routier.png" },
    { name: "Port Autonome de Douala", logo: "pse-custom/clients/Pad.png" }
  ];

  
  var REF_LOGOS = [
    "pse-custom/clients/minessante.png",
    "pse-custom/clients/minetransport.png",
    "pse-custom/clients/fond-routier.png",
    "pse-custom/clients/minepat.png",
    "pse-custom/clients/Pad.png",
    "pse-custom/clients/minepat.png",
    "pse-custom/clients/republic-canton-geneve.png",
    "pse-custom/clients/blue-infinity.png"
  ];

  function getLang() {
    try { var s = localStorage.getItem("pse-lang"); if (s === "fr" || s === "en") return s; } catch (e) {}
    return "fr";
  }
  function L(o, lang) { return (o && o[lang]) || (o && o.fr) || ""; }

  function injectStyles() {
    if (document.getElementById("pse-refs-style")) return;
    var st = document.createElement("style");
    st.id = "pse-refs-style";
    st.textContent =
      ".pse-refs{padding:96px clamp(16px,4vw,56px);background:#ffffff;" +
      "font-family:'Geist','Geist Placeholder',Inter,system-ui,-apple-system,sans-serif}" +
      ".pse-refs__in{max-width:1180px;margin:0 auto}" +
      ".pse-refs__head{max-width:720px;margin:0 auto 52px;text-align:center}" +
      ".pse-refs__eyebrow{font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;" +
      "color:#348ace;margin:0 0 14px}" +
      ".pse-refs__t{font-family:'Geist','Geist Placeholder',Inter,sans-serif;" +
      "font-weight:500;font-size:clamp(26px,3.4vw,44px);letter-spacing:-.04em;color:#1e1e1f;margin:0 0 16px;line-height:1.15}" +
      ".pse-refs__s{font-size:clamp(16px,1.5vw,19px);line-height:1.65;color:#6b6b7b;margin:0}" +
      ".pse-refs__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:20px}" +
      ".pse-ref{position:relative;overflow:hidden;background:#fff;border:1px solid rgba(22,20,42,.06);border-radius:20px;" +
      "padding:30px 30px 28px;display:flex;flex-direction:column;gap:14px;" +
      "box-shadow:0 1px 2px rgba(12,20,36,.04);" +
      "transition:transform .35s cubic-bezier(.22,.61,.36,1),box-shadow .35s ease,border-color .35s ease}" +
      ".pse-ref::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;" +
      "background:linear-gradient(180deg,#348ace,#1f6fae);transform:scaleY(0);transform-origin:top;" +
      "transition:transform .35s cubic-bezier(.22,.61,.36,1)}" +
      ".pse-ref:hover{transform:translateY(-6px);border-color:rgba(52,138,206,.20);" +
      "box-shadow:0 24px 50px rgba(12,20,36,.12)}" +
      ".pse-ref:hover::before{transform:scaleY(1)}" +
      ".pse-ref__logo{display:block;width:auto;max-width:230px;height:82px;max-height:82px;" +
      "object-fit:contain;align-self:center;margin:0 auto}" +
      ".pse-ref__t{font-family:'Geist','Geist Placeholder',Inter,sans-serif;font-weight:500;" +
      "font-size:18px;line-height:1.32;letter-spacing:-.01em;color:#16142a;margin:2px 0 0;text-align:center}" +
      ".pse-ref__d{font-size:14.5px;line-height:1.7;color:#5b5b6b;margin:0;text-align:center}" +
      ".pse-refs__trust{margin:64px 0 0;text-align:center}" +
      ".pse-refs__trust h4{display:flex;align-items:center;justify-content:center;gap:20px;" +
      "font-size:12.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;" +
      "color:#9a9aab;margin:0 0 26px}" +
      ".pse-refs__trust h4::before,.pse-refs__trust h4::after{content:'';height:1px;width:min(120px,14vw);" +
      "background:linear-gradient(90deg,transparent,rgba(22,20,42,.16))}" +
      ".pse-refs__trust h4::after{background:linear-gradient(90deg,rgba(22,20,42,.16),transparent)}" +
      ".pse-refs__clients{width:100%}" +
      ".pse-logos{display:flex;flex-direction:column;gap:16px;width:100%}" +
      
      ".pse-logos__row{display:flex;flex-wrap:nowrap;justify-content:center;gap:14px}" +
      ".pse-logos__row--bot{max-width:66%;margin:0 auto}" +   
      ".pse-logo{flex:1 1 0;min-width:0;max-width:150px;height:84px;" +
      "display:flex;align-items:center;justify-content:center;padding:14px 16px;box-sizing:border-box;" +
      "background:linear-gradient(160deg,#fcfdfe,#f4f7fa);border:1px solid rgba(22,20,42,.06);border-radius:14px;" +
      "transition:transform .28s cubic-bezier(.22,.61,.36,1),box-shadow .28s ease,border-color .28s ease}" +
      ".pse-logo:hover{transform:translateY(-4px);border-color:rgba(52,138,206,.22);background:#fff;" +
      "box-shadow:0 16px 32px rgba(12,20,36,.12)}" +
      ".pse-logo img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;display:block;" +
      "filter:grayscale(100%);opacity:.7;transition:filter .25s ease,opacity .25s ease}" +
      ".pse-logo:hover img{filter:grayscale(0);opacity:1}" +
      "@media(max-width:680px){.pse-logos__row{flex-wrap:wrap}.pse-logos__row--bot{max-width:none}" +
      ".pse-logo{flex:0 0 calc(33.333% - 10px);height:66px;padding:10px 12px}}" +
      "@media(max-width:980px){.pse-refs__grid{grid-template-columns:repeat(2,1fr)}}" +
      "@media(max-width:620px){.pse-refs__grid{grid-template-columns:1fr}}";
    (document.head || document.documentElement).appendChild(st);
  }
//media screen size ensure there sizings responsible for it
  function render(lang) {
    var sec = document.createElement("section");
    sec.className = "pse-refs";
    sec.id = "pse-references";
    sec.setAttribute("data-framer-name", "Section References");

    var cards = "";
    for (var i = 0; i < REFS.length; i++) {
      cards +=
        '<article class="pse-ref">' +
          '<img class="pse-ref__logo" loading="lazy" src="' + (REF_LOGOS[i] || "") +
            '" alt="">' +
          '<h3 class="pse-ref__t" data-ref="t" data-i="' + i + '">' + L(REFS[i].t, lang) + '</h3>' +
          '<p class="pse-ref__d" data-ref="d" data-i="' + i + '">' + L(REFS[i].d, lang) + '</p>' +
        '</article>';
    }
    
    function tile(c) {
      return '<div class="pse-logo"><img src="' + c.logo + '" alt="' + c.name +
             '" title="' + c.name + '" loading="lazy"></div>';
    }
    var rowTop = "", rowBot = "";
    for (var c = 0; c < CLIENTS.length; c++)
      if (c < 8) { rowTop += tile(CLIENTS[c]); } else { rowBot += tile(CLIENTS[c]); }
    var clients =
      '<div class="pse-logos">' +
        '<div class="pse-logos__row pse-logos__row--top">' + rowTop + '</div>' +
        '<div class="pse-logos__row pse-logos__row--bot">' + rowBot + '</div>' +
      '</div>';// ensure there are several stuffs with it's

    sec.innerHTML =
      '<div class="pse-refs__in">' +
        '<div class="pse-refs__head">' +
          '<p class="pse-refs__eyebrow" data-ref="eyebrow">' + L(T.eyebrow, lang) + '</p>' +
          '<h2 class="pse-refs__t" data-ref="title">' + L(T.title, lang) + '</h2>' +
          '<p class="pse-refs__s" data-ref="sub">' + L(T.sub, lang) + '</p>' +
        '</div>' +
        '<div class="pse-refs__grid">' + cards + '</div>' +
        '<div class="pse-refs__trust">' +
          '<h4 data-ref="trust">' + L(T.trust, lang) + '</h4>' +
          '<div class="pse-refs__clients">' + clients + '</div>' +
        '</div>' +
      '</div>';
    return sec;
  }

  function relang(lang) {
    var sec = document.getElementById("pse-references");
    if (!sec) return;
    var q = sec.querySelector('[data-ref="eyebrow"]'); if (q) q.textContent = L(T.eyebrow, lang);
    q = sec.querySelector('[data-ref="title"]'); if (q) q.textContent = L(T.title, lang);
    q = sec.querySelector('[data-ref="sub"]'); if (q) q.textContent = L(T.sub, lang);
    q = sec.querySelector('[data-ref="trust"]'); if (q) q.textContent = L(T.trust, lang);
    var ts = sec.querySelectorAll('[data-ref="t"]');
    for (var i = 0; i < ts.length; i++) ts[i].textContent = L(REFS[ts[i].getAttribute("data-i")].t, lang);
    var ds = sec.querySelectorAll('[data-ref="d"]');
    for (var j = 0; j < ds.length; j++) ds[j].textContent = L(REFS[ds[j].getAttribute("data-i")].d, lang);
  }//The dynamic effect of pse consulting sarl 

  function mount() {
    if (document.getElementById("pse-references")) return true;
    
    var anchor = document.querySelector('[data-framer-name="Section Recent Articles"]');
    if (!anchor || !anchor.parentNode) return false;
    injectStyles();
    var sec = render(getLang());
    anchor.parentNode.insertBefore(sec, anchor.nextSibling);
    return true;
  }//based on inheritance of it's parents 

  function hookLang() {
    if (window.__pseRefsHooked) return;
    if (typeof window.PSE_setLang === "function") {
      var orig = window.PSE_setLang;
      window.PSE_setLang = function (l) { orig(l); relang(l === "en" ? "en" : "fr"); };
      window.__pseRefsHooked = true;
    }
  }

  function boot() { if (mount()) hookLang(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
  window.addEventListener("load", boot);
  setTimeout(boot, 800);
  setTimeout(boot, 2200);
//timeline for ensuring the load time responsiveness 
  if (typeof MutationObserver !== "undefined") {
    var pend = false;
    new MutationObserver(function () {
      if (pend) return;
      pend = true;
      window.requestAnimationFrame(function () { pend = false; boot(); });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
