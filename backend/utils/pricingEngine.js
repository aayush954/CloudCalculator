// utils/pricingEngine.js
// ─────────────────────────────────────────────────────────────
// Realistic mock pricing data structured for easy replacement
// with real AWS/Azure/GCP pricing APIs.
//
// Pricing sources (mock, as of 2024):
//   AWS:   https://aws.amazon.com/ec2/pricing/
//   Azure: https://azure.microsoft.com/en-us/pricing/
//   GCP:   https://cloud.google.com/compute/all-pricing
// ─────────────────────────────────────────────────────────────

// ─── Regional multipliers ─────────────────────────────────────
const REGION_MULTIPLIERS = {
  "us-east":      { aws: 1.00, azure: 1.00, gcp: 1.00, label: "US East" },
  "us-west":      { aws: 1.07, azure: 1.08, gcp: 1.06, label: "US West" },
  "eu-west":      { aws: 1.15, azure: 1.12, gcp: 1.14, label: "Europe West" },
  "eu-central":   { aws: 1.18, azure: 1.10, gcp: 1.16, label: "Europe Central" },
  "ap-southeast": { aws: 1.20, azure: 1.18, gcp: 1.22, label: "Asia Pacific SE" },
  "ap-northeast": { aws: 1.22, azure: 1.20, gcp: 1.20, label: "Asia Pacific NE" },
  "ap-south":     { aws: 1.10, azure: 1.08, gcp: 1.12, label: "Asia South" },
  "sa-east":      { aws: 1.30, azure: 1.35, gcp: 1.28, label: "South America" },
};

// ─── Base pricing per unit/hour (USD) ─────────────────────────
const BASE_PRICING = {
  aws: {
    name: "Amazon Web Services",
    shortName: "AWS",
    color: "#FF9900",
    cpu: {
      perCorePerHour: 0.0464,       // ~m6i.xlarge / 4 cores = $0.192/hr
      discountedPerCorePerHour: 0.0278, // reserved 1yr
    },
    ram: {
      perGBPerHour: 0.0058,         // ~$0.0058/GB/hr general purpose
      discountedPerGBPerHour: 0.0035,
    },
    storage: {
      perGBPerMonth: 0.08,          // EBS gp3
      perGBPerMonthSnapshot: 0.05,
    },
    network: {
      perGBOut: 0.09,
      freeGBOut: 100,
    },
    support: {
      developerMin: 29,
      businessPercent: 0.10,
    },
    features: [
      "Largest service catalog (200+)",
      "Best global reach (33 regions)",
      "Mature ecosystem & tooling",
      "Reserved & spot instance savings",
    ],
  },

  azure: {
    name: "Microsoft Azure",
    shortName: "Azure",
    color: "#0078D4",
    cpu: {
      perCorePerHour: 0.0448,       // ~D4s v5 / 4 cores = $0.192/hr
      discountedPerCorePerHour: 0.0269,
    },
    ram: {
      perGBPerHour: 0.0056,
      discountedPerGBPerHour: 0.0034,
    },
    storage: {
      perGBPerMonth: 0.0760,        // Premium SSD LRS
      perGBPerMonthSnapshot: 0.05,
    },
    network: {
      perGBOut: 0.087,
      freeGBOut: 100,
    },
    support: {
      developerMin: 29,
      businessPercent: 0.10,
    },
    features: [
      "Best Microsoft/enterprise integration",
      "Strong hybrid cloud (Azure Arc)",
      "Compliance certifications leader",
      "Azure Hybrid Benefit savings",
    ],
  },

  gcp: {
    name: "Google Cloud Platform",
    shortName: "GCP",
    color: "#4285F4",
    cpu: {
      perCorePerHour: 0.0425,       // n2-standard-4 / 4 = $0.170/hr
      discountedPerCorePerHour: 0.0255, // committed use
    },
    ram: {
      perGBPerHour: 0.0057,
      discountedPerGBPerHour: 0.0034,
    },
    storage: {
      perGBPerMonth: 0.08,          // Persistent SSD
      perGBPerMonthSnapshot: 0.026,
    },
    network: {
      perGBOut: 0.085,
      freeGBOut: 200,               // GCP gives more free egress
    },
    support: {
      developerMin: 0,              // No min for basic
      businessPercent: 0.09,
    },
    features: [
      "Best sustained use discounts (auto)",
      "Leading AI/ML services (Vertex AI)",
      "Superior networking performance",
      "Per-second billing granularity",
    ],
  },
};

