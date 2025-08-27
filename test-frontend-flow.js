#!/usr/bin/env node

/**
 * Test script to simulate frontend checkout form submission
 */

const API_BASE = 'http://localhost:3001';

// Simulate realistic form data as it would come from the frontend
const frontendFormData = {
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

async function testFrontendFlow() {
  console.log('🖥️  Testing Frontend Payment Flow');
  console.log('=' .repeat(50));
  
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

  try {
    console.log('🚀 Submitting checkout form...');
    
    const response = await fetch(`${API_BASE}/api/netopia/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(frontendFormData),
    });

    const result = await response.json();
    
    console.log('📊 Server Response:');
    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${response.ok ? '✅' : '❌'}`);
    console.log('');

    if (result.redirectUrl) {
      console.log('✅ Checkout Successful!');
      console.log('🔗 Payment URL:', result.redirectUrl);
      console.log('📋 Order ID:', result.orderID);
      console.log('');
      
      console.log('🎯 Complete the payment flow:');
      console.log('1. 🌐 Open the payment URL in your browser');
      console.log('2. 💳 Use test card: 4111111111111111');
      console.log('3. 📅 Expiry: 12/25, CVV: 123');
      console.log('4. ✅ Complete payment');
      console.log('5. 👀 Watch server logs for IPN notifications');
      console.log('');
      
      // Open the payment URL automatically
      console.log('🚀 Opening payment page...');
      const { exec } = require('child_process');
      exec(`open "${result.redirectUrl}"`);
      
    } else {
      console.log('❌ Checkout Failed');
      console.log('Error:', JSON.stringify(result, null, 2));
    }

  } catch (error) {
    console.error('❌ Frontend flow test failed:', error.message);
  }
}

async function monitorServerLogs() {
  console.log('👀 Monitoring server for payment updates...');
  console.log('   (Press Ctrl+C to stop monitoring)');
  console.log('');
  
  // This would typically be done by watching the server logs
  // For now, we'll just provide instructions
  console.log('💡 To monitor real-time server logs:');
  console.log('   Watch the terminal where you ran "npm run dev"');
  console.log('   Look for:');
  console.log('   - "Payment start request received"');
  console.log('   - "NETOPIA API Response"');
  console.log('   - "IPN received" (after payment completion)');
  console.log('   - "Payment approved for order"');
}

async function main() {
  await testFrontendFlow();
  console.log('');
  await monitorServerLogs();
}

main().catch(console.error);
