
(function () {
  "use strict";

  function removeTemplateOverlays() {
    var nodes = document.querySelectorAll('[data-framer-name="Buy Template Module"], [data-framer-name="Buy Template Button"], #__framer-badge-container');
    for (var i = 0; i < nodes.length; i++) nodes[i].remove();
  }

  function sanitizeFooterLinks() {
    var links = document.querySelectorAll('footer [data-framer-name="Link Wrapper"] a, footer [data-framer-name="Legal Wrap"] a, footer a.ref-footer__contact');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute("data-pse-clean-link") === "true") continue;
      var clean = links[i].cloneNode(true);
      clean.setAttribute("data-pse-clean-link", "true");
      clean.removeAttribute("data-highlight");
      clean.removeAttribute("data-framer-page-link-current");
      clean.removeAttribute("data-nested-link");
      links[i].replaceWith(clean);
    }
  }

  function normalize() {
    removeTemplateOverlays();
    sanitizeFooterLinks();
    var links = document.querySelectorAll("footer a[href]");
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href") || "";
      var label = (links[i].textContent || "").trim();
      if (/blog\.html(?:[?#].*)?$/i.test(href) || /^(Blog|Actualités)$/i.test(label)) {
        links[i].setAttribute("href", "references.html");
        links[i].setAttribute("data-pse-footer-route", "references");
        var text = links[i].querySelector("p");
        if (text) text.textContent = document.documentElement.lang === "en" ? "References" : "Références";
        links[i].setAttribute("aria-label", document.documentElement.lang === "en" ? "References" : "Références");
      }
    }
  }

  function boot() {
    normalize();
    if (typeof MutationObserver !== "undefined") {
      var pending = false;
      new MutationObserver(function () {
        if (pending) return;
        pending = true;
        requestAnimationFrame(function () {
          pending = false;
          normalize();
        });
      }).observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
