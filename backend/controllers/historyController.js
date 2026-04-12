// controllers/historyController.js
const Calculation = require("../models/Calculation");
const mongoose    = require("mongoose");

// GET /api/history/:sessionId
const getHistory = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({ success: true, data: [], message: "Database not connected" });
  }

  try {
    const { sessionId } = req.params;
    const history = await Calculation
      .find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("inputs cheapest ranking createdAt totals");

    return res.json({ success: true, data: history });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch history" });
  }
};

// DELETE /api/history/:sessionId
const clearHistory = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({ success: true, message: "Database not connected" });
  }

  try {
    await Calculation.deleteMany({ sessionId: req.params.sessionId });
    return res.json({ success: true, message: "History cleared" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to clear history" });
  }
};

module.exports = { getHistory, clearHistory };
