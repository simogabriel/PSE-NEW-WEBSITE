(function () {
  "use strict";

  var siteBase = new URL("../", document.currentScript.src);
  // Stylesheets are ordered in the HTML. Never detach live stylesheets:
  // moving them on a head mutation can expose the unstyled template.

  // Keep the exported template router from replacing one page with another
  // inside the current document. Leave navigation itself to the browser.
  function isolatePageNavigation(event) {
    var link = event.target.closest && event.target.closest("a[href]");
    if (!link || event.defaultPrevented) return;
    var target;
    try { target = new URL(link.href, document.baseURI); } catch (error) { return; }
    if (target.origin !== siteBase.origin ||
        target.pathname.indexOf(siteBase.pathname) !== 0 ||
        !/\.html$/i.test(target.pathname)) return;
    event.stopImmediatePropagation();
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
