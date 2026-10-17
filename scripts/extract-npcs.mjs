// scripts/extract-npcs.mjs
import fs from 'fs';

const content = fs.readFileSync('target_artifacts/messenger_abeto/App3D.js', 'utf8');

const startStr = 'this.npcs.push(new npc(this,';
let pos = 1743000;
const items = [];
const math = { radians: (deg) => deg * Math.PI / 180 };

while (true) {
  const idx = content.indexOf(startStr, pos);
  if (idx === -1 || idx > 1760000) break;
  
  const objStart = idx + startStr.length;
  let depth = 0;
  let objEnd = -1;
  for (let i = objStart; i < objStart + 2000; i++) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') {
      depth--;
      if (depth === 0) {
        objEnd = i + 1;
        break;
      }
    }
  }

  if (objEnd !== -1) {
    const rawObj = content.slice(objStart, objEnd);
    try {
      const fn = new Function('math', 'return ' + rawObj);
      const parsed = fn(math);
      items.push(parsed);
    } catch (err) {
      console.warn('Parse error at', idx, err.message);
    }
    pos = objEnd;
  } else {
    pos = idx + startStr.length;
  }
}

console.log('Total extracted NPCs:', items.length);
fs.writeFileSync('reconstructed_messenger/src/data/npcs_groundtruth.json', JSON.stringify(items, null, 2));
console.log('Saved to reconstructed_messenger/src/data/npcs_groundtruth.json');
items.forEach((n, i) => {
  console.log(`${i + 1}. [${n.id}] ${n.extraData?.name} - pos: [${n.position}] - rot: [${n.rotation ? n.rotation.map(r => r.toFixed(3)) : 'none'}]`);
});
