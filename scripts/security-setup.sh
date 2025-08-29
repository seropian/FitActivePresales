#!/bin/bash

# FitActive Security Setup Script
# This script configures firewall rules and security settings

set -e

echo "🔒 FitActive Security Configuration"
echo "=================================="

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "❌ This script should not be run as root for security reasons"
   exit 1
fi

# Function to check if ufw is installed
check_ufw() {
    if ! command -v ufw &> /dev/null; then
        echo "⚠️  UFW (Uncomplicated Firewall) is not installed"
        echo "   Please install it with: sudo apt install ufw"
        return 1
    fi
    return 0
}

# Function to configure firewall
configure_firewall() {
    echo "🔥 Configuring firewall rules..."
    
    # Reset UFW to defaults
    sudo ufw --force reset
    
    # Set default policies
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    
    # Allow SSH (be careful not to lock yourself out!)
    sudo ufw allow ssh
    sudo ufw allow 22/tcp
    
    # Allow HTTP and HTTPS
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    
    # Explicitly deny backend ports from external access
    sudo ufw deny 3001/tcp
    sudo ufw deny 3002/tcp
    sudo ufw deny 3003/tcp
    
    # Allow localhost access to backend ports (this is implicit but explicit is better)
    sudo ufw allow from 127.0.0.1 to any port 3001
    sudo ufw allow from 127.0.0.1 to any port 3002
    sudo ufw allow from 127.0.0.1 to any port 3003
    
    # Enable UFW
    sudo ufw --force enable
    
    echo "✅ Firewall configured successfully"
    sudo ufw status verbose
}

# Function to configure server security
configure_server_security() {
    echo "🛡️  Configuring server security settings..."
    
    # Update server configuration to bind only to localhost
    echo "📝 Ensuring backend only listens on localhost..."
    
    # Check if server is configured to listen only on localhost
    if grep -q "app.listen(PORT)" server/server.ts; then
        echo "⚠️  Server configuration should specify localhost binding"
        echo "   Consider updating server.ts to: app.listen(PORT, 'localhost', ...)"
    fi
    
    echo "✅ Server security settings reviewed"
}

# Function to test security configuration
test_security() {
    echo "🧪 Testing security configuration..."
    
    # Test that backend ports are not accessible externally
    echo "🔍 Checking backend port accessibility..."
    
    # Get server IP
    SERVER_IP=$(curl -s ifconfig.me || echo "unknown")
    echo "📍 Server IP: $SERVER_IP"
    
    # Test ports (this will fail if properly secured, which is what we want)
    for port in 3001 3002 3003; do
        echo "Testing port $port..."
        if timeout 5 bash -c "</dev/tcp/$SERVER_IP/$port" 2>/dev/null; then
            echo "❌ WARNING: Port $port is accessible from external IP!"
        else
            echo "✅ Port $port is properly secured"
        fi
    done
}

# Function to show security status
show_security_status() {
    echo ""
    echo "🔐 Security Status Summary"
    echo "========================="
    
    echo "🔥 Firewall Status:"
    sudo ufw status verbose
    
    echo ""
    echo "🌐 Nginx Configuration:"
    if nginx -t 2>/dev/null; then
        echo "✅ Nginx configuration is valid"
    else
        echo "❌ Nginx configuration has errors"
    fi
    
    echo ""
    echo "🔒 SSL Certificate Status:"
    if sudo certbot certificates 2>/dev/null | grep -q "presale.fitactive.open-sky.org"; then
        echo "✅ SSL certificate is configured"
    else
        echo "⚠️  SSL certificate status unknown"
    fi
    
    echo ""
    echo "📋 Security Recommendations:"
    echo "1. Regularly update system packages: sudo apt update && sudo apt upgrade"
    echo "2. Monitor logs: sudo tail -f /var/log/nginx/error.log"
    echo "3. Review firewall rules: sudo ufw status verbose"
    echo "4. Check SSL certificate expiry: sudo certbot certificates"
    echo "5. Monitor PM2 processes: pm2 status"
}

# Main execution
main() {
    case "${1:-all}" in
        "firewall")
            if check_ufw; then
                configure_firewall
            fi
            ;;
        "server")
            configure_server_security
            ;;
        "test")
            test_security
            ;;
        "status")
            show_security_status
            ;;
        "all")
            if check_ufw; then
                configure_firewall
            fi
            configure_server_security
            test_security
            show_security_status
            ;;
        *)
            echo "Usage: $0 [firewall|server|test|status|all]"
            echo ""
            echo "Commands:"
            echo "  firewall - Configure UFW firewall rules"
            echo "  server   - Configure server security settings"
            echo "  test     - Test security configuration"
            echo "  status   - Show security status"
            echo "  all      - Run all security configurations (default)"
            exit 1
            ;;
    esac
}

main "$@"
