#!/usr/bin/env node

/**
 * Test script for NETOPIA payment flow in development environment
 */

interface OrderData {
  orderID: string;
  amount: number;
  currency: string;
  description: string;
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

interface TestPaymentData {
  order: OrderData;
  billing: BillingData;
  company: null;
}

interface PaymentResponse {
  redirectUrl?: string;
  error?: string;
  [key: string]: any;
}

interface HealthResponse {
  status: string;
  [key: string]: any;
}

const API_BASE = 'http://localhost:3001';

// Test payment data
const testPaymentData: TestPaymentData = {
  order: {
    orderID: `TEST-${Date.now()}`,
    amount: 99.90,
    currency: 'RON',
    description: 'Test payment - FitActive Dev Environment'
  },
  billing: {
    firstName: 'John',
    lastName: 'Doe',
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

async function testPaymentFlow(): Promise<void> {
  console.log('🧪 Testing NETOPIA Payment Flow in Development Environment');
  console.log('='.repeat(60));
  
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

    const result: PaymentResponse = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(result, null, 2));

    if (result.redirectUrl) {
      console.log('');
      console.log('✅ Payment initiation successful!');
      console.log('🔗 Redirect URL:', result.redirectUrl);
      console.log('');
      console.log('🎯 Next Steps:');
      console.log('1. Open the redirect URL in your browser');
      console.log('2. Use NETOPIA sandbox test cards:');
      console.log('   - Success: 4111111111111111 (any CVV, future date)');
      console.log('   - Failure: 4000000000000002 (any CVV, future date)');
      console.log('3. Complete the payment flow');
      console.log('4. Check the server logs for IPN notifications');
      console.log('');
      console.log('🌐 You can also test via the frontend at: http://localhost:5173');
    } else {
      console.log('❌ Payment initiation failed');
      console.log('Error details:', result);
    }

  } catch (error) {
    const err = error as Error;
    console.error('❌ Test failed:', err.message);
    
    if ('code' in err && (err as any).code === 'ECONNREFUSED') {
      console.log('');
      console.log('💡 Make sure the development server is running:');
      console.log('   npm run dev');
    }
  }
}

// Health check first
async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const health: HealthResponse = await response.json();
    console.log('🏥 Server Health:', health.status);
    return health.status === 'ok';
  } catch (error) {
    console.log('❌ Server not responding');
    return false;
  }
}

async function main(): Promise<void> {
  console.log('🔍 Checking server health...');
  const isHealthy = await healthCheck();
  
  if (!isHealthy) {
    console.log('❌ Server is not running or not healthy');
    console.log('💡 Start the server with: npm run dev');
    process.exit(1);
  }
  
  console.log('✅ Server is healthy');
  console.log('');
  
  await testPaymentFlow();
}

main().catch(console.error);
