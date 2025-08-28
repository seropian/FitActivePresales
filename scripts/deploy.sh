#!/bin/bash

# ===========================================
# FitActive Deployment Script
# ===========================================
# Single deployment script for all environments and operations
# Supports: dev, test, prod environments with full lifecycle management

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
APP_DIR="${APP_DIR:-$PROJECT_ROOT}"

# Environment configurations
get_env_port() {
    case $1 in
        "dev") echo "3001" ;;
        "test") echo "3002" ;;
        "prod") echo "3003" ;;
    esac
}

get_env_db() {
    case $1 in
        "dev") echo "data.sqlite" ;;
        "test") echo "data-test.sqlite" ;;
        "prod") echo "data-prod.sqlite" ;;
    esac
}

get_env_name() {
    case $1 in
        "dev") echo "development" ;;
        "test") echo "test" ;;
        "prod") echo "production" ;;
    esac
}

# Utility functions
print_header() {
    echo -e "${CYAN}================================${NC}"
    echo -e "${CYAN}🚀 $1${NC}"
    echo -e "${CYAN}================================${NC}"
}

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Show usage information
show_usage() {
    echo -e "${CYAN}FitActive Deployment Script${NC}"
    echo ""
    echo "Usage: $0 [ENVIRONMENT] [ACTION] [OPTIONS]"
    echo ""
    echo -e "${YELLOW}ENVIRONMENTS:${NC}"
    echo "  dev      - Development environment (port 3001)"
    echo "  test     - Test environment (port 3002)"
    echo "  prod     - Production environment (port 3003)"
    echo ""
    echo -e "${YELLOW}ACTIONS:${NC}"
    echo "  start    - Start the application"
    echo "  stop     - Stop the application"
    echo "  restart  - Restart the application"
    echo "  status   - Show application status"
    echo "  logs     - Show application logs"
    echo "  build    - Build frontend and start backend"
    echo "  deploy   - Full deployment (git pull, build, restart)"
    echo "  setup    - Initial environment setup"
    echo "  cleanup  - Clean build artifacts and logs"
    echo ""
    echo -e "${YELLOW}OPTIONS:${NC}"
    echo "  --no-build    - Skip frontend build step"
    echo "  --no-git      - Skip git pull step"
    echo "  --force       - Force restart even if already running"
    echo "  --logs=N      - Show N lines of logs (default: 50)"
    echo ""
    echo -e "${YELLOW}EXAMPLES:${NC}"
    echo "  $0 dev start              # Start development environment"
    echo "  $0 prod deploy            # Full production deployment"
    echo "  $0 test restart --force   # Force restart test environment"
    echo "  $0 dev logs --logs=100    # Show 100 lines of dev logs"
    echo ""
    echo -e "${YELLOW}QUICK COMMANDS:${NC}"
    echo "  $0 status                 # Show status of all environments"
    echo "  $0 cleanup                # Clean all environments"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check PM2
    if ! command -v pm2 &> /dev/null; then
        print_warning "PM2 is not installed. Installing PM2..."
        npm install -g pm2
    fi
    
    print_status "Prerequisites check completed"
}

# Get environment configuration
get_env_config() {
    local env=$1
    local key=$2
    case $key in
        "port") get_env_port $env ;;
        "db") get_env_db $env ;;
        "env") get_env_name $env ;;
    esac
}

# Build frontend
build_frontend() {
    local env=$1
    print_info "Building frontend for $env environment..."
    
    cd "$PROJECT_ROOT/frontend"
    
    if [ ! -d "node_modules" ]; then
        print_info "Installing frontend dependencies..."
        npm install
    fi
    
    npm run build
    print_status "Frontend build completed"
    
    cd "$PROJECT_ROOT"
}

# Install dependencies
install_dependencies() {
    local env=$1
    print_info "Installing dependencies for $env environment..."
    
    # Server dependencies
    cd "$PROJECT_ROOT/server"
    if [ "$env" = "prod" ]; then
        npm install --production
    else
        npm install
    fi
    
    cd "$PROJECT_ROOT"
    print_status "Dependencies installed"
}

# Setup environment files
setup_environment() {
    local env=$1
    print_info "Setting up environment configuration for $env..."
    
    local env_file="server/.env"
    if [ "$env" != "dev" ]; then
        env_file="server/.env.$env"
    fi
    
    if [ ! -f "$env_file" ]; then
        print_warning "Environment file $env_file not found"
        print_info "Creating template environment file..."
        
        cat > "$env_file" << EOF
# FitActive $env Environment Configuration
NODE_ENV=$(get_env_config $env env)
PORT=$(get_env_config $env port)
DATABASE_PATH=$(get_env_config $env db)

# Add your specific configuration here
EOF
        print_status "Template environment file created: $env_file"
        print_warning "Please configure the environment file before deployment"
    else
        print_status "Environment file exists: $env_file"
    fi
}

# Git operations
git_pull() {
    if [ "$SKIP_GIT" = "true" ]; then
        print_info "Skipping git pull (--no-git flag)"
        return
    fi
    
    print_info "Pulling latest changes from repository..."
    
    if [ -d ".git" ]; then
        git pull origin main || {
            print_warning "Git pull failed, continuing with existing code"
        }
        print_status "Git pull completed"
    else
        print_warning "Not a git repository, skipping git pull"
    fi
}

