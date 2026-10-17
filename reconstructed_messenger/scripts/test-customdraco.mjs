// scripts/test-customdraco.mjs
import { spawn } from 'child_process';
import http from 'http';
import WebSocket from 'ws';

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9225', '--disable-gpu-sandbox', '--enable-webgl', '--ignore-gpu-blocklist', 'http://localhost:3005'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  http.get('http://127.0.0.1:9225/json', res => {
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
        await new Promise(r => setTimeout(r, 2000));

        const resBones = await send('Runtime.evaluate', {
          expression: `window.planetScene.assetManager.customDracoLoader.loadAsync('/assets/geometries/npcs/present/alien/alien-bones.drc')
            .then(g => ({ success: true, attrs: Object.keys(g.attributes) }))
            .catch(e => ({ error: e.message || String(e) }))`,
          awaitPromise: true,
          returnByValue: true
        });
        console.log('Alien bones result:', JSON.stringify(resBones?.result?.value, null, 2));

        const resAlien = await send('Runtime.evaluate', {
          expression: `window.planetScene.assetManager.customDracoLoader.loadAsync('/assets/geometries/npcs/present/alien/alien.drc')
            .then(g => ({ success: true, attrs: Object.keys(g.attributes) }))
            .catch(e => ({ error: e.message || String(e) }))`,
          awaitPromise: true,
          returnByValue: true
        });
        console.log('Alien mesh result:', JSON.stringify(resAlien?.result?.value, null, 2));

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
