#!/bin/bash

# ===========================================
# FitActive Presales Deployment Script
# ===========================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [ENVIRONMENT] [ACTION]"
    echo ""
    echo "ENVIRONMENTS:"
    echo "  dev      - Development environment (port 3001)"
    echo "  test     - Test environment (port 3002)"
    echo "  prod     - Production environment (port 3003)"
    echo ""
    echo "ACTIONS:"
    echo "  start    - Start the application"
    echo "  stop     - Stop the application"
    echo "  restart  - Restart the application"
    echo "  status   - Show application status"
    echo "  logs     - Show application logs"
    echo "  build    - Build frontend and start backend"
    echo ""
    echo "Examples:"
    echo "  $0 dev start     # Start development environment"
    echo "  $0 prod restart  # Restart production environment"
    echo "  $0 test logs     # Show test environment logs"
}

# Check if PM2 is installed
check_pm2() {
    if ! command -v pm2 &> /dev/null; then
        print_error "PM2 is not installed. Please install it first:"
        echo "npm install -g pm2"
        exit 1
    fi
}

# Build frontend
build_frontend() {
    local env=$1

    case $env in
        "dev")
            print_status "Building frontend for development..."
            cd frontend
            # For development, we build with development mode
            npm run build:dev
            cd ..
            print_success "Frontend built successfully for development"
            ;;
        "test")
            print_status "Building frontend for testing..."
            cd frontend
            # For testing, we build with test mode
            npm run build:test
            cd ..
            print_success "Frontend built successfully for testing"
            ;;
        "prod")
            print_status "Building frontend for production..."
            cd frontend
            # For production, we build with production mode
            npm run build:prod
            cd ..
            print_success "Frontend built successfully for production"
            ;;
        *)
            print_error "Unknown environment for build: $env"
            exit 1
            ;;
    esac
}

# Deploy function
deploy() {
    local env=$1
    local action=$2
    local app_name="fitactive-${env}"
    
    print_status "Deploying ${env} environment..."
    
    case $action in
        "start")
            print_status "Starting ${app_name}..."
            pm2 start config/ecosystem.config.js --only $app_name --env $env
            print_success "${app_name} started successfully"
            ;;
        "stop")
            print_status "Stopping ${app_name}..."
            pm2 stop $app_name
            print_success "${app_name} stopped successfully"
            ;;
        "restart")
            print_status "Restarting ${app_name}..."
            pm2 restart $app_name --env $env
            print_success "${app_name} restarted successfully"
            ;;
        "status")
            print_status "Status for ${app_name}:"
            pm2 status $app_name
            ;;
        "logs")
            print_status "Showing logs for ${app_name}:"
            pm2 logs $app_name --lines 50
            ;;
        "build")
            build_frontend $env
            print_status "Starting ${app_name} after build..."
            pm2 start config/ecosystem.config.js --only $app_name --env $env
            print_success "${app_name} started successfully after build"
            ;;
        *)
            print_error "Unknown action: $action"
            show_usage
            exit 1
            ;;
    esac
}

# Main script
main() {
    # Check arguments
    if [ $# -lt 2 ]; then
        print_error "Missing arguments"
        show_usage
        exit 1
    fi
    
    local environment=$1
    local action=$2
    
    # Validate environment
    case $environment in
        "dev"|"test"|"prod")
            ;;
        *)
            print_error "Invalid environment: $environment"
            show_usage
            exit 1
            ;;
    esac
    
    # Check PM2
    check_pm2
    
    # Execute deployment
    deploy $environment $action
    
    print_success "Deployment completed for ${environment} environment"
}

# Run main function with all arguments
main "$@"
