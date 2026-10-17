import { spawn } from 'child_process';
import http from 'http';
import WebSocket from 'ws';

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9232', '--disable-gpu-sandbox', '--enable-webgl', '--ignore-gpu-blocklist', 'http://localhost:3005'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  http.get('http://127.0.0.1:9232/json', res => {
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
        await new Promise(r => setTimeout(r, 3000));

        const res = await send('Runtime.evaluate', {
          expression: `(() => {
            const introMesh = window.planetScene?.introPlanetGroup?.children[0];
            const geom = introMesh?.geometry;
            const uvs = geom?.attributes?.uv;
            const elem = geom?.attributes?.elementId;
            const tex = introMesh?.material?.map;
            const img = tex?.image;
            if (!img) return { error: 'No image' };

            // Create canvas to read atlas pixels
            const c = document.createElement('canvas');
            c.width = 16;
            c.height = 16;
            const ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const idata = ctx.getImageData(0, 0, 16, 16).data;

            const colorHistogram = {};

            for (let i = 0; i < geom.attributes.position.count; i++) {
              const e = elem.getX(i);
              if (e === 0) { // Manmade
                const u = Math.max(0, Math.min(0.9999, uvs.getX(i)));
                const v = Math.max(0, Math.min(0.9999, uvs.getY(i)));
                const px = Math.floor(u * 16);
                // Three.js flipY=true means v=1 -> row 0, v=0 -> row 15
                const py = Math.floor((1.0 - v) * 16);
                const idx = (py * 16 + px) * 4;
                const hex = '#' + ((1 << 24) + (idata[idx] << 16) + (idata[idx+1] << 8) + idata[idx+2]).toString(16).slice(1);
                colorHistogram[hex] = (colorHistogram[hex] || 0) + 1;
              }
            }

            return {
              totalManmadeVerts: 72083,
              histogram: colorHistogram
            };
          })()`,
          returnByValue: true
        });

        console.log('Sampled Colors Histogram:', JSON.stringify(res?.result?.value, null, 2));

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
