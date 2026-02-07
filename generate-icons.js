// Icon generation script for Shri Pandit Ji PWA
// This script creates placeholder icons in various sizes
// For production, replace with actual branded graphics

const fs = require('fs');
const path = require('path');

// Simple SVG template for the icon
// Using "ॐ" (Om symbol) as the spiritual icon
const createSVG = (size, isMaskable = false) => {
  const padding = isMaskable ? size * 0.2 : 0; // 20% padding for maskable icons
  const contentSize = size - (padding * 2);
  const fontSize = contentSize * 0.6;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#FF6B35"/>
  <text x="${size/2}" y="${size/2 + fontSize/3}" 
        font-family="Arial, sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold"
        fill="#FFFFFF" 
        text-anchor="middle">ॐ</text>
</svg>`;
};

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon configurations
const icons = [
  { name: 'icon-16x16.svg', size: 16, maskable: false },
  { name: 'icon-32x32.svg', size: 32, maskable: false },
  { name: 'icon-48x48.svg', size: 48, maskable: false },
  { name: 'icon-180x180.svg', size: 180, maskable: false }, // Apple touch icon
  { name: 'icon-192x192.svg', size: 192, maskable: false },
  { name: 'icon-512x512.svg', size: 512, maskable: false },
  { name: 'icon-192x192-maskable.svg', size: 192, maskable: true },
  { name: 'icon-512x512-maskable.svg', size: 512, maskable: true },
];

// Generate all icons
icons.forEach(icon => {
  const svg = createSVG(icon.size, icon.maskable);
  const filePath = path.join(iconsDir, icon.name);
  fs.writeFileSync(filePath, svg);
  console.log(`Created: ${icon.name}`);
});

console.log('\nAll icons generated successfully!');
console.log('Note: These are placeholder SVG icons. For production, use PNG format with actual branded graphics.');
