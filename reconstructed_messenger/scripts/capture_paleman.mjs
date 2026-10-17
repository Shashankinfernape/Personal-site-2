import { spawn } from 'child_process';
import http from 'http';
import WebSocket from 'ws';
import fs from 'fs';

async function capture() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9227', '--disable-gpu-sandbox', '--enable-webgl', '--ignore-gpu-blocklist', 'http://localhost:3005'
  ]);
  await new Promise(r => setTimeout(r, 2500));

  http.get('http://127.0.0.1:9227/json', (res) => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', async () => {
      const page = JSON.parse(raw).find(t => t.type === 'page' && t.url.includes('3005'));
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      let id = 1;
      const send = (m, p = {}) => new Promise((resolve) => {
        const mId = id++;
        const handler = (d) => {
          const r = JSON.parse(d.toString());
          if (r.id === mId) {
            ws.off('message', handler);
            resolve(r.result);
          }
        };
        ws.on('message', handler);
        ws.send(JSON.stringify({ id: mId, method: m, params: p }));
      });

      ws.on('open', async () => {
        await send('Runtime.enable');
        await new Promise(r => setTimeout(r, 4000));
        await send('Runtime.evaluate', { expression: 'document.querySelector(".begin-btn")?.click()' });
        await new Promise(r => setTimeout(r, 2000));

        // Let's inspect Pale Man and the environment around him
        const info = await send('Runtime.evaluate', {
          expression: `(() => {
            const ps = window.planetScene;
            const pm = ps.npcManager.npcs.find(n => n.id === 'alien');
            const pmPos = pm.position.clone();
            const pmUp = pmPos.clone().normalize();
            
            // Get Pale Man's world matrix & forward facing direction
            pm.mesh.updateMatrixWorld(true);
            const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(pm.mesh.quaternion).normalize();
            
            // Set camera 3.0 meters away along forward and 1.3 meters up for a complete storybook perspective
            const camPos = pmPos.clone().addScaledVector(forward, 3.0).addScaledVector(pmUp, 1.3);
            const lookTarget = pmPos.clone().addScaledVector(pmUp, 0.45);

            // Hook render loop to keep camera locked at Pale Man for screenshot
            ps._overrideCamera = () => {
              ps.camera.position.copy(camPos);
              ps.camera.up.copy(pmUp);
              ps.camera.lookAt(lookTarget);
            };
            const origUpdate = ps.update.bind(ps);
            ps.update = function(d, inp) {
              origUpdate(d, inp);
              if (ps._overrideCamera) ps._overrideCamera();
            };

            return {
              pmPos: pmPos.toArray(),
              camPos: camPos.toArray(),
              forward: forward.toArray(),
              isSkinned: pm.characterMesh.isSkinnedMesh,
              bonesCount: pm.characterMesh.skeleton ? pm.characterMesh.skeleton.bones.length : 0,
              hasMixer: !!pm.mixer
            };
          })()`,
          returnByValue: true
        });
        console.log('Pale Man Framing Info:', JSON.stringify(info?.result?.value, null, 2));

        // Wait 3 seconds for animation mixer and idle breathing cycles to update
        await new Promise(r => setTimeout(r, 3000));

        console.log('Capturing framed Pale Man screenshot...');
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

capture().catch(e => { console.error(e); process.exit(1); });
