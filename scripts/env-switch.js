#!/usr/bin/env node

/**
 * Environment Switcher Script
 * Usage: node scripts/env-switch.js [development|test|production]
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

const environments = {
  development: {
    file: '.env',
    description: 'Development environment (local development)',
    port: 3001,
    database: 'data.sqlite'
  },
  test: {
    file: '.env.test',
    description: 'Test environment (testing & QA)',
    port: 3002,
    database: 'test.sqlite'
  },
  production: {
    file: '.env.prod',
    description: 'Production environment (live deployment)',
    port: 3003,
    database: 'production.sqlite'
  }
};

function showUsage() {
  console.log('\n🌍 Environment Switcher');
  console.log('========================\n');
  
  console.log('Usage: node scripts/env-switch.js [environment]\n');
  
  console.log('Available environments:');
  Object.entries(environments).forEach(([env, config]) => {
    const exists = fs.existsSync(path.join(projectRoot, 'server', config.file));
    const status = exists ? '✅' : '❌';
    console.log(`  ${env.padEnd(12)} ${status} ${config.description}`);
    console.log(`  ${' '.repeat(15)} Port: ${config.port}, DB: ${config.database}`);
  });
  
  console.log('\nExamples:');
  console.log('  node scripts/env-switch.js development');
  console.log('  node scripts/env-switch.js test');
  console.log('  node scripts/env-switch.js production');
  console.log('');
}

function switchEnvironment(targetEnv) {
  if (!environments[targetEnv]) {
    console.error(`❌ Invalid environment: ${targetEnv}`);
    showUsage();
    process.exit(1);
  }

  const config = environments[targetEnv];
  const envFilePath = path.join(projectRoot, 'server', config.file);
  
  if (!fs.existsSync(envFilePath)) {
    console.error(`❌ Environment file not found: ${config.file}`);
    console.log(`   Please create the file: server/${config.file}`);
    process.exit(1);
  }

  console.log(`\n🔄 Switching to ${targetEnv} environment...`);
  console.log(`📁 Config file: ${config.file}`);
  console.log(`🚀 Port: ${config.port}`);
  console.log(`📊 Database: ${config.database}`);
  console.log(`📝 Description: ${config.description}\n`);

  // Set NODE_ENV and start the server
  process.env.NODE_ENV = targetEnv;
  
  console.log(`✅ Environment set to: ${targetEnv}`);
  const npmScript = targetEnv === 'production' ? 'env:prod' : `env:${targetEnv}`;
  console.log(`💡 You can now run: cd server && npm run ${npmScript}`);
  console.log(`💡 Or use: NODE_ENV=${targetEnv} node server/server.js\n`);
}

function checkEnvironmentFiles() {
  console.log('\n📋 Environment Files Status:');
  console.log('============================\n');
  
  Object.entries(environments).forEach(([env, config]) => {
    const filePath = path.join(projectRoot, 'server', config.file);
    const exists = fs.existsSync(filePath);
    const status = exists ? '✅ EXISTS' : '❌ MISSING';
    
    console.log(`${env.padEnd(12)} ${status.padEnd(10)} server/${config.file}`);
    
    if (exists) {
      try {
        const stats = fs.statSync(filePath);
        const size = (stats.size / 1024).toFixed(1);
        const modified = stats.mtime.toLocaleDateString();
        console.log(`${' '.repeat(23)} Size: ${size}KB, Modified: ${modified}`);
      } catch (error) {
        console.log(`${' '.repeat(23)} Error reading file stats`);
      }
    }
  });
  console.log('');
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  showUsage();
  checkEnvironmentFiles();
} else if (args[0] === '--check' || args[0] === '-c') {
  checkEnvironmentFiles();
} else {
  switchEnvironment(args[0]);
}
