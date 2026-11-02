"use strict";

const { getOpportunities } = require("./_lib/kv");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    return res.status(200).json(await getOpportunities());
  } catch (error) {
    console.error("Unable to read career opportunities:", error.message);
    return res.status(error.statusCode || 500).json({ error: "Career opportunities are temporarily unavailable" });
  }
};
