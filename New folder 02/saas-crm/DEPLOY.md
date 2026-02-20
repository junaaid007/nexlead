# NexLead CRM Deployment Guide

**Created by Junaid Mansoor**

This guide covers deploying NexLead CRM to various platforms.

## Table of Contents
- [Option 1: Render.com (Recommended - Free Tier)](#option-1-rendercom-recommended)
- [Option 2: Railway.app](#option-2-railwayapp)
- [Option 3: Netlify + Heroku](#option-3-netlify--heroku)
- [Option 4: VPS/Dedicated Server](#option-4-vpsdedicated-server)

---

## Option 1: Render.com (Recommended)

Render offers a generous free tier with PostgreSQL, Node.js, and static site hosting.

### Step 1: Create Render Account
1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub/GitLab repository

### Step 2: Deploy with render.yaml (Blueprint)
1. Push the `render.yaml` file to your repository root
2. In Render Dashboard, click "Blueprints"
3. Click "New Blueprint Instance"
4. Select your repository
5. Render will automatically detect and deploy:
   - PostgreSQL database
   - Backend API service
   - Frontend static site

### Step 3: Manual Deploy (Alternative)

#### Database
1. Go to "PostgreSQL" in Render Dashboard
2. Click "New PostgreSQL"
3. Name: `novaflow-crm-db`
4. Plan: Free
5. Create and note the connection details

#### Backend API
1. Go to "Web Services"
2. Click "New Web Service"
3. Select your repository
4. Configure:
   - Name: `novaflow-crm-api`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free
5. Add Environment Variables:
   ```
   NODE_ENV=production
   DB_HOST=(from database)
   DB_PORT=5432
   DB_NAME=(from database)
   DB_USER=(from database)
   DB_PASSWORD=(from database)
   FRONTEND_URL=(your frontend URL)
   ```

#### Frontend
1. Go to "Static Sites"
2. Click "New Static Site"
3. Select your repository
4. Configure:
   - Name: `novaflow-crm-web`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://novaflow-crm-api.onrender.com/api
   ```

---

## Option 2: Railway.app

Railway offers simple deployment with automatic environment variable handling.

### Step 1: Setup
1. Go to [railway.app](https://railway.app) and sign up
2. Install Railway CLI (optional):
   ```bash
   npm install -g @railway/cli
   railway login
   ```

### Step 2: Deploy Backend
1. Create new project: `railway init`
2. Add PostgreSQL: `railway add --database postgres`
3. Deploy:
   ```bash
   cd backend
   railway up
   ```
4. Set environment variables in Railway Dashboard

### Step 3: Deploy Frontend
1. Build locally:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Deploy `dist` folder to Railway static hosting or Netlify

---

## Option 3: Netlify + Heroku

### Backend on Heroku

1. Create Heroku account and install CLI
2. Create app:
   ```bash
   heroku create novaflow-crm-api
   ```
3. Add PostgreSQL:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```
4. Deploy:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```
5. Run database migrations:
   ```bash
   heroku psql -f ../database/schema.sql
   ```

### Frontend on Netlify

1. Build locally:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Drag and drop `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Or connect Git repository for auto-deploys

---

## Option 4: VPS/Dedicated Server

### Prerequisites
- Ubuntu 20.04+ server
- Node.js 18+
- PostgreSQL 14+
- Nginx
- Domain name (optional)

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 globally
sudo npm install -g pm2
```

### Step 2: Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE novaflow_crm;
CREATE USER novaflow_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE novaflow_crm TO novaflow_user;
\q

# Run schema
sudo -u postgres psql -d novaflow_crm -f /path/to/database/schema.sql
```

### Step 3: Deploy Backend

```bash
# Create app directory
mkdir -p /var/www/novaflow-crm
cd /var/www/novaflow-crm

# Copy backend files
cp -r /path/to/backend .
cd backend

# Install dependencies
npm install --production

# Create .env file
cat > .env << EOF
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=novaflow_crm
DB_USER=novaflow_user
DB_PASSWORD=your_secure_password
FRONTEND_URL=https://your-domain.com
EOF

# Start with PM2
pm2 start src/server.js --name novaflow-api
pm2 save
pm2 startup
```

### Step 4: Deploy Frontend

```bash
# On local machine
cd frontend
npm install
npm run build

# Copy dist to server
scp -r dist user@your-server:/var/www/novaflow-crm/
```

### Step 5: Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/novaflow-crm
```

Add configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/novaflow-crm/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/novaflow-crm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Environment Variables Reference

### Backend
```env
NODE_ENV=production
PORT=5000
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=saas_crm
DB_USER=your-db-user
DB_PASSWORD=your-db-password
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend
```env
VITE_API_URL=https://your-api-url.com/api
```

---

## Post-Deployment

### 1. Verify Deployment
- Check API health: `GET https://your-api.com/api/health`
- Check frontend loads correctly
- Test lead creation

### 2. Database Migration (if needed)
```bash
# Connect to database and run schema
psql -h your-host -U your-user -d saas_crm -f database/schema.sql
```

### 3. Monitoring
- Render: Built-in monitoring in dashboard
- Railway: Built-in metrics
- VPS: Set up PM2 monitoring with `pm2 monit`

---

## Troubleshooting

### CORS Errors
Ensure `FRONTEND_URL` environment variable matches your actual frontend URL.

### Database Connection Issues
- Verify database credentials
- Check if database allows external connections
- For Render/Railway: Use internal connection strings when possible

### Build Failures
- Ensure Node.js version is 18+
- Check that all dependencies are in package.json
- Verify environment variables are set

---

## Support

For deployment issues, refer to:
- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app
- Netlify Docs: https://docs.netlify.com

**Created by Junaid Mansoor**
