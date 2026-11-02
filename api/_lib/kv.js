"use strict";

const BASE = "career:";

async function command(commands) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    const error = new Error("Configure a Vercel KV or Upstash Redis REST URL and token");
    error.statusCode = 503;
    throw error;
  }
  const response = await fetch(url.replace(/\/$/, "") + "/pipeline", {
    method: "POST",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify(commands)
  });
  if (!response.ok) throw new Error("Career storage request failed (" + response.status + ")");
  const results = await response.json();
  const failed = results.find((item) => item && item.error);
  if (failed) throw new Error(failed.error);
  return results.map((item) => item && item.result);
}

async function getOpportunities() {
  const [value] = await command([["GET", BASE + "opportunities"]]);
  if (!value) return [];
  const parsed = JSON.parse(value);
  return Array.isArray(parsed) ? parsed : [];
}

async function saveOpportunities(roles) {
  await command([["SET", BASE + "opportunities", JSON.stringify(roles)]]);
}

module.exports = { command, getOpportunities, saveOpportunities, BASE };
