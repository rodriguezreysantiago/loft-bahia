// Navega, scrollea un selector a la vista, espera y captura el viewport (CDP).
// node scripts/shot-el.mjs <url> <selector> <out> [w] [h] [waitMs]
import { writeFileSync } from 'node:fs';
const [URL, SEL, OUT, W = '1366', H = '900', WAIT = '4500'] = process.argv.slice(2);
const PORT = process.env.CDP_PORT || '9222';
async function main() {
  let t; for (let i = 0; i < 40; i++) { try { t = await (await fetch(`http://localhost:${PORT}/json`)).json(); if (t.some(x => x.type === 'page')) break; } catch {} await new Promise(r => setTimeout(r, 200)); }
  const page = t.find(x => x.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0; const pend = new Map(); const ev = {};
  const send = (m, p = {}) => new Promise(res => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
  const once = (n) => new Promise(res => { ev[n] = res; });
  await new Promise(res => ws.addEventListener('open', res));
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); } if (m.method && ev[m.method]) { const c = ev[m.method]; delete ev[m.method]; c(m.params); } });
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: +W, height: +H, deviceScaleFactor: 1, mobile: false });
  const loaded = once('Page.loadEventFired');
  await send('Page.navigate', { url: URL });
  await loaded;
  await send('Runtime.evaluate', { expression: `document.querySelector(${JSON.stringify(SEL)})?.scrollIntoView({block:'center'})` });
  await new Promise(r => setTimeout(r, +WAIT));
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(OUT, Buffer.from(shot.data, 'base64'));
  console.log('OK', OUT);
  ws.close();
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
