(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("pse-has-nav");
  var theme;
  try { theme = localStorage.getItem("pse-theme"); } catch (error) {}
  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  root.setAttribute("data-pse-theme", theme);
  root.style.colorScheme = theme;

  // A slow image or remote template must never hide or disable the page.
  function reveal() {
    root.classList.remove("pse-page-loading");
    root.classList.add("pse-page-ready");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", reveal, { once: true });
  } else {
    reveal();
  }
  window.addEventListener("pageshow", reveal);
})();
