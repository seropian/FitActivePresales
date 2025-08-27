# FitActive Presales Starter

A complete presales application for FitActive gym with payment processing, invoice generation, and email notifications.

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

The project includes automated deployment scripts for managing different environments:

#### 1. General Deployment Script (`scripts/deploy.sh`)
Flexible script for managing all environments (dev/test/prod):

**Usage:**
```bash
./scripts/deploy.sh [ENVIRONMENT] [ACTION]
```

**Environments:**
- `dev` - Development environment (port 3001)
- `test` - Test environment (port 3002)
- `prod` - Production environment (port 3000)

**Actions:**
- `start` - Start the application
- `stop` - Stop the application
- `restart` - Restart the application
- `status` - Show application status
- `logs` - Show application logs
- `build` - Build frontend and start backend

**Examples:**
```bash
# Start development environment
./scripts/deploy.sh dev start

# Restart production environment
./scripts/deploy.sh prod restart

# Show test environment logs
./scripts/deploy.sh test logs

# Build and start production
./scripts/deploy.sh prod build

# Check status of development environment
./scripts/deploy.sh dev status
```

#### 2. Production Deployment Script (`scripts/deploy-production.sh`)
Comprehensive production deployment script that:
- Pulls latest code from git
- Installs dependencies
- Builds frontend
- Sets up environment files
- Manages PM2 processes
- Verifies deployment

**Usage:**
```bash
# Must be run as 'sero' user
./scripts/deploy-production.sh
```

#### Environment Configuration
Each environment runs on different ports and uses different databases:
- **Development**: Port 3001, `data.sqlite`
- **Test**: Port 3002, `data-test.sqlite`
- **Production**: Port 3000, `data-prod.sqlite`

#### Quick Start Commands

**For Development:**
```bash
./scripts/deploy.sh dev build    # Build and start dev
./scripts/deploy.sh dev logs     # Monitor dev logs
```

**For Testing:**
```bash
./scripts/deploy.sh test start   # Start test environment
./scripts/deploy.sh test status  # Check test status
```

**For Production:**
```bash
./scripts/deploy-production.sh   # Full production deployment
# OR
./scripts/deploy.sh prod restart # Quick production restart
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

## 📝 License

ISC License - see package.json files for details.
