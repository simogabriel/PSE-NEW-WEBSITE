
(function () {
  "use strict";

  function headerContactUrl() {
    var headerLink = document.querySelector('.pse-nav__links a[href*="contact.html"]');
    return headerLink ? headerLink.href : new URL("contact.html", document.baseURI).href;
  }

  function isContactCta(link) {
    var label = (link.textContent || "").replace(/\s+/g, " ").trim();
    return /^(Let['’]s Connect|Get in Touch|Contactez-nous)$/i.test(label);
  }

  function normalize() {
    var links = document.querySelectorAll('section[data-framer-name] a, .framer-OR4dp a');
    for (var i = 0; i < links.length; i++) {
      if (!isContactCta(links[i])) continue;
      links[i].setAttribute("href", "contact.html");
      links[i].setAttribute("data-pse-contact-cta", "true");
      links[i].setAttribute("aria-label", "Get in Touch");
    }
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest('a[data-pse-contact-cta="true"]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(headerContactUrl());
  }, true);

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
