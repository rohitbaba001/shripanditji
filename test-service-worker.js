#!/usr/bin/env node

/**
 * Service Worker Test Server
 * Generates SSL certificates and starts HTTPS server for testing
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Service Worker Test Setup\n');

// Check if certificates exist
const certExists = fs.existsSync('cert.pem') && fs.existsSync('key.pem');

if (!certExists) {
  console.log('📜 Generating self-signed SSL certificates...');
  try {
    execSync('npm run generate-cert', { stdio: 'inherit' });
    console.log('✅ Certificates generated successfully\n');
  } catch (error) {
    console.error('❌ Failed to generate certificates');
    console.error('Please run: npm run generate-cert');
    process.exit(1);
  }
} else {
  console.log('✅ SSL certificates already exist\n');
}

console.log('🚀 Starting HTTPS development server...');
console.log('📍 Server will be available at: https://localhost:8443\n');
console.log('⚠️  You will need to accept the self-signed certificate warning in your browser\n');
console.log('📋 Follow the testing guide in SERVICE-WORKER-TEST-GUIDE.md\n');
console.log('Press Ctrl+C to stop the server\n');
console.log('─'.repeat(60));

try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  // Server was stopped by user
  console.log('\n\n✅ Server stopped');
}
