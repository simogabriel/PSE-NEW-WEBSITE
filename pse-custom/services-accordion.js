









(function () {
  "use strict";

  var T = {
    eyebrow: { fr: "Nos services", en: "Our Services" },
    title: { fr: "Ce que nous faisons", en: "What We Do" }
  };

  var SERVICES = [
    { t: { fr: "Développement de logiciels", en: "Software Development" },
      d: { fr: "De la conception à la maintenance post-production : applications web, mobiles et systèmes métiers sur mesure.",
           en: "From design to post-production maintenance: custom web, mobile and business applications." } },
    { t: { fr: "Ingénierie, analyse & conseil", en: "Engineering, Analysis & Advice" },
      d: { fr: "Étude approfondie de vos besoins, analyse fonctionnelle et conseil stratégique pour cadrer et sécuriser vos projets numériques.",
           en: "In-depth study of your needs, functional analysis and strategic advice to frame and secure your digital projects." } },
    { t: { fr: "Gestion de projets informatiques", en: "IT Project Management" },
      d: { fr: "Planification, organisation et supervision de l'exécution de vos projets, dans le respect des délais, du budget et de la qualité.",
           en: "Planning, organizing and supervising project delivery — on time, on budget and to the expected quality." } },
    { t: { fr: "Vente, installation & maintenance", en: "Sale, Installation & Maintenance" },
      d: { fr: "Fourniture de matériel et de solutions informatiques, installation sur site et maintenance pour garantir la continuité de vos opérations.",
           en: "Supply of IT equipment and solutions, on-site installation and maintenance to keep your operations running." } },
    { t: { fr: "Exploration & valorisation des données", en: "Data Mining & Insights" },
      d: { fr: "Extraction d'informations et de modèles utiles à partir de vos données pour éclairer vos décisions et créer de la valeur.",
           en: "Extracting useful information and patterns from your data to inform decisions and create value." } },
    { t: { fr: "Gestion du changement", en: "Change Management" },
      d: { fr: "Accompagnement des équipes dans l'adoption des nouveaux outils et processus : formation, conduite du changement et appropriation durable.",
           en: "Supporting teams in adopting new tools and processes: training, change management and lasting adoption." } }
  ];

  function getLang() {
    try { var s = localStorage.getItem("pse-lang"); if (s === "fr" || s === "en") return s; } catch (e) {}
    return "fr";
  }
  function L(o, lang) { return (o && o[lang]) || (o && o.fr) || ""; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function injectStyles() {
    if (document.getElementById("pse-sva-style")) return;
    var st = document.createElement("style");
    st.id = "pse-sva-style";
    st.textContent =
      ".pse-sva{padding:96px clamp(16px,4vw,56px);background:#f7f9fb;" +
      "font-family:'Geist','Geist Placeholder',Inter,system-ui,-apple-system,sans-serif}" +
      ".pse-sva__in{max-width:980px;margin:0 auto}" +
      ".pse-sva__head{max-width:760px;margin:0 auto 48px;text-align:center}" +
      ".pse-sva__eyebrow{font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;" +
      "color:#348ace;margin:0 0 12px}" +
      ".pse-sva__t{font-family:'Geist','Geist Placeholder',Inter,sans-serif;font-weight:500;" +
      "font-size:clamp(28px,3.6vw,46px);letter-spacing:-.04em;color:#1e1e1f;margin:0;line-height:1.12}" +
      ".pse-sva__list{border-top:1px solid rgba(22,20,42,.10)}" +
      ".pse-acc{border-bottom:1px solid rgba(22,20,42,.10)}" +
      ".pse-acc__btn{position:relative;width:100%;background:none;border:0;text-align:left;" +
      "display:flex;align-items:center;gap:clamp(14px,2.5vw,28px);padding:24px clamp(14px,2vw,22px);" +
      "border-radius:14px;font-family:inherit;color:#16142a;" +
      "transition:color .22s ease,background .28s ease}" +
      ".pse-acc__btn::before{content:'';position:absolute;left:0;top:16%;bottom:16%;width:3px;border-radius:3px;" +
      "background:linear-gradient(180deg,#348ace,#1f6fae);transform:scaleY(0);transform-origin:center;" +
      "transition:transform .3s cubic-bezier(.22,.61,.36,1)}" +
      ".pse-acc__btn:hover{color:#348ace;background:rgba(52,138,206,.045)}" +
      ".pse-acc.is-open .pse-acc__btn{background:rgba(52,138,206,.05);color:#16142a}" +
      ".pse-acc.is-open .pse-acc__btn::before{transform:scaleY(1)}" +
      ".pse-acc__num{font-family:'Archivo','Archivo Placeholder',sans-serif;font-weight:700;" +
      "font-size:14px;color:#348ace;flex:0 0 auto;min-width:26px;letter-spacing:.03em;opacity:.9;" +
      "font-variant-numeric:tabular-nums}" +
      ".pse-acc__t{font-family:'Geist','Geist Placeholder',Inter,sans-serif;font-weight:500;" +
      "font-size:clamp(18px,2.1vw,24px);line-height:1.25;letter-spacing:-.02em;flex:1 1 auto;margin:0}" +
      ".pse-acc__ic{flex:0 0 auto;width:30px;height:30px;border-radius:50%;position:relative;" +
      "border:1.5px solid rgba(22,20,42,.18);transition:border-color .25s ease,background .25s ease}" +
      ".pse-acc__ic::before,.pse-acc__ic::after{content:'';position:absolute;top:50%;left:50%;" +
      "width:11px;height:1.7px;background:#16142a;transform:translate(-50%,-50%);transition:transform .3s ease,background .25s ease}" +
      ".pse-acc__ic::after{transform:translate(-50%,-50%) rotate(90deg)}" +
      ".pse-acc.is-open .pse-acc__ic{border-color:#348ace;background:#348ace}" +
      ".pse-acc.is-open .pse-acc__ic::before,.pse-acc.is-open .pse-acc__ic::after{background:#fff}" +
      ".pse-acc.is-open .pse-acc__ic::after{transform:translate(-50%,-50%) rotate(0deg)}" +
      ".pse-acc.is-open .pse-acc__btn{color:#16142a}" +
      ".pse-acc__panel{overflow:visible;height:auto}" +
      ".pse-acc__d{margin:0;padding:0 0 28px clamp(40px,calc(26px + 2.5vw),54px);" +
      "max-width:680px;font-size:clamp(15px,1.5vw,17px);line-height:1.7;color:#5b5b6b}" +
      "@media(max-width:520px){.pse-acc__d{padding-left:0}}" +
      ".pse-sva__in{max-width:1240px}" +
      ".pse-sva__list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;border:0}" +
      ".pse-acc{display:flex;flex-direction:column;min-width:0;min-height:280px;border:1px solid rgba(52,138,206,.18);" +
      "border-radius:20px;background:linear-gradient(155deg,#fff 0%,#f7fbff 100%);overflow:hidden;" +
      "box-shadow:0 14px 38px rgba(20,42,70,.08);transition:transform .28s ease,box-shadow .28s ease,border-color .28s ease}" +
      ".pse-acc:hover{transform:translateY(-5px);border-color:rgba(52,138,206,.38);box-shadow:0 22px 48px rgba(20,42,70,.14)}" +
      ".pse-acc__btn{display:grid;grid-template-columns:42px minmax(0,1fr);align-items:start;gap:14px;padding:26px 24px 18px;border-radius:0}" +
      ".pse-acc.is-open .pse-acc__btn{background:none}" +
      ".pse-acc__btn::before{display:none}" +
      ".pse-acc__num{display:flex;align-items:center;justify-content:center;min-width:42px;width:42px;height:42px;" +
      "border-radius:50%;background:rgba(52,138,206,.10);font-size:14px}" +
      ".pse-acc__t{font-size:clamp(20px,2vw,28px);line-height:1.2;align-self:center;color:#16142a!important}" +
      ".pse-acc:hover .pse-acc__t,.pse-acc.is-open .pse-acc__t{color:#16142a!important}" +
      ".pse-acc__panel{display:block;flex:1 1 auto;overflow:visible;height:auto!important}" +
      ".pse-acc__d{max-width:none;margin:0;padding:0 24px 28px 80px;font-size:clamp(15px,1.2vw,17px);line-height:1.6}" +
      "@media(max-width:900px){.pse-sva__list{grid-template-columns:repeat(2,minmax(0,1fr))}}" +
      "@media(max-width:600px){.pse-sva{padding-inline:16px}.pse-sva__list{grid-template-columns:1fr;gap:16px}" +
      ".pse-acc{min-height:0}.pse-acc__btn{padding:22px 18px 16px;grid-template-columns:38px minmax(0,1fr)}" +
      ".pse-acc__num{min-width:38px;width:38px;height:38px}.pse-acc__d{padding:0 18px 24px 70px}}";
    (document.head || document.documentElement).appendChild(st);
  }

  function render(lang) {
    var sec = document.createElement("section");
    sec.className = "pse-sva";
    sec.id = "pse-services-acc";
    sec.setAttribute("data-framer-name", "Section Services Accordion PSE");

    var rows = "";
    for (var i = 0; i < SERVICES.length; i++) {
      rows +=
        '<div class="pse-acc' + (i === 0 ? " is-open" : "") + '">' +
          '<div class="pse-acc__btn">' +
            '<span class="pse-acc__num">' + pad(i + 1) + '</span>' +
            '<h3 class="pse-acc__t" data-sva="t" data-i="' + i + '">' + L(SERVICES[i].t, lang) + '</h3>' +
          '</div>' +
          '<div class="pse-acc__panel">' +
            '<p class="pse-acc__d" data-sva="d" data-i="' + i + '">' + L(SERVICES[i].d, lang) + '</p>' +
          '</div>' +
        '</div>';
    }
    sec.innerHTML =
      '<div class="pse-sva__in">' +
        '<div class="pse-sva__head">' +
          '<p class="pse-sva__eyebrow" data-sva="eyebrow">' + L(T.eyebrow, lang) + '</p>' +
          '<h2 class="pse-sva__t" data-sva="title">' + L(T.title, lang) + '</h2>' +
        '</div>' +
        '<div class="pse-sva__list">' + rows + '</div>' +
      '</div>';
    return sec;
  }

  function setOpen(acc, open) {
    var panel = acc.querySelector(".pse-acc__panel");
    var btn = acc.querySelector(".pse-acc__btn");
    if (open) {
      acc.classList.add("is-open");
      if (btn) btn.setAttribute("aria-expanded", "true");
      panel.style.height = panel.scrollHeight + "px";
      
      var onEnd = function () {
        if (acc.classList.contains("is-open")) panel.style.height = "auto";
        panel.removeEventListener("transitionend", onEnd);
      };
      panel.addEventListener("transitionend", onEnd);
    } else {
      acc.classList.remove("is-open");
      if (btn) btn.setAttribute("aria-expanded", "false");
      panel.style.height = panel.scrollHeight + "px";   
      void panel.offsetHeight;                           
      panel.style.height = "0px";
    }
  }

  function wire(sec) {
    var accs = sec.querySelectorAll(".pse-acc");
    for (var i = 0; i < accs.length; i++) {
      (function (acc) {
        var btn = acc.querySelector(".pse-acc__btn");
        var panel = acc.querySelector(".pse-acc__panel");
        if (acc.classList.contains("is-open")) panel.style.height = "auto";
        btn.addEventListener("click", function () {
          var willOpen = !acc.classList.contains("is-open");
          for (var k = 0; k < accs.length; k++) if (accs[k] !== acc) setOpen(accs[k], false);
          setOpen(acc, willOpen);
        });
      })(accs[i]);
    }
  }

  function relang(lang) {
    document.querySelectorAll(".pse-sva").forEach(function (sec) {
    var q;
    q = sec.querySelector('[data-sva="eyebrow"]'); if (q) q.textContent = L(T.eyebrow, lang);
    q = sec.querySelector('[data-sva="title"]'); if (q) q.textContent = L(T.title, lang);
    var ts = sec.querySelectorAll('[data-sva="t"]');
    for (var i = 0; i < ts.length; i++) ts[i].textContent = L(SERVICES[ts[i].getAttribute("data-i")].t, lang);
    var ds = sec.querySelectorAll('[data-sva="d"]');
    for (var j = 0; j < ds.length; j++) ds[j].textContent = L(SERVICES[ds[j].getAttribute("data-i")].d, lang);
    
    var open = sec.querySelector(".pse-acc.is-open .pse-acc__panel");
    if (open) { open.style.height = "auto"; }
    });
  }

  function mount() {
    var footers = document.querySelectorAll("footer");
    if (!footers.length) return false;
    injectStyles();
    footers.forEach(function (footer, index) {
      if (!footer.parentNode || (footer.previousElementSibling && footer.previousElementSibling.classList.contains("pse-sva"))) return;
      var sec = render(getLang());
      sec.id = index === 0 ? "pse-services-acc" : "pse-services-acc-" + index;
      footer.parentNode.insertBefore(sec, footer);
    });
    return true;
  }

  function hookLang() {
    if (window.__pseSvaHooked) return;
    if (typeof window.PSE_setLang === "function") {
      var orig = window.PSE_setLang;
      window.PSE_setLang = function (l) { orig(l); relang(l === "en" ? "en" : "fr"); };
      window.__pseSvaHooked = true;
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
