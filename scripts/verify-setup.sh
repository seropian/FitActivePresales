#!/bin/bash

# FitActive Setup Verification Script
# Run this script to verify your HTTPS setup is working correctly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DOMAIN="presale.fitactive.open-sky.org"
SERVER_IP="49.12.189.69"

echo -e "${BLUE}🔍 FitActive Setup Verification${NC}"
echo -e "${BLUE}===============================${NC}"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to test HTTP endpoint
test_endpoint() {
    local url=$1
    local description=$2
    
    echo -n "Testing $description... "
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

# Function to test SSL certificate
test_ssl() {
    local domain=$1
    
    echo -n "Testing SSL certificate for $domain... "
    
    if echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Valid${NC}"
        
        # Show certificate expiry
        expiry=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
        echo -e "   Certificate expires: ${YELLOW}$expiry${NC}"
        return 0
    else
        echo -e "${RED}❌ Invalid or not found${NC}"
        return 1
    fi
}

# Check DNS resolution
echo -e "${YELLOW}🌐 Checking DNS resolution...${NC}"
if command_exists dig; then
    resolved_ip=$(dig +short "$DOMAIN" | tail -n1)
    if [ "$resolved_ip" = "$SERVER_IP" ]; then
        echo -e "DNS resolution: ${GREEN}✅ $DOMAIN → $SERVER_IP${NC}"
    else
        echo -e "DNS resolution: ${RED}❌ $DOMAIN → $resolved_ip (expected: $SERVER_IP)${NC}"
        echo -e "${YELLOW}⚠️  Please update your DNS records to point to $SERVER_IP${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  dig command not found, skipping DNS check${NC}"
fi

echo ""

# Test SSL certificate
echo -e "${YELLOW}🔒 Checking SSL certificate...${NC}"
if command_exists openssl; then
    test_ssl "$DOMAIN"
else
    echo -e "${YELLOW}⚠️  openssl command not found, skipping SSL check${NC}"
fi

echo ""

# Test HTTPS-only access
echo -e "${YELLOW}🔒 Testing HTTPS-only access...${NC}"

# Test HTTP to HTTPS redirect
echo -n "HTTP to HTTPS redirect... "
redirect_code=$(curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN")
if [[ "$redirect_code" == "301" ]]; then
    echo -e "${GREEN}✅ Properly redirects (301)${NC}"
elif [[ "$redirect_code" == "302" ]]; then
    echo -e "${YELLOW}⚠️  Redirects (302 - should be 301)${NC}"
else
    echo -e "${RED}❌ No redirect (HTTP $redirect_code)${NC}"
fi

# Test that HTTP requests are blocked (except Let's Encrypt)
echo -n "HTTP access blocked... "
http_response=$(curl -s -w "%{http_code}" "http://$DOMAIN/api/test" -o /dev/null)
if [[ "$http_response" == "301" ]]; then
    echo -e "${GREEN}✅ HTTP properly redirected${NC}"
else
    echo -e "${RED}❌ HTTP not properly handled (got $http_response)${NC}"
fi

# Test HTTPS endpoints
echo -e "${YELLOW}🌐 Testing HTTPS endpoints...${NC}"

# Test main frontend
test_endpoint "https://$DOMAIN" "Frontend (HTTPS)"

# Test health endpoint
test_endpoint "https://$DOMAIN/health" "Backend Health Check"

# Test API endpoint (this might return 404 or 405, which is OK)
echo -n "Testing API endpoint... "
status_code=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/api/")
if [[ "$status_code" =~ ^(200|404|405|500)$ ]]; then
    echo -e "${GREEN}✅ Reachable (HTTP $status_code)${NC}"
else
    echo -e "${RED}❌ Not reachable (HTTP $status_code)${NC}"
fi

# Test security headers
echo -e "${YELLOW}🛡️  Testing security headers...${NC}"
echo -n "HSTS header... "
if curl -s -I "https://$DOMAIN" | grep -i "strict-transport-security" >/dev/null; then
    echo -e "${GREEN}✅ Present${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
fi

echo -n "X-Frame-Options header... "
if curl -s -I "https://$DOMAIN" | grep -i "x-frame-options" >/dev/null; then
    echo -e "${GREEN}✅ Present${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
fi

echo -n "Content-Security-Policy header... "
if curl -s -I "https://$DOMAIN" | grep -i "content-security-policy" >/dev/null; then
    echo -e "${GREEN}✅ Present${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
fi

# Test that backend is not directly accessible from internet
echo -e "${YELLOW}🔒 Testing backend isolation...${NC}"
echo -n "Direct backend access blocked... "
if timeout 5 bash -c "</dev/tcp/$SERVER_IP/3001" 2>/dev/null; then
    echo -e "${RED}❌ Backend directly accessible from internet${NC}"
    echo -e "${YELLOW}   ⚠️  This is a security risk - backend should only be accessible via nginx${NC}"
else
    echo -e "${GREEN}✅ Backend properly isolated${NC}"
fi

echo ""

# Check if running on server
if [ -f "/etc/nginx/sites-available/$DOMAIN" ]; then
    echo -e "${YELLOW}🔧 Server-side checks...${NC}"
    
    # Check nginx status
    echo -n "Nginx status... "
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✅ Running${NC}"
    else
        echo -e "${RED}❌ Not running${NC}"
    fi
    
    # Check nginx configuration
    echo -n "Nginx configuration... "
    if nginx -t >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Valid${NC}"
    else
        echo -e "${RED}❌ Invalid${NC}"
    fi
    
    # Check PM2 status
    if command_exists pm2; then
        echo -n "PM2 backend status... "
        if pm2 describe fitactive-backend >/dev/null 2>&1; then
            status=$(pm2 describe fitactive-backend | grep -o "status.*online\|status.*stopped" | head -1)
            if echo "$status" | grep -q "online"; then
                echo -e "${GREEN}✅ Running${NC}"
            else
                echo -e "${RED}❌ Stopped${NC}"
            fi
        else
            echo -e "${RED}❌ Not found${NC}"
        fi
    fi
    
    # Check firewall status
    if command_exists ufw; then
        echo -n "Firewall status... "
        if ufw status | grep -q "Status: active"; then
            echo -e "${GREEN}✅ Active${NC}"
        else
            echo -e "${YELLOW}⚠️  Inactive${NC}"
        fi
    fi
    
    # Check SSL certificate files
    echo -n "SSL certificate files... "
    if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
        echo -e "${GREEN}✅ Found${NC}"
    else
        echo -e "${RED}❌ Not found${NC}"
    fi
fi

echo ""

# Performance test
echo -e "${YELLOW}⚡ Performance test...${NC}"
if command_exists curl; then
    echo -n "Frontend load time... "
    load_time=$(curl -o /dev/null -s -w "%{time_total}" "https://$DOMAIN")
    if (( $(echo "$load_time < 3.0" | bc -l) )); then
        echo -e "${GREEN}✅ ${load_time}s${NC}"
    else
        echo -e "${YELLOW}⚠️  ${load_time}s (slow)${NC}"
    fi
fi

echo ""

# Summary
echo -e "${BLUE}📋 Summary${NC}"
echo -e "${BLUE}=========${NC}"
echo -e "• Domain: ${GREEN}$DOMAIN${NC}"
echo -e "• Server IP: ${GREEN}$SERVER_IP${NC}"
echo -e "• Frontend URL: ${GREEN}https://$DOMAIN${NC}"
echo -e "• Backend Health: ${GREEN}https://$DOMAIN/health${NC}"
echo -e "• API Base: ${GREEN}https://$DOMAIN/api/${NC}"

echo ""
echo -e "${YELLOW}💡 Next steps if issues found:${NC}"
echo -e "1. Check DNS: Ensure $DOMAIN points to $SERVER_IP"
echo -e "2. Check SSL: Run 'certbot certificates' on server"
echo -e "3. Check services: Run 'fitactive-status' on server"
echo -e "4. Check logs: 'pm2 logs fitactive-backend' and 'tail -f /var/log/nginx/error.log'"

echo ""
echo -e "${GREEN}✅ Verification complete!${NC}"
