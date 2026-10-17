// reconstructed_messenger/src/engine/ToonMaterials.ts
import * as THREE from 'three';

/**
 * Bright high-key 5-step RGBA toon ramp (shadows stay >= 76% brightness so colors are never muddy!).
 */
export function createToonGradientMap(): THREE.DataTexture {
  const steps = [195, 212, 228, 242, 255];
  const data = new Uint8Array(steps.length * 4);
  for (let i = 0; i < steps.length; i++) {
    data[i * 4 + 0] = steps[i];
    data[i * 4 + 1] = steps[i];
    data[i * 4 + 2] = steps[i];
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, steps.length, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

export const sharedGradientMap = createToonGradientMap();
export const sharedGradientTexture = sharedGradientMap;

export function createToonGradientTexture(steps: number = 5): THREE.DataTexture {
  return sharedGradientMap;
}

/**
 * Ensures every decoded .drc BufferGeometry has valid normals, bounding box, and Float32 attributes.
 */
export function prepareDracoGeometry(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  if (!geometry.attributes.normal || geometry.attributes.normal.count === 0) {
    geometry.computeVertexNormals();
  }
  if (!geometry.attributes.elementId) {
    const count = geometry.attributes.position.count;
    geometry.setAttribute('elementId', new THREE.Float32BufferAttribute(new Float32Array(count).fill(1), 1));
  } else if (!(geometry.attributes.elementId.array instanceof Float32Array)) {
    geometry.setAttribute(
      'elementId',
      new THREE.Float32BufferAttribute(new Float32Array(geometry.attributes.elementId.array), 1)
    );
  }
  if (!geometry.attributes.uv) {
    const count = geometry.attributes.position.count;
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(count * 2), 2));
  } else if (!(geometry.attributes.uv.array instanceof Float32Array)) {
    geometry.setAttribute(
      'uv',
      new THREE.Float32BufferAttribute(new Float32Array(geometry.attributes.uv.array), 2)
    );
  }
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

let cachedAtlasTexture: THREE.Texture | null = null;

export function getSharedAtlasTexture(): THREE.Texture {
  if (!cachedAtlasTexture) {
    const loader = new THREE.TextureLoader();
    cachedAtlasTexture = loader.load('/assets/atlas.png');
    cachedAtlasTexture.colorSpace = THREE.SRGBColorSpace;
    cachedAtlasTexture.minFilter = THREE.NearestFilter;
    cachedAtlasTexture.magFilter = THREE.NearestFilter;
    cachedAtlasTexture.generateMipmaps = false;
    cachedAtlasTexture.flipY = true;
  }
  return cachedAtlasTexture;
}

/**
 * Storybook terrain/building material that matches original messenger.abeto.co palette.
 */
export function createPlanetTerrainMaterial(atlasTexture?: THREE.Texture | null): THREE.MeshToonMaterial {
  const tex = atlasTexture || getSharedAtlasTexture();
  const mat = new THREE.MeshToonMaterial({
    color: 0xffffff,
    gradientMap: sharedGradientMap,
    vertexColors: false,
    map: tex,
  });

  if (tex) {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.flipY = true;
    tex.needsUpdate = true;
  }

  mat.customProgramCacheKey = () => 'planet_terrain_material_v7';

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.tColors = { value: tex };

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
         varying vec3 vWorldPos;
         varying vec3 vWorldNorm;
         attribute float elementId;
         varying float vElementId;
         varying vec2 vUvCoords;`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vec4 wp = modelMatrix * vec4(position, 1.0);
         vWorldPos = wp.xyz;
         vWorldNorm = normalize(mat3(modelMatrix) * objectNormal);
         vElementId = elementId;
         vUvCoords = uv;`
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
         varying vec3 vWorldPos;
         varying vec3 vWorldNorm;
         varying float vElementId;
         varying vec2 vUvCoords;
         uniform sampler2D tColors;

         vec3 rgb2hsv(vec3 c) {
             vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
             vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
             vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
             float d = q.x - min(q.w, q.y);
             float e = 1.0e-10;
             return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
         }

         vec3 hsv2rgb(vec3 c) {
             vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
             vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
             return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
         }`
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
         vec3 radialUp = normalize(vWorldPos);
         float slope = clamp(dot(normalize(vWorldNorm), radialUp), 0.0, 1.0);
         float height = length(vWorldPos);

         // Verbatim App3D.js terrain vs manmade prop logic
         if (abs(vElementId - 1.0) > 0.5) {
             // Element 0: Manmade structures (houses, roofs, fences, props) sample directly from atlas.png
             diffuseColor.rgb = texture2D(tColors, vUvCoords).rgb;
         } else {
             // Element 1: Mountain and walkable planet terrain
             float n1 = sin(vWorldPos.x * 0.18 + vWorldPos.z * 0.12) * cos(vWorldPos.y * 0.15);
             float n2 = cos(vWorldPos.x * 0.08 - vWorldPos.y * 0.14) * sin(vWorldPos.z * 0.16);
             float triplanarNoise = (n1 + n2) * 0.5;

             float grassMask = step(0.38, slope + triplanarNoise * 0.25);
             float wetMask = 1.0 - step(28.2, height + triplanarNoise * 0.5);

             vec2 colorUV = vUvCoords;
             if (grassMask > 0.5) {
                 colorUV = vec2(0.15, 0.95); // Abeto Storybook Cel Grass
             } else if (wetMask > 0.5) {
                 colorUV = vec2(0.21, 0.54); // Shoreline Wet Sand / Rock
             }

             vec3 sampledColor = texture2D(tColors, colorUV).rgb;
             vec3 hsv = rgb2hsv(sampledColor);
             if (grassMask > 0.5) {
                 hsv.z += triplanarNoise * 0.06;
             }
             diffuseColor.rgb = hsv2rgb(hsv);
         }`
      );
  };

  return mat;
}

