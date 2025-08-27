#!/bin/bash

# FitActive Nginx + HTTPS Setup Script
# Run this script on your server (49.12.189.69) as root or with sudo

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="presale.fitactive.open-sky.org"
EMAIL="admin@fitactive.ro"  # Change this to your email
APP_DIR="/home/sero/apps/FitActivePresales"
BACKEND_PORT="3003"
FRONTEND_PORT="80"

echo -e "${BLUE}🚀 FitActive Nginx + HTTPS Setup${NC}"
echo -e "${BLUE}=================================${NC}"
echo -e "Domain: ${GREEN}$DOMAIN${NC}"
echo -e "Email: ${GREEN}$EMAIL${NC}"
echo -e "App Directory: ${GREEN}$APP_DIR${NC}"
echo ""

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ This script must be run as root or with sudo${NC}"
   exit 1
fi

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
apt update && apt upgrade -y

# Install required packages
echo -e "${YELLOW}📦 Installing nginx, certbot, and dependencies...${NC}"
apt install -y nginx certbot python3-certbot-nginx ufw curl wget git nodejs npm

# Install PM2 for process management
echo -e "${YELLOW}📦 Installing PM2 for process management...${NC}"
npm install -g pm2

# Create application directory
echo -e "${YELLOW}📁 Creating application directory...${NC}"
mkdir -p $APP_DIR
chown -R www-data:www-data $APP_DIR

# Configure UFW Firewall (HTTPS-only from internet)
echo -e "${YELLOW}🔥 Configuring firewall for HTTPS-only access...${NC}"
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (essential for management)
ufw allow ssh

# Allow HTTPS from anywhere (port 443)
ufw allow 443/tcp

# Allow HTTP only for Let's Encrypt challenges (port 80)
# This will be redirected to HTTPS by nginx
ufw allow 80/tcp

# Allow backend port only from localhost (not from internet)
ufw allow from 127.0.0.1 to any port $BACKEND_PORT
ufw allow from ::1 to any port $BACKEND_PORT

# Deny direct access to backend from internet
ufw deny $BACKEND_PORT

ufw --force enable

echo -e "${GREEN}✅ Firewall configured for HTTPS-only internet access${NC}"
echo -e "   • SSH (22): Allowed from anywhere"
echo -e "   • HTTPS (443): Allowed from anywhere"
echo -e "   • HTTP (80): Allowed only for Let's Encrypt (redirects to HTTPS)"
echo -e "   • Backend (3001): Blocked from internet, localhost only"

# Create nginx configuration
echo -e "${YELLOW}⚙️  Creating nginx configuration...${NC}"
cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
# FitActive Presales - Nginx Configuration (HTTPS Only)

# HTTP server - ONLY for Let's Encrypt challenges and redirect to HTTPS
server {
    listen 80;
    server_name presale.fitactive.open-sky.org;

    # Allow Let's Encrypt challenges
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        allow all;
    }

    # Redirect all other HTTP traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server - Main application
server {
    listen 443 ssl http2;
    server_name presale.fitactive.open-sky.org;

    # SSL Configuration (will be updated by certbot)
    ssl_certificate /etc/letsencrypt/live/presale.fitactive.open-sky.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/presale.fitactive.open-sky.org/privkey.pem;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS (HTTP Strict Transport Security)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https: data: blob: 'unsafe-inline'; frame-ancestors 'self';" always;
    add_header X-Permitted-Cross-Domain-Policies "none" always;
    add_header X-Robots-Tag "noindex, nofollow" always;

    # Remove server signature
    server_tokens off;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Root directory for frontend static files
    root /home/sero/apps/FitActivePresales/frontend/dist;
    index index.html;

    # Handle frontend routes (SPA)
    location / {
        try_files $uri $uri/ /index.html;

        # Additional security for frontend
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Port 443;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;

        # Ensure backend knows this is HTTPS
        proxy_redirect http:// https://;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3001/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Port 443;
    }

    # Static assets caching with security
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options "nosniff" always;

        # Prevent hotlinking
        valid_referers none blocked server_names;
        if ($invalid_referer) {
            return 403;
        }
    }

    # Security: Block access to sensitive files
    location ~ /\. {
        deny all;
        return 404;
    }

    location ~ \.(env|log|sqlite|conf|ini)$ {
        deny all;
        return 404;
    }

    # Block common exploit attempts
    location ~* \.(php|asp|aspx|jsp)$ {
        deny all;
        return 404;
    }

    # Block access to backup files
    location ~* \.(bak|backup|old|orig|save|swp|tmp)$ {
        deny all;
        return 404;
    }
}
EOF

