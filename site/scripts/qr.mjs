// Genera el QR del sitio (PNG alta-res + SVG) y VERIFICA el decode.
// Correr desde site/: node scripts/qr.mjs [url] [outDir]
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'node:fs';

const URL = process.argv[2] || 'https://loft-bahia.netlify.app';
const OUT = process.argv[3] || '../pieces/qr';
mkdirSync(OUT, { recursive: true });

const opts = { margin: 2, color: { dark: '#211E18', light: '#FBF6EC' } };
await QRCode.toFile(`${OUT}/qr.png`, URL, { ...opts, width: 1024 });
writeFileSync(`${OUT}/qr.svg`, await QRCode.toString(URL, { type: 'svg', ...opts }));

// Verificación: decodificar el PNG generado y confirmar que apunta a la URL.
const { data, info } = await sharp(`${OUT}/qr.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const decoded = jsQR(new Uint8ClampedArray(data), info.width, info.height);
if (!decoded || decoded.data !== URL) {
  console.error('✗ FALLO decode:', decoded ? decoded.data : 'null', '!=', URL);
  process.exit(1);
}
console.log(`✓ QR -> ${URL} | decode verificado | ${OUT}/qr.png + qr.svg`);
