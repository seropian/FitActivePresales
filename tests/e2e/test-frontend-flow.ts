#!/usr/bin/env node

/**
 * Test script to simulate frontend checkout form submission
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

interface CompanyData {
  name: string;
  vatCode: string;
}

interface FrontendFormData {
  order: OrderData;
  billing: BillingData;
  company: CompanyData;
}

interface PaymentResponse {
  redirectUrl?: string;
  error?: string;
  [key: string]: any;
}

const API_BASE = 'http://localhost:3001';

// Simulate realistic form data as it would come from the frontend
const frontendFormData: FrontendFormData = {
  order: {
    orderID: `FA-${Date.now()}`, // Frontend uses FA- prefix
    amount: 1448.80, // Sale price from frontend
    currency: 'RON',
    description: 'Abonament All Inclusive (12 luni) + Pro-Pack BONUS'
  },
  billing: {
    firstName: 'Maria',
    lastName: 'Popescu', 
    email: 'maria.popescu@example.com',
    phone: '+40721234567',
    city: 'București',
    state: 'București',
    postalCode: '010203',
    details: 'Strada Victoriei nr. 15, Sector 1',
    address: 'Strada Victoriei nr. 15, Sector 1'
  },
  company: {
    name: 'Maria Popescu',
    vatCode: '1234567890123' // CNP example
  }
};

async function testFrontendFlow(): Promise<void> {
  console.log('🖥️  Testing Frontend Payment Flow');
  console.log('='.repeat(50));
  
  console.log('👤 Customer Information:');
  console.log(`   Name: ${frontendFormData.billing.firstName} ${frontendFormData.billing.lastName}`);
  console.log(`   Email: ${frontendFormData.billing.email}`);
  console.log(`   Phone: ${frontendFormData.billing.phone}`);
  console.log(`   Address: ${frontendFormData.billing.address}`);
  console.log('');
  
  console.log('🛒 Order Details:');
  console.log(`   Order ID: ${frontendFormData.order.orderID}`);
  console.log(`   Product: ${frontendFormData.order.description}`);
  console.log(`   Amount: ${frontendFormData.order.amount} ${frontendFormData.order.currency}`);
  console.log('');

  console.log('🏢 Company Details:');
  console.log(`   Name: ${frontendFormData.company.name}`);
  console.log(`   VAT/CNP: ${frontendFormData.company.vatCode}`);
  console.log('');

  try {
    console.log('🚀 Submitting payment request...');
    
    const response = await fetch(`${API_BASE}/api/netopia/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FitActive-Frontend/1.0'
      },
      body: JSON.stringify(frontendFormData),
    });

    const result: PaymentResponse = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('📋 Response Data:', JSON.stringify(result, null, 2));

    if (result.redirectUrl) {
      console.log('');
      console.log('✅ Frontend payment flow successful!');
      console.log('🔗 Payment URL:', result.redirectUrl);
      console.log('');
      console.log('🎯 Frontend Integration Notes:');
      console.log('1. The frontend should redirect user to the payment URL');
      console.log('2. After payment, user will be redirected back to your success/failure page');
      console.log('3. Use IPN notifications to update order status in real-time');
      console.log('4. Always verify payment status server-side before fulfilling orders');
      console.log('');
      console.log('🔧 Testing Tips:');
      console.log('- Use NETOPIA sandbox cards for testing');
      console.log('- Monitor server logs for IPN callbacks');
      console.log('- Test both success and failure scenarios');
    } else {
      console.log('❌ Frontend payment flow failed');
      console.log('Error details:', result);
      
      if (result.error) {
        console.log('');
        console.log('🔍 Troubleshooting:');
        console.log('- Check if all required fields are provided');
        console.log('- Verify NETOPIA configuration in server/.env');
        console.log('- Ensure server is running in development mode');
      }
    }

  } catch (error) {
    const err = error as Error;
    console.error('❌ Frontend test failed:', err.message);
    
    if ('code' in err && (err as any).code === 'ECONNREFUSED') {
      console.log('');
      console.log('💡 Server Connection Issues:');
      console.log('- Make sure the development server is running: npm run dev');
      console.log('- Check if the server is listening on port 3001');
      console.log('- Verify no firewall is blocking the connection');
    }
  }
}

async function main(): Promise<void> {
  console.log('🔍 Starting frontend flow simulation...');
  console.log('');
  
  await testFrontendFlow();
}

main().catch(console.error);
