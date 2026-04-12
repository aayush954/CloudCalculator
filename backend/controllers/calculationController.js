// controllers/calculationController.js
const { validationResult } = require("express-validator");
const { calculateCosts }   = require("../utils/pricingEngine");
const Calculation          = require("../models/Calculation");
const mongoose             = require("mongoose");

// POST /api/calculate
const calculate = async (req, res) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { cpu, ram, storage, hours, region, sessionId } = req.body;

  try {
    // Run pricing engine
    const result = calculateCosts({
      cpu:     parseInt(cpu),
      ram:     parseInt(ram),
      storage: parseInt(storage),
      hours:   parseInt(hours),
      region:  region || "us-east",
    });

    // Persist to MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        await Calculation.create({
          inputs:    result.inputs,
          providers: result.providers,
          cheapest:  result.cheapest,
          ranking:   result.ranking,
          sessionId: sessionId || "anonymous",
        });
      } catch (dbErr) {
        console.warn("DB save skipped:", dbErr.message);
      }
    }

    return res.json({ success: true, data: result });
  } catch (err) {
    console.error("Calculation error:", err);
    return res.status(500).json({ error: "Failed to calculate costs" });
  }
};

module.exports = { calculate };
