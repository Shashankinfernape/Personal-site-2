const fs = require('fs');
const path = require('path');
const https = require('https');

const code = fs.readFileSync(path.resolve(__dirname, '../../target_artifacts/messenger_abeto/App3D.js'), 'utf8');

const regex = /["']([a-zA-Z0-9_\-\/]+\.(ktx2|png|font|icon))["']/g;
const assets = new Set();
let match;
while ((match = regex.exec(code)) !== null) {
  assets.add(match[1]);
}

console.log('Total texture/asset references:', assets.size);

async function download(relPath) {
  const target = path.resolve(__dirname, '../public/assets', relPath);
  if (fs.existsSync(target)) {
    return true;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const url = 'https://messenger.abeto.co/assets/' + relPath;

  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(target);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('Downloaded:', relPath);
          resolve(true);
        });
      } else {
        // console.log('Status ' + res.statusCode + ' for:', relPath);
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

(async () => {
  let count = 0;
  for (const asset of Array.from(assets)) {
    const ok = await download(asset);
    if (ok) count++;
  }
  console.log('Downloaded/verified assets:', count, '/', assets.size);
})();
