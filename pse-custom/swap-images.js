









(function () {
  "use strict";

  var BASE = (function () {
    var ss = document.getElementsByTagName("script");
    for (var i = 0; i < ss.length; i++) {
      var s = ss[i].src || "";
      if (/pse-custom\/swap-images\.js(\?|$)/.test(s)) {
        return s.replace(/pse-custom\/swap-images\.js.*$/, "");
      }
    }
    return "";
  })();

  var SWAPS = [
    { sel: '#team-intro [data-framer-name="Image Wrapper"] img, #our-mission [data-framer-name="Image Wrapper"] img', img: 'pse-custom/pse-team.webp' },
    
    { sel: '#image img', img: 'pse-custom/pse-team.webp' },
    
    { sel: '#solve-smarter [data-framer-name="Image Wrap"] img', img: 'pse-custom/solutions-hero.jpg' },
    
    { sel: '#team-intro-1 [data-framer-name="Image Wrapper"] img', img: 'pse-custom/pse-team.webp' }
  ];

  function apply() {
    for (var i = 0; i < SWAPS.length; i++) {
      var url = BASE + SWAPS[i].img;
      var nodes = document.querySelectorAll(SWAPS[i].sel);
      for (var j = 0; j < nodes.length; j++) {
        var im = nodes[j];
        
        if (im.getAttribute("data-pse-img") === SWAPS[i].img &&
            im.src === url && !im.getAttribute("srcset")) continue;
        im.removeAttribute("srcset");
        im.removeAttribute("data-framer-original-sizes");
        im.setAttribute("src", url);
        im.setAttribute("data-pse-img", SWAPS[i].img);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
  window.addEventListener("load", apply);
  setTimeout(apply, 800);
  setTimeout(apply, 2000);

  if (typeof MutationObserver !== "undefined") {
    var pending = false;
    new MutationObserver(function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () { pending = false; apply(); });
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["srcset", "src"] });
  }
})();
