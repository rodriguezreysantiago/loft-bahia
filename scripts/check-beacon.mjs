// Confirma que un request (beacon de analytics) se dispara al cargar la página.
// node scripts/check-beacon.mjs <url> <substringAMatchear>
const [URL, MATCH] = process.argv.slice(2);
const PORT = process.env.CDP_PORT || '9222';
async function main() {
  let t; for (let i = 0; i < 40; i++) { try { t = await (await fetch(`http://localhost:${PORT}/json`)).json(); if (t.some(x => x.type === 'page')) break; } catch {} await new Promise(r => setTimeout(r, 200)); }
  const ws = new WebSocket(t.find(x => x.type === 'page').webSocketDebuggerUrl);
  let id = 0; const pend = new Map();
  const send = (m, p = {}) => new Promise(res => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
  const hits = new Map();
  await new Promise(res => ws.addEventListener('open', res));
  ws.addEventListener('message', e => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); }
    if (m.method === 'Network.requestWillBeSent' && m.params.request.url.includes(MATCH)) hits.set(m.params.requestId, { url: m.params.request.url, status: 'pending' });
    if (m.method === 'Network.responseReceived' && hits.has(m.params.requestId)) hits.get(m.params.requestId).status = m.params.response.status;
  });
  await send('Network.enable');
  await send('Page.enable');
  await send('Page.navigate', { url: URL });
  await new Promise(r => setTimeout(r, 6000));
  if (hits.size === 0) console.log('✗ no se disparó ningún request a', MATCH);
  else for (const h of hits.values()) console.log('beacon ->', h.status, h.url.slice(0, 90));
  ws.close();
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
