# FitActive Testing Suite

This directory contains all testing-related files for the FitActive Presales application.

## Test Files

### Payment Flow Tests

#### `test-payment.js`
- **Purpose**: Tests NETOPIA payment flow in development environment
- **Environment**: Local development (http://localhost:3001)
- **Usage**: `node tests/test-payment.js`
- **Features**:
  - Health check for local server
  - Payment initiation test
  - Test data with sample order
  - Provides test card numbers for sandbox testing

#### `test-payment-flow.js`
- **Purpose**: Comprehensive payment flow testing for both local and production
- **Environment**: Both local and production environments
- **Usage**: `npm run test:payment` or `node tests/test-payment-flow.js`
- **Features**:
  - Tests multiple environments (local + production)
  - Validation error testing
  - Order status checking
  - Health checks for all endpoints
  - Comprehensive test coverage

#### `test-payment-public.js`
- **Purpose**: Production server testing from external perspective
- **Environment**: Production (https://presale.fitactive.open-sky.org)
- **Usage**: `node tests/test-payment-public.js`
- **Features**:
  - Frontend accessibility test
  - Backend health check
  - Production payment flow testing
  - External monitoring capabilities

#### `test-frontend-flow.js`
- **Purpose**: Simulates frontend checkout form submission
- **Environment**: Local development
- **Usage**: `node tests/test-frontend-flow.js`
- **Features**:
  - Realistic form data simulation
  - Frontend-to-backend integration testing
  - Automatic browser opening for payment completion
  - Step-by-step payment instructions

## Running Tests

### Individual Tests
```bash
# Test local development payment flow
node tests/test-payment.js

# Test comprehensive payment flow (local + production)
npm run test:payment

# Test production server from external perspective
node tests/test-payment-public.js

# Test frontend form submission flow
node tests/test-frontend-flow.js
```

### Prerequisites
- For local tests: Development server running (`npm run dev`)
- For production tests: Production server accessible
- Node.js dependencies installed (`npm install`)

## Test Data

All tests use realistic Romanian customer data and proper formatting:
- Romanian phone numbers (+40...)
- Romanian addresses (București, etc.)
- Proper currency (RON)
- Valid test card numbers for NETOPIA sandbox

## Environment Configuration

Tests automatically detect and adapt to different environments:
- **Development**: http://localhost:3001
- **Production**: https://presale.fitactive.open-sky.org

## Test Card Numbers

For NETOPIA sandbox testing:
- **Success**: 4111111111111111 (any CVV, future expiry date)
- **Failure**: 4000000000000002 (any CVV, future expiry date)
- **Expiry**: 12/25
- **CVV**: 123
