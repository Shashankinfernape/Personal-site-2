# Reverse Engineering Evidence Dossier: Messenger by Abeto
**Target Application:** [https://messenger.abeto.co/](https://messenger.abeto.co/)  
**Analysis Engine:** `morluto/rea` (AST Decompiler & Evidence-Backed Runtime Tracer)  
**Investigation Scope:** WebGL2 Multi-Pass Pipeline, 5-Step Cel/Toon Shading, Comic Edge Ink Detection, Spherical Planetary Physics, three-mesh-bvh Collision Resolution, and Cloud Run Protobuf WebSocket Synchronization.

---

## 1. Artifact Inventory & Cryptographic Module Map

The table below maps all captured runtime chunks and evidence artifacts located in `./target_artifacts/messenger_abeto/` to their verified SHA-256 digests, size, and architectural role:

| Artifact File | Size | SHA-256 Digest | Reconstructed Architectural Role |
|---|---|---|---|
| `App3D.js` | 1.92 MB | `3B146C7D69D309B3AF364E5198880D5975DAE2B6DAEA496E89F8206BB91449D7` | Core WebGL2 Simulation Engine, Shaders, Character Controller, & MicroRealm WebSocket Client |
| `webgl.js` | 3.82 KB | `5B90D83CECCF7A770955637E8D5944F14877CCC7FD6EE390A16148F626BEBE91` | DOM Host Injector, WebGL2 Capability Validator, & Svelte 5 Runtime Bootstrapper |
| `index.html` | 6.25 KB | `35C434987C030B80D9518943CF6249C4E4F7AAD3837E061C3CA4AE6036F4C768` | Shell Entrypoint, PWA Viewport Configuration, & Canvas Container |
| `style.css` | 1.49 KB | `9F4EECF7A0F3F57040EF6D0154AD383EB4DF76FA51D8F288372E790E701EA277` | Viewport CSS Reset, Hand-Drawn Font Imports, & HUD Overlay Positioning |
| `bundle-analysis.json`| 20.7 KB| `6D4A19DDC92511B55500C71B109D404A08411128E0157F0D375DE9285353AB0F` | AST Node Graph & WebGL Extension Fingerprint Ledger (364,132 visited AST nodes) |
| `runtime-inspection.json`| 1.76 KB| `5416E20A99FA0B1C6646BD493164A40498181CFE2414D71734228B14729979EC` | Active WebGL2 Context State, Extensions, & Screen Viewport Geometry |
| `drc-assets.json` | 25.3 KB| `65A5F0DE0AE0664908896F68DCC537F6FDA96FF42333AE50368F82484DC02989` | 146 Draco-compressed Geometries (Planet Chunks, Hitmeshes, Avatar Outfits, Props) |
| `npcs.json` | 9.23 KB| `68CA2D16A321877D3D64221D52D3A9B1A1A31968A30D6E399877C62962EA709E` | 20 Non-Player Character Rig Definitions, Bone Attachments, & Waypoints |
| `quests.json` | 9.28 KB| `80CA6E7D1ADFE43A0915203082263B07E4AE013368C248A035D306C4E9DACF60` | 5 Core Delivery Quests State Machine, Dialog Chains, & Hand Bone Items |
| `gameplay-state.json`| 3.18 KB| `C7D16AB4E891A13F7E90865CF105FD3698092D1FB6DE9DD6DA0D2A40D1FDC159` | Active Player Coordinate Baselines, Wardrobe Configurations, & Flags |

---

## 2. WebGL2 Render Pipeline & Custom Shaders Specification

### 2.1 Multi-Render-Target (MRT) Dual-Buffer Geometry Pass
Messenger configures a custom `MultipleRenderPass` (`App3D.js#L4252`) rendering simultaneously to a dual-texture `WebGLRenderTarget`:
- **Format:** `THREE.HalfFloatType` (or `THREE.FloatType` fallback)
- **Attachment 0 (`tColor`):** Cel-toned diffuse lighting and base albedo colors.
- **Attachment 1 (`tInfo`):** Encodes camera linear depth in Channel `R`, octahedral surface normal in Channels `GB`, and object surface contribution factor in Channel `A`.

### 2.2 Octahedral Normal Encoding & Decoding
Extracted verbatim from `App3D.js#L4268-L4280`:
```glsl
vec2 encodeNormal(vec3 n) {
    n /= (abs(n.x) + abs(n.y) + abs(n.z));
    return (n.z >= 0.0) ? n.xy : (1.0 - abs(n.yx)) * sign(n.xy);
}

vec3 decodeNormal(vec2 f) {
    vec3 n = vec3(f, 1.0 - abs(f.x) - abs(f.y));
    float t = max(-n.z, 0.0);
    n.x += (n.x > 0.0) ? -t : t;
    n.y += (n.y > 0.0) ? -t : t;
    return normalize(n);
}

vec2 encodeNormalSpheremap(vec3 n) {
    float f = sqrt(8.0 * n.z + 8.0);
    return n.xy / f * 2.0;
}

vec3 decodeNormalSpheremap(vec2 n) {
    vec4 nn = vec4(n.xy, 1.0, -1.0);
    float l = dot(nn.xyz, -nn.xyw);
    nn.z = l;
    nn.xy *= sqrt(l);
    return nn.xyz * 2.0 + vec3(0.0, 0.0, -1.0);
}
```

### 2.3 Comic Book Ink Outline Post-Processing Shader
Extracted verbatim from `App3D.js#L5604-L5720` (`custom_default` and `outlines$1`):
```glsl
float outline(
    sampler2D tColor, 
    sampler2D tInfo, 
    vec2 uv, 
    float outlineWidth, 
    float scale, 
    vec3 idRange, 
    vec3 depthRange, 
    vec3 normalRange, 
    float rangeSmoothMargin, 
    float idMinScale, 
    vec2 distanceFadeRange, 
    vec2 nearFar, 
    inout float nearestDepth,
    inout float centDepth
) {
    vec2 offset = 1.0 / vec2(textureSize(tInfo, 0)) * outlineWidth * scale;

    float contributions[5];
    float faceIds[5];
    float depths[5];
    vec3 normals[5];

    vec2 dirs[5] = vec2[5](vec2(0, 0), vec2(-1, 0), vec2(1, 0), vec2(0, -1), vec2(0, 1)); 
    vec4 n; vec2 dir;
    #pragma unroll_loop_start
    for (int i = 0; i < 5; i++) {
        dir = dirs[i];
        n = texture(tInfo, uv + offset * dir); 
        contributions[i] = n.a; 
        depths[i] = getLinearDepth(1.0 - n.r, nearFar.x, nearFar.y);
        normals[i] = decodeNormalSpheremap(n.gb);
        faceIds[i] = texture(tColor, uv + offset * dir).a;
    }
    #pragma unroll_loop_end

    float centerId = faceIds[0];
    float centerDepth = depths[0];
    float centerContribution = contributions[0];
    vec3 centerNormal = normals[0];
    centDepth = centerDepth;

    vec2 idVariation = vec2((faceIds[1] - centerId) - (faceIds[2] - centerId), (faceIds[3] - centerId) - (faceIds[4] - centerId));
    vec2 depthVariation = vec2((depths[1] - centerDepth) - (depths[2] - centerDepth), (depths[3] - centerDepth) - (depths[4] - centerDepth));
    vec2 normalVariation = vec2(distance(normals[1], centerNormal) - distance(normals[2], centerNormal), distance(normals[3], centerNormal) - distance(normals[4], centerNormal));

    float idVariationTotal = sqrt((idVariation.x * idVariation.x) + (idVariation.y * idVariation.y));
    float depthVariationTotal = sqrt((depthVariation.x * depthVariation.x) + (depthVariation.y * depthVariation.y));
    float normalVariationTotal = sqrt((normalVariation.x * normalVariation.x) + (normalVariation.y * normalVariation.y));

    float idContribution = fit(fit(idVariationTotal, idRange.x, idRange.y, 0.0, 1.0), idRange.z, idRange.z + rangeSmoothMargin, 0.0, 1.0);
    idContribution = mix(idContribution * idMinScale, idContribution, clamp(scale, 0.0, 1.0));

    float normalContribution = fit(fit(normalVariationTotal, normalRange.x, normalRange.y, 0.0, 1.0), normalRange.z, normalRange.z + rangeSmoothMargin, 0.0, 1.0);

    float depthLimit = depthRange.z + 1.0 - centerNormal.z;
    float depthContribution = fit(fit(depthVariationTotal, depthRange.x, depthRange.y, 0.0, 1.0), depthLimit, depthLimit + rangeSmoothMargin, 0.0, 1.0);

    float minDepth = centerDepth;
    float minContrib = centerContribution;

    #pragma unroll_loop_start
    for (int i = 1; i < 5; i++) {
        if (depths[i] < minDepth) {
            minDepth = depths[i];
            minContrib = contributions[i];
        }
    }
    #pragma unroll_loop_end

    nearestDepth = minDepth;

    if (minDepth < centerDepth) {
        if (minContrib > centerContribution) centerContribution = max(centerContribution, ceil(minContrib));
        else centerContribution = min(centerContribution, floor(minContrib));
    }

    float viewZ = -orthographicDepthToViewZ(minDepth, nearFar.x, nearFar.y);
    centerContribution *= fit(viewZ, distanceFadeRange.x, distanceFadeRange.y, 1.0, 0.0);

    return clamp(idContribution + normalContribution + depthContribution, 0.0, 1.0) * centerContribution;
}
```

### 2.4 Ground-Truth Outline Uniform Defaults
Extracted from `customUniforms$1.planet` (`App3D.js#L5680`):
- `uOutlineColor`: `THREE.Color("#373f42")` (Graphite Comic Ink)
- `uOutlineThickness`: `1.0`
- `uOutlineFade`: `Vector2(50.0, 300.0)`
- `uInfoRange`: `Vector3(0.0001, 0.0002, 0.1)`
- `uInfoMinScale`: `0.6`
- `uDepthRange`: `Vector3(0.0001, 0.01001, 0.25)`
- `uNormalRange`: `Vector3(0.4, 0.5, 0.3)`
- `uOutlineScale`: `1.0`
- `uSmoothMargin`: `0.2`
- `tLUT`: `lut.ktx2` tetrahedral color lookup table (`uLUTIntensity = 1.0`)

---

## 3. Physics & Spherical Planetary Math Specification

### 3.1 Planetary Coordinate & Radial Gravity Vector
The world is a curved spherical planet centered at origin `(0, 0, 0)`.
1. **Up Vector (Planetary Surface Normal):**
   $$\mathbf{up} = \frac{\mathbf{P}}{\|\mathbf{P}\|}$$
2. **Inward Radial Gravity Acceleration:**
   $$\mathbf{a}_{gravity} = -\mathbf{up} \cdot g, \quad g = 18.0 \, \text{m/s}^2$$
3. **Character Quaternion Re-alignment:**
   $$\mathbf{q}_{align} = \text{setFromUnitVectors}((0, 1, 0), \mathbf{up})$$
   The player's yaw is calculated around this dynamic normal:
   $$\mathbf{q}_{player} = \mathbf{q}_{align} \times \text{setFromAxisAngle}((0, 1, 0), \theta_{heading})$$

### 3.2 three-mesh-bvh Collision Resolution
- **Hitmesh Compilation:** 5 Draco geometries (`hitmesh_0.drc` through `hitmesh_4.drc`) merged via `mergeGeometries(...)`.
- **Character Collider Capsule:**
  - `radius = 0.35`
  - `segment = Line3(Vector3(0, 0.35, 0), Vector3(0, 1.45, 0))` (total height = 1.80m)
- **Fixed Physics Loop (60 Hz):**
  - Timestep: `FIXED_DT = 1.0 / 60.0` (~16.66ms).
  - Accumulator loop runs `worldBvh.shapecast()` up to 5 substeps per frame.
  - Resolves floor adhesion, slope sliding, stair stepping up to 0.45m, and horizontal wall repulsion.

### 3.3 Spherical Follow Camera Controller (`followCamera`)
- **Follow Catch-up Lerp:** `cameraTargetLocalLerp = 0.0125`
- **Framing Displacement:** `Vector3(-0.65, 0.0, 1.0)` (offsets the player slightly to the left on 16:9 screens)
- **Spherical Smoothing:** Orthonormal local basis built from $\mathbf{up}_{player}$ to prevent camera inversion when traversing South Pole (`phi = \pi`).

---

## 4. Real-Time Multiplayer Protocol (`MicroRealmConnection`)

### 4.1 Connection Specifications
- **Authoritative Endpoint:** `wss://multiplayer-server-76608060529.us-central1.run.app`
- **Protocol:** WebSocket with `permessage-deflate`, `binaryType = 'arraybuffer'`
- **Tick Rate:** `35ms` broadcast interval (~28 updates/sec)
- **Heartbeat Ping:** `20s` keepalive

### 4.2 Protobuf Wire Schema (`player.proto`)
```protobuf
syntax = "proto3";

message PlayerState {
    string id = 1;
    repeated float p = 2; // [x, y, z] position on sphere
    repeated float r = 3; // [rx, ry, rz] Euler rotation
    uint32 medium = 4;    // 0: GROUND, 1: AIR, 2: WATER
    uint32 animation = 5; // 0: IDLE, 1: WALK, 2: RUN, 3: AIR, 4: AFK
    string bonesFile = 6;
    repeated string modelFiles = 7;
    repeated string animationFiles = 8;
    string tag = 9;
    string networkEvent = 10;
}
```

### 4.3 Client Interpolation & State Smoothing
Remote players are rendered via `characterBatchedSkinnedMesh`. State packets are buffered and smoothed per frame using exponential damping:
$$\mathbf{P}_{render} = \text{THREE.MathUtils.damp}(\mathbf{P}_{current}, \mathbf{P}_{target}, \lambda = 18.0, \Delta t)$$
$$\mathbf{Q}_{render} = \mathbf{Q}_{current}.\text{slerp}(\mathbf{Q}_{target}, 1.0 - e^{-\lambda \Delta t})$$

---

## 5. Residual Unknowns Ledger (`audit_residual_unknowns`)

| Subsystem | Residual Unknown | Rationale / Mitigation |
|---|---|---|
| **Server-Side Room Partitioning** | Exact geographic spatial hashing algorithm used in Cloud Run server | Unknown server-side code; mitigated by standard spatial bucket / room prefix `planets-default` |
| **Draco Quantization Matrix** | Specific position/normal/uv bit quantization flags passed to Draco encoder | Solved by standard `DRACOLoader` decoding with 16-bit vertex attributes |
| **Audio HRTF Impulse Responses** | Custom binaural convolution filters for Smelly Falls cave reverb | Client uses WebAudio `PannerNode` with `panningModel: "HRTF"` and `distanceModel: "inverse"` |

---
**Status:** Verification Complete. Proceeding to Phase 4 Clean-Room Reconstruction (`./reconstructed_messenger/`).
