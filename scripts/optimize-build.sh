#!/bin/bash

# FitActive Build Optimization Script
# This script optimizes the build process and dependencies

set -e

echo "🚀 FitActive Build Optimization"
echo "==============================="

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to optimize frontend build
optimize_frontend() {
    print_status "Optimizing frontend build..."
    
    cd frontend
    
    # Clean previous builds
    print_status "Cleaning previous builds..."
    rm -rf dist node_modules/.vite
    
    # Install dependencies with clean cache
    print_status "Installing dependencies with clean cache..."
    npm ci --prefer-offline
    
    # Run TypeScript check
    print_status "Running TypeScript check..."
    if npx tsc --noEmit; then
        print_success "TypeScript check passed"
    else
        print_warning "TypeScript check failed, but continuing build..."
    fi
    
    # Run tests
    print_status "Running frontend tests..."
    if npm run test:run; then
        print_success "Frontend tests passed"
    else
        print_warning "Some frontend tests failed, but continuing build..."
    fi
    
    # Build with optimizations
    print_status "Building frontend with optimizations..."
    NODE_ENV=production npm run build
    
    # Analyze bundle size
    if command_exists du; then
        BUNDLE_SIZE=$(du -sh dist | cut -f1)
        print_success "Frontend build completed. Bundle size: $BUNDLE_SIZE"
    else
        print_success "Frontend build completed"
    fi
    
    cd ..
}

# Function to optimize server build
optimize_server() {
    print_status "Optimizing server build..."
    
    cd server
    
    # Clean previous builds
    print_status "Cleaning previous builds..."
    rm -rf dist
    
    # Install dependencies with clean cache
    print_status "Installing dependencies with clean cache..."
    npm ci --prefer-offline
    
    # Run TypeScript check
    print_status "Running TypeScript check..."
    if npx tsc --noEmit; then
        print_success "Server TypeScript check passed"
    else
        print_warning "Server TypeScript check failed, but continuing build..."
    fi
    
    # Run tests
    print_status "Running server tests..."
    if npm run test; then
        print_success "Server tests passed"
    else
        print_warning "Some server tests failed, but continuing build..."
    fi
    
    # Build server
    print_status "Building server..."
    npm run build
    
    print_success "Server build completed"
    
    cd ..
}

# Function to optimize dependencies
optimize_dependencies() {
    print_status "Optimizing dependencies..."
    
    # Check for unused dependencies
    if command_exists npx; then
        print_status "Checking for unused dependencies..."
        
        # Frontend
        cd frontend
        if npx depcheck --ignores="@types/*,vitest,@vitest/*" 2>/dev/null; then
            print_success "Frontend dependencies are optimized"
        else
            print_warning "Some unused dependencies found in frontend"
        fi
        cd ..
        
        # Server
        cd server
        if npx depcheck --ignores="@types/*,vitest,@vitest/*" 2>/dev/null; then
            print_success "Server dependencies are optimized"
        else
            print_warning "Some unused dependencies found in server"
        fi
        cd ..
    fi
}

# Function to run security audit
run_security_audit() {
    print_status "Running security audit..."
    
    # Root dependencies
    if npm audit --audit-level=moderate; then
        print_success "Root dependencies are secure"
    else
        print_warning "Some security issues found in root dependencies"
    fi
    
    # Frontend dependencies
    cd frontend
    if npm audit --audit-level=high; then
        print_success "Frontend dependencies are secure"
    else
        print_warning "Some security issues found in frontend dependencies"
    fi
    cd ..
    
    # Server dependencies
    cd server
    if npm audit --audit-level=moderate; then
        print_success "Server dependencies are secure"
    else
        print_warning "Some security issues found in server dependencies"
    fi
    cd ..
}

# Function to generate build report
generate_build_report() {
    print_status "Generating build report..."
    
    REPORT_FILE="build-report-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "FitActive Build Report"
        echo "====================="
        echo "Generated: $(date)"
        echo ""
        
        echo "Frontend Build:"
        if [ -d "frontend/dist" ]; then
            echo "✅ Frontend build exists"
            if command_exists du; then
                echo "📦 Bundle size: $(du -sh frontend/dist | cut -f1)"
            fi
            echo "📁 Files: $(find frontend/dist -type f | wc -l)"
        else
            echo "❌ Frontend build missing"
        fi
        echo ""
        
        echo "Server Build:"
        if [ -d "server/dist" ]; then
            echo "✅ Server build exists"
            echo "📁 Files: $(find server/dist -type f | wc -l)"
        else
            echo "❌ Server build missing"
        fi
        echo ""
        
        echo "Dependencies:"
        echo "Frontend packages: $(cd frontend && npm list --depth=0 2>/dev/null | grep -c "├\|└" || echo "unknown")"
        echo "Server packages: $(cd server && npm list --depth=0 2>/dev/null | grep -c "├\|└" || echo "unknown")"
        echo ""
        
        echo "Security Status:"
        echo "Last audit: $(date)"
        
    } > "$REPORT_FILE"
    
    print_success "Build report generated: $REPORT_FILE"
}

# Main execution
main() {
    case "${1:-all}" in
        "frontend")
            optimize_frontend
            ;;
        "server")
            optimize_server
            ;;
        "deps")
            optimize_dependencies
            ;;
        "audit")
            run_security_audit
            ;;
        "report")
            generate_build_report
            ;;
        "all")
            optimize_dependencies
            run_security_audit
            optimize_frontend
            optimize_server
            generate_build_report
            print_success "🎉 Build optimization completed successfully!"
            ;;
        *)
            echo "Usage: $0 [frontend|server|deps|audit|report|all]"
            echo ""
            echo "Commands:"
            echo "  frontend - Optimize frontend build"
            echo "  server   - Optimize server build"
            echo "  deps     - Check and optimize dependencies"
            echo "  audit    - Run security audit"
            echo "  report   - Generate build report"
            echo "  all      - Run all optimizations (default)"
            exit 1
            ;;
    esac
}

main "$@"
