#!/usr/bin/env node

/**
 * Test script for NETOPIA payment flow on public production URL
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

const API_BASE = 'https://presale.fitactive.open-sky.org';

// Test payment data
const testPaymentData: TestPaymentData = {
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

async function testProductionPaymentFlow(): Promise<void> {
  console.log('🌐 Testing NETOPIA Payment Flow on Production URL');
  console.log('='.repeat(60));
  console.log('⚠️  WARNING: This will create a real payment request on production!');
  console.log('');
  
  try {
    console.log('📋 Production Test Order Data:');
    console.log(`   Order ID: ${testPaymentData.order.orderID}`);
    console.log(`   Amount: ${testPaymentData.order.amount} ${testPaymentData.order.currency}`);
    console.log(`   Email: ${testPaymentData.billing.email}`);
    console.log(`   API URL: ${API_BASE}`);
    console.log('');

    console.log('🚀 Initiating payment with NETOPIA (Production)...');
    
    const response = await fetch(`${API_BASE}/api/netopia/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FitActive-Production-Test/1.0'
      },
      body: JSON.stringify(testPaymentData),
    });

    const result: PaymentResponse = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(result, null, 2));

    if (result.redirectUrl) {
      console.log('');
      console.log('✅ Production payment initiation successful!');
      console.log('🔗 Redirect URL:', result.redirectUrl);
      console.log('');
      console.log('🎯 Production Testing Steps:');
      console.log('1. Open the redirect URL in your browser');
      console.log('2. ⚠️  Use ONLY test cards in production sandbox:');
      console.log('   - Success: 4111111111111111 (any CVV, future date)');
      console.log('   - Failure: 4000000000000002 (any CVV, future date)');
      console.log('3. Complete the payment flow');
      console.log('4. Monitor production logs for IPN notifications');
      console.log('5. Verify SSL certificate and HTTPS connections');
      console.log('');
      console.log('🔒 Production Security Notes:');
      console.log('- All communications are over HTTPS');
      console.log('- Production NETOPIA credentials are being used');
      console.log('- IPN callbacks will be sent to production URLs');
      console.log('- Database writes will occur on production database');
      console.log('');
      console.log('🌐 Production URL: https://presale.fitactive.open-sky.org');
    } else {
      console.log('❌ Production payment initiation failed');
      console.log('Error details:', result);
      
      if (result.error) {
        console.log('');
        console.log('🔍 Production Troubleshooting:');
        console.log('- Check production server logs');
        console.log('- Verify NETOPIA production configuration');
        console.log('- Ensure SSL certificates are valid');
        console.log('- Check firewall and security group settings');
      }
    }

  } catch (error) {
    const err = error as Error;
    console.error('❌ Production test failed:', err.message);
    
    if ('code' in err) {
      const code = (err as any).code;
      if (code === 'ECONNREFUSED') {
        console.log('');
        console.log('💡 Production Server Issues:');
        console.log('- Production server may be down');
        console.log('- Check server status and health endpoints');
        console.log('- Verify DNS resolution for presale.fitactive.open-sky.org');
      } else if (code === 'ENOTFOUND') {
        console.log('');
        console.log('💡 DNS Resolution Issues:');
        console.log('- Domain may not be properly configured');
        console.log('- Check DNS settings and propagation');
        console.log('- Verify domain is pointing to correct server');
      }
    }
  }
}

// Health check for production
async function productionHealthCheck(): Promise<boolean> {
  try {
    console.log('🏥 Checking production server health...');
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'User-Agent': 'FitActive-Health-Check/1.0'
      }
    });
    
    const health: HealthResponse = await response.json();
    console.log('🏥 Production Server Health:', health.status);
    
    if (health.status === 'ok') {
      console.log('✅ Production server is healthy');
      return true;
    } else {
      console.log('⚠️  Production server health check returned:', health.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Production server not responding');
    console.log('Error:', (error as Error).message);
    return false;
  }
}

async function main(): Promise<void> {
  console.log('🔍 Starting production environment test...');
  console.log('');
  
  // Health check first
  const isHealthy = await productionHealthCheck();
  
  if (!isHealthy) {
    console.log('❌ Production server is not healthy');
    console.log('💡 Please check server status before running payment tests');
    process.exit(1);
  }
  
  console.log('✅ Production server is healthy');
  console.log('');
  
  // Confirmation prompt for production testing
  console.log('⚠️  PRODUCTION ENVIRONMENT DETECTED');
  console.log('This will create real payment requests on the live system.');
  console.log('Make sure you understand the implications before proceeding.');
  console.log('');
  
  await testProductionPaymentFlow();
}

main().catch(console.error);
