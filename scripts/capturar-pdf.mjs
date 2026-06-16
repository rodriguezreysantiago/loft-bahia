// Exporta una página (el flyer) a PDF A4 vía CDP Page.printToPDF.
// Uso: node scripts/capturar-pdf.mjs <url> <outFile>
// Requiere Chrome headless con --remote-debugging-port=9222 corriendo.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const [url, outFile] = process.argv.slice(2);
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
  const loaded = once('Page.loadEventFired');
  await send('Page.navigate', { url });
  await loaded;
  await send('Runtime.evaluate', {
    expression: `(async () => {
      document.querySelector('astro-dev-toolbar')?.remove();
      document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
      await document.fonts.ready;
      const imgs = [...document.images];
      await Promise.race([
        Promise.all(imgs.map(i => i.complete && i.naturalWidth ? 1 : new Promise(r => { i.onload = i.onerror = r; }))),
        new Promise(r => setTimeout(r, 20000)),
      ]);
      await new Promise(r => setTimeout(r, 400));
      return true;
    })()`,
    awaitPromise: true, returnByValue: true,
  });

  const pdf = await send('Page.printToPDF', {
    landscape: false,
    printBackground: true,
    paperWidth: 8.27, paperHeight: 11.69, // A4 en pulgadas
    marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
    preferCSSPageSize: true,
    scale: 1,
  });
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, Buffer.from(pdf.data, 'base64'));
  console.log('  ✓', outFile);
  ws.close();
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
