#!/bin/bash

# ===========================================
# FitActive Production Deployment Script
# ===========================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/home/sero/apps/FitActivePresales"
PM2_APP_NAME="fitactive-backend"

echo -e "${BLUE}🚀 Starting FitActive Production Deployment...${NC}"

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as sero user
if [ "$USER" != "sero" ]; then
    print_error "This script must be run as the 'sero' user"
    echo "Usage: su - sero -c './scripts/deploy-production.sh'"
    exit 1
fi

# Navigate to app directory
cd "$APP_DIR" || {
    print_error "Failed to navigate to $APP_DIR"
    exit 1
}

print_status "Working directory: $(pwd)"

# Step 1: Pull latest changes
echo -e "${BLUE}📥 Pulling latest changes from repository...${NC}"
git pull origin main || {
    print_warning "Git pull failed, continuing with existing code"
}

# Step 2: Install/update dependencies
echo -e "${BLUE}📦 Installing server dependencies...${NC}"
cd server
npm install --production || {
    print_error "Failed to install server dependencies"
    exit 1
}
cd ..

# Step 3: Build frontend
echo -e "${BLUE}🏗️  Building frontend...${NC}"
cd frontend
npm install || {
    print_error "Failed to install frontend dependencies"
    exit 1
}
npm run build || {
    print_error "Failed to build frontend"
    exit 1
}
cd ..

# Step 4: Setup environment files
echo -e "${BLUE}⚙️  Setting up environment configuration...${NC}"

# Copy production environment file if it doesn't exist
if [ ! -f ".env.prod" ]; then
    if [ -f "server/.env.prod" ]; then
        cp server/.env.prod .env.prod
        print_status "Copied .env.prod from server directory"
    else
        print_error ".env.prod not found in server directory"
        exit 1
    fi
else
    print_status ".env.prod already exists"
fi

# Step 5: Setup NETOPIA public key
echo -e "${BLUE}🔐 Setting up NETOPIA public key...${NC}"

if [ ! -f "netopia_public.pem" ]; then
    if [ -f "server/netopia_public.pem" ]; then
        cp server/netopia_public.pem ./netopia_public.pem
        print_status "Copied NETOPIA public key to project root"
    else
        print_warning "NETOPIA public key not found in server directory"
        print_warning "Make sure to add netopia_public.pem to the project root"
    fi
else
    print_status "NETOPIA public key already exists"
fi

# Step 6: Restart PM2 process
echo -e "${BLUE}🔄 Restarting PM2 process...${NC}"

# Check if PM2 process exists
if pm2 list | grep -q "$PM2_APP_NAME"; then
    pm2 restart "$PM2_APP_NAME" || {
        print_error "Failed to restart PM2 process"
        exit 1
    }
    print_status "PM2 process restarted successfully"
else
    print_warning "PM2 process '$PM2_APP_NAME' not found"
    echo -e "${BLUE}Starting new PM2 process...${NC}"
    
    # Start with ecosystem config if available
    if [ -f "config/ecosystem.config.js" ]; then
        pm2 start config/ecosystem.config.js || {
            print_error "Failed to start PM2 process with ecosystem config"
            exit 1
        }
    else
        # Fallback to direct start
        pm2 start server/server.js --name "$PM2_APP_NAME" --env production || {
            print_error "Failed to start PM2 process"
            exit 1
        }
    fi
    print_status "PM2 process started successfully"
fi

# Step 7: Verify deployment
echo -e "${BLUE}🔍 Verifying deployment...${NC}"

# Wait a moment for the process to start
sleep 3

# Check PM2 status
if pm2 list | grep -q "online.*$PM2_APP_NAME"; then
    print_status "PM2 process is online"
else
    print_error "PM2 process is not online"
    echo "PM2 Status:"
    pm2 list
    echo "Recent logs:"
    pm2 logs "$PM2_APP_NAME" --lines 10 --nostream
    exit 1
fi

# Check for recent errors
ERROR_COUNT=$(pm2 logs "$PM2_APP_NAME" --lines 20 --nostream 2>/dev/null | grep -i error | wc -l)
if [ "$ERROR_COUNT" -gt 0 ]; then
    print_warning "Found $ERROR_COUNT recent errors in logs"
    echo "Recent logs:"
    pm2 logs "$PM2_APP_NAME" --lines 10 --nostream
else
    print_status "No recent errors found in logs"
fi

# Final status
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}📊 Final Status:${NC}"
pm2 list | grep "$PM2_APP_NAME"

echo -e "${BLUE}🔗 Application should be available at:${NC}"
echo -e "   https://presale.fitactive.open-sky.org"

echo -e "${BLUE}📝 To monitor logs:${NC}"
echo -e "   pm2 logs $PM2_APP_NAME"

echo -e "${BLUE}📈 To monitor performance:${NC}"
echo -e "   pm2 monit"
