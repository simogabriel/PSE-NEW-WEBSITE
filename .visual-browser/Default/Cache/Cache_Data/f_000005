














(function () {
  "use strict";

  var SEC_SEL = '[data-framer-name="Section Recent Articles"], [data-framer-name="Section Insights & News"]';

  var IMG_DIR = "pse-custom/news/";

  
  
  var REAL_IMGS = ["news-1.jpg", "news-2.jpg"];

  
  var CARD_IMAGES = [
    "news-1.jpg",
    "news-2.jpg",
    "news-3.jpg",
    "news-4.jpg",
    "news-5.jpg",
    "news-6.jpg",
    "news-7.jpg"
  ];

  
  var CARD_CAPTIONS = [
    { en: "AI-powered solutions transforming modern manufacturing", fr: "Des solutions propulsées par l'IA qui transforment l'industrie moderne" },
    { en: "Developing the digital skills that power tomorrow's industries", fr: "Développer les compétences numériques qui feront avancer les industries de demain" },
    { en: "Turning enterprise data into confident business decisions", fr: "Transformer les données d'entreprise en décisions stratégiques éclairées" },
    { en: "Predictive maintenance for reliable, efficient operations", fr: "La maintenance prédictive au service d'opérations fiables et efficaces" },
    { en: "Digital solutions for more sustainable manufacturing", fr: "Des solutions numériques pour une production plus durable" },
    { en: "Building the connected enterprise of Industry 4.0", fr: "Construire l'entreprise connectée de l'Industrie 4.0" },
    { en: "PSE Consulting SARL delivering innovation in the field", fr: "PSE Consulting SARL concrétise l'innovation sur le terrain" }
  ];

  var HOME_CAPTIONS = [
    { en: "Digital Transformation Conference", fr: "Conférence sur la transformation numérique" },
    { en: "AI and Industrial Innovation Presentation", fr: "Présentation sur l’IA et l’innovation industrielle" },
    { en: "Smart Manufacturing Leadership Forum", fr: "Forum du leadership en fabrication intelligente" },
    { en: "Predictive Maintenance Technical Session", fr: "Session technique sur la maintenance prédictive" },
    { en: "Sustainable Industry Conference", fr: "Conférence sur l’industrie durable" },
    { en: "Industry 4.0 Executive Presentation", fr: "Présentation stratégique sur l’Industrie 4.0" },
    { en: "PSE Innovation Showcase", fr: "Présentation des innovations de PSE Consulting" }
  ];

  var HOME_COPY = {
    en: {
      heading: "Conferences and Presentations",
      intro: "Discover PSE Consulting conferences where leaders, specialists and partners exchange practical ideas about technology and digital transformation.",
      detail: "Explore PSE Consulting presentations on artificial intelligence, software, data, project management, responsible technology and Industry 4.0."
    },
    fr: {
      heading: "Conférences et présentations",
      intro: "Découvrez les conférences de PSE Consulting, où dirigeants, spécialistes et partenaires échangent des idées concrètes sur la technologie et la transformation numérique.",
      detail: "Découvrez les présentations de PSE Consulting consacrées à l’intelligence artificielle, aux logiciels, aux données, à la gestion de projets, au numérique responsable et à l’Industrie 4.0."
    }
  };

  
  
  
  var EXTRA = [
    { href: "blog/data-driven-manufacturing.html",             img: "news-3.jpg", title: "Data-Driven Manufacturing" },
    { href: "blog/predictive-maintenance-the-game-changer.html", img: "news-4.jpg", title: "Predictive Maintenance: The Game Changer" },
    { href: "blog/sustainable-manufacturing-solutions.html",   img: "news-5.jpg", title: "Sustainable Manufacturing Solutions" },
    { href: "blog/this-is-a-bloh-headline-title.html",         img: "news-6.jpg", title: "The Future of Industry 4.0" },
    { href: "blog.html",                                       img: "news-7.jpg", title: "PSE on the Field", cls: "pse-news-photo7" }
  ];

  function norm(s) { return (s || "").replace(/\s+/g, " ").trim(); }

  function getLang() {
    try {
      var saved = localStorage.getItem("pse-lang");
      if (saved === "fr" || saved === "en") return saved;
    } catch (e) {}
    return (document.documentElement.lang || "fr").toLowerCase().indexOf("en") === 0 ? "en" : "fr";
  }

  function captionFor(index, lang) {
    var caption = CARD_CAPTIONS[index] || {};
    return caption[lang] || caption.fr || caption.en || "";
  }

  
  
  function setCardImage(card, file) {
    var imgs = card.querySelectorAll(
      '[data-framer-name="Blog Image Wrap"] img, [data-framer-name="Image"] img');
    if (!imgs.length) imgs = card.querySelectorAll('img');   
    var src = IMG_DIR + file;
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (img.getAttribute("src") === src) continue;          
      img.removeAttribute("srcset");
      img.removeAttribute("sizes");
      img.removeAttribute("data-framer-original-sizes");
      img.setAttribute("src", src);
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.objectPosition = "center";
    }
  }

  
  
  
  
  function configureIndividualCard(card, index, isHome) {
    var cardNumber = index + 1;
    var oldTitles = card.querySelectorAll(".pse-news-card-title");
    for (var t = 0; t < oldTitles.length; t++) oldTitles[t].remove();

    card.classList.add("pse-news-card-" + cardNumber);
    card.setAttribute("data-pse-carousel-card", String(cardNumber));
    card.setAttribute("data-pse-image-file", CARD_IMAGES[index]);
    if (isHome) card.setAttribute("data-pse-home-card", "1");

    var imageContainers = card.querySelectorAll(
      '[data-framer-name="Blog Image Wrap"]');
    for (var i = 0; i < imageContainers.length; i++) {
      var imageContainer = imageContainers[i];
      imageContainer.classList.add("pse-carousel-image-container");
      imageContainer.setAttribute("data-pse-image-container", String(cardNumber));

      var caption = imageContainer.querySelector(".pse-carousel-image-caption");
      if (!caption) {
        caption = document.createElement("span");
        caption.className = "pse-carousel-image-caption";
        imageContainer.appendChild(caption);
      }
      var captionText = isHome
        ? (HOME_CAPTIONS[index][getLang()] || HOME_CAPTIONS[index].en)
        : captionFor(index, getLang());
      if (caption.textContent !== captionText) caption.textContent = captionText;
    }

    setCardImage(card, CARD_IMAGES[index]);
  }

  function updateHomeCopy(section, lang) {
    var copy = HOME_COPY[lang === "en" ? "en" : "fr"];
    var headings = section.querySelectorAll("h2");
    for (var h = 0; h < headings.length; h++) headings[h].textContent = copy.heading;
    var textWrap = section.querySelector('[data-framer-name="Text Content Wrap"]');
    if (!textWrap) return;
    var paragraphs = textWrap.querySelectorAll("p");
    if (paragraphs[0]) paragraphs[0].textContent = copy.intro;
    if (paragraphs[1]) paragraphs[1].textContent = copy.detail;
  }

  function setCardTitle(card, title) {
    var ps = card.querySelectorAll("p");
    var best = null, bestLen = -1;
    for (var i = 0; i < ps.length; i++) {
      var t = norm(ps[i].textContent);
      if (!t) continue;
      if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(t)) continue;          
      if (/^\d+\s*min/i.test(t)) continue;                          
      if (/^(read more|lire la suite|en savoir plus)$/i.test(t)) continue;
      if (t.length > bestLen) { bestLen = t.length; best = ps[i]; }
    }
    if (best) {
      best.removeAttribute("data-pse-block");   
      best.textContent = title;
    }
  }

  
  
  
  function addClones(track, realCards) {
    if (!realCards.length) return;
    for (var i = 0; i < EXTRA.length; i++) {
      var e = EXTRA[i];
      if (track.querySelector(':scope > a[data-pse-news-clone][data-href="' + e.href + '"]')) continue;
      var src = realCards[i % realCards.length];   
      var clone = src.cloneNode(true);
      clone.setAttribute("href", e.href);
      clone.setAttribute("data-pse-news-clone", "1");
      clone.setAttribute("data-href", e.href);
      clone.classList.add("pse-news-card");
      if (e.cls) clone.classList.add(e.cls);
      setCardTitle(clone, e.title);
      setCardImage(clone, e.img);
      track.appendChild(clone);
    }
  }

  function chevron(dir) {
    
    var d = dir === "left"
      ? "M15 5 L8 12 L15 19"
      : "M9 5 L16 12 L9 19";
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="' + d + '" stroke="currentColor" stroke-width="2.2" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  
  
  
  function wireViewAll(section) {
    if (!section || section.getAttribute("data-framer-name") !== "Section Recent Articles") return;
    var links = section.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      var label = norm(links[i].textContent).toLowerCase();
      if (label !== "view all" && label !== "voir tout") continue;
      var link = links[i];
      link.setAttribute("href", "contact.html");
      link.setAttribute("data-fr", "Nous contacter");
      link.setAttribute("data-en", "Contact Us");
      link.classList.add("pse-conference-cta");
      var labelNode = link.querySelector("p") || link.querySelector("span");
      if (labelNode) {
        labelNode.setAttribute("data-fr", "Nous contacter");
        labelNode.setAttribute("data-en", "Contact Us");
        labelNode.textContent = getLang() === "en" ? "Contact Us" : "Nous contacter";
      }
      if (link.getAttribute("data-pse-view-all") === "1") continue;
      link.setAttribute("data-pse-view-all", "1");
      link.addEventListener("click", function (event) {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        event.stopPropagation();
        window.location.assign(new URL("contact.html", document.baseURI).href);
      }, true);
    }
  }

  function build(section) {
    if (!section) return;
    var isHome = section.getAttribute("data-framer-name") === "Section Recent Articles";
    if (isHome) updateHomeCopy(section, getLang());
    wireViewAll(section);

    
    var firstCard = section.querySelector('a[href*="blog/"]');
    if (!firstCard) return;                 
    var track = firstCard.parentElement;
    if (!track) return;

    section.classList.add("pse-news");
    track.classList.add("pse-news-track");

    
    
    var realCards = track.querySelectorAll(':scope > a:not([data-pse-news-clone])');
    for (var i = 0; i < realCards.length; i++) {
      realCards[i].classList.add("pse-news-card");
      if (REAL_IMGS[i]) setCardImage(realCards[i], REAL_IMGS[i]);
    }

    
    if (section.getAttribute("data-framer-name") === "Section Recent Articles") {
      addClones(track, realCards);
    }

    var individualCards = track.querySelectorAll(":scope > .pse-news-card");
    for (var c = 0; c < individualCards.length && c < CARD_IMAGES.length; c++) {
      configureIndividualCard(individualCards[c], c, isHome);
      if (isHome) individualCards[c].setAttribute("href", "contact.html");
    }

    
    var controls = track.nextElementSibling;
    if (!controls || !controls.classList || !controls.classList.contains("pse-news-controls")) {
      controls = document.createElement("div");
      controls.className = "pse-news-controls";

      var prev = document.createElement("button");
      prev.type = "button";
      prev.className = "pse-news-nav pse-news-prev";
      prev.setAttribute("aria-label", "Article précédent");
      prev.innerHTML = chevron("left");

      var next = document.createElement("button");
      next.type = "button";
      next.className = "pse-news-nav pse-news-next";
      next.setAttribute("aria-label", "Article suivant");
      next.innerHTML = chevron("right");

      controls.appendChild(prev);
      controls.appendChild(next);
      track.parentNode.insertBefore(controls, track.nextSibling);

      function isVertical() {
        var isBlogCarousel = section.getAttribute("data-framer-name") === "Section Insights & News";
        return !isBlogCarousel && window.matchMedia && window.matchMedia("(max-width: 1199px)").matches;
      }
      function position() {
        return isVertical() ? track.scrollTop : track.scrollLeft;
      }
      function maximum() {
        return isVertical()
          ? Math.max(0, track.scrollHeight - track.clientHeight)
          : Math.max(0, track.scrollWidth - track.clientWidth);
      }
      function setPosition(value) {
        if (isVertical()) track.scrollTop = value;
        else track.scrollLeft = value;
      }
      function step() {
        var card = track.querySelector(".pse-news-card");
        var styles = getComputedStyle(track);
        var gap = parseFloat(isVertical() ? styles.rowGap : styles.columnGap) || 24;
        if (!card) return isVertical() ? track.clientHeight * 0.7 : track.clientWidth * 0.7;
        var box = card.getBoundingClientRect();
        return (isVertical() ? box.height : box.width) + gap;
      }
      function update() {
        var max = maximum() - 2;
        var current = position();
        prev.disabled = current <= 2;
        next.disabled = current >= max;
      }

      
      var slideFrame = null;
      function slideTo(target) {
        if (slideFrame) window.cancelAnimationFrame(slideFrame);
        var start = position();
        var max = maximum();
        var end = Math.max(0, Math.min(target, max));
        var distance = end - start;
        var reduceMotion = window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion || Math.abs(distance) < 1) {
          setPosition(end);
          return;
        }
        var started = performance.now();
        function animate(now) {
          var progress = Math.min((now - started) / 1200, 1);
          var eased = 0.5 - Math.cos(Math.PI * progress) / 2;
          setPosition(start + distance * eased);
          if (progress < 1) slideFrame = window.requestAnimationFrame(animate);
          else slideFrame = null;
        }
        slideFrame = window.requestAnimationFrame(animate);
      }

      
      
      var autoTimer = null;
      function stopAuto() {
        if (autoTimer) window.clearInterval(autoTimer);
        autoTimer = null;
      }
      function advanceAuto() {
        if (!document.documentElement.contains(track)) {
          stopAuto();
          return;
        }
        var max = maximum() - 2;
        var current = position();
        if (current >= max) {
          slideTo(0);
        } else {
          slideTo(current + step());
        }
      }
      function startAuto() {
        stopAuto();
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        autoTimer = window.setInterval(advanceAuto, 1300);
      }
      prev.addEventListener("click", function () {
        slideTo(position() - step());
        startAuto();
      });
      next.addEventListener("click", function () {
        slideTo(position() + step());
        startAuto();
      });
      track.addEventListener("scroll", function () {
        window.requestAnimationFrame(update);
      });
      window.addEventListener("resize", update);
      track.addEventListener("mouseenter", stopAuto);
      track.addEventListener("mouseleave", startAuto);
      track.addEventListener("focusin", stopAuto);
      track.addEventListener("focusout", startAuto);
      track.addEventListener("touchstart", stopAuto, { passive: true });
      track.addEventListener("touchend", startAuto, { passive: true });
      update();
      startAuto();
      
      setTimeout(update, 300);
      setTimeout(update, 1200);
    }
  }

  function scan() {
    var sections = document.querySelectorAll(SEC_SEL);
    for (var i = 0; i < sections.length; i++) build(sections[i]);
  }

  function translateCaptions(lang) {
    var captions = document.querySelectorAll(".pse-carousel-image-caption");
    for (var i = 0; i < captions.length; i++) {
      var card = captions[i].closest("[data-pse-carousel-card]");
      var index = card ? parseInt(card.getAttribute("data-pse-carousel-card"), 10) - 1 : i;
      var isHome = captions[i].closest('[data-framer-name="Section Recent Articles"]');
      var activeLang = lang === "en" ? "en" : "fr";
      var text = isHome
        ? (HOME_CAPTIONS[index][activeLang] || HOME_CAPTIONS[index].en)
        : captionFor(index, activeLang);
      if (captions[i].textContent !== text) captions[i].textContent = text;
    }
    var homeSection = document.querySelector('[data-framer-name="Section Recent Articles"]');
    if (homeSection) updateHomeCopy(homeSection, lang);
  }

  function hookLanguageSwitcher() {
    if (window.__pseNewsLangHooked || typeof window.PSE_setLang !== "function") return;
    window.__pseNewsLangHooked = true;
    var originalSetLang = window.PSE_setLang;
    window.PSE_setLang = function (lang) {
      originalSetLang(lang);
      translateCaptions(lang);
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan);
  } else { scan(); }
  window.addEventListener("load", scan);
  window.addEventListener("load", hookLanguageSwitcher);
  setTimeout(scan, 800);
  setTimeout(scan, 2000);
  setTimeout(hookLanguageSwitcher, 0);
  setTimeout(hookLanguageSwitcher, 800);

  if (typeof MutationObserver !== "undefined") {
    var pend = false;
    new MutationObserver(function () {
      if (pend) return;
      pend = true;
      window.requestAnimationFrame(function () { pend = false; scan(); });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
