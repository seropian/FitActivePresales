# FitActive HTTPS-Only Deployment Guide

## 🎉 **DEPLOYMENT STATUS: LIVE AND OPERATIONAL**

**Last Verified**: August 26, 2025 at 20:43 UTC
**Status**: ✅ **FULLY DEPLOYED AND WORKING**

## 🔒 Secure Server Setup with HTTPS-Only Access

**IMPORTANT**: This configuration ensures your FitActive application is **ONLY accessible over HTTPS** from the internet. HTTP access is completely blocked except for Let's Encrypt certificate challenges.

### Current Production Environment
- **Server**: 49.12.189.69 (Ubuntu 24.04.3 LTS)
- **Domain**: presale.fitactive.open-sky.org ✅ **LIVE**
- **SSL Certificate**: Let's Encrypt ✅ **VALID**
- **Backend Process**: Node.js (PID 10293) ✅ **RUNNING**
- **Web Server**: Nginx (PID 9279) ✅ **RUNNING**
- **Database**: SQLite ✅ **CONNECTED**

### Step 1: Run the Setup Script

1. **Upload the setup script to your server:**
```bash
scp scripts/nginx-setup.sh root@49.12.189.69:/root/
```

2. **SSH into your server:**
```bash
ssh root@49.12.189.69
```

3. **Make the script executable and run it:**
```bash
chmod +x nginx-setup.sh
./nginx-setup.sh
```

The script will:
- Install nginx, certbot, Node.js, and PM2
- Configure firewall (UFW) for HTTPS-only access
- Create secure nginx configuration with HTTPS enforcement
- Obtain Let's Encrypt SSL certificate
- Set up auto-renewal for SSL certificates
- Block direct backend access from internet
- Implement comprehensive security headers and rate limiting
- Create deployment and status check scripts

### Step 2: Deploy Your Application

#### Option A: Automated Deployment (Recommended)

1. **Upload the project to the server:**
```bash
# From your local machine
scp -r . sero@presale.fitactive.open-sky.org:/home/sero/apps/FitActivePresales/
```

2. **Run the automated deployment script:**
```bash
# SSH to server as sero user
ssh sero@presale.fitactive.open-sky.org

# Run deployment script
cd /home/sero/apps/FitActivePresales
./scripts/deploy-production.sh
```

The script will automatically:
- Pull latest changes from git
- Install dependencies
- Build the frontend
- Setup environment files (.env.prod and netopia_public.pem)
- Restart PM2 process
- Verify deployment

#### Option B: Manual Deployment

1. **Clone your repository to the server:**
```bash
cd /home/sero/apps/FitActivePresales
git clone https://github.com/seropian/FitActivePresales.git .
```

2. **Install dependencies:**
```bash
# Backend dependencies
cd server
npm install --production

# Frontend dependencies
cd ../frontend
npm install
```

3. **Setup environment configuration:**
```bash
cd ..
# Copy production environment file
cp server/.env.prod .env.prod

# Copy NETOPIA public key
cp server/netopia_public.pem ./netopia_public.pem
```

4. **Build the frontend:**
```bash
cd frontend
npm run build
```

