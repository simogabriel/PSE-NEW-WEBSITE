














(function () {
  "use strict";

  
  var TEAM = [
    { img: "boss.jpg",      name: "Dongmo Baudouin",        role: { fr: "Directeur informatique", en: "IT Director" } },
    { img: "philip.jpeg",   name: "Manga Ewane Philippe",   role: { fr: "Chef de projet", en: "Project Manager" } },
    { img: "schimdt.jpeg",  name: "Schimdt Nguemechia",     role: { fr: "Chef de projet", en: "Project Manager" } },
    { img: "aleka.jpg",     name: "Aleka Mervie",           role: { fr: "Analyste d'affaires", en: "Business Analyst" } },
    { img: "alice.jpeg",    name: "Alice Mervie",           role: { fr: "Développeuse back-end", en: "Back-end Developer" } },
    { img: "vianney.jpeg",  name: "Vianney Ulrich",         role: { fr: "Développeur front-end", en: "Front-end Developer" } },
    { img: "lennon.jpeg",   name: "Lennon Youssouf",        role: { fr: "Développeur front-end", en: "Front-end Developer" } },
    { img: "leonel.jpeg",   name: "Kotieu Léonel",          role: { fr: "Concepteur UI/UX", en: "UI/UX Designer" } },
    { img: "audrey.jpeg",   name: "Audrey Ntamack",         role: { fr: "Directrice marketing", en: "Marketing Director" } },
    { img: "ludivine.jpg",  name: "Petmi Ludivine Chloé",   role: { fr: "Assistante de direction", en: "Executive Assistant" } },
    { img: "arnold.jpeg",   name: "Arno Mbende",            role: { fr: "Ingénieur réseau", en: "Network Engineer" } },
    { img: "../joel.jpg",    name: "JOEL EDMOND NGUEMETA", role: { fr: "DÉVELOPPEUR FULL STACK", en: "FULL STACK DEVELOPER" } }
  ];
  

  var SECTION_SEL = '[data-framer-name="Section Our Team"]';
  var CARD_MARK = "data-framer-name";

  function getLang() {
    try { var s = localStorage.getItem("pse-lang"); if (s === "fr" || s === "en") return s; } catch (e) {}
    return "fr";
  }

  function updateTeamHeading(section, lang) {
    var headings = document.querySelectorAll(
      '[data-framer-name="Section Team Header"] h1, ' +
      '[data-framer-name="Section Team Header"] h2, ' +
      '[data-framer-name="Section Our Team"] h1, ' +
      '[data-framer-name="Section Our Team"] h2'
    );
    var frenchHeading = "Rencontrez notre \u00e9quipe";
    var label = lang === "en" ? "Meet Our Team" : frenchHeading;
    for (var i = 0; i < headings.length; i++) {
      var current = (headings[i].textContent || "").replace(/\s+/g, " ").trim();
      if (!/^(Meet Our Leaders|Meet Our Team|Rencontrez notre équipe)$/i.test(current)) continue;
      headings[i].setAttribute("data-en", "Meet Our Team");
      headings[i].setAttribute("data-fr", frenchHeading);
      headings[i].textContent = label;
    }
  }

  function removeLegacyCareerEmail() {
    var nodes = document.querySelectorAll("a, p, span");
    for (var i = nodes.length - 1; i >= 0; i--) {
      var text = nodes[i].textContent || "";
      var href = nodes[i].getAttribute && (nodes[i].getAttribute("href") || "");
      if (/careers@asteria\.com/i.test(text + " " + href)) {
        var link = nodes[i].closest && nodes[i].closest("a");
        (link || nodes[i]).remove();
      }
    }
  }

  function isContactLink(link) {
    if (!link) return false;
    var label = (link.textContent || "").replace(/\s+/g, " ").trim();
    return /^(Contactez-nous|Nous contacter|Get in Touch|Contact Us|Let's Connect)$/i.test(label);
  }

  function fixContactLinks() {
    var links = document.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      if (isContactLink(links[i])) links[i].setAttribute("href", "contact.html");
    }
  }

  function updateCareersCopy(lang) {
    var sections = document.querySelectorAll('[data-framer-name^="Section Careers"]');
    var english = "Whether you're a seasoned professional or just starting your career, we offer opportunities for growth, development, and collaboration. Interested in exploring a role at PSE Consulting? Send us your application - contact details are below.";
    var french = "Que vous soyez un professionnel exp\u00e9riment\u00e9 ou que vous d\u00e9butiez votre carri\u00e8re, nous vous offrons des possibilit\u00e9s d'\u00e9volution, de d\u00e9veloppement et de collaboration. Vous souhaitez rejoindre PSE Consulting ? Envoyez-nous votre candidature ; nos coordonn\u00e9es figurent ci-dessous.";
    for (var s = 0; s < sections.length; s++) {
      var paragraphs = sections[s].querySelectorAll("p");
      for (var p = 0; p < paragraphs.length; p++) {
        if (/Whether you're a seasoned|Que vous soyez un professionnel/i.test(paragraphs[p].textContent || "")) {
          if (paragraphs[p].getAttribute("data-en") !== english) paragraphs[p].setAttribute("data-en", english);
          if (paragraphs[p].getAttribute("data-fr") !== french) paragraphs[p].setAttribute("data-fr", french);
          var translated = lang === "en" ? english : french;
          if (paragraphs[p].textContent !== translated) paragraphs[p].textContent = translated;
        }
      }
    }
  }

  function updateVisionCopy(lang) {
    var english = "Developing together! We have a strong desire to build long-term relationships with our customers. That's why, at PSE, we not only offer IT solutions that meet your needs, but also work with you to create a real strategy. With the market constantly evolving and demand changing, we help you adapt and grow.";
    var french = "D\u00e9veloppons ensemble ! Nous tenons \u00e0 construire des relations durables avec nos clients. C'est pourquoi, chez PSE, nous ne nous contentons pas de proposer des solutions informatiques adapt\u00e9es \u00e0 vos besoins : nous travaillons \u00e9galement avec vous afin d'\u00e9laborer une v\u00e9ritable strat\u00e9gie. Dans un march\u00e9 en constante \u00e9volution, o\u00f9 les attentes changent rapidement, nous vous aidons \u00e0 vous adapter et \u00e0 vous d\u00e9velopper.";
    var paragraphs = document.querySelectorAll("p");
    for (var i = 0; i < paragraphs.length; i++) {
      if (/^(Developing together!|At PSE Consulting, our mission|Chez PSE Consulting, notre mission|D\u00e9veloppons ensemble !)/i.test((paragraphs[i].textContent || "").trim())) {
        paragraphs[i].classList.add("pse-vision-copy");
        var textWrap = paragraphs[i].closest && paragraphs[i].closest('[data-framer-name="Text Wrap"]');
        if (textWrap) textWrap.classList.add("pse-vision-wrap");
        if (paragraphs[i].getAttribute("data-en") !== english) paragraphs[i].setAttribute("data-en", english);
        if (paragraphs[i].getAttribute("data-fr") !== french) paragraphs[i].setAttribute("data-fr", french);
        var translated = lang === "en" ? english : french;
        if (paragraphs[i].textContent !== translated) paragraphs[i].textContent = translated;
      }
    }
  }
  function BASE() {
    var ss = document.getElementsByTagName("script");
    for (var i = 0; i < ss.length; i++) {
      var s = ss[i].src || "";
      if (/pse-custom\/team-grid\.js(\?|$)/.test(s)) return s.replace(/pse-custom\/team-grid\.js.*$/, "");
    }
    return "";
  }

  function injectStyles() {
    if (document.getElementById("pse-team-grid-style")) return;
    var st = document.createElement("style");
    st.id = "pse-team-grid-style";
    st.textContent =
      ".pse-team-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:30px 26px;" +
      "width:100%;max-width:1180px;margin:0 auto;padding:8px 20px;box-sizing:border-box;" +
      "font-family:Inter,'Inter Placeholder',system-ui,-apple-system,sans-serif}" +
      ".pse-team-card{display:flex;flex-direction:column;align-items:center;text-align:center}" +
      ".pse-team-photo{width:100%;aspect-ratio:4/5;object-fit:cover;object-position:center top;" +
      "border-radius:18px;display:block;background:#0c1424;box-shadow:0 10px 30px rgba(12,20,36,.12);" +
      "transition:transform .35s ease,box-shadow .35s ease}" +
      ".pse-team-card:hover .pse-team-photo{transform:translateY(-4px);box-shadow:0 18px 40px rgba(12,20,36,.20)}" +
      ".pse-team-name{margin:16px 0 3px;font-family:Archivo,'Archivo Placeholder',Inter,sans-serif;" +
      "font-weight:600;font-size:18px;letter-spacing:-.01em;color:#16142a;line-height:1.2}" +
      ".pse-team-role{margin:0;font-size:14px;font-weight:500;color:#348ace;line-height:1.3}" +
      "@media(max-width:1080px){.pse-team-grid{grid-template-columns:repeat(3,1fr)}}" +
      "@media(max-width:720px){.pse-team-grid{grid-template-columns:repeat(2,1fr);gap:22px 18px}}" +
      "@media(max-width:440px){.pse-team-name{font-size:16px}}" +
      "[data-pse-team-hidden]{display:none !important}";
    (document.head || document.documentElement).appendChild(st);
  }

  
  
  function findCardRoots(section) {
    var wraps = section.querySelectorAll('[' + CARD_MARK + '="Team Image Wrap"]');
    var roots = [];
    for (var i = 0; i < wraps.length; i++) {
      var node = wraps[i];
      while (node && node.parentNode && node.parentNode !== section) {
        var p = node.parentNode, sibs = p.children, cnt = 0;
        for (var j = 0; j < sibs.length; j++) {
          if (sibs[j] === node || (sibs[j].querySelector &&
              sibs[j].querySelector('[' + CARD_MARK + '="Team Image Wrap"]'))) cnt++;
        }
        if (cnt >= 2) { roots.push(node); break; }
        node = p;
      }
    }
    return roots;
  }

  function buildGrid(lang) {
    var grid = document.createElement("div");
    grid.className = "pse-team-grid";
    grid.setAttribute("data-pse-team-grid", "1");
    var base = BASE();
    for (var i = 0; i < TEAM.length; i++) {
      var m = TEAM[i];
      var card = document.createElement("div");
      card.className = "pse-team-card";
      var img = document.createElement("img");
      img.className = "pse-team-photo";
      img.loading = "lazy";
      img.alt = m.name;
      img.src = base + "pse-custom/team/" + m.img;
      var nm = document.createElement("p");
      nm.className = "pse-team-name";
      nm.textContent = m.name;
      var rl = document.createElement("p");
      rl.className = "pse-team-role";
      rl.setAttribute("data-pse-role", "1");
      rl.textContent = (m.role && m.role[lang]) || (m.role && m.role.fr) || "";
      card.appendChild(img);
      card.appendChild(nm);
      card.appendChild(rl);
      grid.appendChild(card);
    }
    return grid;
  }

  function hideKids(holder) {
    var kids = holder.children;
    for (var i = 0; i < kids.length; i++) {
      if (!kids[i].hasAttribute("data-pse-team-grid")) kids[i].setAttribute("data-pse-team-hidden", "1");
    }
  }

  function mount() {
    var sections = document.querySelectorAll(SECTION_SEL);
    for (var s = 0; s < sections.length; s++) mountSection(sections[s]);
    return sections.length > 0;
  }

  function mountSection(section) {
    removeLegacyCareerEmail();
    updateCareersCopy(getLang());
    updateVisionCopy(getLang());
    if (!section) return false;
    updateTeamHeading(section, getLang());
    injectStyles();

    
    
    var cw = section.querySelector('[data-framer-name="Content Wrap"]');
    if (cw) { cw.style.opacity = "1"; cw.style.transform = "none"; }

    
    var holder = section.querySelector('[data-framer-name="Team Content"]');

    if (section.querySelector('[data-pse-team-grid]')) {
      
      if (holder) hideKids(holder);
      return true;
    }

    var grid = buildGrid(getLang());
    grid.style.opacity = "1";

    if (holder) {
      hideKids(holder);            
      holder.appendChild(grid);    
    } else {
      
      var roots = findCardRoots(section);
      for (var i = 0; i < roots.length; i++) roots[i].setAttribute("data-pse-team-hidden", "1");
      section.appendChild(grid);
    }
    return true;
  }

  function relang(lang) {
    updateTeamHeading(document.querySelector(SECTION_SEL), lang);
    updateCareersCopy(lang);
    updateVisionCopy(lang);
    var rls = document.querySelectorAll('.pse-team-grid [data-pse-role]');
    for (var i = 0; i < rls.length; i++) {
      var m = TEAM[i % TEAM.length];
      rls[i].textContent = (m.role && m.role[lang]) || (m.role && m.role.fr) || "";
    }
  }
  function hookLang() {
    if (window.__pseTeamGridHooked) return;
    if (typeof window.PSE_setLang === "function") {
      var orig = window.PSE_setLang;
      window.PSE_setLang = function (l) { orig(l); relang(l === "en" ? "en" : "fr"); };
      window.__pseTeamGridHooked = true;
    }
  }

  function boot() {
    removeLegacyCareerEmail();
    fixContactLinks();
    updateCareersCopy(getLang());
    updateVisionCopy(getLang());
    if (mount()) hookLang();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
  window.addEventListener("load", boot);
  setTimeout(boot, 800);
  setTimeout(boot, 2200);

  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest("a");
    if (!isContactLink(link) || event.defaultPrevented || event.button !== 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(new URL("contact.html", document.baseURI).href);
  }, true);

  if (typeof MutationObserver !== "undefined") {
    var pend = false;
    new MutationObserver(function () {
      if (pend) return;
      pend = true;
      requestAnimationFrame(function () {
        pend = false;
        removeLegacyCareerEmail();
        fixContactLinks();
        updateCareersCopy(getLang());
        updateVisionCopy(getLang());
        mount();
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
