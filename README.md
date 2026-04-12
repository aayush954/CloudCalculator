# ☁️ CloudCalc — Multi-Cloud Cost Calculator

A production-ready full-stack web application that compares cloud costs across **AWS**, **Azure**, and **Google Cloud** in real time.

![Tech Stack](https://img.shields.io/badge/Frontend-React%2018-blue) ![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green) ![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-brightgreen) ![Charts](https://img.shields.io/badge/Charts-Recharts-orange)

---

## ✨ Features

- **Real-time cost comparison** across AWS, Azure, and GCP
- **Pricing breakdown** — compute, memory, storage, support
- **Reserved / committed-use savings** calculations
- **Interactive bar charts** (monthly, yearly, breakdown)
- **Optimization tips** with impact levels
- **Multi-cloud strategy** recommendations
- **8 global regions** with regional pricing multipliers
- **Quick presets** — Starter, Web App, API Server, Data Node, Dev/Test
- **Dark/light mode** toggle
- **Loading skeletons** and smooth animations
- **MongoDB** calculation history (30-day TTL)
- **Fully responsive** mobile-first design

---

## 🗂 Project Structure

```
multi-cloud-calculator/
├── backend/
│   ├── controllers/
│   │   ├── calculationController.js
│   │   └── historyController.js
│   ├── models/
│   │   └── Calculation.js
│   ├── routes/
│   │   ├── calculations.js
│   │   ├── providers.js
│   │   └── history.js
│   ├── utils/
│   │   ├── db.js
│   │   └── pricingEngine.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── charts/
    │   │   │   └── CostBarChart.jsx
    │   │   ├── forms/
    │   │   │   └── CalculatorForm.jsx
    │   │   ├── layout/
    │   │   │   ├── Footer.jsx
    │   │   │   ├── Hero.jsx
    │   │   │   └── Navbar.jsx
    │   │   └── ui/
    │   │       ├── index.jsx          (Button, Badge, Card, InputField, etc.)
    │   │       ├── ErrorAlert.jsx
    │   │       ├── LoadingSkeleton.jsx
    │   │       ├── OptimizationTips.jsx
    │   │       ├── ProviderCard.jsx
    │   │       └── ResultsSummary.jsx
    │   ├── context/
    │   │   └── ThemeContext.js
    │   ├── hooks/
    │   │   └── useCalculator.js
    │   ├── pages/
    │   │   └── Dashboard.jsx
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── format.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── index.js
    ├── .env.example
    ├── package.json
    └── tailwind.config.js
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account (free tier works)

---

### 1. Clone & Install

```bash
git clone <your-repo>
cd multi-cloud-calculator

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/cloudcalculator?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

> ⚠️ If you skip MongoDB, the app still works — history features will be disabled gracefully.

**Frontend** (`frontend/.env`):
```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:
```env
# Leave empty during development (CRA proxy handles it)
REACT_APP_API_URL=
REACT_APP_NAME=CloudCalc
```

---

### 3. Start the Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server runs at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

---

## 📡 API Endpoints

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-backend.onrender.com/api`

---

### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "production"
}
```

---

### `POST /calculate`
Calculate and compare cloud costs.

**Request Body:**
```json
{
  "cpu": 4,
  "ram": 16,
  "storage": 100,
  "hours": 730,
  "region": "us-east",
  "sessionId": "optional-uuid-for-history"
}
```

| Field | Type | Required | Range | Description |
|-------|------|----------|-------|-------------|
| cpu | integer | ✅ | 1–256 | Virtual CPU cores |
| ram | integer | ✅ | 1–2048 | RAM in GB |
| storage | integer | ✅ | 1–65536 | SSD storage in GB |
| hours | integer | ✅ | 1–744 | Usage hours per month |
| region | string | ❌ | see below | Cloud region |
| sessionId | string | ❌ | max 64 chars | For history tracking |

**Regions:** `us-east` · `us-west` · `eu-west` · `eu-central` · `ap-southeast` · `ap-northeast` · `ap-south` · `sa-east`

**Response:**
```json
{
  "success": true,
  "data": {
    "inputs": { "cpu": 4, "ram": 16, "storage": 100, "hours": 730, "region": "us-east" },
    "providers": {
      "aws": {
        "provider": "aws",
        "name": "Amazon Web Services",
        "shortName": "AWS",
        "color": "#FF9900",
        "instanceType": "m6i.xlarge",
        "region": "US East",
        "breakdown": { "compute": 135.62, "memory": 33.90, "storage": 8.00, "support": 29.00 },
        "totals": {
          "monthly": 206.52,
          "yearly": 2478.24,
          "reservedMonthly": 148.00,
          "reservedYearly": 1776.00,
          "reservedSavings": 702.24
        },
        "features": ["Largest service catalog", "..."],
        "rank": 2,
        "isCheapest": false,
        "premiumVsCheapest": 12.30,
        "premiumPercent": 6.3
      },
      "azure": { ... },
      "gcp": { ... }
    },
    "cheapest": "gcp",
    "ranking": ["gcp", "azure", "aws"],
    "tips": [
      {
        "type": "savings",
        "icon": "💰",
        "title": "Use Reserved / Committed Use Instances",
        "description": "...",
        "impact": "high"
      }
    ],
    "multiCloud": {
      "recommended": true,
      "strategy": "Split by workload type",
      "suggestions": ["..."],
      "estimatedSavings": 24.50
    },
    "calculatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### `GET /providers`
List all supported providers and regions.

**Response:**
```json
{
  "success": true,
  "data": {
    "providers": [
      { "id": "aws", "name": "Amazon Web Services", "shortName": "AWS", "color": "#FF9900", "features": [...] }
    ],
    "regions": [
      { "id": "us-east", "label": "US East" }
    ]
  }
}
```

---

### `GET /history/:sessionId`
Get calculation history for a session (requires MongoDB).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "inputs": { "cpu": 4, "ram": 16, "storage": 100, "hours": 730 },
      "cheapest": "gcp",
      "ranking": ["gcp", "azure", "aws"],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### `DELETE /history/:sessionId`
Clear all calculations for a session.

---

## 🚢 Deployment

### Backend → Render (Free Tier)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** `Node`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=<your-atlas-uri>
   CORS_ORIGIN=https://your-app.vercel.app
   PORT=5000
   ```
6. Click **Deploy** — Render will give you a URL like `https://cloudcalc-api.onrender.com`

---

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://cloudcalc-api.onrender.com
   ```
5. Click **Deploy**

---

### MongoDB Atlas Setup

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free **M0** cluster
3. Add a database user with read/write access
4. Whitelist IP: `0.0.0.0/0` (all IPs, for cloud deployments)
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cloudcalculator
   ```

---

## 🔧 Customizing Pricing

To update pricing models, edit `backend/utils/pricingEngine.js`:

```javascript
// Update per-unit prices
const BASE_PRICING = {
  aws: {
    cpu: {
      perCorePerHour: 0.0464,       // Update this
      discountedPerCorePerHour: 0.0278,
    },
    // ...
  }
};

// Update regional multipliers
const REGION_MULTIPLIERS = {
  'us-east': { aws: 1.00, azure: 1.00, gcp: 1.00, label: 'US East' },
  // ...
};
```

---

## 🔌 Real API Integration (Future)

To replace mock pricing with real APIs:

| Provider | API | Docs |
|----------|-----|------|
| AWS | AWS Price List API | https://aws.amazon.com/blogs/aws/new-aws-price-list-api/ |
| Azure | Azure Retail Prices API | https://learn.microsoft.com/en-us/rest/api/cost-management/retail-prices |
| GCP | Cloud Billing Catalog API | https://cloud.google.com/billing/docs/reference/rest |

Replace the `calculateCosts` function in `pricingEngine.js` with API calls, keeping the same return structure.

---

## 📝 License

MIT — use freely for personal or commercial projects.
