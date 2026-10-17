// scripts/verify-fixes.mjs
import { spawn } from 'child_process';
import http from 'http';
import WebSocket from 'ws';
import fs from 'fs';

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--window-size=1280,720',
    '--disable-gpu-sandbox',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    'http://localhost:3005'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  http.get('http://127.0.0.1:9224/json', (res) => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', async () => {
      const targets = JSON.parse(raw);
      const page = targets.find(t => t.type === 'page' && t.url.includes('3005'));
      if (!page) {
        console.error('No page found');
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
        });

        console.log('Waiting for world assets to mount...');
        await new Promise(r => setTimeout(r, 4000));

        // Click BEGIN DELIVERY
        console.log('Clicking BEGIN DELIVERY...');
        await send('Runtime.evaluate', {
          expression: 'document.querySelector(".begin-btn") ? document.querySelector(".begin-btn").click() : null'
        });

        await new Promise(r => setTimeout(r, 2000));

        // 1. TEST JUMPING
        const posBeforeJump = await send('Runtime.evaluate', {
          expression: 'JSON.stringify({ pos: window.planetScene.characterState.position, r: window.planetScene.characterState.position.length(), isGrounded: window.planetScene.characterState.isGrounded })',
          returnByValue: true
        });
        console.log('Before Jump:', posBeforeJump?.result?.value);

        console.log('Triggering SPACE jump...');
        await send('Input.dispatchKeyEvent', {
          type: 'rawKeyDown',
          code: 'Space',
          key: ' ',
          windowsVirtualKeyCode: 32
        });

        await new Promise(r => setTimeout(r, 120));

        const posMidAir = await send('Runtime.evaluate', {
          expression: 'JSON.stringify({ pos: window.planetScene.characterState.position, r: window.planetScene.characterState.position.length(), isGrounded: window.planetScene.characterState.isGrounded, vel: window.planetScene.physicsLoop.controller.velocity })',
          returnByValue: true
        });
        console.log('Mid-Air Jump State:', posMidAir?.result?.value);

        await send('Input.dispatchKeyEvent', {
          type: 'keyUp',
          code: 'Space',
          key: ' ',
          windowsVirtualKeyCode: 32
        });

        await new Promise(r => setTimeout(r, 800));

        const posAfterLand = await send('Runtime.evaluate', {
          expression: 'JSON.stringify({ pos: window.planetScene.characterState.position, r: window.planetScene.characterState.position.length(), isGrounded: window.planetScene.characterState.isGrounded })',
          returnByValue: true
        });
        console.log('After Land:', posAfterLand?.result?.value);

        // 2. NAVIGATE / POSITION TO PALE MAN
        console.log('Locating Pale Man (alien)...');
        const paleManData = await send('Runtime.evaluate', {
          expression: `(() => {
            const pm = window.planetScene.npcManager.npcs.find(n => n.id === 'alien');
            if (!pm) return null;
            return {
              id: pm.id,
              name: pm.name,
              pos: pm.position,
              hasMesh: !!pm.characterMesh,
              isSkinned: pm.characterMesh ? pm.characterMesh.isSkinnedMesh : false,
              bonesCount: pm.characterMesh?.skeleton ? pm.characterMesh.skeleton.bones.length : 0
            };
          })()`,
          returnByValue: true
        });
        console.log('Pale Man Info:', JSON.stringify(paleManData?.result?.value, null, 2));

        // Position player 2.8m in front of Pale Man and orient player facing Pale Man
        const navRes = await send('Runtime.evaluate', {
          expression: `(() => {
            const pm = window.planetScene.npcManager.npcs.find(n => n.id === 'alien');
            if (pm) {
              const THREE = window.THREE || window.planetScene.characterState.position.constructor;
              const pmUp = pm.position.clone().normalize();
              const tangent = new THREE.Vector3(1.2, 0.3, 1.8).projectOnPlane(pmUp).normalize().multiplyScalar(2.6);
              const standPos = pm.position.clone().add(tangent);
              
              window.planetScene.characterState.position.copy(standPos);
              window.planetScene.physicsLoop.controller.position.copy(standPos);
              window.planetScene.physicsLoop.snapToGround(window.planetScene.characterState);

              // Orient character to look directly toward Pale Man
              const lookDir = pm.position.clone().sub(window.planetScene.characterState.position);
              lookDir.addScaledVector(pmUp, -lookDir.dot(pmUp)).normalize();
              const m = new THREE.Matrix4().lookAt(lookDir, new THREE.Vector3(0, 0, 0), pmUp);
              window.planetScene.characterState.quaternion.setFromRotationMatrix(m);
              return { success: true, standPos: standPos.toArray(), charPos: window.planetScene.characterState.position.toArray() };
            }
            return { error: 'alien not found' };
          })()`,
          returnByValue: true
        });
        console.log('Navigation Result:', JSON.stringify(navRes?.result?.value));

        await new Promise(r => setTimeout(r, 2000));

        // Capture screenshot of Pale Man
        console.log('Capturing Pale Man verification screenshot...');
        const shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('public/live_paleman_verification.png', Buffer.from(shot.data, 'base64'));
        console.log('Saved to public/live_paleman_verification.png! Size:', fs.statSync('public/live_paleman_verification.png').size);

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
