# FitActive Quick Reference Guide

## 🚀 Production Environment

**Domain**: https://presale.fitactive.open-sky.org  
**Server**: 49.12.189.69 (Ubuntu 24.04.3 LTS)  
**Status**: ✅ **LIVE AND OPERATIONAL**

## 🔍 Quick Health Checks

```bash
# Test all endpoints
curl -I https://presale.fitactive.open-sky.org/                    # Frontend
curl -I https://presale.fitactive.open-sky.org/health              # Health check
curl -I https://presale.fitactive.open-sky.org/api/order/status    # API endpoint

# Check PM2 processes
pm2 status

# Check running processes
ps aux | grep -E "(node|nginx)" | grep -v grep

# Check Nginx status
sudo systemctl status nginx

# Test Nginx configuration
sudo nginx -t

# Direct backend testing (bypass Nginx)
curl -v localhost:3001/health                                     # Direct backend health
curl -v "localhost:3001/api/order/status?orderID=test"           # Direct API test
```

## 🛠️ Common Tasks

### Backend Management (PM2)
```bash
# Check PM2 process status
pm2 status

# Start backend (if stopped)
cd /home/sero/apps/FitActivePresales
pm2 start ecosystem.config.js

# Stop backend
pm2 stop fitactive-backend

# Restart backend
pm2 restart fitactive-backend

# View backend logs
pm2 logs fitactive-backend

# Monitor backend in real-time
pm2 monit

# Save PM2 configuration
pm2 save

# Setup auto-start on system reboot
pm2 startup
```

### Frontend Updates
```bash
# Navigate to project
cd /home/sero/apps/FitActivePresales

# Pull latest changes
git pull origin main

# Rebuild frontend
cd frontend
npm install
npm run build

# Frontend files are automatically served by Nginx from dist/
```

### Nginx Management
```bash
# Test configuration
sudo nginx -t

# Reload configuration (no downtime)
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Management
```bash
# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew --nginx

# Test renewal (dry run)
sudo certbot renew --dry-run
```

## 🔧 File Locations

```bash
# Application files
/home/sero/apps/FitActivePresales/

# Frontend build output (served by Nginx)
/home/sero/apps/FitActivePresales/frontend/dist/

# Backend server
/home/sero/apps/FitActivePresales/server/server.js

# Database
/home/sero/apps/FitActivePresales/server/data.sqlite

# Nginx configuration
/etc/nginx/sites-available/presale.fitactive.open-sky.org
/etc/nginx/sites-enabled/presale.fitactive.open-sky.org

# SSL certificates
/etc/letsencrypt/live/presale.fitactive.open-sky.org/

# Logs
/var/log/nginx/access.log
/var/log/nginx/error.log
```

## 🚨 Troubleshooting

### Frontend Not Loading
1. Check if Nginx is running: `sudo systemctl status nginx`
2. Check if build files exist: `ls -la /home/sero/apps/FitActivePresales/frontend/dist/`
3. Rebuild frontend: `cd frontend && npm run build`
4. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

### API Not Responding
1. Check PM2 status: `pm2 status`
2. Check backend health: `curl https://presale.fitactive.open-sky.org/health`
3. Test direct backend: `curl localhost:3001/health`
4. Restart backend: `pm2 restart fitactive-backend`
5. Check PM2 logs: `pm2 logs fitactive-backend`
6. Check Nginx proxy configuration

### SSL Issues
1. Check certificate status: `sudo certbot certificates`
2. Renew if needed: `sudo certbot renew --nginx`
3. Check Nginx SSL configuration: `sudo nginx -t`
4. Restart Nginx: `sudo systemctl restart nginx`

### Database Issues
1. Check if database file exists: `ls -la /home/sero/apps/FitActivePresales/server/data.sqlite`
2. Check file permissions
3. Check backend logs for database connection errors

## 📊 Monitoring Commands

```bash
# System resources
htop
df -h                    # Disk usage
free -h                  # Memory usage

# Network connections
sudo netstat -tlnp | grep :80    # HTTP
sudo netstat -tlnp | grep :443   # HTTPS
sudo netstat -tlnp | grep :3001  # Backend

# Process monitoring
ps aux | grep -E "(node|nginx)"
```

## 🔄 Deployment Workflow

### For Code Updates
```bash
# 1. Navigate to project
cd /home/sero/apps/FitActivePresales

# 2. Pull latest changes
git pull origin main

# 3. Update backend (if needed)
cd server
npm install --production

# 4. Rebuild frontend
cd ../frontend
npm install
npm run build

# 5. Restart backend (PM2)
pm2 restart fitactive-backend

# 6. Reload Nginx (if config changed)
sudo systemctl reload nginx
```

### For Configuration Changes
```bash
# 1. Edit configuration files (templates in config/ directory)
# Update nginx config template:
nano config/nginx-production.conf
# Then copy to nginx sites-available:
sudo cp config/nginx-production.conf /etc/nginx/sites-available/presale.fitactive.open-sky.org

# 2. Test configuration
sudo nginx -t

# 3. Reload Nginx
sudo systemctl reload nginx
```

## 📞 Emergency Contacts

- **Repository**: https://github.com/seropian/FitActivePresales.git
- **Server Access**: SSH to sero@49.12.189.69
- **Domain**: presale.fitactive.open-sky.org

## 🔗 Useful Links

- **Production Site**: https://presale.fitactive.open-sky.org
- **Health Check**: https://presale.fitactive.open-sky.org/health
- **API Base**: https://presale.fitactive.open-sky.org/api/

---

**Last Updated**: August 26, 2025
**Status**: ✅ **FULLY OPERATIONAL** - PM2 Process Management Implemented
