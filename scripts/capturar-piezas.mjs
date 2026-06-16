// Captura piezas apiladas (historias/carrusel/posts) a PNG exactos vía CDP.
// Uso: node scripts/capturar-piezas.mjs <url> <count> <width> <height> <outDir> <prefix>
// Requiere Chrome headless con --remote-debugging-port=9222 ya corriendo.
import { writeFileSync, mkdirSync } from 'node:fs';

const [url, countS, widthS, heightS, outDir, prefix] = process.argv.slice(2);
const count = parseInt(countS, 10);
const width = parseInt(widthS, 10);
const height = parseInt(heightS, 10);
const PORT = process.env.CDP_PORT || '9222';

async function main() {
  let targets;
  for (let i = 0; i < 40; i++) {
    try { targets = await (await fetch(`http://localhost:${PORT}/json`)).json();
      if (targets.some(t => t.type === 'page')) break; } catch {}
    await new Promise(r => setTimeout(r, 200));
  }
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0; const pending = new Map(); const events = {};
  const send = (method, params = {}) => new Promise(res => { const mid = ++id; pending.set(mid, res); ws.send(JSON.stringify({ id: mid, method, params })); });
  const once = (name) => new Promise(res => { events[name] = res; });
  await new Promise(res => ws.addEventListener('open', res));
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
    if (m.method && events[m.method]) { const cb = events[m.method]; delete events[m.method]; cb(m.params); }
  });

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  const loaded = once('Page.loadEventFired');
  await send('Page.navigate', { url });
  await loaded;

  // Esperar fuentes + todas las imágenes decodificadas antes de capturar.
  const ready = await send('Runtime.evaluate', {
    expression: `(async () => {
      // Sacar la barra de dev de Astro (position:fixed) que se cuela en el recorte.
      document.querySelector('astro-dev-toolbar')?.remove();
      // Forzar carga de imágenes lazy (la hoja es muy alta) y esperar fuentes.
      document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
      await document.fonts.ready;
      const imgs = [...document.images];
      const allLoaded = Promise.all(imgs.map(i => i.complete && i.naturalWidth ? 1 : new Promise(r => { i.onload = i.onerror = r; })));
      // timeout de seguridad: nunca colgar más de 20s esperando imágenes.
      await Promise.race([allLoaded, new Promise(r => setTimeout(r, 20000))]);
      await new Promise(r => setTimeout(r, 400));
      return imgs.filter(i => i.complete && i.naturalWidth).length + '/' + imgs.length + ' imgs ok';
    })()`,
    awaitPromise: true, returnByValue: true,
  });
  console.log('frames en la hoja:', ready.result.value, '| capturando', count);

  mkdirSync(outDir, { recursive: true });
  for (let i = 0; i < count; i++) {
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
      clip: { x: 0, y: i * height, width, height, scale: 1 },
    });
    const file = `${outDir}/${prefix}-${i + 1}.png`;
    writeFileSync(file, Buffer.from(shot.data, 'base64'));
    console.log('  ✓', file);
  }
  ws.close();
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
