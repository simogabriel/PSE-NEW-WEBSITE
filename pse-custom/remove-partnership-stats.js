
(function () {
  "use strict";

  var phrases = [
    "Typical Partnership Outcomes",
    "Our partners achieve remarkable growth",
    "These outcomes are not coincidental",
    "Revenue Growth",
    "Increase in Business Efficiency",
    "Growth Over 5 Years"
  ];

  function isPartnershipStats(section) {
    var text = section.textContent || "";
    for (var i = 0; i < phrases.length; i++) {
      if (text.indexOf(phrases[i]) !== -1) return true;
    }
    return section.getAttribute("data-framer-name") === "Section Stats";
  }

  function removeStats() {
    var sections = document.querySelectorAll('section[data-framer-name="Section Stats"]');
    for (var i = sections.length - 1; i >= 0; i--) {
      if (isPartnershipStats(sections[i])) sections[i].remove();
    }
  }

  removeStats();

  if (typeof MutationObserver !== "undefined") {
    new MutationObserver(removeStats).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  document.addEventListener("DOMContentLoaded", removeStats);
  window.addEventListener("load", removeStats);
  setTimeout(removeStats, 500);
  setTimeout(removeStats, 1500);
  setTimeout(removeStats, 3000);
})();
