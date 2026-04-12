// routes/providers.js — Static provider metadata
const express = require("express");
const { BASE_PRICING, REGION_MULTIPLIERS } = require("../utils/pricingEngine");
const router = express.Router();

// GET /api/providers — list all providers and regions
router.get("/", (req, res) => {
  const providers = Object.entries(BASE_PRICING).map(([key, p]) => ({
    id:       key,
    name:     p.name,
    shortName: p.shortName,
    color:    p.color,
    features: p.features,
  }));

  const regions = Object.entries(REGION_MULTIPLIERS).map(([key, r]) => ({
    id:    key,
    label: r.label,
  }));

  res.json({ success: true, data: { providers, regions } });
});

module.exports = router;
