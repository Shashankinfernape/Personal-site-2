// reconstructed_messenger/src/engine/CustomDRACOLoader.ts
import * as THREE from 'three';

export class CustomDRACOLoader {
  private cache = new Map<string, THREE.BufferGeometry>();
  private worker: Worker | null = null;
  private reqId = 1;
  private pending = new Map<number, { resolve: (g: THREE.BufferGeometry) => void; reject: (e: any) => void }>();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.worker = new Worker('/draco/dracoworker.js');
        this.worker.onmessage = (e: MessageEvent) => {
          const { id, geometry, error, message } = e.data;
          const cb = this.pending.get(id);
          if (!cb) return;
          this.pending.delete(id);

          if (error) {
            cb.reject(new Error(message || 'Draco decode error'));
          } else {
            const bg = new THREE.BufferGeometry();
            if (geometry.userData) bg.userData = geometry.userData;
            if (geometry.index) {
              bg.setIndex(new THREE.BufferAttribute(geometry.index.array, 1));
            }
            for (const attr of geometry.attributes) {
              bg.setAttribute(attr.name, new THREE.BufferAttribute(attr.array, attr.itemSize));
            }
            bg.computeVertexNormals();
            bg.computeBoundingBox();
            bg.computeBoundingSphere();
            cb.resolve(bg);
          }
        };
      } catch (err) {
        console.warn('[CustomDRACOLoader] Could not spawn dracoworker, falling back to Three.js DRACOLoader', err);
      }
    }
  }

  public async loadAsync(url: string): Promise<THREE.BufferGeometry> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!.clone();
    }

    if (!this.worker) {
      throw new Error('Worker not initialized');
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch draco file: ${res.status} ${res.statusText}`);
    }
    const buffer = await res.arrayBuffer();

    return new Promise<THREE.BufferGeometry>((resolve, reject) => {
      const id = this.reqId++;
      this.pending.set(id, { resolve, reject });
      this.worker!.postMessage({ url, buffer, id }, [buffer]);
    }).then((geom) => {
      this.cache.set(url, geom);
      return geom.clone();
    });
  }

  public dispose() {
    this.worker?.terminate();
    this.worker = null;
    this.cache.clear();
  }
}

/**
 * Verbatim createSkin from App3D.js
 * Assembles bones hierarchy from bones.drc and binds to SkinnedMesh.
 */
export function createSkin(
  geom: THREE.BufferGeometry,
  bonesGeom: THREE.BufferGeometry,
  material: THREE.Material
): THREE.SkinnedMesh {
  const bones: THREE.Bone[] = [];
  const posAttr = bonesGeom.attributes.position;
  const quatAttr = bonesGeom.attributes.quaternion;
  const scaleAttr = bonesGeom.attributes.scale;
  const hierAttr = bonesGeom.attributes.hierarchy;

  const count = posAttr?.count || 0;
  for (let l = 0; l < count; l++) {
    const c = new THREE.Bone();
    c.name = `bone_${l}`;
    c.position.fromArray(posAttr.array, l * 3);
    if (quatAttr) {
      c.quaternion.fromArray(quatAttr.array, l * 4).normalize();
    }
    if (scaleAttr) {
      c.scale.fromArray(scaleAttr.array, l * 3);
    }
    bones.push(c);
  }

  const roots: number[] = [];
  if (hierAttr) {
    for (let l = 0; l < hierAttr.count; l++) {
      const parentIdx = hierAttr.array[l] - 1;
      if (parentIdx === -1) {
        roots.push(l);
      } else if (bones[parentIdx]) {
        bones[parentIdx].add(bones[l]);
      }
    }
  } else {
    roots.push(0);
  }

  const skeleton = new THREE.Skeleton(bones);
  const skinnedMesh = new THREE.SkinnedMesh(geom, material);
  roots.forEach((l) => {
    if (skeleton.bones[l]) skinnedMesh.add(skeleton.bones[l]);
  });
  skinnedMesh.bind(skeleton);
  if ((skinnedMesh as any).normalizeSkinWeights) {
    skinnedMesh.normalizeSkinWeights();
  }
  return skinnedMesh;
}

/**
 * Verbatim createSkinAnimation from App3D.js
 * Converts Draco animation keyframes into THREE.AnimationClip
 */
export function createSkinAnimation(name: string, animGeom: THREE.BufferGeometry): THREE.AnimationClip {
  const userData = animGeom.userData || {};
  if (!userData.frames || !userData.fps) {
    return new THREE.AnimationClip(name, 0, []);
  }
  const frames = userData.frames as number;
  const fps = userData.fps as number;
  const posCount = animGeom.attributes.position ? animGeom.attributes.position.count : 0;
  const numBones = Math.floor(posCount / frames);
  if (numBones <= 0 || frames <= 1) {
    return new THREE.AnimationClip(name, 0, []);
  }
  const duration = frames / fps;
  const frameInterval = duration / (frames - 1);
  const times = new Array(frames).fill(0).map((_, i) => i * frameInterval);

  const channels: Array<{ name: 'position' | 'quaternion' | 'scale'; itemSize: number }> = [
    { name: 'position', itemSize: 3 },
    { name: 'quaternion', itemSize: 4 },
    { name: 'scale', itemSize: 3 },
  ];

  const tracks: THREE.KeyframeTrack[] = [];
  const tempV = new THREE.Vector3();
  const tempQ = new THREE.Quaternion();

  for (let b = 0; b < numBones; b++) {
    const bonePrefix = `bone_${b}`;
    for (const ch of channels) {
      const attr = animGeom.attributes[ch.name];
      if (!attr) continue;
      const itemSize = attr.itemSize;
      const values: number[] = [];

      for (let f = 0; f < frames; f++) {
        const offset = (f * numBones + b) * itemSize;
        if (itemSize === 4) {
          tempQ.fromArray(attr.array, offset).normalize();
          values.push(tempQ.x, tempQ.y, tempQ.z, tempQ.w);
        } else {
          tempV.fromArray(attr.array, offset);
          values.push(tempV.x, tempV.y, tempV.z);
        }
      }

      if (itemSize === 4) {
        tracks.push(new THREE.QuaternionKeyframeTrack(`${bonePrefix}.quaternion`, times, values, THREE.InterpolateLinear));
      } else {
        tracks.push(new THREE.VectorKeyframeTrack(`${bonePrefix}.${ch.name}`, times, values, THREE.InterpolateLinear));
      }
    }
  }

  return new THREE.AnimationClip(name, duration, tracks);
}
