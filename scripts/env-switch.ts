#!/usr/bin/env node

/**
 * Environment Switcher Script
 * Usage: npx tsx scripts/env-switch.ts [development|test|production]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface EnvironmentConfig {
  file: string;
  description: string;
  port: number;
  database: string;
}

type Environment = 'development' | 'test' | 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const environments: Record<Environment, EnvironmentConfig> = {
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

function showUsage(): void {
  console.log('\n🌍 Environment Switcher');
  console.log('========================\n');
  
  console.log('Usage: npx tsx scripts/env-switch.ts [environment]\n');
  
  console.log('Available environments:');
  Object.entries(environments).forEach(([env, config]) => {
    const exists = fs.existsSync(path.join(projectRoot, 'server', config.file));
    const status = exists ? '✅' : '❌';
    console.log(`  ${env.padEnd(12)} ${status} ${config.description}`);
    console.log(`  ${' '.repeat(15)} Port: ${config.port}, DB: ${config.database}`);
  });
  
  console.log('\nExamples:');
  console.log('  npx tsx scripts/env-switch.ts development');
  console.log('  npx tsx scripts/env-switch.ts test');
  console.log('  npx tsx scripts/env-switch.ts production');
  console.log('');
}

function switchEnvironment(targetEnv: string): void {
  if (!isValidEnvironment(targetEnv)) {
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

function checkEnvironmentFiles(): void {
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

function isValidEnvironment(env: string): env is Environment {
  return env in environments;
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
