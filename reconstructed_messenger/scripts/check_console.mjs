import http from 'http';
import WebSocket from 'ws';
import { spawn } from 'child_process';

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9230',
    '--disable-gpu-sandbox',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    'http://localhost:3005'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  http.get('http://127.0.0.1:9230/json', (res) => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', async () => {
      const page = JSON.parse(raw).find(t => t.type === 'page');
      if (!page) {
        console.error('No page');
        chrome.kill();
        process.exit(1);
      }
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      let id = 1;
      const send = (m, p = {}) => new Promise(r => {
        const msgId = id++;
        const h = (d) => {
          const j = JSON.parse(d);
          if (j.id === msgId) {
            ws.off('message', h);
            r(j.result);
          }
        };
        ws.on('message', h);
        ws.send(JSON.stringify({ id: msgId, method: m, params: p }));
      });

      ws.on('open', async () => {
        await send('Runtime.enable');
        ws.on('message', (d) => {
          const m = JSON.parse(d.toString());
          if (m.method === 'Runtime.consoleAPICalled') {
            console.log('[Console]', m.params.type, ...m.params.args.map(a => a.value || a.description));
          }
          if (m.method === 'Runtime.exceptionThrown') {
            console.error('[Exception]', m.params.exceptionDetails.text, m.params.exceptionDetails.exception?.description);
          }
        });

        await new Promise(r => setTimeout(r, 4000));
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