/**
 * Avatar & wardrobe animation uniforms for GPU vertex-shader limb articulation.
 */
export interface AvatarAnimUniforms {
  uWalkPhase: { value: number };
  uSpeedRatio: { value: number };
  uIsCarrying: { value: number };
  uBBoxMin: { value: THREE.Vector3 };
  uBBoxMax: { value: THREE.Vector3 };
}

/**
 * Caches initial undeformed vertex positions and stores shared bounding box.
 */
export function cacheAvatarRestGeometry(
  geometry: THREE.BufferGeometry,
  referenceBBox?: THREE.Box3
): void {
  if (!geometry.attributes.normal) {
    geometry.computeVertexNormals();
  }
  geometry.computeBoundingBox();
  const posAttr = geometry.attributes.position as THREE.BufferAttribute;
  if (!geometry.userData.restPositions) {
    geometry.userData.restPositions = new Float32Array(posAttr.array);
  }
  if (referenceBBox) {
    geometry.userData.sharedBBox = referenceBBox.clone();
  } else if (geometry.boundingBox) {
    geometry.userData.sharedBBox = geometry.boundingBox.clone();
  }
}

/**
 * 6-State Articulated Character Deformer:
 * - State 1: Idle breathing & subtle posture sway
 * - State 2 & 3: Jaunty Run & Fast Sprint (2-joint hip+knee heel kick, 2-joint shoulder+elbow pump, torso lean & twist)
 * - State 4: Turn Banking (lateral roll into left/right turns)
 * - State 5: Jump Launch (arms reach up, front knee tucks high, rear leg trails)
 * - State 6: Mid-Air Fall / Landing Squash
 */
