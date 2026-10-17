// reconstructed_messenger/src/engine/PlanetScene.ts
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshBVH } from 'three-mesh-bvh';
import {
  createAbetoToonMaterial,
  createPlanetTerrainMaterial,
  createAvatarMaterial,
  AvatarAnimUniforms,
  prepareDracoGeometry,
  cacheAvatarRestGeometry,
  updateCharacterGeometry,
  getSharedAtlasTexture,
} from './ToonMaterials';
import { PhysicsLoop, CharacterPhysicsState } from './PhysicsLoop';
import { AssetManager } from './AssetManager';
import { NPCManager } from './NPCManager';

export class PlanetScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public physicsLoop: PhysicsLoop;
  public characterState: CharacterPhysicsState;
  public npcManager: NPCManager;
  private sharedAvatarBBox?: THREE.Box3;

  // GPU Vertex-Shader Avatar Animation Uniforms
  public avatarAnimUniforms: AvatarAnimUniforms = {
    uWalkPhase: { value: 0 },
    uSpeedRatio: { value: 0 },
    uIsCarrying: { value: 0 },
    uBBoxMin: { value: new THREE.Vector3(-0.45, 0.0, -0.3) },
    uBBoxMax: { value: new THREE.Vector3(0.45, 1.8, 0.3) },
  };

  // Scene state: Intro Orbit vs. Active Present Gameplay
  public isInIntro: boolean = true;
  private introOrbitAngle: number = 0;
  private introPlanetGroup: THREE.Group;
  public presentPlanetGroup: THREE.Group;

  // Real Present Planet Visual Chunks (full_0 to full_9)
  public visualChunkMeshes: THREE.Mesh[] = [];
  public waterMesh: THREE.Mesh | null = null;
  public cablesMesh: THREE.Mesh | null = null;
  public grassMesh: THREE.Mesh | null = null;

  // Character Rig Hierarchies for Real Joint Animation
  public playerGroup: THREE.Group;
  public torsoGroup: THREE.Group;
  public headGroup: THREE.Group;
  public leftArmGroup: THREE.Group;
  public rightArmGroup: THREE.Group;
  public leftLegGroup: THREE.Group;
  public rightLegGroup: THREE.Group;

  // Wardrobe Meshes
  private avatarBaseMesh: THREE.Mesh | null = null;
  private avatarTopMesh: THREE.Mesh | null = null;
  private avatarBottomMesh: THREE.Mesh | null = null;
  private avatarHairMesh: THREE.Mesh | null = null;
  private avatarShoesMesh: THREE.Mesh | null = null;
  public deliveryItemMesh: THREE.Mesh | null = null;

  // Current active wardrobe selection
  public currentWardrobe = {
    hairId: 6,
    topId: 8,
    bottomId: 6,
    shoesId: 3,
    hairColor: '#FF5500',
    jacketColor: '#00F5D4',
    pantsColor: '#27272A',
    sneakersColor: '#FFFFFF',
  };

  // Real Stride & Footstep State
  private runCycleTime: number = 0;
  private lastFootstepSide: number = 0;
  private landingSquash: number = 1.0;

  // Dust Particle Emitter
  private dustGeom: THREE.BufferGeometry;
  private dustPositions: Float32Array;
  private dustParticles: THREE.Points;

  private sunLight: THREE.DirectionalLight;
  private cameraTarget = new THREE.Vector3();
  private tempUp = new THREE.Vector3();
  private tempForward = new THREE.Vector3();
  private tempRight = new THREE.Vector3();
  private assetManager: AssetManager;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#f7f3ec');
    this.scene.fog = new THREE.FogExp2('#f7f3ec', 0.0075);

    this.assetManager = AssetManager.getInstance();

    // 1. Perspective Camera (42 deg medium-telephoto for authentic storybook 16:9 framing)
    this.camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.2, 175);
    this.camera.position.set(0, 45, 60);

    // 2. Dynamic Lighting: Warm daylight matching Abeto
    const hemiLight = new THREE.HemisphereLight(0xfff8e7, 0x6b7c85, 0.35);
    this.scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight('#ffffff', 0.45);
    this.scene.add(ambientLight);

    this.sunLight = new THREE.DirectionalLight('#fffdf2', 0.85);
    this.sunLight.position.set(40, 60, 40);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 160;
    this.sunLight.shadow.camera.left = -32;
    this.sunLight.shadow.camera.right = 32;
    this.sunLight.shadow.camera.top = 32;
    this.sunLight.shadow.camera.bottom = -32;
    this.sunLight.shadow.bias = -0.0001;
    this.sunLight.shadow.normalBias = 0.07;
    this.scene.add(this.sunLight);

    // 3. Scene Groups
    this.introPlanetGroup = new THREE.Group();
    this.presentPlanetGroup = new THREE.Group();
    this.presentPlanetGroup.visible = false;
    this.scene.add(this.introPlanetGroup);
    this.scene.add(this.presentPlanetGroup);

    // 4. Initialize Physics & Character State
    this.physicsLoop = new PhysicsLoop();
    (window as any).planetScene = this;
    (window as any).THREE = THREE;
    this.characterState = {
      position: new THREE.Vector3(5.81095, 5.80205, 25.7794),
      velocity: new THREE.Vector3(0, 0, 0),
      quaternion: new THREE.Quaternion(),
      heading: 0,
      isGrounded: true,
      capsuleRadius: 0.38,
      capsuleHeight: 1.7,
    };

    // 5. Build Articulated Character Joint Hierarchy
    this.playerGroup = new THREE.Group();
    this.torsoGroup = new THREE.Group();
    this.headGroup = new THREE.Group();
    this.leftArmGroup = new THREE.Group();
    this.rightArmGroup = new THREE.Group();
    this.leftLegGroup = new THREE.Group();
    this.rightLegGroup = new THREE.Group();

    this.buildCharacterSkeleton();
    this.scene.add(this.playerGroup);

    // 6. Dust Particles
    const DUST_COUNT = 30;
    this.dustPositions = new Float32Array(DUST_COUNT * 3);
    this.dustGeom = new THREE.BufferGeometry();
    this.dustGeom.setAttribute('position', new THREE.BufferAttribute(this.dustPositions, 3));
    this.dustParticles = new THREE.Points(
      this.dustGeom,
      new THREE.PointsMaterial({ color: '#e2ddd3', size: 0.22, transparent: true, opacity: 0.6 })
    );
    this.scene.add(this.dustParticles);

    // 7. Initialize 20 Live NPCs
    this.npcManager = new NPCManager(this.presentPlanetGroup);

    // 8. Load Real Assets
    this.loadWorldAssets();
    this.loadWardrobeMeshes();
  }

  private buildCharacterSkeleton() {
    this.playerGroup.add(this.torsoGroup);

    // Head mounted to Torso
    this.headGroup.position.set(0, 1.35, 0);
    this.torsoGroup.add(this.headGroup);

    // Arms mounted to upper torso
    this.leftArmGroup.position.set(-0.24, 1.25, 0);
    this.rightArmGroup.position.set(0.24, 1.25, 0);
    this.torsoGroup.add(this.leftArmGroup, this.rightArmGroup);

    // Legs mounted to hip
    this.leftLegGroup.position.set(-0.11, 0.65, 0);
    this.rightLegGroup.position.set(0.11, 0.65, 0);
    this.torsoGroup.add(this.leftLegGroup, this.rightLegGroup);
  }

  /**
   * Fix 1: Mounts All 10 Visual Chunks (full_0..9) + Cables + Water + Clouds.
   */
  private async loadWorldAssets() {
    // 1. Merged BVH Hitmesh Collider (hitmesh_0..4)
    try {
      const hitmeshGeoms = await Promise.all(
        [0, 1, 2, 3, 4].map((i) =>
          this.assetManager.loadDracoGeometry(`geometries/planets/present/hitmesh_${i}.drc`)
        )
      );

      // Sanitize geometries to ensure 100% attribute & indexing compatibility for mergeGeometries
      const cleanGeoms = hitmeshGeoms.map((g) => {
        const nonIndexed = g.index ? g.toNonIndexed() : g.clone();
        const clean = new THREE.BufferGeometry();
        clean.setAttribute('position', nonIndexed.getAttribute('position'));
        return clean;
      });

      const mergedColliderGeom = mergeGeometries(cleanGeoms, false);
      if (mergedColliderGeom) {
        mergedColliderGeom.computeVertexNormals();
        mergedColliderGeom.computeBoundingBox();
        mergedColliderGeom.computeBoundingSphere();
        (mergedColliderGeom as any).boundsTree = new MeshBVH(mergedColliderGeom);

        const colliderMesh = new THREE.Mesh(
          mergedColliderGeom,
          new THREE.MeshBasicMaterial({ visible: false })
        );
        this.scene.add(colliderMesh);
        this.physicsLoop.setCollider(colliderMesh);

        // Snap character firmly to ground now that collider is active
        this.physicsLoop.snapToGround(this.characterState);
        console.log('[PlanetScene] Hitmesh BVH collider initialized & character grounded.');
      } else {
        console.error('[PlanetScene] mergeGeometries returned null for hitmesh!');
      }
    } catch (e) {
      console.warn('[PlanetScene] Error loading hitmesh collider:', e);
    }

    const atlasTexture = getSharedAtlasTexture();

    // 2. Intro Planet Mesh & Props (for initial orbit screen)
    try {
      const [introPlanetGeom, introCloudsGeom, introTreesGeom, introWaterGeom] = await Promise.all([
        this.assetManager.loadDracoGeometry('geometries/planets/present/intro/planet.drc'),
        this.assetManager.loadDracoGeometry('geometries/planets/present/intro/clouds.drc'),
        this.assetManager.loadDracoGeometry('geometries/planets/present/intro/trees.drc'),
        this.assetManager.loadDracoGeometry('geometries/planets/present/intro/water.drc'),
      ]);

      prepareDracoGeometry(introPlanetGeom);
      prepareDracoGeometry(introTreesGeom);
      prepareDracoGeometry(introCloudsGeom);
      prepareDracoGeometry(introWaterGeom);

      const introPlanetMesh = new THREE.Mesh(
        introPlanetGeom,
        createPlanetTerrainMaterial(atlasTexture)
      );
      introPlanetMesh.castShadow = true;
      introPlanetMesh.receiveShadow = true;
      this.introPlanetGroup.add(introPlanetMesh);

      const introTreesMesh = new THREE.Mesh(
        introTreesGeom,
        createPlanetTerrainMaterial(atlasTexture)
      );
      introTreesMesh.castShadow = true;
      this.introPlanetGroup.add(introTreesMesh);

      const introWaterMesh = new THREE.Mesh(
        introWaterGeom,
        createAbetoToonMaterial('#81BFBC', { transparent: true, opacity: 0.85 })
      );
      this.introPlanetGroup.add(introWaterMesh);

      const cloudsMesh = new THREE.Mesh(
        introCloudsGeom,
        createAbetoToonMaterial('#ffffff', { transparent: true, opacity: 0.9 })
      );
      this.introPlanetGroup.add(cloudsMesh);
    } catch (e) {
      console.warn('[PlanetScene] Error loading intro meshes:', e);
    }

    // 3. Mount All 10 Real Present Visual Chunks (full_0 to full_9) with atlas.png UV mapping
    try {
      const chunkPromises = [];
      for (let i = 0; i < 10; i++) {
        chunkPromises.push(
          this.assetManager.loadDracoGeometry(`geometries/planets/present/full_${i}.drc`)
        );
      }
      const chunkGeometries = await Promise.all(chunkPromises);

      chunkGeometries.forEach((geom) => {
        prepareDracoGeometry(geom);
        const chunkMat = createPlanetTerrainMaterial(atlasTexture);
        const mesh = new THREE.Mesh(geom, chunkMat);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        this.visualChunkMeshes.push(mesh);
        this.presentPlanetGroup.add(mesh);
      });
      console.log('[PlanetScene] All 10 present visual chunks mounted with storybook terrain palette.');
    } catch (e) {
      console.warn('[PlanetScene] Error loading present chunks:', e);
    }

    // 4. Present Water, Cables, Grass
    try {
      const [waterGeom, cables1Geom, cables2Geom, grassGeom] = await Promise.all([
        this.assetManager.loadDracoGeometry('geometries/planets/present/water.drc'),
        this.assetManager.loadDracoGeometry('geometries/planets/present/cables-1.drc'),
        this.assetManager.loadDracoGeometry('geometries/planets/present/cables-2.drc'),
        this.assetManager.loadDracoGeometry('geometries/planets/present/grass.drc'),
      ]);

      this.waterMesh = new THREE.Mesh(
        waterGeom,
        createAbetoToonMaterial('#81BFBC', { transparent: true, opacity: 0.85 })
      );
      this.presentPlanetGroup.add(this.waterMesh);

      const cablesMat = createAbetoToonMaterial('#373f42');
      this.presentPlanetGroup.add(new THREE.Mesh(cables1Geom, cablesMat));
      this.presentPlanetGroup.add(new THREE.Mesh(cables2Geom, cablesMat));

      this.grassMesh = new THREE.Mesh(
        grassGeom,
        createAbetoToonMaterial('#307A5A')
      );
      this.presentPlanetGroup.add(this.grassMesh);
    } catch (e) {
      console.warn('[PlanetScene] Error loading present environment props:', e);
    }
  }

  /**
   * Fix 3: Loads and mounts wardrobe 3D meshes based on currentWardrobe selection.
   */
  public async loadWardrobeMeshes() {
    try {
      const [baseGeom, topGeom, bottomGeom, hairGeom, shoesGeom] = await Promise.all([
        this.assetManager.loadDracoGeometry('geometries/avatar/accessories/base.drc'),
        this.assetManager.loadDracoGeometry(`geometries/avatar/accessories/top${this.currentWardrobe.topId}.drc`),
        this.assetManager.loadDracoGeometry(`geometries/avatar/accessories/bottom${this.currentWardrobe.bottomId}.drc`),
        this.assetManager.loadDracoGeometry(`geometries/avatar/accessories/hair${this.currentWardrobe.hairId}.drc`),
        this.assetManager.loadDracoGeometry(`geometries/avatar/accessories/shoes${this.currentWardrobe.shoesId}.drc`),
      ]);

      prepareDracoGeometry(baseGeom);
      prepareDracoGeometry(topGeom);
      prepareDracoGeometry(bottomGeom);
      prepareDracoGeometry(hairGeom);
      prepareDracoGeometry(shoesGeom);

      // Compute shared reference bounding box strictly from base.drc
      const sharedAvatarBBox = baseGeom.boundingBox ? baseGeom.boundingBox.clone() : new THREE.Box3();
      this.sharedAvatarBBox = sharedAvatarBBox;

      cacheAvatarRestGeometry(baseGeom, sharedAvatarBBox);
      cacheAvatarRestGeometry(topGeom, sharedAvatarBBox);
      cacheAvatarRestGeometry(bottomGeom, sharedAvatarBBox);
      cacheAvatarRestGeometry(hairGeom, sharedAvatarBBox);
      cacheAvatarRestGeometry(shoesGeom, sharedAvatarBBox);

      if (baseGeom.boundingBox) {
        this.avatarAnimUniforms.uBBoxMin.value.copy(baseGeom.boundingBox.min);
        this.avatarAnimUniforms.uBBoxMax.value.copy(baseGeom.boundingBox.max);
      }

      if (!this.avatarBaseMesh) {
        this.avatarBaseMesh = new THREE.Mesh(baseGeom, createAvatarMaterial('#FFE0BD', this.avatarAnimUniforms));
        this.torsoGroup.add(this.avatarBaseMesh);
        (window as any).avatarBaseMesh = this.avatarBaseMesh;
      } else {
        this.avatarBaseMesh.geometry.dispose();
        this.avatarBaseMesh.geometry = baseGeom;
      }

      if (!this.avatarTopMesh) {
        this.avatarTopMesh = new THREE.Mesh(topGeom, createAvatarMaterial(this.currentWardrobe.jacketColor, this.avatarAnimUniforms));
        this.torsoGroup.add(this.avatarTopMesh);
        (window as any).avatarTopMesh = this.avatarTopMesh;
      } else {
        this.avatarTopMesh.geometry.dispose();
        this.avatarTopMesh.geometry = topGeom;
        (this.avatarTopMesh.material as THREE.MeshToonMaterial).color.set(this.currentWardrobe.jacketColor);
      }

      if (!this.avatarBottomMesh) {
        this.avatarBottomMesh = new THREE.Mesh(bottomGeom, createAvatarMaterial(this.currentWardrobe.pantsColor, this.avatarAnimUniforms));
        this.torsoGroup.add(this.avatarBottomMesh);
      } else {
        this.avatarBottomMesh.geometry.dispose();
        this.avatarBottomMesh.geometry = bottomGeom;
        (this.avatarBottomMesh.material as THREE.MeshToonMaterial).color.set(this.currentWardrobe.pantsColor);
      }

      // Hair mesh is modeled in character space; attach to torsoGroup at (0,0,0) to prevent double Y-offset
      if (!this.avatarHairMesh) {
        this.avatarHairMesh = new THREE.Mesh(hairGeom, createAvatarMaterial(this.currentWardrobe.hairColor, this.avatarAnimUniforms));
        this.torsoGroup.add(this.avatarHairMesh);
      } else {
        this.avatarHairMesh.geometry.dispose();
        this.avatarHairMesh.geometry = hairGeom;
        (this.avatarHairMesh.material as THREE.MeshToonMaterial).color.set(this.currentWardrobe.hairColor);
      }

      if (!this.avatarShoesMesh) {
        this.avatarShoesMesh = new THREE.Mesh(shoesGeom, createAvatarMaterial(this.currentWardrobe.sneakersColor, this.avatarAnimUniforms));
        this.torsoGroup.add(this.avatarShoesMesh);
      } else {
        this.avatarShoesMesh.geometry.dispose();
        this.avatarShoesMesh.geometry = shoesGeom;
        (this.avatarShoesMesh.material as THREE.MeshToonMaterial).color.set(this.currentWardrobe.sneakersColor);
      }
    } catch (e) {
      console.warn('Error loading wardrobe meshes:', e);
    }
  }

  public setWardrobeMesh(category: 'hair' | 'top' | 'bottom' | 'shoes', id: number) {
    if (category === 'hair') this.currentWardrobe.hairId = id;
    if (category === 'top') this.currentWardrobe.topId = id;
    if (category === 'bottom') this.currentWardrobe.bottomId = id;
    if (category === 'shoes') this.currentWardrobe.shoesId = id;
    this.loadWardrobeMeshes();
  }

  public updateWardrobeColors(colors: {
    capColor: string;
    jacketColor: string;
    pantsColor: string;
    sneakersColor: string;
  }) {
    this.currentWardrobe.hairColor = colors.capColor;
    this.currentWardrobe.jacketColor = colors.jacketColor;
    this.currentWardrobe.pantsColor = colors.pantsColor;
    this.currentWardrobe.sneakersColor = colors.sneakersColor;

    if (this.avatarTopMesh) (this.avatarTopMesh.material as THREE.MeshToonMaterial).color.set(colors.jacketColor);
    if (this.avatarBottomMesh) (this.avatarBottomMesh.material as THREE.MeshToonMaterial).color.set(colors.pantsColor);
    if (this.avatarHairMesh) (this.avatarHairMesh.material as THREE.MeshToonMaterial).color.set(colors.capColor);
    if (this.avatarShoesMesh) (this.avatarShoesMesh.material as THREE.MeshToonMaterial).color.set(colors.sneakersColor);
  }

  /**
   * Fix 5: Transitions from intro orbital camera into player follow camera.
   */
  public startTour() {
    this.isInIntro = false;
    this.introPlanetGroup.visible = false;
    this.presentPlanetGroup.visible = true;
    this.assetManager.playSound('camera/whoosh2.ogg', 0.8);
    this.assetManager.playSound('music/bgmusic-highq.ogg', 0.4);
    if (this.physicsLoop.isColliderReady) {
      this.physicsLoop.snapToGround(this.characterState);
    }
  }

  /**
   * Attaches or detaches delivery parcel to player's carrying arm.
   */
  public setDeliveryItem(modelPath: string | null) {
    if (this.deliveryItemMesh) {
      this.rightArmGroup.remove(this.deliveryItemMesh);
      this.deliveryItemMesh = null;
    }

    if (modelPath) {
      this.assetManager.loadDracoGeometry(modelPath).then((geom) => {
        const mat = createAbetoToonMaterial('#FFE600');
        this.deliveryItemMesh = new THREE.Mesh(geom, mat);
        this.deliveryItemMesh.position.set(0.12, -0.25, 0.15);
        this.deliveryItemMesh.scale.setScalar(0.75);
        this.rightArmGroup.add(this.deliveryItemMesh);
      }).catch((e) => console.warn('Could not attach delivery item:', e));
    }
  }

  public update(delta: number, input: { x: number; y: number; jump: boolean; sprint: boolean }) {
    // 1. Intro Camera Orbit Flow
    if (this.isInIntro) {
      this.introOrbitAngle += delta * 0.2;
      const orbitRadius = 60;
      this.camera.position.set(
        Math.cos(this.introOrbitAngle) * orbitRadius,
        35 + Math.sin(this.introOrbitAngle * 0.5) * 8,
        Math.sin(this.introOrbitAngle) * orbitRadius
      );
      this.camera.lookAt(0, 0, 0);
      this.introPlanetGroup.rotateY(delta * 0.05);
      return;
    }

    // 2. Run Spherical Locomotion & Physics with Camera Tangent Basis
    this.physicsLoop.update(delta, this.characterState, input, this.camera);

    // 3. Update CPU Vertex Deformation on Avatar & Wardrobe Meshes (only when moving or airborne)
    const walkPhase = this.physicsLoop.controller.walkPhase;
    const speedRatio = this.physicsLoop.controller.speedRatio;
    const isCarrying = !!this.deliveryItemMesh;
    const airBlend = this.physicsLoop.controller.airBlend;

    const isDeforming = speedRatio > 0.01 || airBlend > 0.01;
    if (isDeforming || (this as any)._wasDeforming) {
      if (this.avatarBaseMesh) updateCharacterGeometry(this.avatarBaseMesh.geometry, walkPhase, speedRatio, isCarrying, airBlend);
      if (this.avatarTopMesh) updateCharacterGeometry(this.avatarTopMesh.geometry, walkPhase, speedRatio, isCarrying, airBlend);
      if (this.avatarBottomMesh) updateCharacterGeometry(this.avatarBottomMesh.geometry, walkPhase, speedRatio, isCarrying, airBlend);
      if (this.avatarHairMesh) updateCharacterGeometry(this.avatarHairMesh.geometry, walkPhase, speedRatio, isCarrying, airBlend);
      if (this.avatarShoesMesh) updateCharacterGeometry(this.avatarShoesMesh.geometry, walkPhase, speedRatio, isCarrying, airBlend);
      (this as any)._wasDeforming = isDeforming;
    }

    // 4. Synchronize Avatar Root & enforce 1:1:1 scale (no squashing)
    this.playerGroup.position.copy(this.characterState.position);
    this.playerGroup.quaternion.copy(this.characterState.quaternion);
    this.playerGroup.scale.set(1, 1, 1);

    // 5. Footstep Audio & Dust Puff
    if (this.characterState.isGrounded && speedRatio > 0.05) {
      this.runCycleTime = this.physicsLoop.controller.walkPhase;
      const currentPhase = Math.sin(this.runCycleTime) > 0 ? 1 : -1;
      if (currentPhase !== this.lastFootstepSide) {
        this.lastFootstepSide = currentPhase;
        this.assetManager.playSound('character/footsteps4.ogg', 0.35);

        // Spawn ground dust puff
        const idx = Math.floor(Math.random() * 30) * 3;
        this.dustPositions[idx] = this.characterState.position.x + (Math.random() - 0.5) * 0.3;
        this.dustPositions[idx + 1] = this.characterState.position.y;
        this.dustPositions[idx + 2] = this.characterState.position.z + (Math.random() - 0.5) * 0.3;
        this.dustGeom.attributes.position.needsUpdate = true;
      }
    }

    // 6. Update 20 Live NPCs Proximity
    this.npcManager.update(this.characterState.position, delta);

    // 7. Spherical Follow Camera with Balanced Behind-the-Shoulder Framing & Obstacle Collision
    this.tempUp.copy(this.characterState.position).normalize();
    if (this.tempUp.lengthSq() < 0.001) this.tempUp.set(0, 1, 0);

    // Character's forward direction is +Z in local space
    const charForward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.characterState.quaternion);
    charForward.addScaledVector(this.tempUp, -charForward.dot(this.tempUp)).normalize();

    // Camera offset behind player (-5.2 along forward) and raised (+2.4 along spherical normal)
    const camOffset = new THREE.Vector3()
      .addScaledVector(this.tempUp, 2.4)
      .addScaledVector(charForward, -5.2);

    const desiredCamPos = this.characterState.position.clone().add(camOffset);
    const safeCamPos = this.physicsLoop.controller.resolveCameraCollision(
      desiredCamPos,
      this.physicsLoop.getColliders()
    );
    this.camera.position.lerp(safeCamPos, 0.12);

    this.cameraTarget.copy(this.characterState.position).addScaledVector(this.tempUp, 1.1);
    this.camera.lookAt(this.cameraTarget);
    this.camera.up.copy(this.tempUp);

    // Dynamic sun light follows player on sphere
    this.sunLight.position
      .copy(this.characterState.position)
      .addScaledVector(this.tempUp, 40)
      .add(new THREE.Vector3(20, 20, 20));
    this.sunLight.target = this.playerGroup;
  }
}