# PM2 operations
pm2_operation() {
    local env=$1
    local action=$2
    local app_name="fitactive-${env}"
    
    case $action in
        "start")
            print_info "Starting $app_name..."
            if pm2 list | grep -q "$app_name" && [ "$FORCE_RESTART" != "true" ]; then
                print_warning "$app_name is already running. Use --force to restart."
                return
            fi
            pm2 start config/ecosystem.config.cjs --only $app_name --env $(get_env_config $env env)
            print_status "$app_name started successfully"
            ;;
        "stop")
            print_info "Stopping $app_name..."
            pm2 stop $app_name 2>/dev/null || print_warning "$app_name was not running"
            print_status "$app_name stopped"
            ;;
        "restart")
            print_info "Restarting $app_name..."
            pm2 restart $app_name --env $(get_env_config $env env) 2>/dev/null || {
                print_info "$app_name not found, starting new instance..."
                pm2 start config/ecosystem.config.cjs --only $app_name --env $(get_env_config $env env)
            }
            print_status "$app_name restarted successfully"
            ;;
        "status")
            print_info "Status for $app_name:"
            pm2 status $app_name 2>/dev/null || print_warning "$app_name not found in PM2"
            ;;
        "logs")
            local log_lines=${LOG_LINES:-50}
            print_info "Showing $log_lines lines of logs for $app_name:"
            pm2 logs $app_name --lines $log_lines 2>/dev/null || print_warning "$app_name not found in PM2"
            ;;
    esac
}

# Full deployment process
full_deploy() {
    local env=$1
    
    print_header "Full Deployment - $env Environment"
    
    git_pull
    setup_environment $env
    install_dependencies $env
    
    if [ "$SKIP_BUILD" != "true" ]; then
        build_frontend $env
    fi
    
    pm2_operation $env restart
    
    print_status "Full deployment completed for $env environment"
    
    # Show status
    sleep 2
    pm2_operation $env status
}

# Cleanup operations
cleanup_environment() {
    local env=$1
    print_info "Cleaning up $env environment..."
    
    # Clean frontend build
    if [ -d "frontend/dist" ]; then
        rm -rf frontend/dist
        print_status "Cleaned frontend build artifacts"
    fi
    
    # Clean logs
    local app_name="fitactive-${env}"
    pm2 flush $app_name 2>/dev/null || true
    print_status "Cleaned PM2 logs for $app_name"
}

# Show status of all environments
show_all_status() {
    print_header "All Environments Status"
    
    for env in dev test prod; do
        echo -e "\n${YELLOW}=== $env Environment ===${NC}"
        pm2_operation $env status
    done
}

# Parse command line arguments
parse_arguments() {
    SKIP_BUILD=false
    SKIP_GIT=false
    FORCE_RESTART=false
    LOG_LINES=50

    while [[ $# -gt 0 ]]; do
        case $1 in
            --no-build)
                SKIP_BUILD=true
                shift
                ;;
            --no-git)
                SKIP_GIT=true
                shift
                ;;
            --force)
                FORCE_RESTART=true
                shift
                ;;
            --logs=*)
                LOG_LINES="${1#*=}"
                shift
                ;;
            *)
                break
                ;;
        esac
    done
}

# Main execution function
main() {
    # Parse arguments first
    parse_arguments "$@"

    # Get remaining arguments after parsing flags
    local remaining_args=()
    while [[ $# -gt 0 ]]; do
        case $1 in
            --*)
                # Skip flags (already parsed)
                shift
                ;;
            *)
                remaining_args+=("$1")
                shift
                ;;
        esac
    done

    # Handle special commands that don't require environment
    if [ ${#remaining_args[@]} -eq 1 ]; then
        case "${remaining_args[0]}" in
            "status")
                show_all_status
                exit 0
                ;;
            "cleanup")
                for env in dev test prod; do
                    cleanup_environment $env
                done
                print_status "Cleanup completed for all environments"
                exit 0
                ;;
        esac
    fi

    # Validate arguments
    if [ ${#remaining_args[@]} -lt 2 ]; then
        print_error "Missing arguments"
        show_usage
        exit 1
    fi

    local environment="${remaining_args[0]}"
    local action="${remaining_args[1]}"

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

    # Check prerequisites
    check_prerequisites

    # Navigate to project root
    cd "$PROJECT_ROOT"

    # Execute action
    case $action in
        "start"|"stop"|"restart"|"status"|"logs")
            pm2_operation $environment $action
            ;;
        "build")
            build_frontend $environment
            pm2_operation $environment start
            ;;
        "deploy")
            full_deploy $environment
            ;;
        "setup")
            setup_environment $environment
            install_dependencies $environment
            print_status "Setup completed for $environment environment"
            ;;
        "cleanup")
            cleanup_environment $environment
            ;;
        *)
            print_error "Unknown action: $action"
            show_usage
            exit 1
            ;;
    esac

    print_status "Operation completed successfully"
}

# Script entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