export function updateCharacterGeometry(
  geometry: THREE.BufferGeometry,
  walkPhase: number,
  speedRatio: number,
  isCarrying = false,
  airBlend = 0,
  radialSpeed = 0,
  turnLean = 0,
  forwardLean = 0,
  idleTime = 0
): void {
  const rest = geometry.userData.restPositions as Float32Array | undefined;
  const bbox = (geometry.userData.sharedBBox || geometry.boundingBox) as THREE.Box3 | undefined;
  if (!rest || !bbox) return;

  const posAttr = geometry.attributes.position as THREE.BufferAttribute;
  const out = posAttr.array as Float32Array;

  const minX = bbox.min.x, minY = bbox.min.y;
  const sizeX = Math.max(bbox.max.x - bbox.min.x, 0.001);
  const sizeY = Math.max(bbox.max.y - bbox.min.y, 0.001);
  const centerX = minX + 0.5 * sizeX;
  const hipY = minY + 0.47 * sizeY;
  const kneeY = minY + 0.25 * sizeY;
  const shoulderY = minY + 0.74 * sizeY;
  const elbowY = minY + 0.62 * sizeY;

  const groundWeight = 1.0 - airBlend;
  // Crisp double-step run bounce + gentle idle breathing
  const runBounce = Math.abs(Math.sin(walkPhase)) * 0.058 * speedRatio * groundWeight;
  const idleBreathe = Math.sin(idleTime * 2.8) * 0.01 * (1.0 - speedRatio) * groundWeight;
  // Jump rising vs falling blend (-1 = falling, +1 = rising)
  const riseFactor = Math.max(-1.0, Math.min(1.0, radialSpeed / 6.0));

  for (let i = 0; i < rest.length; i += 3) {
    let x = rest[i];
    let y = rest[i + 1];
    let z = rest[i + 2];

    const normX = (x - minX) / sizeX;
    const normY = (y - minY) / sizeY;
    const side = normX >= 0.5 ? 1.0 : -1.0;
    const distCenterX = Math.abs(normX - 0.5);
    const phaseSide = Math.sin(walkPhase) * side;

    // 1. ARMS: 2-Joint Shoulder + Bent-Elbow Runner Pump + Jump/Fall Reach
    if (distCenterX > 0.17 && normY > 0.46 && normY < 0.84) {
      const t = Math.min(Math.max((distCenterX - 0.17) / 0.08, 0.0), 1.0);
      const armWeight = t * t * (3.0 - 2.0 * t);
      const shoulderX = minX + (0.5 + side * 0.17) * sizeX;

      // Fold down from 45-deg A-pose on ground; spread out in mid-air
      const groundFold = 0.66 - 0.10 * speedRatio;
      const airFold = riseFactor > 0 ? 0.22 : 0.16;
      const foldAngle = side * (groundFold * groundWeight + airFold * airBlend) * armWeight;
      const cosF = Math.cos(foldAngle), sinF = Math.sin(foldAngle);
      const rx = x - shoulderX;
      const ry = y - shoulderY;
      x = shoulderX + (rx * cosF - ry * sinF);
      y = shoulderY + (rx * sinF + ry * cosF);

      // Forearm elbow bend during run so arms pump like a runner instead of straight sticks
      if (distCenterX > 0.27) {
        const ft = Math.min(Math.max((distCenterX - 0.27) / 0.08, 0.0), 1.0);
        const elbowBend = (0.85 * speedRatio * groundWeight + 0.35 * airBlend) * ft;
        const cosE = Math.cos(elbowBend), sinE = Math.sin(elbowBend);
        const erY = y - elbowY;
        const erZ = z;
        y = elbowY + (erY * cosE - erZ * sinE);
        z = erY * sinE + erZ * cosE;
      }

      // Shoulder forward/back swing
      const runArmSwing = -phaseSide * 0.78 * speedRatio * groundWeight;
      const jumpArmSwing = (riseFactor * 0.45 - 0.25) * airBlend;
      let swingAngle = (runArmSwing + jumpArmSwing) * armWeight;
      if (isCarrying && side > 0) {
        swingAngle = 0.85 * armWeight;
      }
      const cosS = Math.cos(swingAngle), sinS = Math.sin(swingAngle);
      const ry2 = y - shoulderY;
      const rz2 = z;
      y = shoulderY + (ry2 * cosS - rz2 * sinS);
      z = ry2 * sinS + rz2 * cosS;
    }

    // 2. LEGS: 2-Joint Hip Stride + Knee Bend (Heel Kick on Run & High Knee Tuck on Jump!)
    if (normY < 0.47) {
      const t = Math.min(Math.max((0.47 - normY) / 0.09, 0.0), 1.0);
      const legWeight = t * t * (3.0 - 2.0 * t);

      // Thigh swing at hip
      const runThigh = phaseSide * 0.82 * speedRatio * groundWeight;
      const jumpThigh = (side > 0 ? 0.68 : -0.48) * airBlend;
      const thighAngle = (runThigh + jumpThigh) * legWeight;

      const cosH = Math.cos(thighAngle), sinH = Math.sin(thighAngle);
      const hy = y - hipY;
      const hz = z;
      y = hipY + (hy * cosH - hz * sinH);
      z = hy * sinH + hz * cosH;

      // Lower leg knee bend (heels kick backward during run stride & tuck in mid-air!)
      if (normY < 0.27) {
        const kt = Math.min(Math.max((0.27 - normY) / 0.08, 0.0), 1.0);
        const kneeLift = Math.max(0.0, -Math.cos(walkPhase) * side);
        const runKneeBend = -(0.22 + kneeLift * 1.05) * speedRatio * groundWeight;
        const jumpKneeBend = (side > 0 ? -1.05 : -0.45) * airBlend;
        const kneeAngle = (runKneeBend + jumpKneeBend) * kt;

        const cosK = Math.cos(kneeAngle), sinK = Math.sin(kneeAngle);
        const ky = y - kneeY;
        const kz = z;
        y = kneeY + (ky * cosK - kz * sinK);
        z = ky * sinK + kz * cosK;
      }
    }

    // 3. UPPER BODY COUNTER-TWIST, FORWARD RUN LEAN & TURN BANKING
    const upperWeight = Math.min(Math.max((normY - 0.15) / 0.75, 0.0), 1.0);
    // Torso counter-yaw twist while running
    const twist = -Math.sin(walkPhase) * 0.14 * speedRatio * groundWeight * upperWeight;
    if (Math.abs(twist) > 0.001) {
      const cosT = Math.cos(twist), sinT = Math.sin(twist);
      const tx = x - centerX;
      const tz = z;
      x = centerX + (tx * cosT - tz * sinT);
      z = tx * sinT + tz * cosT;
    }

    // Forward pitch lean when running/sprinting
    const pitch = forwardLean * groundWeight * upperWeight;
    if (Math.abs(pitch) > 0.001) {
      const cosP = Math.cos(pitch), sinP = Math.sin(pitch);
      const py = y - minY;
      const pz = z;
      y = minY + (py * cosP - pz * sinP);
      z = py * sinP + pz * cosP;
    }

    // Lateral roll banking when turning left/right
    const roll = turnLean * upperWeight;
    if (Math.abs(roll) > 0.001) {
      const cosR = Math.cos(roll), sinR = Math.sin(roll);
      const rx = x - centerX;
      const ry = y - minY;
      x = centerX + (rx * cosR - ry * sinR);
      y = minY + (rx * sinR + ry * cosR);
    }

    out[i] = x;
    out[i + 1] = y + runBounce + idleBreathe * upperWeight;
    out[i + 2] = z;
  }

  posAttr.needsUpdate = true;
}

