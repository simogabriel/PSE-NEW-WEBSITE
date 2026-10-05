









(function () {
  "use strict";

  var T = {
    title: { fr: "Nos coordonnées", en: "Our Contact Details" },
    cmr: { fr: "Cameroun", en: "Cameroon" },
    che: { fr: "Suisse", en: "Switzerland" },
    addr: { fr: "Adresse", en: "Address" },
    phone: { fr: "Téléphone", en: "Phone" },
    email: { fr: "E-mail", en: "Email" }
  };
  var DATA = {
    cmrAddr: "Bastos, Yaoundé 2, Région du Centre, BP 6471 Yaoundé — Cameroun",
    cmrPhones: ["+237 670 91 21 66", "(+237)673 18 67 28"],
    cheAddr: "Route de Vevey 42, 1009 Pully — Suisse",
    chePhones: ["(+41) 76 468 6947"],
    email: "info@pse-consulting.com"
  };

  function getLang() {
    try { var s = localStorage.getItem("pse-lang"); if (s === "fr" || s === "en") return s; } catch (e) {}
    return "fr";
  }
  function L(o, lang) { return (o && o[lang]) || (o && o.fr) || ""; }

  function injectStyles() {
    if (document.getElementById("pse-cinfo-style")) return;
    var st = document.createElement("style");
    st.id = "pse-cinfo-style";
    st.textContent =
      ".pse-cinfo{padding:24px clamp(16px,4vw,56px) 72px;background:#ffffff;" +
      "font-family:'Geist','Geist Placeholder',Inter,system-ui,-apple-system,sans-serif}" +
      ".pse-cinfo__in{max-width:1000px;margin:0 auto}" +
      ".pse-cinfo__t{font-family:'Geist','Geist Placeholder',Inter,sans-serif;font-weight:500;" +
      "font-size:clamp(24px,3vw,36px);letter-spacing:-.04em;color:#1e1e1f;margin:0 0 26px;text-align:center;line-height:1.12}" +
      ".pse-cinfo__grid{display:grid;grid-template-columns:1fr 1fr;gap:22px}" +
      ".pse-cc{border:1px solid rgba(22,20,42,.08);border-radius:18px;padding:26px 26px;background:#f7f9fb;" +
      "transition:transform .28s cubic-bezier(.22,.61,.36,1),box-shadow .28s ease,border-color .28s ease}" +
      ".pse-cc:hover{transform:translateY(-4px);border-color:rgba(52,138,206,.18);box-shadow:0 18px 38px rgba(12,20,36,.09)}" +
      ".pse-cc h3{display:flex;align-items:center;gap:9px;font-family:Archivo,'Archivo Placeholder',Inter,sans-serif;" +
      "font-weight:600;font-size:19px;color:#16142a;margin:0 0 16px}" +
      ".pse-cc h3::before{content:'';width:10px;height:10px;border-radius:50%;background:#348ace;display:inline-block}" +
      ".pse-cc__row{margin:0 0 12px}" +
      ".pse-cc__k{display:block;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;" +
      "color:#9a9aab;margin-bottom:3px}" +
      ".pse-cc__v{font-size:15px;line-height:1.5;color:#3a3a4a;margin:0}" +
      ".pse-cc__v a{color:#348ace;text-decoration:none}" +
      ".pse-cc__v a:hover{text-decoration:underline}" +
      "@media(max-width:680px){.pse-cinfo__grid{grid-template-columns:1fr}}";
    (document.head || document.documentElement).appendChild(st);
  }

  function phones(list) {
    var out = "";
    for (var i = 0; i < list.length; i++) {
      var tel = list[i].replace(/[^0-9+]/g, "");
      out += '<p class="pse-cc__v"><a href="tel:' + tel + '">' + list[i] + '</a></p>';
    }
    return out;
  }

  function card(country, addr, phoneList, lang, withEmail) {
    return '<div class="pse-cc">' +
      '<h3 data-ci="' + (country === "cmr" ? "cmr" : "che") + '">' + L(T[country], lang) + '</h3>' +
      '<div class="pse-cc__row"><span class="pse-cc__k" data-ci="addr">' + L(T.addr, lang) + '</span>' +
        '<p class="pse-cc__v">' + addr + '</p></div>' +
      '<div class="pse-cc__row"><span class="pse-cc__k" data-ci="phone">' + L(T.phone, lang) + '</span>' +
        phones(phoneList) + '</div>' +
      (withEmail ? '<div class="pse-cc__row"><span class="pse-cc__k" data-ci="email">' + L(T.email, lang) +
        '</span><p class="pse-cc__v"><a href="mailto:' + DATA.email + '">' + DATA.email + '</a></p></div>' : '') +
      '</div>';
  }

  function render(lang) {
    var sec = document.createElement("section");
    sec.className = "pse-cinfo";
    sec.id = "pse-contact-info";
    sec.setAttribute("data-framer-name", "Section Contact Coordinates");
    sec.innerHTML =
      '<div class="pse-cinfo__in">' +
        '<h2 class="pse-cinfo__t" data-ci="title">' + L(T.title, lang) + '</h2>' +
        '<div class="pse-cinfo__grid">' +
          card("cmr", DATA.cmrAddr, DATA.cmrPhones, lang, true) +
          card("che", DATA.cheAddr, DATA.chePhones, lang, false) +
        '</div>' +
      '</div>';
    return sec;
  }

  function relang(lang) {
    var map = { title: T.title, cmr: T.cmr, che: T.che, addr: T.addr, phone: T.phone, email: T.email };
    for (var k in map) {
      var els = document.querySelectorAll('.pse-cinfo [data-ci="' + k + '"]');
      for (var i = 0; i < els.length; i++) els[i].textContent = L(map[k], lang);
    }
  }

  function replaceLegacyEmail() {
    var nodes = document.querySelectorAll('[data-framer-name="Section Contact Info"] p, [data-framer-name="Section Contact Info"] a');
    var legacyEmail = /(?:hello|careers)@asteria\.com/i;
    for (var i = 0; i < nodes.length; i++) {
      if (legacyEmail.test(nodes[i].textContent || "")) {
        nodes[i].textContent = DATA.email;
      }
      if (nodes[i].tagName === "A" && legacyEmail.test(nodes[i].getAttribute("href") || "")) {
        nodes[i].setAttribute("href", "mailto:" + DATA.email);
      }
    }
  }

  function replaceLegacyHours() {
    var nodes = document.querySelectorAll('[data-framer-name="Section Contact Info"] p');
    for (var i = 0; i < nodes.length; i++) {
      var value = nodes[i].textContent || "";
      if (/Monday\s*-\s*Friday/i.test(value) && /(?:11am\s*-\s*7pm|9am\s*-\s*6pm)/i.test(value)) {
        if (nodes[i].innerHTML !== "Monday - Friday<br>9am - 6pm") nodes[i].innerHTML = "Monday - Friday<br>9am - 6pm";
      } else if (/Lundi\s*-\s*Vendredi/i.test(value) && /(?:11h\s*-\s*19h|9h\s*-\s*18h)/i.test(value)) {
        if (nodes[i].innerHTML !== "Lundi - Vendredi<br>9h - 18h") nodes[i].innerHTML = "Lundi - Vendredi<br>9h - 18h";
      } else if (/11am\s*-\s*7pm/i.test(value)) {
        nodes[i].textContent = "9am - 6pm";
      } else if (/11h\s*-\s*19h/i.test(value)) {
        nodes[i].textContent = "9h - 18h";
      }
    }
  }

  function mount() {
    var anchors = document.querySelectorAll('[data-framer-name="Section Contact Header"]');
    if (!anchors.length) return false;
    injectStyles();
    for (var i = 0; i < anchors.length; i++) {
      var anchor = anchors[i];
      if (anchor.nextElementSibling && anchor.nextElementSibling.classList.contains("pse-cinfo")) continue;
      var section = render(getLang());
      section.id = i === 0 ? "pse-contact-info" : "pse-contact-info-" + i;
      anchor.parentNode.insertBefore(section, anchor.nextSibling);
    }
    return true;
  }

  function hookLang() {
    if (window.__pseCinfoHooked) return;
    if (typeof window.PSE_setLang === "function") {
      var orig = window.PSE_setLang;
      window.PSE_setLang = function (l) { orig(l); relang(l === "en" ? "en" : "fr"); };
      window.__pseCinfoHooked = true;
    }
  }

  function prepareForms() {
    document.querySelectorAll("form.framer-ranhfr").forEach(function (form) {
      var lang = getLang();
      var note = form.querySelector("[data-pse-email-note]");
      if (!note) {
        note = document.createElement("p");
        note.setAttribute("data-pse-email-note", "");
        note.setAttribute("role", "status");
        note.style.cssText = "font:14px/1.5 system-ui;color:inherit";
        form.appendChild(note);
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          if (!form.reportValidity()) return;
          var fields = ["Name", "Phone", "Compan", "Email", "Message"];
          var body = fields.map(function (name) {
            var field = form.elements.namedItem(name);
            return (name === "Compan" ? "Company" : name) + ": " + (field ? field.value : "");
          }).join("\n\n");
          window.location.href = "mailto:" + DATA.email + "?subject=" +
            encodeURIComponent("PSE Consulting - Contact") + "&body=" + encodeURIComponent(body);
        });
      }
      var copy = lang === "en"
        ? "Send the draft from your email app, or email info@pse-consulting.com."
        : "Envoyez le brouillon depuis votre messagerie ou écrivez à info@pse-consulting.com.";
      if (note.textContent !== copy) note.textContent = copy;
      var button = form.querySelector('[type="submit"] p');
      var label = lang === "en" ? "Open email draft" : "Ouvrir le brouillon";
      if (button && button.textContent !== label) button.textContent = label;
    });
  }

  function boot() {
    if (mount()) hookLang();
    prepareForms();
    replaceLegacyEmail();
    replaceLegacyHours();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
  window.addEventListener("load", boot);
  setTimeout(boot, 800);
  setTimeout(boot, 2200);

  if (typeof MutationObserver !== "undefined") {
    var pend = false;
    new MutationObserver(function () {
      if (pend) return;
      pend = true;
      window.requestAnimationFrame(function () { pend = false; boot(); });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
