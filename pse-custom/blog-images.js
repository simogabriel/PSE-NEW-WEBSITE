










(function () {
  "use strict";

  var IMG_DIR = "pse-custom/news/";

  
  var MAP = {
    "ai-transforms-manufacturing":            "news-1.jpg",
    "bridging-the-manufacturing-skills-gap":  "news-2.jpg",
    "data-driven-manufacturing":              "news-3.jpg",
    "predictive-maintenance-the-game-changer":"news-4.jpg",
    "sustainable-manufacturing-solutions":    "news-5.jpg",
    "this-is-a-bloh-headline-title":          "news-6.jpg"
  };

  function setImgs(card, file) {
    var imgs = card.querySelectorAll(
      '[data-framer-name="Blog Image Wrap"] img, [data-framer-name="Image"] img');
    if (!imgs.length) imgs = card.querySelectorAll("img");
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
      img.style.objectPosition = "center 42%";           
    }
  }

  function scan() {
    var cards = document.querySelectorAll('a[href*="blog/"]');
    for (var i = 0; i < cards.length; i++) {
      var href = cards[i].getAttribute("href") || "";
      var m = href.match(/blog\/([^\/?#]+?)\.html/);
      if (!m) continue;
      var file = MAP[m[1]];
      if (file) setImgs(cards[i], file);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan);
  } else { scan(); }
  window.addEventListener("load", scan);
  setTimeout(scan, 600);
  setTimeout(scan, 1600);

  if (typeof MutationObserver !== "undefined") {
    var pend = false;
    new MutationObserver(function () {
      if (pend) return;
      pend = true;
      window.requestAnimationFrame(function () { pend = false; scan(); });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
