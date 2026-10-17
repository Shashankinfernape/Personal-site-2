// scripts/decompile-app3d.mjs
import fs from 'fs';
import path from 'path';

const app3dPath = path.resolve('target_artifacts/messenger_abeto/App3D.js');
const outDir = path.resolve('decompiled_specs');

if (!fs.existsSync(app3dPath)) {
  console.error('App3D.js not found at', app3dPath);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const content = fs.readFileSync(app3dPath, 'utf8');

function getLineAndCol(offset) {
  const prefix = content.slice(0, offset);
  const lineNum = prefix.split('\n').length;
  const lastNewline = prefix.lastIndexOf('\n');
  const col = offset - lastNewline;
  return { line: lineNum, col };
}

function extractSlice(title, startIdx, endIdx) {
  const locStart = getLineAndCol(startIdx);
  const locEnd = getLineAndCol(endIdx);
  const code = content.slice(startIdx, endIdx);

  return `/**
 * ============================================================================
 * ${title}
 * Ground-truth source from App3D.js: Lines ${locStart.line}:${locStart.col} - ${locEnd.line}:${locEnd.col}
 * Offset range: [${startIdx}, ${endIdx}] (Length: ${code.length})
 * ============================================================================
 */
${code}
`;
}

console.log('Extracting 01_assets_and_materials.js...');
const specs01 = [
  extractSlice('CustomDRACOLoader, createSkin, createSkinAnimation, geometryLoader', 750350, 763500),
  extractSlice('textureLoader & Basis / KTX2 texture management', 828140, 832000),
  extractSlice('baseMaterial, vertex & fragment shaders, atlas and noise textures', 1608000, 1622320),
  extractSlice('class terrain, BatchedMesh, LOD chunks full_0..9', 1640950, 1645000)
].join('\n\n');
fs.writeFileSync(path.join(outDir, '01_assets_and_materials.js'), specs01, 'utf8');

console.log('Extracting 02_player_physics.js...');
const specs02 = [
  extractSlice('class la (Verbatim BVH Capsule Collision Solver, Auto-Step, Jump Impulse)', 1363600, 1376057),
  extractSlice('class charactersControls (Input handling, WASD, Sprint, Jump, Mobile)', 1405500, 1412500),
  extractSlice('class characters (Character setup, collider assignment, physics loop ticking)', 1630700, 1634500)
].join('\n\n');
fs.writeFileSync(path.join(outDir, '02_player_physics.js'), specs02, 'utf8');

console.log('Extracting 03_npcs_and_animations.js...');
const specs03 = [
  extractSlice('class npc (NPC wrapper, skin loading, speech bubble, dialog interaction)', 1661660, 1667500),
  extractSlice('pointAnimation & createSkinAnimation keyframe tracks', 758000, 762000),
  extractSlice('class NPC mesh implementation (Dialog, LookAt, Idle, Gestures)', 1545000, 1566000)
].join('\n\n');
fs.writeFileSync(path.join(outDir, '03_npcs_and_animations.js'), specs03, 'utf8');

console.log('Extracting 04_camera_rig.js...');
const specs04 = [
  extractSlice('followCamera (Spherical follow camera, damping, shake, target offset)', 1304920, 1313386),
  extractSlice('Camera setup, FOV, near/far, intro orbit and zoom in/out', 1647400, 1650500)
].join('\n\n');
fs.writeFileSync(path.join(outDir, '04_camera_rig.js'), specs04, 'utf8');

console.log('Extracting 05_ui_and_quests.js...');
const specs05 = [
  extractSlice('class quest & quest management state machine', 1568450, 1575000),
  extractSlice('class emojis (Delivery parcel give/receive objects, letter, postcard, note)', 1622320, 1624500)
].join('\n\n');
fs.writeFileSync(path.join(outDir, '05_ui_and_quests.js'), specs05, 'utf8');

console.log('All 5 specs successfully dumped into decompiled_specs/ !');
