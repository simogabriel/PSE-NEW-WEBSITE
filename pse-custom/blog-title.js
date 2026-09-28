
(function () {
  "use strict";

  function updateBlogTitle() {
    var titles = document.querySelectorAll(
      '#team-intro[data-framer-name="Section Blog Header"] h1'
    );
    for (var i = 0; i < titles.length; i++) {
      if (titles[i].textContent !== "PSE Consulting SARL") {
        titles[i].textContent = "PSE Consulting SARL";
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateBlogTitle);
  } else {
    updateBlogTitle();
  }
  window.addEventListener("load", updateBlogTitle);
  setTimeout(updateBlogTitle, 500);
  setTimeout(updateBlogTitle, 1500);
})();
