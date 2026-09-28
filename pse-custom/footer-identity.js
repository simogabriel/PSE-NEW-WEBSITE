
(function () {
  "use strict";

  var COPY = {
    fr: {
      brand: "PSE Consulting Cameroun SARL",
      based: "Basé à Yaoundé & Genève",
      contact: "Nous contacter",
      copyright: "© 2026 PSE Consulting Cameroun SARL. Tous droits réservés."
    },
    en: {
      brand: "PSE Consulting Cameroun SARL",
      based: "Based in Yaoundé & Geneva",
      contact: "Contact us",
      copyright: "© 2026 PSE Consulting Cameroun SARL. All rights reserved."
    }
  };

  function language() {
    try { return localStorage.getItem("pse-lang") === "en" ? "en" : "fr"; }
    catch (e) { return "fr"; }
  }

  var FOOTER_LINKS = [
    { href: "index.html", fr: "Accueil", en: "Home" },
    { href: "about.html", fr: "À propos", en: "About" },
    { href: "solutions.html", fr: "Solutions", en: "Solutions" },
    { href: "team.html", fr: "Équipe", en: "Team" },
    { href: "references.html", fr: "Références", en: "References" },
    { href: "contact.html", fr: "Contact", en: "Contact" }
  ];
 
  var SOCIAL_LINKS = [
    { name: "Facebook", href: "https://www.facebook.com/share/1GF7nAhtPE/?mibextid=wwXIfr", svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v2H6v4h3v7h4v-7h3.2l.8-4h-4V9c0-.7.3-1 1-1Z"/></svg>' },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/pseconsultingcm/", svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.3H3.2V21h3.3V8.3ZM4.9 3C3.8 3 3 3.8 3 4.9s.8 1.9 1.9 1.9 1.9-.8 1.9-1.9S6 3 4.9 3ZM21 13.7c0-3.8-2-5.6-4.7-5.6-2.2 0-3.1 1.2-3.7 2V8.3H9.3V21h3.3v-6.3c0-1.7.3-3.3 2.4-3.3 2 0 2.1 1.9 2.1 3.4V21H21v-7.3Z"/></svg>' },
    { name: "Twitter / X", href: "https://x.com/yvanetoua?s=11", svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.2 3h4.9l4 5.4L17.8 3h2l-5.8 6.9L20.7 21h-4.9l-4.5-6-5.1 6h-2l6.2-7.5L4.2 3Zm3.9 2H7l9.8 14h1.1L8.1 5Z"/></svg>' },
    { name: "Instagram", href: "https://www.instagram.com/", svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle class="pse-social-dot" cx="17.4" cy="6.7" r="1.1"/></svg>' },
  ]; 

  function ensureSocialLinks(footer) {
    var existing = footer.querySelector(".pse-footer-socials");
    var socialLabel = language() === "en" ? "Social media" : "RÃ©seaux sociaux";
    if (existing) {
      existing.setAttribute("aria-label", socialLabel);
      return;
    }
    var nav = document.createElement("nav");
    nav.className = "pse-footer-socials";
    nav.setAttribute("aria-label", socialLabel);
    for (var i = 0; i < SOCIAL_LINKS.length; i++) {
      var item = SOCIAL_LINKS[i];
      var link = document.createElement("a");
      link.href = item.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", item.name);
      link.setAttribute("title", item.name);
      link.innerHTML = item.svg;
      nav.appendChild(link);
    }
    var endRow = footer.querySelector('[data-framer-name="End"], .ref-footer__end');
    if (endRow) endRow.insertBefore(nav, endRow.firstChild);
    else {
      var linkWrapper = footer.querySelector('[data-framer-name="Link Wrapper"], .ref-footer__nav');
      if (linkWrapper && linkWrapper.parentNode) linkWrapper.parentNode.insertBefore(nav, linkWrapper.nextSibling);
      else footer.appendChild(nav);
    }
  }

  function normalizeFooterNavigation(footer) {
    var wrapper = footer.querySelector('[data-framer-name="Link Wrapper"]');
    if (!wrapper) return;
    wrapper.style.setProperty("display", "flex", "important");
    wrapper.style.setProperty("flex-direction", "row", "important");
    wrapper.style.setProperty("flex-wrap", "nowrap", "important");
    wrapper.style.setProperty("align-items", "center", "important");
    wrapper.style.setProperty("gap", window.matchMedia("(min-width: 1200px)").matches ? "56px" : "16px", "important");
    wrapper.style.setProperty("width", "100%", "important");
    wrapper.style.setProperty("max-width", "100%", "important");
    wrapper.style.setProperty("overflow-x", "auto", "important");
    wrapper.style.setProperty("overflow-y", "hidden", "important");

    var directItems = wrapper.children;
    for (var d = 0; d < directItems.length; d++) {
      directItems[d].style.setProperty("flex", "0 0 auto", "important");
      directItems[d].style.setProperty("width", "auto", "important");
      directItems[d].style.setProperty("max-width", "none", "important");
    }
    var anchors = wrapper.querySelectorAll("a");
    var lang = language();
    for (var i = 0; i < anchors.length && i < FOOTER_LINKS.length; i++) {
      var item = FOOTER_LINKS[i];
      anchors[i].setAttribute("href", item.href);
      anchors[i].setAttribute("data-pse-footer-route", item.href.replace(".html", ""));
      anchors[i].removeAttribute("data-framer-page-link-current");
      var label = anchors[i].querySelector("p");
      if (label) label.textContent = item[lang];
      anchors[i].setAttribute("aria-label", item[lang]);
    }
  }

  function clearLegacyPageCache() {
    if (window.PSE_clearLegacyPageCache) window.PSE_clearLegacyPageCache();
  }

  function update() {
    var text = COPY[language()];
    var footers = document.querySelectorAll("footer");

    for (var i = 0; i < footers.length; i++) {
      var footer = footers[i];
      var center = footer.querySelector('[data-framer-name="Footer Center Wrap"]');
      var legal = footer.querySelector('[data-framer-name="Legal Wrap"]');
      var time = footer.querySelector('[data-framer-name="Time Wrapper"]');

      normalizeFooterNavigation(footer);
      ensureSocialLinks(footer);

      
      
      if (footer.classList.contains("ref-footer")) {
        var refBrand = footer.querySelector(".ref-footer__brand");
        var refBased = footer.querySelector(".ref-footer__loc");
        var refContact = footer.querySelector(".ref-footer__contact");
        var refCopyright = footer.querySelector(".ref-footer__copy");
        if (refBrand) refBrand.textContent = text.brand;
        if (refBased) refBased.textContent = text.based;
        if (refContact) {
          refContact.href = "contact.html";
          refContact.textContent = text.contact + " ↗";
          refContact.setAttribute("aria-label", text.contact);
        }
        if (refCopyright) refCopyright.textContent = text.copyright;
        continue;
      }

      if (center) {
        var heading = center.querySelector("h2");
        var subtitle = center.querySelector("p");
        if (heading) heading.textContent = text.brand;
        if (subtitle) subtitle.textContent = text.based;
      }

      
      
      if (time) time.style.display = "none";

      if (legal) {
        var items = legal.querySelectorAll('[data-framer-component-type="RichTextContainer"]');
        if (items[0]) {
          var contact = items[0].querySelector("a");
          if (!contact) {
            var paragraph = items[0].querySelector("p");
            contact = document.createElement("a");
            contact.href = "contact.html";
            contact.className = paragraph ? paragraph.className : "";
            contact.style.cssText = "color:inherit;text-decoration:none;display:inline-flex;align-items:center;gap:.45em";
            items[0].textContent = "";
            items[0].appendChild(contact);
          }
          contact.href = "contact.html";
          contact.setAttribute("data-pse-footer-route", "contact");
          contact.textContent = text.contact + " ↗";
          contact.setAttribute("aria-label", text.contact);
        }

        if (items[1]) {
          var copyright = items[1].querySelector("p") || items[1];
          copyright.textContent = text.copyright;
        }
      }
    }
  }

  function init() {
    update();
    window.addEventListener("load", update);
    window.addEventListener("resize", update);
   
    
    
    document.addEventListener("click", function (event) {
      var link = event.target.closest && event.target.closest('footer a[data-pse-footer-route], footer a.ref-footer__contact');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var rawHref = link.getAttribute("href") || "";
      var match = rawHref.match(/(?:^|\/)(index|about|solutions|team|references|blog|contact)\.html(?:[?#].*)?$/i);
      if (!match) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      clearLegacyPageCache();
      
      
      var routeName = match[1].toLowerCase() === "blog" ? "references" : match[1].toLowerCase();
      var fileName = routeName + ".html";
      var headerLinks = document.querySelectorAll(".pse-nav__links a[href]");
      var destination = "";
      for (var i = 0; i < headerLinks.length; i++) {
        var headerUrl = new URL(headerLinks[i].href, document.baseURI);
        if (headerUrl.pathname.toLowerCase().slice(-fileName.length) === fileName) {
          destination = headerLinks[i].href;
          break;
        }
      }
       window.location.assign(destination || new URL(fileName, document.baseURI).href);
    }, true);
    document.addEventListener("click", function (event) {
      if (event.target.closest && event.target.closest("[data-pse-lang]")) {
        setTimeout(update, 0);
      }
    });
    setTimeout(update, 1200);
    setTimeout(update, 2500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

