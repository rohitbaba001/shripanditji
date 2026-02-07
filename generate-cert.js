// Generate self-signed certificate for development
const { execSync } = require('child_process');
const fs = require('fs');

console.log('Generating self-signed SSL certificate for development...');

// Check if certificates already exist
if (fs.existsSync('cert.pem') && fs.existsSync('key.pem')) {
  console.log('✅ Certificates already exist!');
  console.log('   - cert.pem');
  console.log('   - key.pem');
  process.exit(0);
}

// Try to use openssl if available
try {
  execSync(
    'openssl req -newkey rsa:2048 -new -nodes -x509 -days 365 -keyout key.pem -out cert.pem -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"',
    { stdio: 'inherit' }
  );
  console.log('✅ Certificates generated successfully!');
  console.log('   - cert.pem');
  console.log('   - key.pem');
} catch (error) {
  console.log('❌ OpenSSL not found. Creating basic certificates...');
  
  // Create basic self-signed certificate using Node.js crypto
  const crypto = require('crypto');
  const { pki } = require('node-forge');
  
  try {
    // Generate a keypair
    console.log('Generating RSA keypair...');
    const keys = pki.rsa.generateKeyPair(2048);
    
    // Create a certificate
    console.log('Creating certificate...');
    const cert = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    
    const attrs = [{
      name: 'commonName',
      value: 'localhost'
    }, {
      name: 'countryName',
      value: 'US'
    }, {
      shortName: 'ST',
      value: 'State'
    }, {
      name: 'localityName',
      value: 'City'
    }, {
      name: 'organizationName',
      value: 'Organization'
    }];
    
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.setExtensions([{
      name: 'basicConstraints',
      cA: true
    }, {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    }, {
      name: 'subjectAltName',
      altNames: [{
        type: 2, // DNS
        value: 'localhost'
      }, {
        type: 7, // IP
        ip: '127.0.0.1'
      }]
    }]);
    
    // Self-sign certificate
    cert.sign(keys.privateKey);
    
    // Convert to PEM format
    const pemCert = pki.certificateToPem(cert);
    const pemKey = pki.privateKeyToPem(keys.privateKey);
    
    // Write to files
    fs.writeFileSync('cert.pem', pemCert);
    fs.writeFileSync('key.pem', pemKey);
    
    console.log('✅ Certificates generated successfully!');
    console.log('   - cert.pem');
    console.log('   - key.pem');
  } catch (forgeError) {
    console.log('❌ node-forge not installed. Installing...');
    console.log('Run: npm install node-forge');
    console.log('Then run: node generate-cert.js');
    process.exit(1);
  }
}

console.log('\n📝 Note: These are self-signed certificates for development only.');
console.log('   Your browser will show a security warning - this is normal.');
console.log('   Click "Advanced" and "Proceed to localhost" to continue.');
console.log('\n🚀 Now you can run: npm run dev');
