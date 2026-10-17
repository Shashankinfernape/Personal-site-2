import WebSocket from 'ws';
import http from 'http';
import { spawn } from 'child_process';

async function profile() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9241',
    '--window-size=1280,720',
    '--disable-gpu-sandbox',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    'http://localhost:3005'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  http.get('http://127.0.0.1:9241/json', (res) => {
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

        // Click Begin Delivery
        await send('Runtime.evaluate', {
          expression: 'document.querySelector(".begin-btn")?.click()'
        });
        await new Promise(r => setTimeout(r, 2000));

        const breakdown = await send('Runtime.evaluate', {
          expression: `new Promise((resolve) => {
            const sc = window.planetScene;
            const timings = {
              physics: [],
              characterGeom: [],
              npcUpdate: [],
              camCollision: []
            };

            let frames = 0;
            function testFrame() {
              const delta = 0.016;
              const input = { x: 0, y: 1, jump: false, sprint: false };

              // 1. Physics
              const t0 = performance.now();
              sc.physicsLoop.update(delta, sc.characterState, input, sc.camera);
              const t1 = performance.now();
              timings.physics.push(t1 - t0);

              // 2. Character Geom
              const walkPhase = sc.physicsLoop.controller.walkPhase;
              const speedRatio = sc.physicsLoop.controller.speedRatio;
              const isCarrying = !!sc.deliveryItemMesh;
              const airBlend = sc.physicsLoop.controller.airBlend;

              const t2 = performance.now();
              // Note: updateCharacterGeometry is called inside planetScene.update
              // Let's call planetScene.update directly but instrumented
              timings.characterGeom.push(0);

              // 3. NPC Manager
              const t3 = performance.now();
              sc.npcManager.update(sc.characterState.position, delta);
              const t4 = performance.now();
              timings.npcUpdate.push(t4 - t3);

              frames++;
              if (frames < 30) {
                requestAnimationFrame(testFrame);
              } else {
                const avg = arr => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
                resolve({
                  physicsAvgMs: avg(timings.physics),
                  npcUpdateAvgMs: avg(timings.npcUpdate)
                });
              }
            }
            requestAnimationFrame(testFrame);
          })`,
          awaitPromise: true,
          returnByValue: true
        });

        console.log('Breakdown Results:', JSON.stringify(breakdown.result.value, null, 2));

        ws.close();
        chrome.kill();
        process.exit(0);
      });
    });
  });
}

profile().catch(console.error);
