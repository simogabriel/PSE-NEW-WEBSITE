











(function () {
  "use strict";

  var BASE = (function () {
    var ss = document.getElementsByTagName("script");
    for (var i = 0; i < ss.length; i++) {
      var s = ss[i].src || "";
      if (/pse-custom\/about-images\.js(\?|$)/.test(s)) return s.replace(/pse-custom\/about-images\.js.*$/, "");
    }
    return "";
  })();

  var CEREMONY = [
    "pse-custom/about/parchemin-1.jpeg", "pse-custom/about/parchemin-2.jpeg",
    "pse-custom/about/parchemin-3.jpeg", "pse-custom/about/parchemin-4.jpeg",
    "pse-custom/about/parchemin-5.jpeg"
  ];
  var LEADERS = [
    "pse-custom/team/boss.jpg", "pse-custom/team/philip.jpeg", "pse-custom/team/schimdt.jpeg",
    "pse-custom/team/audrey.jpeg", "pse-custom/team/alice.jpeg", "pse-custom/team/leonel.jpeg"
  ];
  var BANNER = "pse-custom/pse-team.webp";

  
  var ASSIGN = {};   
  var COUNT = {};    

  function origKey(im) {
    var k = im.getAttribute("data-pse-orig");
    if (!k) {
      k = im.getAttribute("src") || ("rnd-" + Math.random());
      im.setAttribute("data-pse-orig", k);
    }
    return k;
  }
  function setImg(im, file) {
    if (im.getAttribute("data-pse-aimg") === file && im.src === BASE + file && !im.getAttribute("srcset")) return;
    im.removeAttribute("srcset");
    im.removeAttribute("data-framer-original-sizes");
    im.setAttribute("src", BASE + file);
    im.setAttribute("data-pse-aimg", file);
  }

  function eachImg(secName, fn) {
    var secs = document.querySelectorAll('[data-framer-name="' + secName + '"]');
    for (var s = 0; s < secs.length; s++) {
      var imgs = secs[s].querySelectorAll("img");
      for (var i = 0; i < imgs.length; i++) fn(imgs[i]);
    }
  }

  function flat(secName, file) {
    eachImg(secName, function (im) { origKey(im); setImg(im, file); });
  }

  function cycle(secName, files, groupId) {
    if (COUNT[groupId] == null) COUNT[groupId] = 0;
    eachImg(secName, function (im) {
      var key = groupId + "::" + origKey(im);
      if (!(key in ASSIGN)) { ASSIGN[key] = files[COUNT[groupId] % files.length]; COUNT[groupId]++; }
      setImg(im, ASSIGN[key]);
    });
  }

  function apply() {
    if (!document.querySelector('[data-framer-name="Section Our Leaders"], ' +
        '[data-framer-name="Section Full Image"], [data-framer-name="Section  Image"]')) return;
    flat("Section Full Image", BANNER);
    cycle("Section  Image", CEREMONY, "gallery");
    cycle("Section Our Leaders", LEADERS, "leaders");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else { apply(); }
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
