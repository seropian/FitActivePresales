# Environment Configuration Guide

This project supports three distinct environments: **Development**, **Test**, and **Production**. Each environment has its own configuration file and database.

## 🌍 Environment Overview

| Environment | Config File | Database | Port | Purpose |
|-------------|-------------|----------|------|---------|
| **Development** | `.env` | `data.sqlite` | 3001 | Local development |
| **Test** | `.env.test` | `test.sqlite` | 3002 | Testing & QA |
| **Production** | `.env.prod` | `production.sqlite` | 3001 | Live deployment |

## 📁 Configuration Files

### Development (`.env`)
- Used for local development
- Sandbox/test API endpoints
- Local database
- Debug logging enabled

### Test (`.env.test`)
- Used for testing and QA
- Mock services enabled
- Separate test database
- Payment processing disabled
- Different port (3002) to avoid conflicts

### Production (`.env.prod`)
- Used for live deployment
- Production API endpoints
- Production database
- Optimized for performance

## 🚀 Running Different Environments

### Development
```bash
# Method 1: Using npm script
npm run dev

# Method 2: Using environment-specific script
npm run env:dev

# Method 3: Manual
NODE_ENV=development node server.js
```

### Test
```bash
# Method 1: Using npm script
npm run test:server

# Method 2: Using environment-specific script
npm run env:test

# Method 3: Manual
NODE_ENV=test node server.js
```

### Production
```bash
# Method 1: Using npm script
npm start

# Method 2: Using environment-specific script
npm run env:prod

# Method 3: Manual
NODE_ENV=production node server.js
```

## ⚙️ Environment-Specific Features

### Test Environment Features
- **Disabled Payments**: `DISABLE_PAYMENTS=true` prevents actual payment processing
- **Mock Services**: `USE_MOCK_SERVICES=true` uses mock external APIs
- **Debug Mode**: `DEBUG_MODE=true` enables detailed logging
- **Separate Database**: Uses `test.sqlite` to avoid data conflicts
- **Different Port**: Runs on port 3002 to allow parallel testing

### Production Environment Features
- **Production APIs**: Uses live NETOPIA and SmartBill endpoints
- **Optimized Database**: Uses `production.sqlite`
- **Security**: Production-grade SMTP and security settings
- **Performance**: Optimized for production workloads

## 🔧 Configuration Management

### Environment Detection
The application automatically detects the environment using `NODE_ENV` and loads the appropriate configuration:

```javascript
import { 
  getEnvironment, 
  isDevelopment, 
  isTest, 
  isProduction 
} from './config/environment.js';

// Check current environment
console.log(getEnvironment()); // 'development', 'test', or 'production'

// Environment checks
if (isDevelopment()) {
  // Development-specific code
}

if (isTest()) {
  // Test-specific code
}

if (isProduction()) {
  // Production-specific code
}
```

### Environment Validation
Validate required environment variables:

```javascript
import { validateEnvironment } from './config/environment.js';

// Validate required variables
validateEnvironment([
  'NETOPIA_API_KEY',
  'SMARTBILL_EMAIL',
  'SMARTBILL_TOKEN'
]);
```

## 📊 Database Configuration

Each environment uses its own SQLite database:

- **Development**: `data.sqlite`
- **Test**: `test.sqlite`
- **Production**: `production.sqlite`

This ensures data isolation between environments.

## 🔐 Security Considerations

### Development
- Uses sandbox/test API keys
- Local SMTP (Mailtrap recommended)
- Debug logging enabled

### Test
- Uses test credentials
- Mock services for external APIs
- Payments disabled for safety

### Production
- Uses real API keys and credentials
- Production SMTP provider
- Optimized logging
- Security headers enabled

## 📝 Setup Instructions

### 1. Development Setup
```bash
# Copy the example file
cp server/.env.example server/.env

# Edit with your development credentials
nano server/.env
```

### 2. Test Setup
```bash
# The .env.test file is already created
# Edit with your test credentials if needed
nano server/.env.test
```

### 3. Production Setup
```bash
# Edit the production file with real credentials
nano server/.env.prod
```

## 🔍 Troubleshooting

### Environment Not Loading
- Check that `NODE_ENV` is set correctly
- Verify the configuration file exists
- Check file permissions

### Database Issues
- Ensure the database directory is writable
- Check that the database path is correct
- Verify SQLite is installed

### Port Conflicts
- Development environment uses port 3001
- Test environment uses port 3002
- Production environment uses port 3003
- Change ports in environment files if needed

## 📋 Environment Variables Reference

### Required for All Environments
- `NODE_ENV`: Environment name
- `PORT`: Server port
- `APP_BASE_URL`: Frontend URL

### Payment Processing
- `NETOPIA_API_KEY`: NETOPIA API key
- `NETOPIA_POS_SIGNATURE`: POS signature
- `SMARTBILL_EMAIL`: SmartBill email
- `SMARTBILL_TOKEN`: SmartBill token

### Email Configuration
- `SMTP_HOST`: SMTP server
- `SMTP_PORT`: SMTP port
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password

### Test-Specific
- `DISABLE_PAYMENTS`: Disable payment processing
- `USE_MOCK_SERVICES`: Use mock external services
- `DEBUG_MODE`: Enable debug logging
