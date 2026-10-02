(function () {
  "use strict";

  var siteBase = new URL("../", document.currentScript.src);
  // Stylesheets are ordered in the HTML. Never detach live stylesheets:
  // moving them on a head mutation can expose the unstyled template.

  // Keep the exported template router from replacing one page with another
  // inside the current document. Leave navigation itself to the browser.
  var navigationPendingUntil = 0;
  window.addEventListener("pageshow", function () { navigationPendingUntil = 0; });

  function isolatePageNavigation(event) {
    var link = event.target.closest && event.target.closest("a[href]");
    if (!link || event.defaultPrevented) return;
    var target;
    try { target = new URL(link.href, document.baseURI); } catch (error) { return; }
    if (target.origin !== siteBase.origin ||
        target.pathname.indexOf(siteBase.pathname) !== 0 ||
        !/\.html$/i.test(target.pathname)) return;
    event.stopImmediatePropagation();
    var isNav = link.closest(".pse-nav");
    var plainClick = event.type === "click" && event.button === 0 &&
      !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey;
    if (!isNav || !plainClick || link.hasAttribute("download") ||
        (link.target && link.target !== "_self")) return;

    isNav.classList.remove("is-open");
    var burger = isNav.querySelector(".pse-nav__burger");
    if (burger) burger.setAttribute("aria-expanded", "false");

    var current = new URL(location.href);
    function pagePath(path) { return path.replace(/\/index\.html$/i, "/"); }
    var samePage = pagePath(target.pathname) === pagePath(current.pathname) &&
      target.search === current.search;
    if (samePage) {
      if (!target.hash || target.hash === current.hash) event.preventDefault();
      return;
    }
    if (Date.now() < navigationPendingUntil) {
      event.preventDefault();
      return;
    }
    // Allow one native navigation, with a short retry window if it fails.
    navigationPendingUntil = Date.now() + 1200;
  }
  window.addEventListener("click", isolatePageNavigation, true);
  window.addEventListener("auxclick", isolatePageNavigation, true);

  // Warm the next local document as soon as a visitor shows navigation intent.
  var prefetched = new Set();
  function prefetchNavigation(event) {
    var link = event.target.closest && event.target.closest("a[href]");
    if (!link || link.download || (navigator.connection && navigator.connection.saveData)) return;
    var url;
    try { url = new URL(link.href, document.baseURI); } catch (error) { return; }
    if (!/^https?:$/.test(url.protocol) || url.origin !== siteBase.origin ||
        url.pathname.indexOf(siteBase.pathname) !== 0 || !/\.html$/i.test(url.pathname) ||
        url.pathname === location.pathname) return;
    url.hash = "";
    if (prefetched.has(url.href)) return;
    prefetched.add(url.href);
    var hint = document.createElement("link");
    hint.rel = "prefetch";
    hint.href = url.href;
    document.head.appendChild(hint);
  }
  document.addEventListener("pointerover", prefetchNavigation, { passive: true });
  document.addEventListener("touchstart", prefetchNavigation, { passive: true });
  document.addEventListener("focusin", prefetchNavigation);

})();