/**
 * Avatar & wardrobe material (clean MeshToonMaterial with shared toon ramp and optional map).
 */
export function createAvatarMaterial(
  color: THREE.ColorRepresentation,
  _animUniforms?: AvatarAnimUniforms,
  options: { map?: THREE.Texture } = {}
): THREE.MeshToonMaterial {
  const mat = new THREE.MeshToonMaterial({
    color,
    gradientMap: sharedGradientMap,
    map: options.map || null,
  });
  return mat;
}

/**
 * General cel-shaded MeshToonMaterial with fallback to procedural storybook palette when map is present.
 */
export function createAbetoToonMaterial(
  color: THREE.ColorRepresentation,
  options: {
    map?: THREE.Texture;
    roughness?: number;
    windSway?: boolean;
    windStrength?: number;
    transparent?: boolean;
    opacity?: number;
  } = {}
): THREE.MeshToonMaterial {
  if (options.map) {
    return createPlanetTerrainMaterial(options.map);
  }

  const mat = new THREE.MeshToonMaterial({
    color,
    gradientMap: sharedGradientMap,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1.0,
  });

  return mat;
}

/**
 * Spheremap Normal & Linear Depth G-Buffer Override Material
 * Generates the tInfo buffer sampled by Abeto's 5-tap outline shader.
 */
export function createInfoGBufferMaterial(camera: THREE.Camera): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      cameraNear: { value: (camera as THREE.PerspectiveCamera).near || 0.2 },
      cameraFar: { value: (camera as THREE.PerspectiveCamera).far || 175.0 },
    },
    vertexShader: `
      #include <common>
      #include <skinning_pars_vertex>

      varying vec3 vViewNormal;
      varying float vViewDepth;

      void main() {
        #include <beginnormal_vertex>
        #include <skinbase_vertex>
        #include <skinnormal_vertex>
        #include <defaultnormal_vertex>
        vViewNormal = normalize(transformedNormal);

        #include <begin_vertex>
        #include <skinning_vertex>
        #include <project_vertex>
        vViewDepth = -mvPosition.z;
      }
    `,
    fragmentShader: `
      uniform float cameraNear;
      uniform float cameraFar;
      varying vec3 vViewNormal;
      varying float vViewDepth;

      vec2 encodeNormalSpheremap(vec3 n) {
        float f = sqrt(8.0 * n.z + 8.0);
        return (n.xy / f * 2.0) * 0.5 + 0.5;
      }

      void main() {
        float linearDepth = clamp((vViewDepth - cameraNear) / (cameraFar - cameraNear), 0.0, 1.0);
        vec2 encNormal = encodeNormalSpheremap(normalize(vViewNormal));
        gl_FragColor = vec4(linearDepth, encNormal, 1.0);
      }
    `,
  });
}

/**
 * Decompiled Post-Processing 5-Tap Comic Ink Outline Shader
 * Extracted verbatim from App3D.js#L5604-L5720 (Messenger by Abeto)
 */
