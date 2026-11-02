"use strict";

const { timingSafeEqual, createHash } = require("node:crypto");
const webpush = require("web-push");
const { command, getOpportunities, saveOpportunities, BASE } = require("../_lib/kv");

function authorized(req) {
  const expected = process.env.CAREERS_ADMIN_TOKEN;
  const received = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!expected || !received) return false;
  const a = createHash("sha256").update(expected).digest();
  const b = createHash("sha256").update(received).digest();
  return timingSafeEqual(a, b) && received === expected;
}

function validText(value, max) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

function validRole(role) {
  if (!role || typeof role !== "object") return false;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{1,79}$/.test(role.id || "")) return false;
  if (!role.title || !validText(role.title.en, 120) || !validText(role.title.fr, 120)) return false;
  if (!validText(role.location, 120)) return false;
  if (!role.type || !validText(role.type.en, 80) || !validText(role.type.fr, 80)) return false;
  if (!role.summary || !validText(role.summary.en, 2000) || !validText(role.summary.fr, 2000)) return false;
  if (role.posted && !/^\d{4}-\d{2}-\d{2}$/.test(role.posted)) return false;
  if (role.closingDate && !/^\d{4}-\d{2}-\d{2}$/.test(role.closingDate)) return false;
  if (role.applyUrl) {
    try {
      if (!["https:", "http:", "mailto:"].includes(new URL(role.applyUrl).protocol)) return false;
    } catch (error) { return false; }
  }
  return true;
}

function pushPayload(role, language) {
  return JSON.stringify({
    title: language === "fr" ? "Nouvelle opportunit\u00e9 chez PSE Consulting" : "New opportunity at PSE Consulting",
    body: language === "fr" ? role.title.fr : role.title.en,
    url: "/career.html"
  });
}

async function notifySubscribers(newRoles) {
  if (!newRoles.length || !process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY || !process.env.VAPID_SUBJECT) return 0;
  webpush.setVapidDetails(process.env.VAPID_SUBJECT, process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
  const [ids] = await command([["SMEMBERS", BASE + "subscription-ids"]]);
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const subscriptions = await command(ids.map((id) => ["GET", BASE + "subscription:" + id]));
  let delivered = 0;
  await Promise.all(subscriptions.map(async (value, index) => {
    if (!value) return;
    let subscription;
    try { subscription = JSON.parse(value); } catch (error) { return; }
    for (const role of newRoles) {
      try {
        await webpush.sendNotification(subscription, pushPayload(role, subscription.language));
        delivered += 1;
      } catch (error) {
        if (error.statusCode === 404 || error.statusCode === 410) {
          await command([
            ["DEL", BASE + "subscription:" + ids[index]],
            ["SREM", BASE + "subscription-ids", ids[index]]
          ]).catch(() => {});
          return;
        }
        console.error("Push delivery failed:", error.statusCode || error.message);
      }
    }
  }));
  return delivered;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  if (req.method !== "GET" && req.method !== "PUT") {
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!authorized(req)) return res.status(401).json({ error: "Unauthorized" });
  try {
    if (req.method === "GET") return res.status(200).json(await getOpportunities());
    const roles = Array.isArray(req.body) ? req.body : req.body && req.body.opportunities;
    if (!Array.isArray(roles) || roles.length > 100 || !roles.every(validRole)) {
      return res.status(400).json({ error: "Each opportunity must include a unique id, bilingual title, location, type, and summary" });
    }
    const ids = roles.map((role) => role.id);
    if (new Set(ids).size !== ids.length) return res.status(400).json({ error: "Opportunity IDs must be unique" });
    const previous = await getOpportunities();
    const oldIds = new Set(previous.map((role) => role.id));
    const added = roles.filter((role) => !oldIds.has(role.id));
    await saveOpportunities(roles);
    let notified = 0;
    try { notified = await notifySubscribers(added); }
    catch (error) { console.error("Unable to send career push notifications:", error.message); }
    return res.status(200).json({ ok: true, count: roles.length, newRoles: added.length, notificationsSent: notified });
  } catch (error) {
    console.error("Unable to manage career opportunities:", error.message);
    return res.status(error.statusCode || 500).json({ error: "Career service is temporarily unavailable" });
  }
};
