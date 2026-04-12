// models/Calculation.js — Mongoose schema for saved calculations
const mongoose = require("mongoose");

const BreakdownSchema = new mongoose.Schema({
  compute: Number,
  memory:  Number,
  storage: Number,
  support: Number,
}, { _id: false });

const TotalsSchema = new mongoose.Schema({
  monthly:          Number,
  yearly:           Number,
  reservedMonthly:  Number,
  reservedYearly:   Number,
  reservedSavings:  Number,
}, { _id: false });

const ProviderResultSchema = new mongoose.Schema({
  provider:     String,
  name:         String,
  shortName:    String,
  color:        String,
  instanceType: String,
  region:       String,
  breakdown:    BreakdownSchema,
  totals:       TotalsSchema,
  rank:         Number,
  isCheapest:   Boolean,
}, { _id: false });

const CalculationSchema = new mongoose.Schema({
  inputs: {
    cpu:     { type: Number, required: true, min: 1, max: 256 },
    ram:     { type: Number, required: true, min: 1, max: 2048 },
    storage: { type: Number, required: true, min: 1, max: 65536 },
    hours:   { type: Number, required: true, min: 1, max: 744 },
    region:  { type: String, default: "us-east" },
  },
  providers:  { type: Map, of: ProviderResultSchema },
  cheapest:   String,
  ranking:    [String],
  sessionId:  { type: String, index: true },
  createdAt:  { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 }, // TTL: 30 days
}, {
  timestamps: true,
});

// Index for fast history retrieval
CalculationSchema.index({ sessionId: 1, createdAt: -1 });

module.exports = mongoose.model("Calculation", CalculationSchema);
