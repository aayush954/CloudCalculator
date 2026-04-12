// routes/calculations.js
const express   = require("express");
const { body }  = require("express-validator");
const { calculate } = require("../controllers/calculationController");

const router = express.Router();

// Input validation rules
const validateCalcInput = [
  body("cpu")
    .isInt({ min: 1, max: 256 })
    .withMessage("CPU cores must be between 1 and 256"),
  body("ram")
    .isInt({ min: 1, max: 2048 })
    .withMessage("RAM must be between 1 and 2048 GB"),
  body("storage")
    .isInt({ min: 1, max: 65536 })
    .withMessage("Storage must be between 1 and 65536 GB"),
  body("hours")
    .isInt({ min: 1, max: 744 })
    .withMessage("Hours must be between 1 and 744 (max per month)"),
  body("region")
    .optional()
    .isIn(["us-east", "us-west", "eu-west", "eu-central", "ap-southeast", "ap-northeast", "ap-south", "sa-east"])
    .withMessage("Invalid region"),
  body("sessionId")
    .optional()
    .isString()
    .isLength({ max: 64 }),
];

// POST /api/calculate
router.post("/", validateCalcInput, calculate);

module.exports = router;
