import sharp from 'sharp';
import { readFileSync } from 'fs';

// Read the SVG
const svg = readFileSync('./public/mask-icon.svg');

// Generate 192x192
await sharp(svg)
  .resize(192, 192)
  .png()
  .toFile('./public/pwa-192x192.png');

// Generate 512x512
await sharp(svg)
  .resize(512, 512)
  .png()
  .toFile('./public/pwa-512x512.png');

// Generate 180x180 for Apple
await sharp(svg)
  .resize(180, 180)
  .png()
  .toFile('./public/apple-touch-icon.png');

console.log('✓ PWA icons generated successfully!');
