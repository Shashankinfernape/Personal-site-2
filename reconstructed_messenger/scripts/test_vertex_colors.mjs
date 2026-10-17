import { spawn } from 'child_process';
import http from 'http';
import WebSocket from 'ws';

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9231', '--disable-gpu-sandbox', '--enable-webgl', '--ignore-gpu-blocklist', 'http://localhost:3005'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  http.get('http://127.0.0.1:9231/json', res => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', async () => {
      const targets = JSON.parse(raw);
      const page = targets.find(t => t.type === 'page' && t.url.includes('3005'));
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      ws.on('open', async () => {
        let id = 1;
        const send = (method, params = {}) => new Promise(resolve => {
          const mId = id++;
          const handler = d => {
            const r = JSON.parse(d.toString());
            if (r.id === mId) { ws.off('message', handler); resolve(r.result); }
          };
          ws.on('message', handler);
          ws.send(JSON.stringify({ id: mId, method, params }));
        });
        await send('Runtime.enable');
        await new Promise(r => setTimeout(r, 3000));

        const res = await send('Runtime.evaluate', {
          expression: `(() => {
            const ps = window.planetScene;
            if (!ps) return 'no ps';

            // Check present visual chunks
            const presentMeshes = ps.visualChunkMeshes;
            const introMesh = ps.introPlanetGroup.children[0];

            function analyzeMesh(mesh, name) {
              if (!mesh || !mesh.geometry) return { name, error: 'no geom' };
              const geom = mesh.geometry;
              const uvs = geom.attributes.uv;
              const elem = geom.attributes.elementId;
              const pos = geom.attributes.position;
              if (!uvs || !elem) return { name, error: 'missing attrs' };

              let countElem0 = 0;
              let countElem1 = 0;
              let countElemOther = 0;

              for (let i = 0; i < pos.count; i++) {
                const e = elem.getX(i);
                if (e === 0) countElem0++;
                else if (e === 1) countElem1++;
                else countElemOther++;
              }
              return {
                name,
                totalVerts: pos.count,
                countElem0_Manmade: countElem0,
                countElem1_Terrain: countElem1,
                countOther: countElemOther
              };
            }

            return {
              intro: analyzeMesh(introMesh, 'introPlanet'),
              chunk0: analyzeMesh(presentMeshes[0], 'full_0'),
              chunk1: analyzeMesh(presentMeshes[1], 'full_1'),
              chunk2: analyzeMesh(presentMeshes[2], 'full_2'),
              chunk3: analyzeMesh(presentMeshes[3], 'full_3'),
              chunk4: analyzeMesh(presentMeshes[4], 'full_4')
            };
          })()`,
          returnByValue: true
        });

        console.log('Mesh analysis:', JSON.stringify(res?.result?.value, null, 2));

        ws.close();
        chrome.kill();
        process.exit(0);
      });
    });
  });
}

test().catch(e => {
  console.error(e);
  process.exit(1);
});