// ─── Instance type lookup (for display purposes) ──────────────
const getInstanceType = (cpu, ram, provider) => {
  const instances = {
    aws:   [
      { maxCpu: 1,  maxRam: 1,  name: "t3.micro" },
      { maxCpu: 2,  maxRam: 4,  name: "t3.medium" },
      { maxCpu: 4,  maxRam: 16, name: "m6i.xlarge" },
      { maxCpu: 8,  maxRam: 32, name: "m6i.2xlarge" },
      { maxCpu: 16, maxRam: 64, name: "m6i.4xlarge" },
      { maxCpu: 32, maxRam: 128, name: "m6i.8xlarge" },
    ],
    azure: [
      { maxCpu: 1,  maxRam: 1,  name: "B1s" },
      { maxCpu: 2,  maxRam: 4,  name: "B2s" },
      { maxCpu: 4,  maxRam: 16, name: "D4s v5" },
      { maxCpu: 8,  maxRam: 32, name: "D8s v5" },
      { maxCpu: 16, maxRam: 64, name: "D16s v5" },
      { maxCpu: 32, maxRam: 128, name: "D32s v5" },
    ],
    gcp:   [
      { maxCpu: 1,  maxRam: 1,  name: "e2-micro" },
      { maxCpu: 2,  maxRam: 4,  name: "e2-medium" },
      { maxCpu: 4,  maxRam: 16, name: "n2-standard-4" },
      { maxCpu: 8,  maxRam: 32, name: "n2-standard-8" },
      { maxCpu: 16, maxRam: 64, name: "n2-standard-16" },
      { maxCpu: 32, maxRam: 128, name: "n2-standard-32" },
    ],
  };
  const list = instances[provider] || instances.aws;
  const match = list.find((i) => cpu <= i.maxCpu && ram <= i.maxRam);
  return match ? match.name : `${provider.toUpperCase()} Custom (${cpu}vCPU/${ram}GB)`;
};

// ─── Main calculation function ────────────────────────────────
const calculateCosts = ({ cpu, ram, storage, hours, region = "us-east" }) => {
  const regionMultipliers = REGION_MULTIPLIERS[region] || REGION_MULTIPLIERS["us-east"];
  const hoursPerMonth = 730; // avg hours/month
  const usageRatio = Math.min(hours / hoursPerMonth, 1); // hours as fraction of month

  const results = {};

  for (const [key, pricing] of Object.entries(BASE_PRICING)) {
    const mult = regionMultipliers[key] || 1;

    // Compute costs
    const cpuCostMonthly  = cpu     * pricing.cpu.perCorePerHour     * hours * mult;
    const ramCostMonthly  = ram     * pricing.ram.perGBPerHour        * hours * mult;
    const storageCostMo   = storage * pricing.storage.perGBPerMonth   * mult;

    // Reserved/committed-use savings
    const cpuReserved     = cpu     * pricing.cpu.discountedPerCorePerHour * hours * mult;
    const ramReserved     = ram     * pricing.ram.discountedPerGBPerHour   * hours * mult;
    const reservedSavings = (cpuCostMonthly + ramCostMonthly) - (cpuReserved + ramReserved);

    // Support estimate
    const baseTotal       = cpuCostMonthly + ramCostMonthly + storageCostMo;
    const supportCost     = Math.max(
      pricing.support.developerMin,
      baseTotal * pricing.support.businessPercent
    );

    const totalMonthly    = cpuCostMonthly + ramCostMonthly + storageCostMo;
    const totalYearly     = totalMonthly * 12;
    const reservedYearly  = (cpuReserved + ramReserved + storageCostMo) * 12;

    results[key] = {
      provider:       key,
      name:           pricing.name,
      shortName:      pricing.shortName,
      color:          pricing.color,
      instanceType:   getInstanceType(cpu, ram, key),
      region:         regionMultipliers.label,

      breakdown: {
        compute:  parseFloat(cpuCostMonthly.toFixed(4)),
        memory:   parseFloat(ramCostMonthly.toFixed(4)),
        storage:  parseFloat(storageCostMo.toFixed(4)),
        support:  parseFloat(supportCost.toFixed(4)),
      },

      totals: {
        monthly:        parseFloat(totalMonthly.toFixed(2)),
        yearly:         parseFloat(totalYearly.toFixed(2)),
        reservedMonthly: parseFloat(((totalYearly - reservedSavings * 12) / 12).toFixed(2)),
        reservedYearly:  parseFloat(reservedYearly.toFixed(2)),
        reservedSavings: parseFloat((reservedSavings * 12).toFixed(2)),
      },

      features: pricing.features,
    };
  }

  // ─── Determine cheapest & rankings ───────────────────────────
  const sorted = Object.values(results).sort(
    (a, b) => a.totals.monthly - b.totals.monthly
  );
  sorted.forEach((r, i) => {
    results[r.provider].rank = i + 1;
    results[r.provider].isCheapest = i === 0;
    if (i > 0) {
      const diff = r.totals.monthly - sorted[0].totals.monthly;
      results[r.provider].premiumVsCheapest = parseFloat(diff.toFixed(2));
      results[r.provider].premiumPercent = parseFloat(
        ((diff / sorted[0].totals.monthly) * 100).toFixed(1)
      );
    }
  });

  // ─── Optimization tips ────────────────────────────────────────
  const tips = generateOptimizationTips({ cpu, ram, storage, hours, results });

  // ─── Multi-cloud recommendation ───────────────────────────────
  const multiCloudRec = generateMultiCloudRecommendation({ cpu, ram, storage, results });

  return {
    inputs: { cpu, ram, storage, hours, region },
    providers: results,
    cheapest: sorted[0].provider,
    ranking: sorted.map((r) => r.provider),
    tips,
    multiCloud: multiCloudRec,
    calculatedAt: new Date().toISOString(),
  };
};

