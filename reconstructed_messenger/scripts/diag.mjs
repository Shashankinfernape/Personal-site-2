import { spawn } from 'child_process';
import http from 'http';
import WebSocket from 'ws';

async function diag() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9226', '--disable-gpu-sandbox', '--enable-webgl', '--ignore-gpu-blocklist', 'http://localhost:3005'
  ]);
  await new Promise(r => setTimeout(r, 2500));

  http.get('http://127.0.0.1:9226/json', (res) => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', async () => {
      const page = JSON.parse(raw).find(t => t.type === 'page' && t.url.includes('3005'));
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      let id = 1;
      const send = (m, p = {}) => new Promise((resolve) => {
        const mId = id++;
        const handler = (d) => {
          const r = JSON.parse(d.toString());
          if (r.id === mId) {
            ws.off('message', handler);
            resolve(r.result);
          }
        };
        ws.on('message', handler);
        ws.send(JSON.stringify({ id: mId, method: m, params: p }));
      });

      ws.on('open', async () => {
        await send('Runtime.enable');
        await new Promise(r => setTimeout(r, 4000));
        await send('Runtime.evaluate', { expression: 'document.querySelector(".begin-btn")?.click()' });
        await new Promise(r => setTimeout(r, 2000));

        const res = await send('Runtime.evaluate', {
          expression: `(() => {
            const ps = window.planetScene;
            const geom = ps.introPlanetGroup.children[0]?.geometry;
            if (!geom) return null;
            const uvs = geom.attributes.uv;
            const elem = geom.attributes.elementId;
            let minU0 = 1, maxU0 = 0, minV0 = 1, maxV0 = 0;
            let minU1 = 1, maxU1 = 0, minV1 = 1, maxV1 = 0;
            const samples0 = [];
            const samples1 = [];

            for (let i = 0; i < geom.attributes.position.count; i++) {
              const u = uvs.getX(i);
              const v = uvs.getY(i);
              const e = elem ? elem.getX(i) : 1;
              if (e === 0) {
                if (u < minU0) minU0 = u;
                if (u > maxU0) maxU0 = u;
                if (v < minV0) minV0 = v;
                if (v > maxV0) maxV0 = v;
                if (samples0.length < 15 && Math.random() < 0.05) samples0.push([+u.toFixed(4), +v.toFixed(4)]);
              } else {
                if (u < minU1) minU1 = u;
                if (u > maxU1) maxU1 = u;
                if (v < minV1) minV1 = v;
                if (v > maxV1) maxV1 = v;
                if (samples1.length < 15 && Math.random() < 0.05) samples1.push([+u.toFixed(4), +v.toFixed(4)]);
              }
            }
            return {
              buildings: { minU: minU0, maxU: maxU0, minV: minV0, maxV: maxV0, samples: samples0 },
              terrain: { minU: minU1, maxU: maxU1, minV: minV1, maxV: maxV1, samples: samples1 }
            };
          })()`,
          returnByValue: true
        });
        console.log('Scene Diagnostic:', JSON.stringify(res?.result?.value, null, 2));

        ws.close();
        chrome.kill();
        process.exit(0);
      });
    });
  });
}

diag().catch(e => { console.error(e); process.exit(1); });
