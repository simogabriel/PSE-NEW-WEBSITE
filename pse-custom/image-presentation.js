
(function () {
  "use strict";

  
  var imageHeadings = {
    "HebkZKn62K57PNuvj5AsbVsCrM.webp": "PRESENTATION WITH THE MINISTRY OF PUBLIC HEALTH",
    "84i1lsBG0q7u859gxo5bE4MiY.webp": "Add text underneath the second image here"
  };

  function injectStyles() {
    if (document.getElementById("pse-image-presentation-style")) return;
    var style = document.createElement("style");
    style.id = "pse-image-presentation-style";
    style.textContent =
      ".pse-content-image{border-radius:16px!important}" +
      ".pse-image-caption{box-sizing:border-box;color:#1e1e1f;font-family:Geist,Inter,system-ui,sans-serif;" +
      "display:block!important;font-size:20px;font-weight:600;line-height:1.3;margin:0 0 14px;" +
      "opacity:1!important;padding:0;text-align:left;visibility:visible!important;width:100%}";
    (document.head || document.documentElement).appendChild(style);
  }

  function excluded(image) {
    var src = (image.getAttribute("src") || "").toLowerCase();
    var alt = (image.getAttribute("alt") || "").toLowerCase();
    var width = parseInt(image.getAttribute("width"), 10) || 0;
    var height = parseInt(image.getAttribute("height"), 10) || 0;
    if (!image.closest('[data-framer-name="Section Recent Articles"]')) return true;
    if (/\.(svg|ico)(\?|$)/.test(src) || /\b(logo|icon|favicon)\b/.test(alt)) return true;
    if (width && height && width <= 128 && height <= 128) return true;
    return !!image.closest('nav, footer, [data-framer-name*="Logo"], [data-framer-name*="Icon"], .ref-logo-grid');
  }

  function addCaption(image) {
    
    
    var card = image.closest('[data-framer-name="Desktop"], [data-framer-name="Tablet"], [data-framer-name="Phone"]');
    var content = card && card.querySelector('[data-framer-name="Blog Content"]');
    if (!content || content.querySelector(":scope > .pse-image-caption")) return;
    var src = image.getAttribute("src") || "";
    var imageName = src.split("/").pop().split("?")[0];
    var captionText = image.getAttribute("data-caption") || imageHeadings[imageName] || "Add your text here";
    var caption = document.createElement("h3");
    caption.className = "pse-image-caption";
    caption.textContent = captionText;
    content.insertBefore(caption, content.firstChild);
    image.setAttribute("data-caption-ready", "1");
  }

  function enhance(root) {
    injectStyles();
    var scope = root || document;
    var images = scope.querySelectorAll ? Array.prototype.slice.call(scope.querySelectorAll("img")) : [];
    
    if (scope.nodeType === 1 && scope.matches && scope.matches("img")) images.unshift(scope);
    for (var i = 0; i < images.length; i++) {
      if (excluded(images[i])) continue;
      images[i].classList.add("pse-content-image");
      addCaption(images[i]);
    }
  }

  enhance(document);
  document.addEventListener("DOMContentLoaded", function () { enhance(document); });
  window.addEventListener("load", function () { enhance(document); });
  
  window.setTimeout(function () { enhance(document); }, 1000);
  if (typeof MutationObserver !== "undefined") {
    new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        for (var j = 0; j < mutations[i].addedNodes.length; j++) enhance(mutations[i].addedNodes[j]);
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
