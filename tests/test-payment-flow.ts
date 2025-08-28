#!/usr/bin/env node

/**
 * FitActive Payment Flow Test Script
 * Tests the complete payment flow including validation, payment initiation, and order status
 */

import axios from 'axios';
import { randomUUID } from 'crypto';

interface Product {
  name: string;
  price: number;
  vat: number;
}

interface OrderData {
  orderID: string;
  amount: number;
  currency: string;
  description: string;
  products: Product[];
}

interface BillingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  postalCode: string;
  details: string;
  address: string;
}

interface CompanyData {
  name: string;
  vatCode: string;
}

interface TestData {
  order: OrderData;
  billing: BillingData;
  company: CompanyData;
}

interface PaymentResponse {
  success?: boolean;
  redirectUrl?: string;
  orderID?: string;
  error?: string;
  [key: string]: any;
}

interface OrderStatusResponse {
  orderID: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
  [key: string]: any;
}

// Configuration
const API_BASE_URL = 'https://presale.fitactive.open-sky.org';
const LOCAL_API_BASE_URL = 'http://localhost:3001';

// Test data
const generateTestOrder = (): OrderData => ({
  orderID: `TEST-${randomUUID()}`,
  amount: 299.99,
  currency: 'RON',
  description: 'FitActive Presale Test Order',
  products: [
    {
      name: 'FitActive Membership',
      price: 299.99,
      vat: 19
    }
  ]
});

const generateTestBilling = (): BillingData => ({
  firstName: 'Test',
  lastName: 'Customer',
  email: `test.${Date.now()}@example.com`,
  phone: '+40712345678',
  city: 'București',
  state: 'București',
  postalCode: '010101',
  details: 'Test Street 123, Sector 1',
  address: 'Test Street 123, Sector 1'
});

const generateTestCompany = (): CompanyData => ({
  name: 'Test Company SRL',
  vatCode: 'RO12345678'
});

// Test functions
async function testPaymentInitiation(baseUrl: string): Promise<PaymentResponse | null> {
  const testData: TestData = {
    order: generateTestOrder(),
    billing: generateTestBilling(),
    company: generateTestCompany()
  };

  console.log('🚀 Testing Payment Initiation');
  console.log(`📍 API Base URL: ${baseUrl}`);
  console.log(`📋 Order ID: ${testData.order.orderID}`);
  console.log(`💰 Amount: ${testData.order.amount} ${testData.order.currency}`);
  console.log(`📧 Email: ${testData.billing.email}`);
  console.log('');

  try {
    const response = await axios.post(`${baseUrl}/api/netopia/start`, testData, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FitActive-Test-Script/1.0'
      },
      timeout: 30000
    });

    console.log('✅ Payment initiation successful');
    console.log(`📊 Status: ${response.status}`);
    console.log(`🔗 Redirect URL: ${response.data.redirectUrl || 'Not provided'}`);
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('❌ Payment initiation failed');
      console.log(`📊 Status: ${error.response?.status || 'No response'}`);
      console.log(`📋 Error: ${error.response?.data?.error || error.message}`);
    } else {
      console.log('❌ Unexpected error:', (error as Error).message);
    }
    return null;
  }
}

async function testOrderStatus(baseUrl: string, orderID: string): Promise<OrderStatusResponse | null> {
  console.log('🔍 Testing Order Status Check');
  console.log(`📋 Order ID: ${orderID}`);
  
  try {
    const response = await axios.get(`${baseUrl}/api/orders/${orderID}/status`, {
      timeout: 10000
    });

    console.log('✅ Order status retrieved');
    console.log(`📊 Status: ${response.data.status}`);
    console.log(`💰 Amount: ${response.data.amount} ${response.data.currency}`);
    console.log(`📅 Created: ${response.data.createdAt}`);
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('❌ Order status check failed');
      console.log(`📊 Status: ${error.response?.status || 'No response'}`);
      console.log(`📋 Error: ${error.response?.data?.error || error.message}`);
    } else {
      console.log('❌ Unexpected error:', (error as Error).message);
    }
    return null;
  }
}

async function testHealthCheck(baseUrl: string): Promise<boolean> {
  console.log('🏥 Testing Health Check');
  
  try {
    const response = await axios.get(`${baseUrl}/health`, {
      timeout: 5000
    });

    console.log('✅ Health check passed');
    console.log(`📊 Status: ${response.data.status}`);
    console.log(`🕐 Timestamp: ${response.data.timestamp || 'Not provided'}`);
    
    return response.data.status === 'ok';
  } catch (error) {
    console.log('❌ Health check failed');
    if (axios.isAxiosError(error)) {
      console.log(`📊 Status: ${error.response?.status || 'No response'}`);
      console.log(`📋 Error: ${error.message}`);
    }
    return false;
  }
}

async function runCompleteTest(baseUrl: string, environment: string): Promise<void> {
  console.log(`\n🧪 Running Complete Payment Flow Test - ${environment.toUpperCase()}`);
  console.log('='.repeat(70));
  
  // Step 1: Health Check
  console.log('\n📋 Step 1: Health Check');
  const isHealthy = await testHealthCheck(baseUrl);
  
  if (!isHealthy) {
    console.log('❌ Health check failed. Skipping payment tests.');
    return;
  }
  
  // Step 2: Payment Initiation
  console.log('\n📋 Step 2: Payment Initiation');
  const paymentResult = await testPaymentInitiation(baseUrl);
  
  if (!paymentResult || !paymentResult.orderID) {
    console.log('❌ Payment initiation failed. Skipping order status test.');
    return;
  }
  
  // Step 3: Order Status Check
  console.log('\n📋 Step 3: Order Status Check');
  await testOrderStatus(baseUrl, paymentResult.orderID);
  
  console.log('\n✅ Complete test flow finished');
  
  if (paymentResult.redirectUrl) {
    console.log('\n🎯 Next Steps for Manual Testing:');
    console.log(`1. Open: ${paymentResult.redirectUrl}`);
    console.log('2. Complete payment with test card');
    console.log('3. Verify IPN callbacks in server logs');
    console.log('4. Check final order status');
  }
}

// Main execution
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const environment = args[0] || 'local';
  
  let baseUrl: string;
  
  switch (environment.toLowerCase()) {
    case 'production':
    case 'prod':
      baseUrl = API_BASE_URL;
      break;
    case 'local':
    case 'dev':
    case 'development':
    default:
      baseUrl = LOCAL_API_BASE_URL;
      break;
  }
  
  console.log('🚀 FitActive Payment Flow Test Script');
  console.log('=====================================');
  console.log(`🌍 Environment: ${environment}`);
  console.log(`🔗 Base URL: ${baseUrl}`);
  
  await runCompleteTest(baseUrl, environment);
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main().catch((error) => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
});
