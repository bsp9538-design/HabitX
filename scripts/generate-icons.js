import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Crisp Habitix vector icon SVG (Bold, Structured, Neo-productivity style)
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="64" fill="#243B53" />
  
  <!-- Shadow of the inner card -->
  <rect x="76" y="76" width="380" height="380" rx="32" fill="#F6D97A" />
  
  <!-- Inner White Card with Dark Border -->
  <rect x="64" y="64" width="380" height="380" rx="32" fill="#FFFFFF" stroke="#243B53" stroke-width="20" />
  
  <!-- Habitix 'H' mark with integrated checkmark in Teal -->
  <!-- Left pillar -->
  <rect x="136" y="140" width="52" height="232" rx="12" fill="#243B53" />
  
  <!-- Right pillar -->
  <rect x="324" y="140" width="52" height="232" rx="12" fill="#243B53" />
  
  <!-- Horizontal connector with Teal badge -->
  <rect x="156" y="232" width="200" height="48" rx="8" fill="#62B6B7" stroke="#243B53" stroke-width="8" />
  
  <!-- Teal & Yellow Accent Checkmark badge -->
  <circle cx="256" cy="256" r="44" fill="#62B6B7" stroke="#243B53" stroke-width="8" />
  <path d="M236 256 L249 269 L278 238" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
  
  <!-- Small bottom-right spark -->
  <circle cx="372" cy="120" r="14" fill="#E9786A" stroke="#243B53" stroke-width="6" />
</svg>
`;

const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <!-- Full background for safe zone -->
  <rect width="512" height="512" fill="#243B53" />
  
  <!-- Scaled center icon for maskable safe zone (within 80% circle) -->
  <g transform="translate(51.2, 51.2) scale(0.8)">
    <rect x="76" y="76" width="380" height="380" rx="32" fill="#F6D97A" />
    <rect x="64" y="64" width="380" height="380" rx="32" fill="#FFFFFF" stroke="#243B53" stroke-width="20" />
    <rect x="136" y="140" width="52" height="232" rx="12" fill="#243B53" />
    <rect x="324" y="140" width="52" height="232" rx="12" fill="#243B53" />
    <rect x="156" y="232" width="200" height="48" rx="8" fill="#62B6B7" stroke="#243B53" stroke-width="8" />
    <circle cx="256" cy="256" r="44" fill="#62B6B7" stroke="#243B53" stroke-width="8" />
    <path d="M236 256 L249 269 L278 238" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="372" cy="120" r="14" fill="#E9786A" stroke="#243B53" stroke-width="6" />
  </g>
</svg>
`;

async function generate() {
  const svgBuffer = Buffer.from(svgIcon);
  const maskableBuffer = Buffer.from(maskableSvg);

  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgIcon);

  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  await sharp(maskableBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32x32.png'));

  console.log('Icons generated successfully in /public!');
}

generate().catch(console.error);
