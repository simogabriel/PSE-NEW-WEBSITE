(function () {
  "use strict";

  var API = "/api/opportunities";
  var list = document.getElementById("career-opportunity-list");
  var alertButton = document.getElementById("career-alert-button");
  var alertStatus = document.getElementById("career-alert-status");
  if (!list) return;

  var roles = [];
  var language = window.__pseCareerLang || "fr";
  function t(en, fr) { return language === "en" ? en : fr; }
  function localized(value) {
    if (value && typeof value === "object") return value[language] || value.en || value.fr || "";
    return value || "";
  }
  function safeDate(value) {
    if (!value) return "";
    var date = new Date(value + "T00:00:00");
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(language === "en" ? "en" : "fr", { year: "numeric", month: "short", day: "numeric" }).format(date);
  }
  function textNode(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = text;
    return el;
  }
  function appHref(url) {
    if (!url) return "contact.html";
    try {
      var parsed = new URL(url, document.baseURI);
      return /^(https?:|mailto:)$/.test(parsed.protocol) ? parsed.href : "contact.html";
    } catch (e) { return "contact.html"; }
  }
  function render() {
    list.textContent = "";
    if (!roles.length) {
      list.appendChild(textNode("p", "career-empty", t("There are no open positions right now. Check back soon or contact us to introduce yourself.", "Aucun poste n'est ouvert pour le moment. Revenez bientot ou contactez-nous pour vous presenter.")));
      return;
    }
    roles.forEach(function (role) {
      var card = document.createElement("article");
      card.className = "career-opportunity";
      var top = document.createElement("div");
      top.className = "career-opportunity__top";
      if (role.posted && Date.now() - new Date(role.posted + "T00:00:00").getTime() < 14 * 86400000) {
        top.appendChild(textNode("span", "career-opportunity__badge", t("New", "Nouveau")));
      }
      var meta = [role.location, localized(role.type)].filter(Boolean).join(" \u00b7 ");
      if (meta) top.appendChild(textNode("span", "career-opportunity__meta", meta));
      card.appendChild(top);
      card.appendChild(textNode("h3", "", localized(role.title) || t("Open position", "Poste a pourvoir")));
      if (localized(role.summary)) card.appendChild(textNode("p", "career-opportunity__summary", localized(role.summary)));
      if (role.closingDate) card.appendChild(textNode("p", "career-opportunity__meta", t("Apply by ", "Postulez avant le ") + safeDate(role.closingDate)));
      var link = textNode("a", "career-opportunity__apply", t("Apply for this role", "Postuler a ce poste") + " \u2197");
      link.href = appHref(role.applyUrl);
      if (/^https?:/i.test(link.href)) { link.target = "_blank"; link.rel = "noopener noreferrer"; }
      card.appendChild(link);
      list.appendChild(card);
    });
  }
  function showLoadError() {
    list.textContent = "";
    list.appendChild(textNode("p", "career-empty", t("Opportunities could not be loaded. Please try again later.", "Impossible de charger les offres. Veuillez reessayer plus tard.")));
  }
  function load() {
    fetch(API, { cache: "no-store" })
      .then(function (response) {
        if (response.status === 404) return fetch("pse-custom/opportunities.json", { cache: "no-store" }).then(function (fallback) {
          if (!fallback.ok) throw new Error("Local fallback unavailable");
          return fallback.json();
        });
        if (!response.ok) throw new Error("API unavailable");
        return response.json();
      })
      .then(function (data) {
        roles = Array.isArray(data) ? data.filter(function (role) { return role && role.id; }) : [];
        render();
      })
      .catch(showLoadError);
  }
  function base64ToBytes(value) {
    var padding = "=".repeat((4 - value.length % 4) % 4);
    var base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
    var raw = window.atob(base64);
    var output = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
    return output;
  }
  function setAlertMessage(message) { if (alertStatus) alertStatus.textContent = message; }
  function configureButton(subscription) {
    if (!alertButton) return;
    if (subscription) {
      alertButton.textContent = t("Alerts enabled", "Alertes activees");
      alertButton.disabled = true;
    }
  }
  function enablePushAlerts() {
    if (!window.isSecureContext) throw new Error(t("Push alerts require HTTPS.", "Les alertes push necessitent une connexion HTTPS."));
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      throw new Error(t("Push alerts are not supported by this browser.", "Ce navigateur ne prend pas en charge les alertes push."));
    }
    return Notification.requestPermission().then(function (permission) {
      if (permission !== "granted") throw new Error(t("Allow notifications in your browser settings to subscribe.", "Autorisez les notifications dans les parametres de votre navigateur."));
      return fetch("/api/notifications/vapid-public-key", { cache: "no-store" }).then(function (response) {
        if (!response.ok) throw new Error(t("Push alerts are not configured on the server yet.", "Les alertes push ne sont pas encore configurees sur le serveur."));
        return response.json();
      });
    }).then(function (config) {
      if (!config.publicKey) throw new Error(t("Push alerts are not configured on the server yet.", "Les alertes push ne sont pas encore configurees sur le serveur."));
      return navigator.serviceWorker.register("/career-sw.js").then(function (registration) {
        return registration.pushManager.getSubscription().then(function (subscription) {
          if (subscription) return subscription;
          return registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64ToBytes(config.publicKey) });
        });
      });
    }).then(function (subscription) {
      return fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.assign({}, subscription.toJSON(), { language: language }))
      }).then(function (response) {
        if (!response.ok) throw new Error(t("Could not save your alert subscription.", "Impossible d'enregistrer votre inscription aux alertes."));
        configureButton(subscription);
        setAlertMessage(t("Subscribed. New opportunity alerts can arrive even when this page is closed.", "Inscription confirmee. Les alertes peuvent arriver meme lorsque cette page est fermee."));
      });
    });
  }

  if (alertButton) {
    alertButton.addEventListener("click", function () {
      alertButton.disabled = true;
      setAlertMessage(t("Setting up alerts...", "Activation des alertes..."));
      Promise.resolve().then(enablePushAlerts).catch(function (error) {
        alertButton.disabled = false;
        setAlertMessage(error.message || t("Could not enable alerts.", "Impossible d'activer les alertes."));
      });
    });
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration("/").then(function (registration) {
        return registration && registration.pushManager.getSubscription();
      }).then(configureButton).catch(function () {});
    }
  }

  window.PSE_careerRefreshLanguage = function (lang) {
    language = lang === "en" ? "en" : "fr";
    render();
  };
  load();
  window.setInterval(function () { if (document.visibilityState !== "hidden") load(); }, 120000);
})();
