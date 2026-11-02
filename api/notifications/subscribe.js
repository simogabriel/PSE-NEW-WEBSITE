"use strict";

const { createHash } = require("node:crypto");
const { command, BASE } = require("../_lib/kv");

function subscriptionId(endpoint) {
  return createHash("sha256").update(endpoint).digest("hex");
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  if (req.method !== "POST" && req.method !== "DELETE") {
    res.setHeader("Allow", "POST, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const subscription = req.body && typeof req.body === "object" ? req.body : {};
  const endpoint = typeof subscription.endpoint === "string" ? subscription.endpoint : "";
  if (!endpoint.startsWith("https://") || endpoint.length > 4096) {
    return res.status(400).json({ error: "Invalid push subscription" });
  }
  const id = subscriptionId(endpoint);
  const key = BASE + "subscription:" + id;
  try {
    if (req.method === "DELETE") {
      await command([["DEL", key], ["SREM", BASE + "subscription-ids", id]]);
      return res.status(200).json({ ok: true });
    }
    if (!subscription.keys || typeof subscription.keys.p256dh !== "string" || typeof subscription.keys.auth !== "string") {
      return res.status(400).json({ error: "Push subscription keys are required" });
    }
    await command([
      ["SET", key, JSON.stringify(subscription)],
      ["SADD", BASE + "subscription-ids", id]
    ]);
    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Unable to save push subscription:", error.message);
    return res.status(error.statusCode || 500).json({ error: "Unable to save notification settings" });
  }
};
