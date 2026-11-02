"use strict";

self.addEventListener("push", function (event) {
  let message = {};
  try { message = event.data ? event.data.json() : {}; } catch (error) {}
  const title = message.title || "New PSE Consulting opportunity";
  const options = {
    body: message.body || "A new role is available. Visit PSE Consulting Careers for details.",
    icon: "/pse-custom/pse-logo.webp",
    badge: "/pse-custom/favicon.ico",
    data: { url: message.url || "/career.html" },
    tag: message.tag || "pse-career-opportunity",
    renotify: true
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const url = new URL(event.notification.data && event.notification.data.url || "/career.html", self.location.origin).href;
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (windows) {
    for (const client of windows) {
      if (client.url === url && "focus" in client) return client.focus();
    }
    return clients.openWindow(url);
  }));
});