# Enable the site
echo -e "${YELLOW}🔗 Enabling nginx site...${NC}"
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo -e "${YELLOW}🧪 Testing nginx configuration...${NC}"
nginx -t

# Start and enable nginx
echo -e "${YELLOW}🚀 Starting nginx...${NC}"
systemctl enable nginx
systemctl restart nginx

# Wait for nginx to start
sleep 2

# Obtain SSL certificate
echo -e "${YELLOW}🔒 Obtaining SSL certificate from Let's Encrypt...${NC}"
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect

# Replace with more secure HTTPS-only configuration
echo -e "${YELLOW}🔒 Applying HTTPS-only security configuration...${NC}"
cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
# FitActive Presales - HTTPS-Only Nginx Configuration
# This configuration ensures the app is ONLY accessible over HTTPS from the internet

# HTTP server - ONLY for Let's Encrypt challenges and redirect to HTTPS
server {
    listen 80;
    server_name presale.fitactive.open-sky.org;

    # Security: Return 444 (no response) for requests without proper host header
    if ($host !~* ^(presale\.fitactive\.open-sky\.org)$ ) {
        return 444;
    }

    # Allow Let's Encrypt challenges
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        allow all;
    }

    # Block all other HTTP requests with immediate redirect
    location / {
        # Add security headers even for redirects
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server - Main application (HTTPS ONLY)
server {
    listen 443 ssl http2;
    server_name presale.fitactive.open-sky.org;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/presale.fitactive.open-sky.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/presale.fitactive.open-sky.org/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Modern SSL configuration for maximum security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security: Block requests without proper host header
    if ($host !~* ^(presale\.fitactive\.open-sky\.org)$ ) {
        return 444;
    }

    # HSTS (HTTP Strict Transport Security) - Force HTTPS for 1 year
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Comprehensive security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';" always;
    add_header X-Permitted-Cross-Domain-Policies "none" always;
    add_header X-Robots-Tag "noindex, nofollow" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=(), vibrate=(), fullscreen=(self)" always;

    # Remove server signature for security
    server_tokens off;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=general:10m rate=30r/s;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Root directory for frontend static files
    root /home/sero/apps/FitActivePresales/frontend/dist;
    index index.html;

    # Handle frontend routes (SPA) with rate limiting
    location / {
        limit_req zone=general burst=50 nodelay;
        try_files $uri $uri/ /index.html;

        # Additional security for frontend
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
    }

    # Proxy API requests to backend with rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;

        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Port 443;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;

        # Ensure backend knows this is HTTPS
        proxy_redirect http:// https://;

        # Security headers for API responses
        proxy_hide_header X-Powered-By;
    }

    # Health check endpoint (less restrictive rate limiting)
    location /health {
        limit_req zone=general burst=10 nodelay;

        proxy_pass http://localhost:3001/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Port 443;
    }

    # Static assets caching with security and hotlink protection
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options "nosniff" always;

        # Prevent hotlinking (allow only from your domain)
        valid_referers none blocked server_names *.fitactive.open-sky.org fitactive.open-sky.org;
        if ($invalid_referer) {
            return 403;
        }
    }

    # Security: Block access to sensitive files and directories
    location ~ /\. {
        deny all;
        return 404;
    }

    location ~ \.(env|log|sqlite|conf|ini|bak|backup|old|orig|save|swp|tmp)$ {
        deny all;
        return 404;
    }

    # Block common exploit attempts
    location ~* \.(php|asp|aspx|jsp|cgi|pl|py)$ {
        deny all;
        return 404;
    }

    # Block access to common admin/config paths
    location ~* /(admin|config|wp-admin|wp-login|phpmyadmin|mysql|database)/ {
        deny all;
        return 404;
    }

    # Block suspicious user agents
    if ($http_user_agent ~* (bot|crawler|spider|scraper|scanner)) {
        return 403;
    }

    # Block requests with suspicious query strings
    if ($query_string ~* (union|select|insert|delete|update|drop|create|alter|exec|script)) {
        return 403;
    }
}