// ─── Optimization tip generator ───────────────────────────────
const generateOptimizationTips = ({ cpu, ram, storage, hours, results }) => {
  const tips = [];
  const cheapestMonthly = Math.min(...Object.values(results).map((r) => r.totals.monthly));

  // Reserved instances tip
  const reservedSavings = results.aws.totals.reservedSavings;
  if (reservedSavings > 50) {
    tips.push({
      type: "savings",
      icon: "💰",
      title: "Use Reserved / Committed Use Instances",
      description: `Switch to 1-year reserved/committed-use instances to save up to $${reservedSavings.toFixed(0)}/year on AWS alone.`,
      impact: "high",
    });
  }

  // Under-utilization tip
  if (hours < 360) {
    tips.push({
      type: "usage",
      icon: "⏱",
      title: "Consider On-Demand or Spot Instances",
      description: `You're using only ${hours}h/month. Spot/preemptible instances can save 60–90% for interruptible workloads.`,
      impact: "high",
    });
  }

  // Storage tip
  if (storage > 500) {
    tips.push({
      type: "storage",
      icon: "🗄️",
      title: "Optimize Storage Tier",
      description: `${storage}GB of premium SSD is expensive. Move infrequently accessed data to object storage (S3/Blob/GCS) at ~$0.02/GB/month.`,
      impact: "medium",
    });
  }

  // RAM ratio tip
  const ramPerCpu = ram / cpu;
  if (ramPerCpu > 8) {
    tips.push({
      type: "sizing",
      icon: "📐",
      title: "Memory-Optimized Instance",
      description: `Your RAM/CPU ratio (${ramPerCpu.toFixed(1)}x) suggests a memory-optimized instance type (r6i/Esv5/n2-highmem) may be cheaper.`,
      impact: "medium",
    });
  } else if (ramPerCpu < 2) {
    tips.push({
      type: "sizing",
      icon: "📐",
      title: "Compute-Optimized Instance",
      description: `Low RAM/CPU ratio — consider compute-optimized instances (c6i/Fsv2/c2) for better price-performance.`,
      impact: "low",
    });
  }

  // Auto-scaling tip
  if (hours === 730) {
    tips.push({
      type: "architecture",
      icon: "⚡",
      title: "Enable Auto-Scaling",
      description: "Running 24/7 at full capacity? Auto-scaling groups can reduce compute costs by 20–40% during off-peak hours.",
      impact: "medium",
    });
  }

  // GCP sustained use tip
  if (hours >= 600) {
    tips.push({
      type: "cloud",
      icon: "☁️",
      title: "GCP Sustained Use Discounts",
      description: "GCP automatically applies up to 30% discount for instances running 25%+ of the month — no commitment needed.",
      impact: "medium",
    });
  }

  return tips;
};

// ─── Multi-cloud recommendation ───────────────────────────────
const generateMultiCloudRecommendation = ({ cpu, ram, storage, results }) => {
  const providers = Object.values(results);
  const spread = providers[providers.length - 1].totals.monthly - providers[0].totals.monthly;

  if (spread < 10) {
    return {
      recommended: false,
      reason: "Pricing is very similar across providers — single cloud is simpler.",
    };
  }

  return {
    recommended: true,
    strategy: "Split by workload type",
    suggestions: [
      `Compute-heavy tasks → ${results.gcp ? "GCP" : "AWS"} (best sustained discounts)`,
      "ML/AI workloads → GCP Vertex AI or AWS SageMaker",
      "Microsoft stack → Azure (native integration, Hybrid Benefit)",
      `Cheapest overall baseline → ${providers[0].shortName}`,
    ],
    estimatedSavings: parseFloat((spread * 0.3).toFixed(2)),
  };
};

module.exports = { calculateCosts, BASE_PRICING, REGION_MULTIPLIERS };
