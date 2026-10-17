import fs from 'fs';

// A simple PNG parser to get the 16x16 RGBA pixels from public/assets/atlas.png
import zlib from 'zlib';

const buf = fs.readFileSync('public/assets/atlas.png');
// Find PLTE
const plteIdx = buf.indexOf(Buffer.from('PLTE'));
const plteLen = buf.readUInt32BE(plteIdx - 4);
const palette = [];
for (let i = 0; i < plteLen; i += 3) {
  palette.push([
    buf[plteIdx + 4 + i],
    buf[plteIdx + 4 + i + 1],
    buf[plteIdx + 4 + i + 2]
  ]);
}

// Find IDAT
const idatIdx = buf.indexOf(Buffer.from('IDAT'));
const idatLen = buf.readUInt32BE(idatIdx - 4);
const compressed = buf.slice(idatIdx + 4, idatIdx + 4 + idatLen);
const decompressed = zlib.inflateSync(compressed);

// 16 rows, each row has 1 filter byte + 16 pixel bytes (since 8-bit indexed)
const pixels = [];
for (let y = 0; y < 16; y++) {
  const row = [];
  const offset = y * 17 + 1; // skip filter byte
  for (let x = 0; x < 16; x++) {
    const colorIdx = decompressed[offset + x];
    const rgb = palette[colorIdx] || [255, 255, 255];
    row.push(rgb);
  }
  pixels.push(row);
}

console.log('Decoded 16x16 atlas pixels successfully!');
for (let y = 0; y < 16; y++) {
  const rowColors = pixels[y].map(rgb => {
    if (rgb[0] === 255 && rgb[1] === 255 && rgb[2] === 255) return '  WHITE  ';
    return '#' + rgb.map(c => c.toString(16).padStart(2, '0')).join('');
  });
  console.log(`Row y=${y.toString().padStart(2, ' ')}: ` + rowColors.join(' '));
}
