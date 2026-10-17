import WebSocket from 'ws';
import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--window-size=1280,720',
    '--disable-gpu-sandbox',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    'http://localhost:3005'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  http.get('http://127.0.0.1:9225/json', (res) => {
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
        await send('Page.enable');
        await send('Runtime.enable');

        ws.on('message', (d) => {
          const m = JSON.parse(d.toString());
          if (m.method === 'Runtime.consoleAPICalled') {
            console.log('[Console]', ...m.params.args.map(a => a.value || a.description));
          }
        });

        console.log('Waiting 3.5s for intro scene to render...');
        await new Promise(r => setTimeout(r, 3500));

        // 1. Capture intro orbit screenshot
        console.log('Capturing intro screenshot...');
        const introShot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('public/live_intro_color.png', Buffer.from(introShot.data, 'base64'));
        console.log('Saved public/live_intro_color.png (size:', fs.statSync('public/live_intro_color.png').size, ')');

        // 2. Click BEGIN DELIVERY button
        console.log('Clicking BEGIN DELIVERY...');
        await send('Runtime.evaluate', {
          expression: 'document.querySelector(".begin-btn")?.click()'
        });

        console.log('Waiting 3.5s for gameplay world to load and mount...');
        await new Promise(r => setTimeout(r, 3500));

        // 3. Capture gameplay world screenshot
        console.log('Capturing gameplay world screenshot...');
        const worldShot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('public/live_world_color.png', Buffer.from(worldShot.data, 'base64'));
        console.log('Saved public/live_world_color.png (size:', fs.statSync('public/live_world_color.png').size, ')');

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
