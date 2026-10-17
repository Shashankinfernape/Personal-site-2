import WebSocket from 'ws';
import http from 'http';
import { spawn } from 'child_process';

async function measure() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9240',
    '--window-size=1280,720',
    '--disable-gpu-sandbox',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    'http://localhost:3005'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  http.get('http://127.0.0.1:9240/json', (res) => {
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

        // Inject high-precision profiling into the render loop for 100 frames
        const profile = await send('Runtime.evaluate', {
          expression: `new Promise((resolve) => {
            const frameDeltas = [];
            const updateTimes = [];
            const renderTimes = [];
            let count = 0;
            const maxFrames = 100;

            const origUpdate = window.planetScene.update.bind(window.planetScene);
            const origRender = window.engineRenderer.render.bind(window.engineRenderer);

            let lastNow = performance.now();

            window.planetScene.update = function(...args) {
              const t0 = performance.now();
              const res = origUpdate(...args);
              updateTimes.push(performance.now() - t0);
              return res;
            };

            window.engineRenderer.render = function(...args) {
              const t0 = performance.now();
              const res = origRender(...args);
              renderTimes.push(performance.now() - t0);
              return res;
            };

            function step(now) {
              frameDeltas.push(now - lastNow);
              lastNow = now;
              count++;
              if (count >= maxFrames) {
                // Restore originals
                window.planetScene.update = origUpdate;
                window.engineRenderer.render = origRender;

                const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
                const max = arr => Math.max(...arr);
                const min = arr => Math.min(...arr);

                resolve({
                  framesMeasured: count,
                  frameIntervalMs: {
                    avg: avg(frameDeltas).toFixed(2),
                    min: min(frameDeltas).toFixed(2),
                    max: max(frameDeltas).toFixed(2),
                    fps: (1000 / avg(frameDeltas)).toFixed(1)
                  },
                  updateTimeMs: {
                    avg: avg(updateTimes).toFixed(2),
                    min: min(updateTimes).toFixed(2),
                    max: max(updateTimes).toFixed(2)
                  },
                  renderTimeMs: {
                    avg: avg(renderTimes).toFixed(2),
                    min: min(renderTimes).toFixed(2),
                    max: max(renderTimes).toFixed(2)
                  }
                });
              } else {
                requestAnimationFrame(step);
              }
            }
            requestAnimationFrame(step);
          })`,
          awaitPromise: true,
          returnByValue: true
        });

        console.log('Frame Profiling Results:', JSON.stringify(profile.result.value, null, 2));

        ws.close();
        chrome.kill();
        process.exit(0);
      });
    });
  });
}

measure().catch(console.error);
