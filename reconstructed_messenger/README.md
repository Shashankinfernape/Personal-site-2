# Messenger by Abeto — Clean-Room WebGL & Multiplayer Reconstruction

This directory contains the clean-room, runnable **Vite + Svelte 5 + Three.js + three-mesh-bvh** reconstruction of **[Messenger by Abeto](https://messenger.abeto.co/)**, reverse engineered using `morluto/rea`.

---

## 1. System Architecture

- **`src/engine/Renderer.ts`:**
  - WebGL2 high-performance renderer with PCFSoft cascaded shadow mapping.
  - Multi-pass `EffectComposer` pipeline integrating high-quality SMAA antialiasing and the verbatim decompiled comic ink outline shader (`#373f42`).
- **`src/engine/ToonMaterials.ts`:**
  - 5-step `DataTexture` toon ramp (`NearestFilter` + `RedFormat`) reproducing Abeto's signature storybook cel shading.
  - Inverted-hull `THREE.BackSide` normal extrusion outline helper.
  - Decompiled 5-tap kernel depth/normal/contribution edge detection shader (`App3D.js#L5604-L5720`).
- **`src/engine/PhysicsLoop.ts`:**
  - 60 Hz fixed-timestep accumulator (`FIXED_DT = 1.0 / 60.0`).
  - Spherical radial gravity ($g = 18.0 \, \text{m/s}^2$) accelerating toward planet origin `(0, 0, 0)`.
  - Dynamic surface normal quaternion re-alignment (`setFromUnitVectors`).
  - `three-mesh-bvh` capsule collider shapecast (`bvh.shapecast()`) with zero-GC math vector pre-allocation.
- **`src/engine/PlanetScene.ts`:**
  - Spherical terrain base with procedural hills and surface tree foliage.
  - Spherical follow camera controller with local orthonormal basis from surface normal, `cameraTargetLocalLerp = 0.0125`, and displacement offset `[-0.65, 0, 1]`.
- **`src/network/MultiplayerClient.ts`:**
  - Real-time WebSocket connection to Cloud Run or local authoritative server.
  - 35ms update throttling loop (~28 updates/sec).
  - Remote player damp smoothing (`THREE.MathUtils.damp`, $\lambda = 18.0$).
- **`server/index.ts`:**
  - Local authoritative Node.js WebSocket server (`ws://localhost:8080`) supporting room broadcasting and peer departures.
- **`src/ui/` (Svelte 5 Runes):**
  - `HudOverlay.svelte` (Side buttons: Quests, Wardrobe, Emojis, Audio)
  - `WardrobeModal.svelte` (Modular swatch customizer for Cap, Jacket, Pants)
  - `QuestNotebook.svelte` (Delivery quest checklist tracking 5 story deliveries)
  - `DialogBubble.svelte` (Hand-drawn comic speech bubbles with projected 2D screen coordinates)

---

## 2. Quick Start

### Start the Local Multiplayer WebSocket Server:
```bash
npm run server
```

### Start the 3D Client (Vite Dev Server):
```bash
npm run dev
```

### Production Build:
```bash
npm run build
```
