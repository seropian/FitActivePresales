#!/usr/bin/env node

/**
 * Test script for NETOPIA payment flow on public production URL
 */

const API_BASE = 'https://presale.fitactive.open-sky.org';

// Test payment data
const testPaymentData = {
  order: {
    orderID: `PROD-TEST-${Date.now()}`,
    amount: 99.90,
    currency: 'RON',
    description: 'Production Test Payment - FitActive'
  },
  billing: {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+40712345678',
    city: 'București',
    state: 'București',
    postalCode: '010101',
    details: 'Test address 123',
    address: 'Test address 123'
  },
  company: null
};

async function testPaymentFlow() {
  console.log('🧪 Testing NETOPIA Payment Flow on Production URL');
  console.log('🌐 URL:', API_BASE);
  console.log('=' .repeat(60));
  
  try {
    console.log('📋 Test Order Data:');
    console.log(`   Order ID: ${testPaymentData.order.orderID}`);
    console.log(`   Amount: ${testPaymentData.order.amount} ${testPaymentData.order.currency}`);
    console.log(`   Email: ${testPaymentData.billing.email}`);
    console.log('');

    console.log('🚀 Initiating payment with NETOPIA...');
    
    const response = await fetch(`${API_BASE}/api/netopia/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPaymentData),
    });

    const result = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(result, null, 2));

    if (result.redirectUrl) {
      console.log('');
      console.log('✅ Payment initiation successful!');
      console.log('🔗 Redirect URL:', result.redirectUrl);
      console.log('');
      console.log('🎯 Next Steps:');
      console.log('1. Open the redirect URL in your browser');
      console.log('2. Use NETOPIA test cards:');
      console.log('   - Success: 4111111111111111 (any CVV, future date)');
      console.log('   - Failure: 4000000000000002 (any CVV, future date)');
      console.log('3. Complete the payment flow');
      console.log('4. Check server logs via SSH for IPN notifications');
      console.log('');
      console.log('🌐 Frontend URL: https://presale.fitactive.open-sky.org');
      console.log('🔧 SSH Debug: ssh sero@presale.fitactive.open-sky.org');
    } else {
      console.log('❌ Payment initiation failed');
      console.log('Error details:', result);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('');
      console.log('💡 Server might be down. Check via SSH:');
      console.log('   ssh sero@presale.fitactive.open-sky.org');
      console.log('   pm2 status');
    }
  }
}

// Health check first
async function healthCheck() {
  try {
    console.log('🔍 Checking server health...');
    const response = await fetch(`${API_BASE}/health`);
    const health = await response.json();
    console.log('🏥 Server Health:', health.status);
    return health.status === 'ok';
  } catch (error) {
    console.log('❌ Server not responding:', error.message);
    return false;
  }
}

// Test frontend accessibility
async function testFrontend() {
  try {
    console.log('🌐 Testing frontend accessibility...');
    const response = await fetch(API_BASE);
    console.log('📊 Frontend Status:', response.status);
    return response.status === 200;
  } catch (error) {
    console.log('❌ Frontend not accessible:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 Running production server tests...');
  console.log('');
  
  // Test frontend
  const frontendOk = await testFrontend();
  if (!frontendOk) {
    console.log('❌ Frontend is not accessible');
  } else {
    console.log('✅ Frontend is accessible');
  }
  console.log('');
  
  // Test backend health
  const isHealthy = await healthCheck();
  if (!isHealthy) {
    console.log('❌ Backend API is not responding');
    console.log('💡 Debug via SSH: ssh sero@presale.fitactive.open-sky.org');
    console.log('   Then run: pm2 status && pm2 logs');
    process.exit(1);
  }
  
  console.log('✅ Backend API is healthy');
  console.log('');
  
  await testPaymentFlow();
}

main().catch(console.error);
