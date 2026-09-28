
(function () {
  "use strict";

  function installMissionStyles() {
    if (document.getElementById("pse-mission-font-styles")) return;
    var style = document.createElement("style");
    style.id = "pse-mission-font-styles";
    style.textContent =
      ".pse-mission-visible-copy{width:100%!important;max-width:900px!important;" +
      "margin-inline:auto!important;text-align:center!important}" +
      ".pse-mission-visible-copy>p:first-child{font-size:clamp(28px,3.2vw,40px)!important;" +
      "line-height:1.2!important;text-align:center!important}" +
      ".pse-mission-visible-copy>p:nth-child(2){font-size:clamp(16px,1.4vw,19px)!important;" +
      "line-height:1.7!important;text-align:center!important}" +
      ".pse-mission-label{font-size:clamp(36px,5vw,64px)!important;line-height:1.08!important;" +
      "letter-spacing:-.04em!important;text-align:center!important}";
    (document.head || document.documentElement).appendChild(style);
  }

  function centerMission() {
    installMissionStyles();
    var sections = document.querySelectorAll('section[data-framer-name="Section About Intro"]');
    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];
      var content = section.querySelector('[data-framer-name="Content Wrap"]');
      var wrap = section.querySelector('[data-framer-name="Wrap"]');
      var textWrap = section.querySelector('[data-framer-name="Text Wrap"]');
      var blocks = section.querySelectorAll('[data-framer-component-type="RichTextContainer"], p, h1, h2');

      
      
      if (content) {
        var copy = content.querySelector(".pse-mission-visible-copy");
        if (!copy) {
          copy = document.createElement("div");
          copy.className = "pse-mission-visible-copy";
          copy.innerHTML =
            "<p>PSE Consulting empowers organizations through innovative, tailored digital solutions.</p>" +
            "<p>Our software, engineering, data and project-management specialists work closely with every client to ensure seamless integration, measurable value and sustainable digital growth.</p>";
          if (wrap) content.insertBefore(copy, wrap);
          else content.appendChild(copy);
        }

        copy.style.setProperty("width", "100%", "important");
        copy.style.setProperty("max-width", "900px", "important");
        copy.style.setProperty("margin-inline", "auto", "important");
        copy.style.setProperty("text-align", "center", "important");

        var missionLead = copy.querySelector("p:first-child");
        var missionBody = copy.querySelector("p:nth-child(2)");
        if (missionLead) {
          missionLead.style.setProperty("font-size", "clamp(28px, 3.2vw, 40px)", "important");
          missionLead.style.setProperty("line-height", "1.2", "important");
        }
        if (missionBody) {
          missionBody.style.setProperty("font-size", "clamp(16px, 1.4vw, 19px)", "important");
          missionBody.style.setProperty("line-height", "1.7", "important");
        }
      }

      if (content) {
        content.style.setProperty("align-items", "center", "important");
        content.style.setProperty("display", "flex", "important");
        content.style.setProperty("flex-direction", "column", "important");
        content.style.setProperty("text-align", "center", "important");
        content.style.setProperty("width", "100%", "important");
      }
      if (wrap) {
        wrap.style.setProperty("display", "none", "important");
        wrap.style.setProperty("flex-direction", "column", "important");
        wrap.style.setProperty("width", "100%", "important");
      }
      if (textWrap) {
        textWrap.style.setProperty("margin-inline", "auto", "important");
        textWrap.style.setProperty("max-width", "900px", "important");
        textWrap.style.setProperty("width", "100%", "important");
      }
      for (var j = 0; j < blocks.length; j++) {
        blocks[j].style.setProperty("text-align", "center", "important");
        blocks[j].style.setProperty("--framer-text-alignment", "center", "important");

        var label = (blocks[j].textContent || "").replace(/\s+/g, " ").trim();
        if (label === "Our Mission" || label === "Notre mission") {
          blocks[j].classList.add("pse-mission-label");
          blocks[j].style.setProperty("--framer-text-color", "#1677c8", "important");
          blocks[j].style.setProperty("color", "#1677c8", "important");
          blocks[j].style.setProperty("opacity", "1", "important");
          blocks[j].style.setProperty("visibility", "visible", "important");
          blocks[j].style.setProperty("font-size", "clamp(36px, 5vw, 64px)", "important");
          blocks[j].style.setProperty("line-height", "1.08", "important");
          blocks[j].style.setProperty("display", "block", "important");
          blocks[j].style.setProperty("margin-inline", "auto", "important");
          blocks[j].style.setProperty("width", "100%", "important");
          if (blocks[j].parentElement) {
            blocks[j].parentElement.style.setProperty("margin-inline", "auto", "important");
            blocks[j].parentElement.style.setProperty("text-align", "center", "important");
            blocks[j].parentElement.style.setProperty("width", "100%", "important");
          }
        }
      }
    }
  }

  installMissionStyles();
  centerMission();
  document.addEventListener("DOMContentLoaded", centerMission);
  window.addEventListener("load", centerMission);
  setTimeout(centerMission, 500);
  setTimeout(centerMission, 1500);
  setTimeout(centerMission, 3000);

  if (typeof MutationObserver !== "undefined") {
    var pending = false;
    new MutationObserver(function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        centerMission();
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
