// reconstructed_messenger/src/engine/NPCManager.ts
import * as THREE from 'three';
import npcsData from '../data/npcs_groundtruth.json';
import { AssetManager } from './AssetManager';
import { createSkin, createSkinAnimation } from './CustomDRACOLoader';
import { getSharedAtlasTexture, sharedGradientMap } from './ToonMaterials';

export interface NPCInstance {
  id: string;
  name: string;
  position: THREE.Vector3;
  rotation?: THREE.Euler;
  color: string;
  voice: string | null;
  texts: string[];
  talkDistance: number;
  hasIcon: boolean;
  alwaysFaceCharacter: boolean;
  talkFacingPlayer: boolean;
  mesh: THREE.Group;
  characterMesh?: THREE.Mesh | THREE.SkinnedMesh;
  iconMesh?: THREE.Mesh;
  upVector: THREE.Vector3;
  mixer?: THREE.AnimationMixer;
}

export class NPCManager {
  public npcs: NPCInstance[] = [];
  public activeNPC: NPCInstance | null = null;
  private scene: THREE.Scene;
  private assetManager: AssetManager;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.assetManager = AssetManager.getInstance();
    this.initNPCs();
  }

  private async initNPCs() {
    const atlasTexture = getSharedAtlasTexture();

    for (const data of npcsData as any[]) {
      const pos = data.position || [0, 26, 0];
      const position = new THREE.Vector3(pos[0], pos[1], pos[2]);
      const upVector = position.clone().normalize();
      const color = data.extraData?.color || data.color || '#66BDE6';

      const group = new THREE.Group();
      group.position.copy(position);

      let initialEuler: THREE.Euler | undefined;
      if (data.rotation && Array.isArray(data.rotation)) {
        initialEuler = new THREE.Euler(data.rotation[0], data.rotation[1], data.rotation[2], 'XYZ');
        group.rotation.copy(initialEuler);
      } else {
        group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), upVector);
      }

      // Overhead interaction balloon icon (if icon !== false)
      let iconMesh: THREE.Mesh | null = null;
      if (data.icon || data.hasIcon) {
        const iconGeom = new THREE.SphereGeometry(0.12, 12, 12);
        const iconMat = new THREE.MeshToonMaterial({
          color: color,
          transparent: true,
          opacity: 0.9,
        });
        iconMesh = new THREE.Mesh(iconGeom, iconMat);
        const iconOffsetY = data.iconOffset ? data.iconOffset[1] : 1.85;
        iconMesh.position.set(0, iconOffsetY, 0);
        group.add(iconMesh);
      }

      const npcInstance: NPCInstance = {
        id: data.id,
        name: data.extraData?.name || data.name || 'NPC',
        position,
        rotation: initialEuler,
        color,
        voice: data.extraData?.voice || data.voice || null,
        texts: data.texts || [],
        talkDistance: data.talkDistance || 3.0,
        hasIcon: !!(data.icon || data.hasIcon),
        alwaysFaceCharacter: data.alwaysFaceCharacter !== false,
        talkFacingPlayer: data.talkFacingPlayer !== false,
        iconMesh: iconMesh || undefined,
        mesh: group,
        upVector,
      };

      // Create toon material mapped with atlas.png for authentic colors
      const npcMat = new THREE.MeshToonMaterial({
        color: 0xffffff,
        map: atlasTexture,
        gradientMap: sharedGradientMap,
      });

      // Load model and bones
      if (data.modelURL && data.bonesURL) {
        Promise.all([
          this.assetManager.loadDracoGeometry(`geometries/${data.modelURL}`),
          this.assetManager.loadDracoGeometry(`geometries/${data.bonesURL}`),
        ])
          .then(async ([modelGeom, bonesGeom]) => {
            const skinnedMesh = createSkin(modelGeom, bonesGeom, npcMat);
            skinnedMesh.castShadow = true;
            skinnedMesh.receiveShadow = true;
            group.add(skinnedMesh);
            npcInstance.characterMesh = skinnedMesh;

            // Load and play authentic skin animation if present
            if (data.animations && data.animations.length > 0) {
              try {
                const animGeom = await this.assetManager.loadDracoGeometry(`geometries/${data.animations[0]}`);
                const clip = createSkinAnimation(data.id, animGeom);
                if (clip.tracks.length > 0) {
                  const mixer = new THREE.AnimationMixer(skinnedMesh);
                  const action = mixer.clipAction(clip);
                  action.play();
                  npcInstance.mixer = mixer;
                }
              } catch (animErr) {
                console.warn(`[NPCManager] Could not load animation for ${data.id}:`, animErr);
              }
            }
          })
          .catch((err) => {
            console.warn(`[NPCManager] Error loading skinned NPC ${data.id}:`, err);
            // Fallback: load unskinned model
            this.assetManager.loadDracoGeometry(`geometries/${data.modelURL}`).then((modelGeom) => {
              const mesh = new THREE.Mesh(modelGeom, npcMat);
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              group.add(mesh);
              npcInstance.characterMesh = mesh;
            });
          });
      } else if (data.modelURL) {
        this.assetManager.loadDracoGeometry(`geometries/${data.modelURL}`).then((modelGeom) => {
          const mesh = new THREE.Mesh(modelGeom, npcMat);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          group.add(mesh);
          npcInstance.characterMesh = mesh;
        });
      }

      // Spatial audio for Dave the Musician
      if (data.id === 'musician' || data.name?.toLowerCase().includes('musician')) {
        this.assetManager.createSpatialAudio('music/musician.ogg', group, {
          refDistance: 6.0,
          maxDistance: 45.0,
          loop: true,
          volume: 0.9,
        });
      }

      this.scene.add(group);
      this.npcs.push(npcInstance);
    }
  }

  public update(playerPosition: THREE.Vector3, delta: number = 0.016): NPCInstance | null {
    let closest: NPCInstance | null = null;
    let minDistance = Infinity;

    for (const npc of this.npcs) {
      if (npc.mixer) {
        npc.mixer.update(delta);
      }
      const dist = npc.position.distanceTo(playerPosition);
      if (dist < npc.talkDistance && dist < minDistance) {
        minDistance = dist;
        closest = npc;
      }

      // Gentle floating animation on interaction icon
      if (npc.iconMesh) {
        npc.iconMesh.position.y = 1.85 + Math.sin(performance.now() * 0.005 + npc.position.x) * 0.08;
      }

      // Only face character if alwaysFaceCharacter is true (Pale Man on lounge chair remains reclined)
      if (npc.alwaysFaceCharacter && dist < 12.0 && npc.characterMesh) {
        const lookDir = playerPosition.clone().sub(npc.position);
        lookDir.addScaledVector(npc.upVector, -lookDir.dot(npc.upVector)).normalize();
        if (lookDir.lengthSq() > 0.01) {
          const m = new THREE.Matrix4().lookAt(lookDir, new THREE.Vector3(0, 0, 0), npc.upVector);
          npc.mesh.quaternion.slerp(new THREE.Quaternion().setFromRotationMatrix(m), 0.05);
        }
      }
    }

    this.activeNPC = closest;
    return closest;
  }
}
