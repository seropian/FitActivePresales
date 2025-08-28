# FitActive Presales Starter

A complete presales application for FitActive gym with payment processing, invoice generation, and email notifications.

## 🎉 **LIVE DEPLOYMENT STATUS**

**✅ FULLY OPERATIONAL** - Last Updated: August 28, 2025

- **🌐 Live URL**: [https://presale.fitactive.open-sky.org](https://presale.fitactive.open-sky.org)
- **💳 Payment System**: ✅ Working (NETOPIA Sandbox)
- **📧 Email Notifications**: ✅ Configured
- **🧾 Invoice Generation**: ✅ SmartBill Integration
- **🔒 SSL Certificate**: ✅ Valid (Let's Encrypt)

## 🏗️ Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express.js + SQLite + Nodemailer
- **Payment Flow**: NETOPIA (sandbox) → SmartBill Invoice → Email with PDF

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- NETOPIA sandbox account
- SmartBill account
- SMTP email service (Mailtrap for development)

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/seropian/FitActivePresales.git
cd FitActivePresales

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

This project supports three environments: **Development**, **Test**, and **Production**.

```bash
# Copy environment template for development
cd ../server
cp .env.example .env
```

Edit `.env` with your development credentials:
- NETOPIA API keys and POS signature
- SmartBill credentials
- SMTP configuration

**Environment Files:**
- `.env` - Development environment (default)
- `.env.test` - Test environment (already created)
- `.env.prod` - Production environment (already created)

**Quick Environment Switching:**
```bash
# Check environment status
node scripts/env-switch.js

# Switch to test environment
node scripts/env-switch.js test

# Switch to production environment
node scripts/env-switch.js production
```

📖 **See [ENVIRONMENT_CONFIG.md](docs/ENVIRONMENT_CONFIG.md) for detailed configuration guide.**

### 3. Start Development Servers

**Backend** (Terminal 1):
```bash
cd server

# Development (default)
npm run dev                # Port 3001

# Test environment
npm run test:server        # Port 3002

# Production
npm start                  # Port 3003
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev               # Port 5173 (development)
```

**Environment URLs:**
- Development: Backend http://localhost:3001, Frontend http://localhost:5173
- Test: Backend http://localhost:3002, Frontend http://localhost:5174
- Production: Backend http://localhost:3003, Frontend (built)

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](docs/) directory:

### Setup & Configuration
- **[Environment Configuration](docs/ENVIRONMENT_CONFIG.md)** - Detailed guide for setting up development, test, and production environments
- **[Quick Reference](docs/QUICK_REFERENCE.md)** - Quick commands and common tasks reference

### Deployment & Operations
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Complete deployment instructions for production
- **[Deployment Status](docs/DEPLOYMENT_STATUS.md)** - Current production status and verification steps
- **[Security Checklist](docs/SECURITY_CHECKLIST.md)** - Security considerations and best practices

### Development Resources
- **[Icon Sizing Guide](docs/ICON_SIZING_GUIDE.md)** - Guidelines for icons and visual assets

## 🔧 Configuration

**Configuration Files**: Deployment and server configuration files are organized as follows:
- `config/` directory:
  - `ecosystem.config.cjs` - PM2 process management configuration
  - `nginx-*.conf` - Nginx server configurations
- `scripts/` directory:
  - `deploy.sh` - Multi-environment deployment script
  - `deploy-production.sh` - Production deployment script
  - `nginx-setup.sh` - Automated server setup script
  - `verify-setup.sh` - Setup verification script
  - `env-switch.js` - Environment switching utility

### NETOPIA Setup
1. Get sandbox credentials from NETOPIA
2. Download the public key file (`netopia_public.pem`)
3. Update `.env` with your credentials

### Local IPN Testing
```bash
# Install ngrok globally
npm install -g ngrok

# Expose local server
ngrok http 3001
```
Update `NETOPIA_NOTIFY_URL` in `.env` with the ngrok URL.

### SmartBill Setup
1. Create SmartBill account
2. Generate API token
3. Update `.env` with credentials

## 📁 Project Structure

```
├── config/                   # Configuration files
│   ├── ecosystem.config.cjs  # PM2 configuration
│   └── nginx-*.conf         # Nginx configurations
├── scripts/                  # Utility scripts
│   ├── deploy.sh            # Multi-environment deployment script
│   ├── deploy-production.sh # Production deployment script
│   ├── env-switch.js        # Environment switching script
│   ├── nginx-setup.sh       # Nginx setup script
│   └── verify-setup.sh      # Setup verification script
├── tests/                    # Testing suite
│   ├── test-payment.js      # Development payment flow tests
│   ├── test-payment-flow.js # Comprehensive payment testing
│   ├── test-payment-public.js # Production server tests
│   ├── test-frontend-flow.js # Frontend integration tests
│   └── README.md            # Testing documentation
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main app component
│   └── package.json
├── server/                   # Express backend
│   ├── config/              # Server configuration files
│   ├── database/            # Database operations
│   ├── routes/              # API routes
│   ├── services/            # External services
│   ├── utils/               # Utility functions
│   └── server.js            # Main server file
└── README.md
```

## 🚀 Deployment

### Deployment Scripts

The project includes a unified deployment script for managing all environments:

#### Deployment Script (`scripts/deploy.sh`)
Single script for managing all environments (dev/test/prod) with enhanced features:

**Usage:**
```bash
./scripts/deploy.sh [ENVIRONMENT] [ACTION] [OPTIONS]
```

**Environments:**
- `dev` - Development environment (port 3001)
- `test` - Test environment (port 3002)
- `prod` - Production environment (port 3003)

**Actions:**
- `start` - Start the application
- `stop` - Stop the application
- `restart` - Restart the application
- `status` - Show application status
- `logs` - Show application logs
- `build` - Build frontend and start backend
- `deploy` - Full deployment (git pull, build, restart)
- `setup` - Initial environment setup
- `cleanup` - Clean build artifacts and logs

**Options:**
- `--no-build` - Skip frontend build step
- `--no-git` - Skip git pull step
- `--force` - Force restart even if already running
- `--logs=N` - Show N lines of logs

**Examples:**
```bash
# Start development environment
./scripts/deploy.sh dev start

# Full production deployment
./scripts/deploy.sh prod deploy

# Show test environment logs with more lines
./scripts/deploy.sh test logs --logs=100

# Build and start production
./scripts/deploy.sh prod build

# Check status of all environments
./scripts/deploy.sh status
```

#### NPM Scripts (Recommended)
For easier access, use the predefined npm scripts:

**Development:**
```bash
npm run start:dev        # Start development environment
npm run deploy:dev       # Deploy development environment
npm run logs:dev         # View development logs
```

**Test:**
```bash
npm run start:test       # Start test environment
npm run deploy:test      # Deploy test environment
npm run logs:test        # View test logs
```

**Production:**
```bash
npm run start:prod       # Start production environment
npm run deploy:prod      # Deploy production environment
npm run logs:prod        # View production logs
```

**Global Commands:**
```bash
npm run status           # Show status of all environments
```

#### Environment Configuration
Each environment runs on different ports and uses different databases:
- **Development**: Port 3001, `data.sqlite`
- **Test**: Port 3002, `data-test.sqlite`
- **Production**: Port 3003, `data-prod.sqlite`

#### Quick Start Commands

**For Development:**
```bash
npm run deploy:dev               # Deploy development environment
npm run logs:dev                 # Monitor dev logs
# OR using script directly
./scripts/deploy.sh dev build
```

**For Testing:**
```bash
npm run start:test               # Start test environment
npm run status                   # Check status of all environments
# OR using script directly
./scripts/deploy.sh test start
```

**For Production:**
```bash
npm run deploy:prod              # Full production deployment
# OR using script directly with options
./scripts/deploy.sh prod deploy --no-git
```

### Production Deployment (Ubuntu Server)

**Current Production Environment:**
- **Server**: 49.12.189.69 (Ubuntu 24.04.3 LTS)
- **Domain**: https://presale.fitactive.open-sky.org
- **Status**: ✅ **LIVE AND OPERATIONAL**

**Architecture:**
```
Internet → Nginx (Port 443/80) → {
  Frontend: Static React files (/var/www/fitactive/frontend/dist)
  API: Proxy to Node.js (Port 3000)
}
```

**Deployment Status (Last Verified: Aug 26, 2025):**
- ✅ HTTPS with valid SSL certificate (Let's Encrypt)
- ✅ Frontend serving correctly at root path
- ✅ API endpoints responding at `/api/*`
- ✅ Database connectivity (SQLite)
- ✅ CORS configuration working
- ✅ Security headers configured
- ✅ Health monitoring endpoint active

**Quick Deployment Check:**
```bash
# Test all endpoints
curl -I https://presale.fitactive.open-sky.org/                    # Frontend
curl -I https://presale.fitactive.open-sky.org/health              # Health check
curl -I https://presale.fitactive.open-sky.org/api/order/status    # API endpoint
```

📖 **Documentation:**
- [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [DEPLOYMENT_STATUS.md](docs/DEPLOYMENT_STATUS.md) - Current production status & verification

### Alternative Hosting Options

**Frontend (Vercel/Netlify):**
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

**Backend (Render/Railway/Fly.io):**
1. Set environment variables in your hosting platform
2. Deploy the `server/` directory
3. Ensure the database file is persistent

## 🔍 API Endpoints

**Production API Base URL**: `https://presale.fitactive.open-sky.org`

- `POST /api/netopia/start` - Start payment (✅ Responding with 400 for invalid data)
- `POST /api/netopia/ipn` - Payment notification webhook
- `GET /api/order/status?orderID=<id>` - Get order status (✅ Working - returns 200)
- `GET /health` - Health check (✅ Working - returns 200)

**API Status (Last Verified: Aug 26, 2025):**
- All endpoints are responding correctly
- CORS configured for frontend domain
- Security headers applied
- Error handling working as expected

## 🛠️ Development

### Code Structure
- Modular backend with separated concerns
- Clean React components with proper state management
- Environment-based configuration
- Proper error handling and logging

### Available Scripts

**Backend:**
- `npm run dev` - Development server
- `npm start` - Production server

**Frontend:**
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build

## 🔧 Recent Updates

### Payment System Fixes (August 28, 2025)
- ✅ **Fixed NETOPIA Integration**: Resolved server crashes during payment processing
- ✅ **Enhanced Error Handling**: Comprehensive logging and error recovery
- ✅ **Improved Stability**: Better axios configuration and ES module compatibility
- ✅ **Production Ready**: Full end-to-end payment flow working

See [Payment System Fixes Documentation](docs/PAYMENT_SYSTEM_FIXES.md) for detailed technical information.

### Testing the Payment System
1. Visit [https://presale.fitactive.open-sky.org](https://presale.fitactive.open-sky.org)
2. Fill out the payment form
3. Use NETOPIA test cards:
   - **Success**: `4111111111111111` (any CVV, future date)
   - **Failure**: `4000000000000002` (any CVV, future date)

## 📝 License

ISC License - see package.json files for details.