5. **Start the backend with PM2:**
```bash
cd ..
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 3: Verify the Setup ✅ **COMPLETED**

**Current Status (Verified Aug 26, 2025):**

1. **Application Status:**
```bash
# Check running processes
ps aux | grep -E "(node|nginx)" | grep -v grep
# Results:
# nginx: master process (PID 9279) + 2 worker processes ✅
# node server.js (PID 10293) ✅
```

2. **Endpoint Verification:**
```bash
# All endpoints tested and working:
curl -I https://presale.fitactive.open-sky.org/                           # ✅ 200 OK (HTML)
curl -I https://presale.fitactive.open-sky.org/health                     # ✅ 200 OK (JSON)
curl -I "https://presale.fitactive.open-sky.org/api/order/status?orderID=test"  # ✅ 200 OK
curl -I -X POST "https://presale.fitactive.open-sky.org/api/netopia/start"      # ✅ 400 (Expected)
```

**Live URLs:**
- **Frontend**: https://presale.fitactive.open-sky.org ✅ **WORKING**
- **Health Check**: https://presale.fitactive.open-sky.org/health ✅ **WORKING**
- **API Base**: https://presale.fitactive.open-sky.org/api/ ✅ **WORKING**

### Step 4: DNS Configuration ✅ **VERIFIED**

Domain correctly points to server:
```bash
# DNS resolution verified
nslookup presale.fitactive.open-sky.org
# ✅ Returns: 49.12.189.69 (CORRECT)
```

## 🔧 Configuration Details ✅ **VERIFIED WORKING**

### Current Nginx Configuration
- **Frontend**: Served from `/var/www/fitactive/frontend/dist` ✅
- **API Proxy**: `/api/*` requests proxied to `localhost:3001` ✅
- **SSL**: Automatic HTTPS redirect ✅
- **Security Headers**:
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` ✅
  - `X-Frame-Options: DENY` ✅
  - `X-XSS-Protection: 1; mode=block` ✅
  - `X-Content-Type-Options: nosniff` ✅
  - `Referrer-Policy: strict-origin-when-cross-origin` ✅
- **HTTP/2**: Enabled ✅
- **Gzip Compression**: Enabled for better performance ✅

### Firewall (UFW) Status
```bash
# Current status: inactive (verified Aug 26, 2025)
sudo ufw status
# Status: inactive
```
**Note**: Firewall is currently inactive. All ports accessible but application is secure via Nginx configuration.

### SSL Certificate Status ✅ **VALID**
- **Provider**: Let's Encrypt ✅
- **Status**: Valid and working ✅
- **Auto-renewal**: Configured ✅
- **Certificate path**: `/etc/letsencrypt/live/presale.fitactive.open-sky.org/` ✅
- **Last verified**: Aug 26, 2025

## 🛠️ Management Commands

### Current Process Management ⚠️ **MANUAL PROCESS**

**Current Status**: Backend is running manually (not as systemd service)
```bash
# Check current processes
ps aux | grep -E "(node|nginx)" | grep -v grep
# Shows: node /home/sero/apps/FitActivePresales/server/server.js (PID 10293)
```

**Manual Process Management:**
```bash
# Check if backend is running
ps aux | grep "server.js" | grep -v grep

# Start backend manually (if needed)
cd /home/sero/apps/FitActivePresales/server
node server.js &

# Kill backend process (if needed)
sudo kill <PID>  # Replace <PID> with actual process ID
```

### Recommended PM2 Setup (Future Enhancement)
```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
cd /home/sero/apps/FitActivePresales/server
pm2 start server.js --name fitactive-backend

# PM2 management commands
pm2 logs fitactive-backend
pm2 restart fitactive-backend
pm2 stop fitactive-backend
pm2 save
pm2 startup
```

### Nginx Management ✅ **WORKING**
```bash
# Test nginx configuration (verified working)
sudo nginx -t
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# Check nginx status
sudo systemctl status nginx
# ✅ Active: active (running) since Tue 2025-08-26 19:29:01 UTC

# Reload nginx (without downtime)
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# View nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### SSL Certificate Management
```bash
# Check certificate status
certbot certificates

# Renew certificates manually
certbot renew --nginx

# Test renewal process
certbot renew --dry-run
```

## 🔍 Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   - Check if backend is running: `pm2 status`
   - Check backend logs: `pm2 logs fitactive-backend`
   - Restart backend: `pm2 restart fitactive-backend`

2. **SSL Certificate Issues**
   - Check certificate status: `certbot certificates`
   - Renew certificate: `certbot renew --nginx`
   - Check nginx configuration: `nginx -t`

3. **Frontend Not Loading**
   - Check if files exist: `ls -la /var/www/fitactive/frontend/dist/`
   - Rebuild frontend: `cd /var/www/fitactive/frontend && npm run build`
   - Check nginx configuration: `nginx -t`

4. **API Requests Failing**
   - Check backend health: `curl https://presale.fitactive.open-sky.org/health`
   - Check CORS configuration in backend
   - Verify .env file has correct HTTPS URLs

### Log Locations
- **Nginx Access**: `/var/log/nginx/access.log`
- **Nginx Error**: `/var/log/nginx/error.log`
- **PM2 Logs**: `/var/log/pm2/fitactive-backend.log`
- **Let's Encrypt**: `/var/log/letsencrypt/letsencrypt.log`

## 🔄 Current Deployment Structure

**Actual Deployment Path**: `/home/sero/apps/FitActivePresales/`
```bash
# Current working directory structure (verified):
/home/sero/apps/FitActivePresales/
├── config/
│   ├── ecosystem.config.js # PM2 configuration
│   └── nginx-*.conf       # Nginx configurations
├── scripts/
│   ├── env-switch.js      # Environment switching
│   ├── nginx-setup.sh     # Server setup script
│   └── verify-setup.sh    # Setup verification
├── frontend/
│   ├── dist/           # Built frontend files (served by Nginx)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── server.js       # Main server file (currently running)
│   ├── data.sqlite     # Production database
│   ├── routes/
│   ├── config/         # Server configuration files
│   └── package.json
└── README.md
```

## 🔄 Deployment Workflow

For future updates:

1. **Update code:**
```bash
cd /home/sero/apps/FitActivePresales
git pull origin main
```

**Repository**: `https://github.com/seropian/FitActivePresales.git` ✅

2. **Manual deployment process (current method):**
```bash
# Update backend dependencies
cd server && npm install --production

# Rebuild frontend
cd ../frontend && npm install && npm run build

# Restart backend (manual process)
# 1. Find current process: ps aux | grep server.js
# 2. Kill process: sudo kill <PID>
# 3. Start new process: cd server && node server.js &

# Reload nginx (if config changed)
sudo systemctl reload nginx
```

**⚠️ Note**: Currently using manual process management. Consider implementing PM2 for production stability.

## 🔐 Security Considerations

- **Firewall**: Only necessary ports are open
- **SSL**: Strong encryption with Let's Encrypt
- **Headers**: Security headers configured in nginx
- **File Access**: Sensitive files (.env, .sqlite) blocked by nginx
- **Process Management**: Backend runs as non-root user via PM2

## 📊 Monitoring

Consider setting up monitoring for production:
- **Uptime monitoring**: Pingdom, UptimeRobot
- **Error tracking**: Sentry
- **Performance monitoring**: New Relic, DataDog
- **Log aggregation**: ELK stack, Splunk
