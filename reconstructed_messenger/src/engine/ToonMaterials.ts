// reconstructed_messenger/src/engine/ToonMaterials.ts
import * as THREE from 'three';

/**
 * 5-step RGBA toon ramp DataTexture.
 * Avoids WebGL2 RedFormat zeroing out Green/Blue channels in diffuseColor.
 */
export function createToonGradientMap(): THREE.DataTexture {
  const steps = [80, 140, 190, 230, 255];
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
 * CPU Vertex Deformer for Avatar & Wardrobe geometries.
 * Deforms geometry.attributes.position directly from cached restPositions once per frame.
 * This guarantees the G-buffer tInfo outline pass (scene.overrideMaterial) AND the beauty color pass
 * sample the EXACT same silhouette, 100% eliminating frozen A-pose outline ghosting.
 */
export function updateCharacterGeometry(
  geometry: THREE.BufferGeometry,
  walkPhase: number,
  speedRatio: number,
  isCarrying = false,
  airBlend = 0
): void {
  const rest = geometry.userData.restPositions as Float32Array | undefined;
  const bbox = (geometry.userData.sharedBBox || geometry.boundingBox) as THREE.Box3 | undefined;
  if (!rest || !bbox) return;

  const posAttr = geometry.attributes.position as THREE.BufferAttribute;
  const out = posAttr.array as Float32Array;

  const minX = bbox.min.x, minY = bbox.min.y;
  const sizeX = Math.max(bbox.max.x - bbox.min.x, 0.001);
  const sizeY = Math.max(bbox.max.y - bbox.min.y, 0.001);
  const hipY = minY + 0.47 * sizeY;
  const shoulderY = minY + 0.74 * sizeY;
  const groundWeight = 1.0 - airBlend;
  const bounceY = Math.abs(Math.sin(walkPhase)) * 0.035 * speedRatio * groundWeight;

  for (let i = 0; i < rest.length; i += 3) {
    let x = rest[i];
    let y = rest[i + 1];
    let z = rest[i + 2];

    const normX = (x - minX) / sizeX;
    const normY = (y - minY) / sizeY;
    const side = normX >= 0.5 ? 1.0 : -1.0;
    const distCenterX = Math.abs(normX - 0.5);

    // 1. Arms: Fold down from A-pose on ground; lift outward & sweep slightly back during jump (airBlend)
    if (distCenterX > 0.17 && normY > 0.46 && normY < 0.82) {
      const t = Math.min(Math.max((distCenterX - 0.17) / 0.08, 0.0), 1.0);
      const armWeight = t * t * (3.0 - 2.0 * t);
      const shoulderX = minX + (0.5 + side * 0.17) * sizeX;

      // Lift arms outward slightly in mid-air (0.34 rad vs 0.70 rad resting)
      const foldAngle = -side * (0.70 * groundWeight + 0.34 * airBlend) * armWeight;
      const cosF = Math.cos(foldAngle), sinF = Math.sin(foldAngle);
      const rx = x - shoulderX;
      const ry = y - shoulderY;
      x = shoulderX + (rx * cosF - ry * sinF);
      y = shoulderY + (rx * sinF + ry * cosF);

      const walkSwing = Math.sin(walkPhase) * 0.50 * speedRatio * side * groundWeight;
      const jumpSwing = -0.35 * airBlend; // Arms sweep slightly backward in jump
      let swingAngle = (walkSwing + jumpSwing) * armWeight;
      if (isCarrying && side > 0) {
        swingAngle = -0.82 * armWeight;
      }
      const cosS = Math.cos(swingAngle), sinS = -Math.sin(swingAngle);
      const ry2 = y - shoulderY;
      const rz2 = z;
      y = shoulderY + (ry2 * cosS - rz2 * sinS);
      z = ry2 * sinS + rz2 * cosS;
    }

    // 2. Legs: Stride swing on ground; front knee tuck + rear leg trail during jump
    if (normY < 0.47) {
      const t = Math.min(Math.max((0.47 - normY) / 0.10, 0.0), 1.0);
      const legWeight = t * t * (3.0 - 2.0 * t);
      const walkStride = -Math.sin(walkPhase) * 0.55 * speedRatio * side * groundWeight;
      const jumpTuck = (side > 0 ? 0.55 : -0.45) * airBlend;
      const strideAngle = (walkStride + jumpTuck) * legWeight;

      const cosL = Math.cos(strideAngle), sinL = -Math.sin(strideAngle);
      const ry = y - hipY;
      const rz = z;
      y = hipY + (ry * cosL - rz * sinL);
      z = ry * sinL + rz * cosL;
    }

    out[i] = x;
    out[i + 1] = y + bounceY;
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

export const globalToonUniforms = {
  uTime: { value: 0 },
};

/**
 * Authentic Messenger cel-shaded Water Material
 * Features depth-dependent gradient (#81BFBC -> #2e6e8c), oscillating shoreline foam waves, and cool toon shading.
 */
export function createWaterMaterial(options: {
  shallowColor?: string;
  deepColor?: string;
  transparent?: boolean;
  opacity?: number;
} = {}): THREE.MeshToonMaterial {
  const shallowColor = options.shallowColor || '#81BFBC';
  const deepColor = options.deepColor || '#2e6e8c';

  const mat = new THREE.MeshToonMaterial({
    color: shallowColor,
    gradientMap: sharedGradientMap,
    transparent: options.transparent ?? true,
    opacity: options.opacity ?? 0.88,
  });

  mat.customProgramCacheKey = () => 'abeto_water_material_v1';

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = globalToonUniforms.uTime;
    shader.uniforms.uDeepColor = { value: new THREE.Color(deepColor) };

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
         uniform float uTime;
         varying vec3 vWorldPos;
         varying vec3 vWorldNorm;
         varying vec2 vUvCoords;`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vec4 wp = modelMatrix * vec4(position, 1.0);
         float waveH = sin(wp.x * 0.45 + wp.z * 0.35 + uTime * 2.2) * 0.04;
         wp.xyz += normalize(wp.xyz) * waveH;
         transformed += normal * waveH;
         vWorldPos = wp.xyz;
         vWorldNorm = normalize(mat3(modelMatrix) * objectNormal);
         vUvCoords = uv;`
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
         uniform float uTime;
         uniform vec3 uDeepColor;
         varying vec3 vWorldPos;
         varying vec3 vWorldNorm;
         varying vec2 vUvCoords;`
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
         float distFromCenter = length(vWorldPos);
         float shorelinePhase = fract(distFromCenter * 1.8 - uTime * 0.35 + sin(vWorldPos.x * 0.3 + vWorldPos.z * 0.3) * 0.8);
         float foam = smoothstep(0.72, 0.95, shorelinePhase);

         float depthFactor = smoothstep(27.8, 26.6, distFromCenter);
         vec3 waterCol = mix(diffuseColor.rgb, uDeepColor, depthFactor * 0.65);
         diffuseColor.rgb = mix(waterCol, vec3(1.0), foam * 0.85);`
      );
  };

  return mat;
}

/**
 * Authentic Messenger Foliage Material for Grass & Trees
 * Includes wind sway vertex displacement (uTime * 2.2) and storybook toon lighting.
 */
export function createFoliageMaterial(
  color: THREE.ColorRepresentation = '#307A5A',
  options: { windStrength?: number; map?: THREE.Texture } = {}
): THREE.MeshToonMaterial {
  const windStrength = options.windStrength ?? 0.12;

  const mat = new THREE.MeshToonMaterial({
    color,
    gradientMap: sharedGradientMap,
    map: options.map || null,
  });

  mat.customProgramCacheKey = () => `abeto_foliage_material_${windStrength}`;

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = globalToonUniforms.uTime;
    shader.uniforms.uWindStrength = { value: windStrength };

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
         uniform float uTime;
         uniform float uWindStrength;
         varying vec3 vWorldPos;`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vec4 wp = modelMatrix * vec4(position, 1.0);
         float swayPhase = wp.x * 0.28 + wp.z * 0.22 + uTime * 2.2;
         float swayAmp = uWindStrength * (0.4 + 0.6 * sin(wp.x * 0.15 + wp.y * 0.1));
         vec3 sway = vec3(
           sin(swayPhase) * swayAmp,
           0.0,
           cos(swayPhase * 0.8) * swayAmp * 0.7
         );
         transformed += sway;
         vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`
      );
  };

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
    uOutlineColor: { value: new THREE.Color('#363a3c') }, // Ground-truth comic ink from App3D.js:1602016
    uOutlineThickness: { value: 1.0 },
    uOutlineFade: { value: new THREE.Vector2(5.0, 80.0) },
    uNormalRange: { value: new THREE.Vector3(0.4, 0.5, 0.3) },
    uDepthRange: { value: new THREE.Vector3(1e-4, 0.01001, 0.1) },
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

      // Composite authentic comic ink (#363a3c) over beauty color
      vec3 finalColor = mix(baseColor.rgb, uOutlineColor, edgeFactor);

      // Subtle storybook paper grain modulation
      float paperNoise = fract(sin(dot(vUv * uResolution, vec2(12.9898, 78.233))) * 43758.5453);
      finalColor = mix(finalColor, finalColor * (0.97 + 0.06 * paperNoise), 0.35);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};