# Catch-all server block to handle requests to wrong domains
server {
    listen 80 default_server;
    listen 443 ssl default_server;
    server_name _;

    # Dummy SSL certificate for default server
    ssl_certificate /etc/letsencrypt/live/presale.fitactive.open-sky.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/presale.fitactive.open-sky.org/privkey.pem;

    # Return 444 (no response) for all requests to wrong domains
    return 444;
}
EOF

# Create PM2 ecosystem file for the backend
echo -e "${YELLOW}⚙️  Creating PM2 configuration...${NC}"
cat > $APP_DIR/config/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'fitactive-backend',
    script: './server/server.js',
    cwd: '/home/sero/apps/FitActivePresales',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3003
    },
    error_file: '/var/log/pm2/fitactive-backend-error.log',
    out_file: '/var/log/pm2/fitactive-backend-out.log',
    log_file: '/var/log/pm2/fitactive-backend.log',
    time: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF

# Create log directory for PM2
mkdir -p /var/log/pm2
chown -R www-data:www-data /var/log/pm2

# Set up SSL certificate auto-renewal
echo -e "${YELLOW}🔄 Setting up SSL certificate auto-renewal...${NC}"
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --nginx") | crontab -

# Create deployment script
echo -e "${YELLOW}📝 Creating deployment helper script...${NC}"
cat > /usr/local/bin/deploy-fitactive << 'EOF'
#!/bin/bash

# FitActive Deployment Script
set -e

APP_DIR="/home/sero/apps/FitActivePresales"
REPO_URL="https://github.com/seropian/FitActivePresales.git"

echo "🚀 Deploying FitActive application..."

# Navigate to app directory
cd $APP_DIR

# Pull latest changes (if git repo exists)
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes..."
    git pull origin main
else
    echo "⚠️  No git repository found. Please clone your repository to $APP_DIR"
fi

# Install/update backend dependencies
echo "📦 Installing backend dependencies..."
cd server && npm install --production

# Build frontend
echo "🏗️  Building frontend..."
cd ../frontend && npm install && npm run build

# Restart backend with PM2
echo "🔄 Restarting backend..."
pm2 restart fitactive-backend || pm2 start ../config/ecosystem.config.js

# Reload nginx
echo "🔄 Reloading nginx..."
systemctl reload nginx

echo "✅ Deployment complete!"
EOF

chmod +x /usr/local/bin/deploy-fitactive

# Create status check script
cat > /usr/local/bin/fitactive-status << 'EOF'
#!/bin/bash

echo "🏥 FitActive Application Status"
echo "=============================="

echo "📊 Nginx Status:"
systemctl status nginx --no-pager -l

echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "📊 SSL Certificate Status:"
certbot certificates

echo ""
echo "🔥 Firewall Status:"
ufw status

echo ""
echo "🌐 Testing endpoints:"
echo "Frontend: curl -I https://presale.fitactive.open-sky.org"
curl -I https://presale.fitactive.open-sky.org 2>/dev/null | head -1 || echo "❌ Frontend not responding"

echo "Backend Health: curl -I https://presale.fitactive.open-sky.org/health"
curl -I https://presale.fitactive.open-sky.org/health 2>/dev/null | head -1 || echo "❌ Backend not responding"
EOF

chmod +x /usr/local/bin/fitactive-status

echo ""
echo -e "${GREEN}✅ Nginx and SSL setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "1. Clone your application to ${GREEN}$APP_DIR${NC}"
echo -e "2. Update your .env file with HTTPS URLs"
echo -e "3. Build and deploy your application"
echo -e "4. Start the backend with PM2"
echo ""
echo -e "${BLUE}🛠️  Useful Commands:${NC}"
echo -e "• Deploy app: ${GREEN}deploy-fitactive${NC}"
echo -e "• Check status: ${GREEN}fitactive-status${NC}"
echo -e "• View logs: ${GREEN}pm2 logs fitactive-backend${NC}"
echo -e "• Restart backend: ${GREEN}pm2 restart fitactive-backend${NC}"
echo ""
echo -e "${YELLOW}⚠️  Remember to:${NC}"
echo -e "• Update your DNS to point $DOMAIN to this server (49.12.189.69)"
echo -e "• Update your .env file with the new HTTPS URLs"
echo -e "• Test all functionality after deployment"
