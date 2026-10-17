import WebSocket from 'ws';
import http from 'http';
import { spawn } from 'child_process';

async function test() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9238',
    '--window-size=1280,720',
    '--disable-gpu-sandbox',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    'http://localhost:3005'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  http.get('http://127.0.0.1:9238/json', (res) => {
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

        const res = await send('Runtime.evaluate', {
          expression: `(() => {
            const THREE = window.THREE;
            const sc = window.planetScene;
            const colliders = sc.physicsLoop.getColliders();
            const col = colliders[0];
            if (!col) return 'No collider';

            const pts = [
              new THREE.Vector3(5.81095, 5.80205, 25.7794),
              new THREE.Vector3(13.9316, 19.3062, 8.38147),
              new THREE.Vector3(26.25, 9.71, 1.40), // office worker
            ];

            const results = pts.map(p => {
              const up = p.clone().normalize();
              const origin = p.clone().addScaledVector(up, 2.0);
              const ray = new THREE.Raycaster(origin, up.clone().negate(), 0, 10);
              const hits = ray.intersectObject(col, true);
              return {
                target: [p.x, p.y, p.z],
                hits: hits.map(h => ({
                  point: [h.point.x, h.point.y, h.point.z],
                  dist: h.distance,
                  radius: h.point.length()
                }))
              };
            });

            return results;
          })()`,
          returnByValue: true
        });

        console.log('Spawn Points Test:', JSON.stringify(res.result.value, null, 2));

        ws.close();
        chrome.kill();
        process.exit(0);
      });
    });
  });
}

test().catch(console.error);
