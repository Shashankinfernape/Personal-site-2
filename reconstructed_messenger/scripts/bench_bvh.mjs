import WebSocket from 'ws';
import http from 'http';
import { spawn } from 'child_process';

async function test() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9242',
    '--window-size=1280,720',
    '--disable-gpu-sandbox',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    'http://localhost:3005'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  http.get('http://127.0.0.1:9242/json', (res) => {
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
        await new Promise(r => setTimeout(r, 3000));
        await send('Runtime.evaluate', {
          expression: 'document.querySelector(".begin-btn")?.click()'
        });
        await new Promise(r => setTimeout(r, 2000));

        const timings = await send('Runtime.evaluate', {
          expression: `(() => {
            const sc = window.planetScene;
            const primary = sc.physicsLoop.getColliders()[0];
            const bvh = primary.geometry.boundsTree;
            const ctrl = sc.physicsLoop.controller;
            const ray = new window.THREE.Raycaster(ctrl.position.clone().add(new window.THREE.Vector3(0,1,0)), new window.THREE.Vector3(0,-1,0), 0, 2);

            // Test 1: raycast without acceleratedRaycast
            const t0 = performance.now();
            for (let i = 0; i < 10; i++) ray.intersectObject(primary, true);
            const t1 = performance.now();

            // Test 2: shapecast
            const box = new window.THREE.Box3().setFromCenterAndSize(ctrl.position, new window.THREE.Vector3(1, 2, 1));
            const p1 = new window.THREE.Vector3();
            const p2 = new window.THREE.Vector3();
            const seg = new window.THREE.Line3(ctrl.position, ctrl.position.clone().add(new window.THREE.Vector3(0, 1.7, 0)));
            const t2 = performance.now();
            for (let i = 0; i < 10; i++) {
              bvh.shapecast({
                intersectsBounds: b => b.intersectsBox(box),
                intersectsTriangle: tri => {
                  tri.closestPointToSegment(seg, p1, p2);
                  return false;
                }
              });
            }
            const t3 = performance.now();

            return {
              rawRaycast10xMs: (t1 - t0).toFixed(2),
              shapecast10xMs: (t3 - t2).toFixed(2)
            };
          })()`,
          returnByValue: true
        });

        console.log('Raycast vs Shapecast Timings:', timings.result.value);

        ws.close();
        chrome.kill();
        process.exit(0);
      });
    });
  });
}

test().catch(console.error);
