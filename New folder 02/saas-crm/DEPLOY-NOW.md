# NexLead CRM - Quick Deployment Guide

**Created by Junaid Mansoor**

## Recommended Free Deployment Stack

| Component | Platform | URL | Cost |
|-----------|----------|-----|------|
| Frontend | Netlify | `nexlead.netlify.app` | Free |
| Backend | Render | `nexlead-api.onrender.com` | Free |
| Database | Render PostgreSQL | Internal | Free |

---

## Step 1: Push Code to GitHub

```bash
# Initialize git (if not done)
cd saas-crm
git init
git add .
git commit -m "Initial NexLead CRM deployment"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/nexlead-crm.git
git push -u origin main
```

---

## Step 2: Deploy Backend to Render (Free)

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### 2.2 Create PostgreSQL Database
1. Dashboard → **New** → **PostgreSQL**
2. Name: `nexlead-crm-db`
3. Plan: **Free**
4. Click **Create Database**
5. **Copy the "Internal Database URL"** (you'll need it)

### 2.3 Deploy Backend API
1. Dashboard → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `nexlead-crm-api`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
4. Click **Advanced** and add Environment Variables:
   ```
   NODE_ENV=production
   DB_HOST=(from database - hostname only)
   DB_PORT=5432
   DB_NAME=(from database)
   DB_USER=(from database)
   DB_PASSWORD=(from database)
   FRONTEND_URL=https://nexlead.netlify.app
   ```
5. Click **Create Web Service**

Wait for deployment (2-3 minutes). Your API will be at:
`https://nexlead-crm-api.onrender.com`

### 2.4 Initialize Database
Once deployed, run the schema:
```bash
# Connect to Render PostgreSQL and run:
psql [DATABASE_URL] -f database/schema.sql
```

Or use Render's SQL shell in the dashboard.

---

## Step 3: Deploy Frontend to Netlify (Free)

### Option A: Netlify Drop (Easiest - No Git Required)

1. **Build locally first**:
   ```bash
   cd frontend
   # Create production .env file
   echo "VITE_API_URL=https://nexlead-crm-api.onrender.com/api" > .env.production
   npm install
   npm run build
   ```

2. Go to [netlify.com/drop](https://app.netlify.com/drop)

3. Drag and drop the `frontend/dist` folder

4. Your site is live instantly at `random-name.netlify.app`

5. **Change site name**:
   - Site settings → Change site name
   - Set to: `nexlead`
   - Final URL: `nexlead.netlify.app`

### Option B: Git-based Deployment (Auto-deploys)

1. Go to [netlify.com](https://netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Connect GitHub → Select your repo
4. Configure build:
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`
5. Click **Show advanced** → **New variable**:
   ```
   VITE_API_URL=https://nexlead-crm-api.onrender.com/api
   ```
6. Click **Deploy site**

---

## Step 4: Update CORS (Important!)

After Netlify deployment, update Render environment variable:

1. Go to Render Dashboard → `nexlead-crm-api` → **Environment**
2. Update `FRONTEND_URL` to your actual Netlify URL:
   ```
   FRONTEND_URL=https://nexlead.netlify.app
   ```
3. Click **Save Changes** (auto-redeploys)

---

## Step 5: Get Free Custom Domain (Freenom)

Get a free `.tk`, `.ml`, `.ga`, `.cf`, or `.gq` domain:

1. Go to [freenom.com](https://freenom.com)
2. Search for domain (e.g., `nexlead.tk`)
3. Select **Get it now** → **Checkout** (0.00 USD)
4. Complete registration

### Connect Domain to Netlify:
1. Netlify Dashboard → Your site → **Domain settings**
2. Click **Add custom domain**
3. Enter: `nexlead.tk`
4. Follow DNS instructions:
   - Go to Freenom → My Domains → Manage Domain → Management Tools → Nameservers
   - Use Netlify's nameservers or add CNAME record pointing to your Netlify URL

---

## Verification Checklist

- [ ] Backend API responding: `https://nexlead-crm-api.onrender.com/api/health`
- [ ] Frontend loads: `https://nexlead.netlify.app`
- [ ] Can create a test lead
- [ ] Dashboard shows MRR metrics
- [ ] Pipeline displays leads

---

## Troubleshooting

### CORS Errors
```
Access to fetch blocked by CORS policy
```
**Fix**: Update `FRONTEND_URL` in Render to match your actual Netlify URL exactly.

### Database Connection Failed
**Fix**: Check all DB_* environment variables in Render. Use Internal Database URL for same-region connections.

### Build Fails on Netlify
**Fix**: Check that `VITE_API_URL` is set in environment variables.

### API Returns 404
**Fix**: Ensure backend is deployed and healthy. Check Render logs.

---

## Your Live URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend | https://nexlead.netlify.app | ⏳ Deploy |
| API | https://nexlead-crm-api.onrender.com | ⏳ Deploy |
| Custom Domain | https://nexlead.tk (optional) | ⏳ Setup |

**Created by Junaid Mansoor**
