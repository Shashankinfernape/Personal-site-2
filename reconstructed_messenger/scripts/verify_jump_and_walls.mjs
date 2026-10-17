import WebSocket from 'ws';
import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9235',
    '--window-size=1280,720',
    '--disable-gpu-sandbox',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    'http://localhost:3005'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  http.get('http://127.0.0.1:9235/json', (res) => {
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
        await send('Page.enable');
        await send('Runtime.enable');

        console.log('Waiting for intro to load...');
        await new Promise(r => setTimeout(r, 3000));

        // Click BEGIN DELIVERY
        console.log('Clicking BEGIN DELIVERY...');
        await send('Runtime.evaluate', {
          expression: 'document.querySelector(".begin-btn")?.click()'
        });

        console.log('Waiting for world mount & ground snap...');
        await new Promise(r => setTimeout(r, 3000));

        // 1. Measure initial grounded position
        const groundState = await send('Runtime.evaluate', {
          expression: `(() => {
            const ctrl = window.planetScene.physicsLoop.controller;
            return {
              radius: ctrl.currentRadius,
              isGrounded: ctrl.isGrounded,
              airBlend: ctrl.airBlend
            };
          })()`,
          returnByValue: true
        });
        console.log('Ground State:', groundState.result.value);

        // 2. Test Jump & Capture Mid-Air Pose
        console.log('Pressing SPACE to jump...');
        await send('Input.dispatchKeyEvent', {
          type: 'rawKeyDown',
          code: 'Space',
          key: ' ',
          windowsVirtualKeyCode: 32
        });

        // Sample trajectory during jump
        const jumpTrajectory = [];
        for (let i = 0; i < 8; i++) {
          await new Promise(r => setTimeout(r, 50));
          const sample = await send('Runtime.evaluate', {
            expression: `(() => {
              const ctrl = window.planetScene.physicsLoop.controller;
              const up = ctrl.position.clone().normalize();
              return {
                radius: ctrl.currentRadius,
                isGrounded: ctrl.isGrounded,
                airBlend: ctrl.airBlend,
                radialVel: ctrl.velocity.dot(up)
              };
            })()`,
            returnByValue: true
          });
          jumpTrajectory.push(sample.result.value);
        }

        // Capture screenshot right around jump apex (arms lifted, knees tucked!)
        console.log('Capturing mid-air jump screenshot...');
        const jumpShot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('public/live_jump_pose.png', Buffer.from(jumpShot.data, 'base64'));
        console.log('Saved public/live_jump_pose.png (size:', fs.statSync('public/live_jump_pose.png').size, ')');

        // Release space key
        await send('Input.dispatchKeyEvent', {
          type: 'keyUp',
          code: 'Space',
          key: ' ',
          windowsVirtualKeyCode: 32
        });

        // Wait for landing
        await new Promise(r => setTimeout(r, 600));

        const landingState = await send('Runtime.evaluate', {
          expression: `(() => {
            const ctrl = window.planetScene.physicsLoop.controller;
            return {
              radius: ctrl.currentRadius,
              isGrounded: ctrl.isGrounded,
              airBlend: ctrl.airBlend
            };
          })()`,
          returnByValue: true
        });
        console.log('Landing State:', landingState.result.value);

        const initialR = groundState.result.value.radius;
        const maxR = Math.max(...jumpTrajectory.map(s => s.radius));
        const jumpHeight = maxR - initialR;
        console.log(`Jump Peak Height: +${jumpHeight.toFixed(2)}m (target ~1.0m, crisp hop)`);

        // 3. Test Wall Collision: walk forward into railing/wall for 1.2s
        console.log('Walking forward into wall/fence for 1.2s...');
        await send('Input.dispatchKeyEvent', {
          type: 'rawKeyDown',
          code: 'KeyW',
          key: 'w',
          windowsVirtualKeyCode: 87
        });
        await new Promise(r => setTimeout(r, 1200));

        const wallContactState = await send('Runtime.evaluate', {
          expression: `(() => {
            const ctrl = window.planetScene.physicsLoop.controller;
            return {
              pos: [ctrl.position.x, ctrl.position.y, ctrl.position.z],
              isGrounded: ctrl.isGrounded,
              speed: ctrl.speedRatio
            };
          })()`,
          returnByValue: true
        });
        console.log('Wall Contact State:', wallContactState.result.value);

        console.log('Capturing wall collision screenshot...');
        const wallShot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('public/live_wall_collision.png', Buffer.from(wallShot.data, 'base64'));
        console.log('Saved public/live_wall_collision.png (size:', fs.statSync('public/live_wall_collision.png').size, ')');

        await send('Input.dispatchKeyEvent', {
          type: 'keyUp',
          code: 'KeyW',
          key: 'w',
          windowsVirtualKeyCode: 87
        });

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
