// reconstructed_messenger/scripts/capture.js
import WebSocket from 'ws';
import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=1280,720',
    '--disable-gpu-sandbox',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    'http://localhost:3005'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  http.get('http://127.0.0.1:9222/json', (res) => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', async () => {
      const targets = JSON.parse(raw);
      const page = targets.find(t => t.type === 'page' && t.url.includes('3005'));
      if (!page) {
        console.error('No page target found');
        chrome.kill();
        process.exit(1);
      }

      console.log('Connecting to page ws:', page.webSocketDebuggerUrl);
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
        console.log('WS connected! Enabling domains...');
        await send('Page.enable');
        await send('Runtime.enable');

        ws.on('message', (d) => {
          const m = JSON.parse(d.toString());
          if (m.method === 'Runtime.consoleAPICalled') {
            console.log('[Browser Console]', ...m.params.args.map(a => a.value || a.description));
          }
          if (m.method === 'Runtime.exceptionThrown') {
            console.error('[Browser Exception]', m.params.exceptionDetails.text, m.params.exceptionDetails.exception?.description);
          }
        });

        console.log('Waiting for scene to mount...');
        await new Promise(r => setTimeout(r, 3000));

        const baseBBoxRes = await send('Runtime.evaluate', {
          expression: 'JSON.stringify({ base: window.avatarBaseMesh?.geometry?.boundingBox, top: window.avatarTopMesh?.geometry?.boundingBox })',
          returnByValue: true
        });
        console.log('EVAL BBOX:', baseBBoxRes?.result?.value);

        // Click BEGIN DELIVERY button
        console.log('Clicking BEGIN DELIVERY...');
        await send('Runtime.evaluate', {
          expression: 'document.querySelector(".begin-btn") ? document.querySelector(".begin-btn").click() : null'
        });

        await new Promise(r => setTimeout(r, 2000));

        const posBefore = await send('Runtime.evaluate', {
          expression: 'JSON.stringify(window.planetScene?.characterState?.position)',
          returnByValue: true
        });
        console.log('Position BEFORE W:', posBefore?.result?.value);

        // Press and hold W key for 2 seconds
        console.log('Dispatching KeyW keydown...');
        await send('Input.dispatchKeyEvent', {
          type: 'rawKeyDown',
          code: 'KeyW',
          key: 'w',
          windowsVirtualKeyCode: 87
        });

        await new Promise(r => setTimeout(r, 800));

        const posDuring = await send('Runtime.evaluate', {
          expression: 'JSON.stringify({ pos: window.planetScene?.characterState?.position, walkPhase: window.planetScene?.physicsLoop?.controller?.walkPhase, speed: window.planetScene?.physicsLoop?.controller?.speedRatio })',
          returnByValue: true
        });
        console.log('State DURING W:', posDuring?.result?.value);

        await send('Input.dispatchKeyEvent', {
          type: 'keyUp',
          code: 'KeyW',
          key: 'w',
          windowsVirtualKeyCode: 87
        });

        // Capture screenshot
        console.log('Capturing screenshot...');
        const shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('public/live_gameplay_fixed.png', Buffer.from(shot.data, 'base64'));
        console.log('Screenshot saved to public/live_gameplay_fixed.png! Size:', fs.statSync('public/live_gameplay_fixed.png').size);

        ws.close();
        chrome.kill();
        process.exit(0);
      });
    });
  });
}

run().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
