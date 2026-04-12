# 📤 GitHub Setup & Deployment Guide

This guide walks you through pushing your code to GitHub and deploying to Render & Vercel.

---

## Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Set repository name: `multi-cloud-calculator` (or your choice)
3. **Do NOT** initialize with README, .gitignore, or license (already in our repo)
4. Click **Create repository**
5. Copy the repository URL (e.g., `https://github.com/your-username/multi-cloud-calculator.git`)

---

## Step 2: Add Remote & Push to GitHub

```bash
# Navigate to project root
cd multi-cloud-calculator

# Add remote (replace YOUR_REPO_URL with the one from Step 1)
git remote add origin YOUR_REPO_URL

# Verify remote is added
git remote -v

# Push initial commit to GitHub
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/your-username/multi-cloud-calculator.git
git branch -M main
git push -u origin main
```

Your code is now on GitHub! ✅

---

## Step 3: Deploy Backend to Render

### 3a. Connect GitHub to Render

1. Go to [render.com](https://render.com) and sign up / log in
2. Click **New +** → **Web Service**
3. Click **Connect repository** → authorize GitHub
4. Find and select `multi-cloud-calculator` repo

### 3b. Configure Backend Service

- **Name:** `cloudcalc-api` (or your choice)
- **Root Directory:** `backend`
- **Framework/Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Instance Type:** Free tier (optional, comes with limitations)

### 3c. Add Environment Variables

In Render dashboard, go to **Environment** and add:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cloudcalculator?retryWrites=true&w=majority
CORS_ORIGIN=https://your-frontend-url.vercel.app
RATE_LIMIT_MAX=100
```

For `MONGODB_URI`, use your MongoDB Atlas connection string (see MongoDB Atlas Setup below).

### 3d. Deploy

Click **Create Web Service** — Render will deploy automatically.

**Get your backend URL** from the Render dashboard (e.g., `https://cloudcalc-api.onrender.com`)

---

## Step 4: Deploy Frontend to Vercel

### 4a. Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up / log in
2. Click **New Project**
3. Click **Import Git Repository** → authorize GitHub
4. Find and select `multi-cloud-calculator` repo

### 4b. Configure Frontend

- **Framework Preset:** Create React App
- **Root Directory:** `frontend`
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `build` (auto-detected)

### 4c. Add Environment Variables

In Vercel dashboard, add:

```
REACT_APP_API_URL=https://cloudcalc-api.onrender.com
```

(Replace with your actual backend URL from Step 3)

### 4d. Deploy

Click **Deploy** — Vercel will build and deploy your frontend.

**Your app is live!** The deployment URL will be shown (e.g., `https://multi-cloud-calculator.vercel.app`)

---

## Step 5: Set up MongoDB Atlas (Database)

### 5a. Create Free Cluster

1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **Build a Database** → **M0 (Free tier)**
4. Choose a cloud provider and region
5. Click **Create**

### 5b. Create Database User

1. Go to **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Set username and password (save these!)
4. Set database access to **Read and write to any database**
5. Click **Add User**

### 5c. Get Connection String

1. Go to **Databases** → click **Connect** on your cluster
2. Choose **Drivers**
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `cloudcalculator`

Example:
```
mongodb+srv://my_username:my_password@cluster0.xxxxx.mongodb.net/cloudcalculator?retryWrites=true&w=majority
```

### 5d. Update Render Environment Variable

1. Go back to Render dashboard
2. In your backend service, click **Environment**
3. Update `MONGODB_URI` with your connection string
4. Click **Save**
5. Your service will auto-redeploy

---

## Step 6: Verify Everything Works

- **Frontend:** Open your Vercel URL → should load the calculator
- **API Health:** Go to `https://cloudcalc-api.onrender.com/api/health` → should return JSON
- **Calculations:** Use the calculator → should work without history (until MongoDB connects)
- **History:** Once MongoDB is set up, calculations should be saved

---

## 🔄 Making Updates

After this initial setup, making updates is simple:

```bash
# Make your changes locally
git add .
git commit -m "Your commit message"
git push origin main
```

Both Render and Vercel will automatically redeploy when you push to GitHub! 🚀

---

## 📋 Quick Checklist

- [ ] GitHub repo created & pushed
- [ ] Render backend deployed with env vars
- [ ] Vercel frontend deployed with `REACT_APP_API_URL` set
- [ ] MongoDB Atlas cluster created & connection string saved
- [ ] Backend `MONGODB_URI` updated in Render
- [ ] Frontend testing: calculator loads
- [ ] API health check passes
- [ ] (Optional) History feature works after MongoDB connects

---

## 🆘 Troubleshooting

### "Cannot reach backend" on frontend
- Check Render backend is deployed (green status)
- Verify `REACT_APP_API_URL` in Vercel matches your Render URL
- Check CORS_ORIGIN in Render backend env vars matches your Vercel URL

### "MONGODB_URI not set" in backend logs
- Render backend hasn't redeployed after env var update
- Click **Redeploy** on Render dashboard

### Build fails on Vercel
- Check for syntax errors in `frontend/src/`
- Verify all dependencies are in `frontend/package.json`

### Database connection times out
- MongoDB cluster not active (click cluster to check)
- IP address not whitelisted (add `0.0.0.0/0` in MongoDB Atlas → Network Access)

---

## 📚 Additional Resources

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [GitHub Help](https://docs.github.com)