export const AbetoComicOutlineShader = {
  uniforms: {
    tDiffuse: { value: null },
    tInfo: { value: null }, // R = linear depth, GB = octahedral normal, A = contribution
    uOutlineColor: { value: new THREE.Color('#373f42') }, // Ground-truth comic ink
    uOutlineThickness: { value: 1.2 },
    uOutlineFade: { value: new THREE.Vector2(50.0, 300.0) },
    uNormalRange: { value: new THREE.Vector3(0.4, 0.5, 0.3) },
    uDepthRange: { value: new THREE.Vector3(0.0035, 0.015, 0.25) },
    uSmoothMargin: { value: 0.2 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    cameraNear: { value: 0.2 },
    cameraFar: { value: 175.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform sampler2D tInfo;
    uniform vec3 uOutlineColor;
    uniform float uOutlineThickness;
    uniform vec2 uOutlineFade;
    uniform vec3 uNormalRange;
    uniform vec3 uDepthRange;
    uniform float uSmoothMargin;
    uniform vec2 uResolution;
    uniform float cameraNear;
    uniform float cameraFar;

    varying vec2 vUv;

    vec3 decodeNormalSpheremap(vec2 n) {
      vec2 uncompressed = n * 2.0 - 1.0;
      vec4 nn = vec4(uncompressed, 1.0, -1.0);
      float l = dot(nn.xyz, -nn.xyw);
      nn.z = l;
      nn.xy *= sqrt(max(l, 0.00001));
      return normalize(nn.xyz * 2.0 + vec3(0.0, 0.0, -1.0));
    }

    void main() {
      vec4 baseColor = texture2D(tDiffuse, vUv);
      vec4 info0 = texture2D(tInfo, vUv);

      // If background / sky or zero contribution, preserve beauty base color
      if (info0.a < 0.01) {
        gl_FragColor = baseColor;
        return;
      }

      vec2 texelSize = 1.0 / uResolution;
      vec2 offset = texelSize * uOutlineThickness;

      // 5-tap kernel: Center, Left, Right, Down, Up
      vec4 info1 = texture2D(tInfo, vUv + vec2(-offset.x, 0.0));
      vec4 info2 = texture2D(tInfo, vUv + vec2(offset.x, 0.0));
      vec4 info3 = texture2D(tInfo, vUv + vec2(0.0, -offset.y));
      vec4 info4 = texture2D(tInfo, vUv + vec2(0.0, offset.y));

      float d0 = info0.r;
      float d1 = info1.r;
      float d2 = info2.r;
      float d3 = info3.r;
      float d4 = info4.r;

      vec3 n0 = decodeNormalSpheremap(info0.gb);
      vec3 n1 = decodeNormalSpheremap(info1.gb);
      vec3 n2 = decodeNormalSpheremap(info2.gb);
      vec3 n3 = decodeNormalSpheremap(info3.gb);
      vec3 n4 = decodeNormalSpheremap(info4.gb);

      vec3 centerNormal = n0;
      float centerDepth = d0;
      float centerContrib = info0.a;

      // Second derivative (Laplacian) depth discontinuities
      vec2 depthVar = vec2(
        (d1 - d0) - (d2 - d0),
        (d3 - d0) - (d4 - d0)
      );
      vec2 normalVar = vec2(
        distance(n1, centerNormal) - distance(n2, centerNormal),
        distance(n3, centerNormal) - distance(n4, centerNormal)
      );

      float totalDepthVar = length(depthVar);
      float totalNormalVar = length(normalVar);

      // Adaptive slope thresholding: prevents smooth continuous planetary slopes from receiving outlines
      float slopeFactor = 1.0 + (1.0 - clamp(abs(centerNormal.z), 0.0, 1.0)) * 2.5;
      float depthThreshold = uDepthRange.x * slopeFactor;
      float depthEdge = smoothstep(depthThreshold, depthThreshold * 2.5, totalDepthVar);

      // Normal crease thresholding for sharp architectural & cliff edges
      float normalEdge = smoothstep(uNormalRange.x, uNormalRange.y, totalNormalVar);

      float edgeFactor = clamp(depthEdge + normalEdge, 0.0, 1.0);

      // Distance fade check (fade out far silhouettes)
      float viewDist = cameraNear + centerDepth * (cameraFar - cameraNear);
      float fade = smoothstep(uOutlineFade.y, uOutlineFade.x, viewDist);
      edgeFactor *= fade * centerContrib;

      // Composite authentic comic ink (#373f42) over beauty color
      vec3 finalColor = mix(baseColor.rgb, uOutlineColor, edgeFactor);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};
