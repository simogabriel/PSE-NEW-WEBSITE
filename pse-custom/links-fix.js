








(function () {
  "use strict";

  
  var TEAM_TXT = /^(voir l'?équipe|view team)$/i;
  var TEAM_HREF = "team.html";

  function norm(s) { return (s || "").replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim(); }

  function isTeamLink(node) {
    var a = node && node.closest ? node.closest("a") : null;
    return (a && TEAM_TXT.test(norm(a.textContent))) ? a : null;
  }

  // Met simplement le bon href (accessibilité / clic milieu / no-JS).
  function fix() {
    var links = document.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if (TEAM_TXT.test(norm(a.textContent)) &&
          a.getAttribute("href") !== TEAM_HREF) {
        a.setAttribute("href", TEAM_HREF);
      }
    }
  }

  // UN SEUL écouteur en capture sur document, posé maintenant — donc AVANT
  // l'initialisation du bundle Framer (chargé en async) : il intercepte le
  // clic en premier et coupe la propagation pour bloquer le routeur Framer.
  document.addEventListener("click", function (e) {
    if (isTeamLink(e.target)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      window.location.href = TEAM_HREF;
    }
  }, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fix);
  } else { fix(); }
  window.addEventListener("load", fix);
  setTimeout(fix, 800);
  setTimeout(fix, 2000);

  if (typeof MutationObserver !== "undefined") {
    var pend = false;
    new MutationObserver(function () {
      if (pend) return;
      pend = true;
      window.requestAnimationFrame(function () { pend = false; fix(); });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
