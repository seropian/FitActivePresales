#!/usr/bin/env node

/**
 * FitActive Payment Flow Test Script
 * Tests the complete payment flow including validation, payment initiation, and order status
 */

import axios from 'axios';
import { randomUUID } from 'crypto';

// Configuration
const API_BASE_URL = 'https://presale.fitactive.open-sky.org';
const LOCAL_API_BASE_URL = 'http://localhost:3001';

// Test data
const generateTestOrder = () => ({
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

const generateTestBilling = () => ({
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+40721234567',
  city: 'Bucharest',
  state: 'Bucharest',
  postalCode: '010101',
  details: 'Test Address 123'
});

const generateTestCompany = () => ({
  name: 'Test Company SRL',
  vatCode: 'RO12345678',
  regCom: 'J40/1234/2023'
});

// Test functions
async function testHealthCheck(baseUrl) {
  console.log(`\n🔍 Testing Health Check: ${baseUrl}/health`);
  try {
    const response = await axios.get(`${baseUrl}/health`);
    console.log('✅ Health Check Response:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health Check Failed:', error.response?.data || error.message);
    return false;
  }
}

async function testPaymentStart(baseUrl, testData) {
  console.log(`\n💳 Testing Payment Start: ${baseUrl}/api/netopia/start`);
  console.log('Test Data:', JSON.stringify(testData, null, 2));
  
  try {
    const response = await axios.post(`${baseUrl}/api/netopia/start`, testData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('✅ Payment Start Response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Payment Start Failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    return { success: false, error: error.response?.data || error.message };
  }
}

async function testOrderStatus(baseUrl, orderID) {
  console.log(`\n📋 Testing Order Status: ${baseUrl}/api/order/status?orderID=${orderID}`);
  
  try {
    const response = await axios.get(`${baseUrl}/api/order/status`, {
      params: { orderID }
    });
    
    console.log('✅ Order Status Response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Order Status Failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

async function testValidationErrors(baseUrl) {
  console.log('\n🚫 Testing Validation Errors');
  
  const testCases = [
    {
      name: 'Empty request body',
      data: {}
    },
    {
      name: 'Missing order data',
      data: { billing: generateTestBilling() }
    },
    {
      name: 'Missing billing data',
      data: { order: generateTestOrder() }
    },
    {
      name: 'Invalid email',
      data: {
        order: generateTestOrder(),
        billing: { ...generateTestBilling(), email: 'invalid-email' }
      }
    },
    {
      name: 'Invalid amount',
      data: {
        order: { ...generateTestOrder(), amount: -100 },
        billing: generateTestBilling()
      }
    },
    {
      name: 'Missing required billing fields',
      data: {
        order: generateTestOrder(),
        billing: { email: 'test@example.com' }
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n  Testing: ${testCase.name}`);
    try {
      const response = await axios.post(`${baseUrl}/api/netopia/start`, testCase.data, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('  ⚠️  Expected error but got success:', response.data);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('  ✅ Validation error caught correctly:', error.response.data.message);
      } else {
        console.log('  ❌ Unexpected error:', error.response?.data || error.message);
      }
    }
  }
}

async function runCompleteTest() {
  console.log('🚀 Starting FitActive Payment Flow Tests\n');
  console.log('=' .repeat(60));
  
  const testOrder = generateTestOrder();
  const testBilling = generateTestBilling();
  const testCompany = generateTestCompany();
  
  const testData = {
    order: testOrder,
    billing: testBilling,
    company: testCompany
  };
  
  // Test both production and local endpoints
  const endpoints = [
    { name: 'Production', url: API_BASE_URL },
    { name: 'Local', url: LOCAL_API_BASE_URL }
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n🌐 Testing ${endpoint.name} Environment: ${endpoint.url}`);
    console.log('-'.repeat(50));
    
    // 1. Health Check
    const healthOk = await testHealthCheck(endpoint.url);
    if (!healthOk && endpoint.name === 'Local') {
      console.log('⚠️  Local server not running, skipping local tests');
      continue;
    }
    
    // 2. Validation Tests
    await testValidationErrors(endpoint.url);
    
    // 3. Valid Payment Start
    const paymentResult = await testPaymentStart(endpoint.url, testData);
    
    // 4. Order Status Check
    await testOrderStatus(endpoint.url, testOrder.orderID);
    
    // 5. Order Status Check for non-existent order
    await testOrderStatus(endpoint.url, 'NON-EXISTENT-ORDER');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 Payment Flow Tests Completed');
}

// Run tests
runCompleteTest().catch(console.error);
