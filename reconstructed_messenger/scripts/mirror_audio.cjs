const fs = require('fs');
const path = require('path');
const https = require('https');

const code = fs.readFileSync(path.resolve(__dirname, '../../target_artifacts/messenger_abeto/App3D.js'), 'utf8');

// Find all .ogg references
const regex = /["']([a-zA-Z0-9_\-\/]+\.ogg)["']/g;
const oggs = new Set();
let match;
while ((match = regex.exec(code)) !== null) {
  oggs.add(match[1]);
}

// Add known dialogue voices
['female1', 'female2', 'female3', 'male1', 'male2', 'male3'].forEach(v => {
  oggs.add('dialogues/' + v + '.ogg');
});

console.log('Total unique ogg references found:', oggs.size);

async function downloadAudio(relPath) {
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
          console.log('Downloaded audio:', relPath);
          resolve(true);
        });
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

(async () => {
  let count = 0;
  for (const ogg of Array.from(oggs)) {
    const ok = await downloadAudio(ogg);
    if (ok) count++;
  }
  console.log('Total audio files verified/downloaded:', count, '/', oggs.size);
})();
