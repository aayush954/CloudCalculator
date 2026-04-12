// routes/history.js
const express = require("express");
const { getHistory, clearHistory } = require("../controllers/historyController");
const router = express.Router();

router.get("/:sessionId", getHistory);
router.delete("/:sessionId", clearHistory);

module.exports = router;
