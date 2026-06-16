// Verifica el lightbox manejando el navegador (CDP). Chrome headless con --remote-debugging-port=9222.
// Uso: node scripts/verify-lightbox.mjs <url> <screenshotOut>
import { writeFileSync } from 'node:fs';
const [URL, OUT] = process.argv.slice(2);
const PORT = process.env.CDP_PORT || '9222';

async function main() {
  let targets;
  for (let i = 0; i < 40; i++) { try { targets = await (await fetch(`http://localhost:${PORT}/json`)).json(); if (targets.some(t => t.type === 'page')) break; } catch {} await new Promise(r => setTimeout(r, 200)); }
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0; const pending = new Map(); const events = {};
  const send = (m, p = {}) => new Promise(res => { const mid = ++id; pending.set(mid, res); ws.send(JSON.stringify({ id: mid, method: m, params: p })); });
  const once = (n) => new Promise(res => { events[n] = res; });
  await new Promise(res => ws.addEventListener('open', res));
  ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } if (m.method && events[m.method]) { const cb = events[m.method]; delete events[m.method]; cb(m.params); } });

  const W = parseInt(process.argv[4] || '1280', 10);
  const H = parseInt(process.argv[5] || '800', 10);
  const isMobile = W < 700;
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: isMobile ? 2 : 1, mobile: isMobile });
  const loaded = once('Page.loadEventFired');
  await send('Page.navigate', { url: URL });
  await loaded;
  const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result.value;

  await ev(`document.fonts.ready.then(()=>true)`);
  const total = await ev(`document.querySelectorAll('[data-lightbox]').length`);

  const opened = await ev(`(async()=>{
    const fig = document.querySelector('#galeria [data-lightbox]'); fig.click();
    const lb = document.getElementById('lightbox'); const img = lb.querySelector('.lb-img');
    await new Promise(r => { if (img.complete && img.naturalWidth) return r(); img.onload = img.onerror = r; setTimeout(r, 5000); });
    return JSON.stringify({ open: lb.classList.contains('open'), ariaHidden: lb.getAttribute('aria-hidden'), src: img.currentSrc || img.src, natW: img.naturalWidth, natH: img.naturalHeight, bodyOverflow: getComputedStyle(document.body).overflow });
  })()`);

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(OUT, Buffer.from(shot.data, 'base64'));

  const before = await ev(`document.getElementById('lightbox').querySelector('.lb-img').src`);
  const nextSrc = await ev(`(async()=>{ const lb=document.getElementById('lightbox'); lb.querySelector('.lb-next').click(); const img=lb.querySelector('.lb-img'); await new Promise(r=>{ if(img.complete&&img.naturalWidth) return r(); img.onload=img.onerror=r; setTimeout(r,5000);}); return img.currentSrc||img.src; })()`);

  const afterEsc = await ev(`(()=>{ document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'})); const lb=document.getElementById('lightbox'); return JSON.stringify({ open: lb.classList.contains('open'), bodyOverflow: getComputedStyle(document.body).overflow }); })()`);

  console.log('total_imgs:', total);
  console.log('al_abrir:', opened);
  console.log('next_cambia:', before !== nextSrc, '(', nextSrc.split('/').pop(), ')');
  console.log('tras_ESC:', afterEsc);
  ws.close();
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
