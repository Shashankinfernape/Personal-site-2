// scripts/test-decode.mjs
import { spawn } from 'child_process';
import http from 'http';
import WebSocket from 'ws';

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9223', '--disable-gpu-sandbox', '--enable-webgl', '--ignore-gpu-blocklist', 'http://localhost:3005'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  http.get('http://127.0.0.1:9223/json', res => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', async () => {
      const targets = JSON.parse(raw);
      const page = targets.find(t => t.type === 'page' && t.url.includes('3005'));
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      ws.on('open', async () => {
        let id = 1;
        const send = (method, params = {}) => new Promise(res => {
          const mId = id++;
          const handler = d => {
            const r = JSON.parse(d.toString());
            if (r.id === mId) { ws.off('message', handler); res(r.result); }
          };
          ws.on('message', handler);
          ws.send(JSON.stringify({ id: mId, method, params }));
        });
        await send('Runtime.enable');
        await new Promise(r => setTimeout(r, 3000));

        const evalRes = await send('Runtime.evaluate', {
          expression: `window.planetScene.assetManager.loadDracoGeometry('geometries/npcs/present/alien/alien-bones.drc').then(g => {
            const r = { keys: Object.keys(g.attributes) };
            for (const k of r.keys) {
              r[k] = { count: g.attributes[k].count, itemSize: g.attributes[k].itemSize };
            }
            return r;
          })`,
          awaitPromise: true,
          returnByValue: true
        });
        console.log('Alien bones decoded attributes:', JSON.stringify(evalRes?.result?.value, null, 2));

        const evalAlien = await send('Runtime.evaluate', {
          expression: `window.planetScene.assetManager.loadDracoGeometry('geometries/npcs/present/alien/alien.drc').then(g => {
            const r = { keys: Object.keys(g.attributes) };
            for (const k of r.keys) {
              r[k] = { count: g.attributes[k].count, itemSize: g.attributes[k].itemSize };
            }
            return r;
          })`,
          awaitPromise: true,
          returnByValue: true
        });
        console.log('Alien mesh decoded attributes:', JSON.stringify(evalAlien?.result?.value, null, 2));

        ws.close();
        chrome.kill();
        process.exit(0);
      });
    });
  });
}

test().catch(e => {
  console.error(e);
  process.exit(1);
});
