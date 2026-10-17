import WebSocket from 'ws';
import http from 'http';
import { spawn } from 'child_process';

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9227',
    '--window-size=1280,720',
    '--disable-gpu-sandbox',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    'http://localhost:3005'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  http.get('http://127.0.0.1:9227/json', (res) => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', async () => {
      const targets = JSON.parse(raw);
      const page = targets.find(t => t.type === 'page' && t.url.includes('3005'));
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      let id = 1;
      const send = (method, params = {}) => new Promise((resolve) => {
        const msgId = id++;
        const handler = (data) => {
          const resp = JSON.parse(data.toString());
          if (resp.id === msgId) {
            ws.off('message', handler);
            resolve(resp.result);
          }
        };
        ws.on('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });

      ws.on('open', async () => {
        await send('Runtime.enable');
        await new Promise(r => setTimeout(r, 3500));

        const info = await send('Runtime.evaluate', {
          expression: `(() => {
            const ps = window.planetScene;
            if (!ps) return { error: 'No planetScene' };

            const introMesh = ps.introPlanetGroup.children[0];
            const mat = introMesh ? introMesh.material : null;
            const tex = mat ? mat.map : null;

            // Sample some vertices and their attributes
            const geom = introMesh ? introMesh.geometry : null;
            const elemAttr = geom ? geom.attributes.elementId : null;
            const uvAttr = geom ? geom.attributes.uv : null;

            return {
              hasMat: !!mat,
              matType: mat ? mat.type : null,
              matColor: mat ? mat.color.getHexString() : null,
              hasMap: !!tex,
              texImage: tex ? {
                hasImage: !!tex.image,
                width: tex.image ? tex.image.width : 0,
                height: tex.image ? tex.image.height : 0,
                src: tex.image ? tex.image.src : null,
                flipY: tex.flipY
              } : null,
              elemAttr: elemAttr ? {
                count: elemAttr.count,
                itemSize: elemAttr.itemSize,
                first10: Array.from(elemAttr.array.slice(0, 10))
              } : null,
              uvAttr: uvAttr ? {
                count: uvAttr.count,
                itemSize: uvAttr.itemSize,
                first10: Array.from(uvAttr.array.slice(0, 10))
              } : null
            };
          })()`,
          returnByValue: true
        });

        console.log('Intro Mesh Info:', JSON.stringify(info.result.value, null, 2));

        ws.close();
        chrome.kill();
        process.exit(0);
      });
    });
  });
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
