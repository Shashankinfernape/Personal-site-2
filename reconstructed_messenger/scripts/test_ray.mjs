import WebSocket from 'ws';
import http from 'http';
import { spawn } from 'child_process';

async function test() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9237',
    '--window-size=1280,720',
    '--disable-gpu-sandbox',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    'http://localhost:3005'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  http.get('http://127.0.0.1:9237/json', (res) => {
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
        await new Promise(r => setTimeout(r, 4000));

        const res = await send('Runtime.evaluate', {
          expression: `(() => {
            const THREE = window.THREE;
            const sc = window.planetScene;
            const colliders = sc.physicsLoop.getColliders();
            const char = sc.characterState;
            const ctrl = sc.physicsLoop.controller;
            const col = colliders[0];
            
            let rayTest = null;
            if (col) {
              const origin = new THREE.Vector3(-10, 36, 14);
              const up = origin.clone().normalize();
              const ray1 = new THREE.Raycaster(origin.clone().addScaledVector(up, 5), up.clone().negate(), 0, 100);
              const hits1 = ray1.intersectObject(col, true);
              const ray2 = new THREE.Raycaster(up.clone().multiplyScalar(65), up.clone().negate(), 0, 100);
              const hits2 = ray2.intersectObject(col, true);

              col.geometry.computeBoundingBox();
              const bb = col.geometry.boundingBox;
              rayTest = {
                bbox: { min: bb.min, max: bb.max },
                hits1: hits1.map(h => ({ point: [h.point.x, h.point.y, h.point.z], dist: h.distance })),
                hits2: hits2.map(h => ({ point: [h.point.x, h.point.y, h.point.z], dist: h.distance }))
              };
            }

            return {
              collidersCount: colliders.length,
              charPos: [char.position.x, char.position.y, char.position.z],
              ctrlPos: [ctrl.position.x, ctrl.position.y, ctrl.position.z],
              isGrounded: ctrl.isGrounded,
              rayTest
            };
          })()`,
          returnByValue: true
        });

        console.log('Result:', JSON.stringify(res.result.value, null, 2));

        ws.close();
        chrome.kill();
        process.exit(0);
      });
    });
  });
}

test().catch(console.error);
