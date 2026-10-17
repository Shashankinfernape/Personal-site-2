import { spawn } from 'child_process';
import http from 'http';
import WebSocket from 'ws';

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9234', '--disable-gpu-sandbox', '--enable-webgl', '--ignore-gpu-blocklist', 'http://localhost:3005'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  http.get('http://127.0.0.1:9234/json', res => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', async () => {
      const targets = JSON.parse(raw);
      const page = targets.find(t => t.type === 'page');
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      ws.on('open', async () => {
        let id = 1;
        const send = (method, params = {}) => new Promise(resolve => {
          const mId = id++;
          const handler = d => {
            const r = JSON.parse(d.toString());
            if (r.id === mId) { ws.off('message', handler); resolve(r.result); }
          };
          ws.on('message', handler);
          ws.send(JSON.stringify({ id: mId, method, params }));
        });
        await send('Runtime.enable');
        await new Promise(r => setTimeout(r, 2000));

        const res = await send('Runtime.evaluate', {
          expression: `(() => {
            const geom = window.planetScene?.introPlanetGroup?.children[0]?.geometry;
            const elem = geom?.attributes?.elementId;
            return {
              constructorName: elem?.array?.constructor?.name,
              itemSize: elem?.itemSize,
              isInteger: elem?.array instanceof Int8Array || elem?.array instanceof Int16Array || elem?.array instanceof Int32Array || elem?.array instanceof Uint8Array || elem?.array instanceof Uint16Array || elem?.array instanceof Uint32Array
            };
          })()`,
          returnByValue: true
        });

        console.log('elementId Type Info:', JSON.stringify(res?.result?.value, null, 2));

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
