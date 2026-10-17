import WebSocket from 'ws';
import http from 'http';
import { spawn } from 'child_process';

async function measure() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9239',
    '--window-size=1280,720',
    '--disable-gpu-sandbox',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    'http://localhost:3005'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  http.get('http://127.0.0.1:9239/json', (res) => {
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

        const perfData = await send('Runtime.evaluate', {
          expression: `(() => {
            const sc = window.planetScene;
            const renderer = window.engineRenderer?.renderer;
            
            // Check GPU info
            const gl = renderer?.getContext();
            let gpuVendor = 'Unknown';
            let gpuRenderer = 'Unknown';
            if (gl) {
              const dbg = gl.getExtension('WEBGL_debug_renderer_info');
              if (dbg) {
                gpuVendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL);
                gpuRenderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL);
              }
            }

            // Check render info
            const renderInfo = renderer?.info?.render;
            const memoryInfo = renderer?.info?.memory;

            return {
              gpuVendor,
              gpuRenderer,
              pixelRatio: renderer?.getPixelRatio(),
              size: renderer ? [renderer.domElement.width, renderer.domElement.height] : null,
              render: renderInfo ? {
                calls: renderInfo.calls,
                triangles: renderInfo.triangles,
                points: renderInfo.points,
                lines: renderInfo.lines
              } : null,
              memory: memoryInfo ? {
                geometries: memoryInfo.geometries,
                textures: memoryInfo.textures
              } : null
            };
          })()`,
          returnByValue: true
        });

        console.log('Performance Diagnostics:', JSON.stringify(perfData.result.value, null, 2));

        ws.close();
        chrome.kill();
        process.exit(0);
      });
    });
  });
}

measure().catch(console.error);
