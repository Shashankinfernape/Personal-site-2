// src/canvas/shaders/IceCrystalShader.ts
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

/**
 * Reverse-Engineered from igloo-inc-analysis (Block [52] of App3D-d68cb154.js)
 * and other-side-of-truth-analysis (WebGL noise grain & UV wireframe shader).
 * Features:
 * - 5-Iteration Chromatic Aberration loop
 * - IOR 1.18 Pure Ice Refractive Index
 * - Procedural Hash31 Voronoi Facet Displacement
 * - Velocity Slope Displacement: (scrollVel * 0.4)
 * - Proximity Frost Melt / Shatter Outward Explosion
 * - fwidth() screen-space derivative UV wireframe for [R] X-Ray Mode
 */
export const IceCrystalMaterial = shaderMaterial(
  {
    uTime: 0,
    uCrystalSeed: 1.0,
    uAccentColor: new THREE.Color('#00F5D4'),
    uProximityMelt: 0.0, // 0.0 = frozen crystal, 1.0 = shattered/melted open
    uScrollVelocity: 0.0,
    uXRayMode: 0.0,
  },
  // VERTEX SHADER
  /* glsl */ `
    uniform float uTime;
    uniform float uCrystalSeed;
    uniform float uProximityMelt;
    uniform float uScrollVelocity;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec2 vUv;
    varying float vFacetNoise;
    varying float vChromaSlope;

    // 3D hash from Igloo Inc procedural crystal growth
    float hash31(vec3 p) {
      p = fract(p * 0.1031);
      p += dot(p, p.yzx + 33.33);
      return fract((p.x + p.y) * p.z);
    }

    void main() {
      vUv = uv;

      // Quantize coordinates to create sharp procedural crystal facets (Igloo Inc. technique)
      vec3 facetedPos = position;
      float crystalFacet = hash31(floor(position * 3.8 + uCrystalSeed));
      vFacetNoise = crystalFacet;

      // Velocity slope displacement (from Igloo Inc App3D line 118)
      float slopeDisp = (crystalFacet * 2.0 - 1.0) * min(uScrollVelocity * 0.0006, 0.35);
      vChromaSlope = slopeDisp;

      // Expand and displace shards outward as camera approaches (uProximityMelt -> 1.0)
      float growth = (crystalFacet - 0.5) * 0.48 * (1.0 - uProximityMelt * 0.8);
      float shatterExplode = uProximityMelt * 0.42 * sin(uTime * 3.0 + crystalFacet * 6.28);
      facetedPos += normal * (growth + shatterExplode + slopeDisp * 0.2);

      vec4 worldPosition = modelMatrix * vec4(facetedPos, 1.0);
      vWorldPos = worldPosition.xyz;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  // FRAGMENT SHADER
  /* glsl */ `
    #define CA_ITERATIONS 5

    uniform float uTime;
    uniform vec3 uAccentColor;
    uniform float uProximityMelt;
    uniform float uScrollVelocity;
    uniform float uXRayMode;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec2 vUv;
    varying float vFacetNoise;
    varying float vChromaSlope;

    // Pseudo-blue noise dithering to eliminate chromatic banding (Igloo Inc technique)
    float ditherNoise(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPos);

      // IOR 1.18 (Pure Ice refractive index from Igloo Inc analysis)
      float n = 1.0 / 1.18;
      float cosI = dot(viewDir, vNormal);
      float sinT2 = n * n * (1.0 - cosI * cosI);
      float fresnel = pow(1.0 - max(cosI, 0.0), 2.85);

      // 5-Iteration Chromatic Aberration Dispersion Loop
      float chromaBase = 0.035 + min(uScrollVelocity * 0.00045, 0.14) + abs(vChromaSlope) * 0.1;
      vec3 iceBase = vec3(0.05, 0.11, 0.19);
      vec3 chromaAccum = vec3(0.0);

      for (int i = 0; i < CA_ITERATIONS; i++) {
        float fi = float(i) / float(CA_ITERATIONS - 1);
        float shift = (fi - 0.5) * chromaBase;
        vec3 spectralColor = vec3(
          smoothstep(0.0, 0.6, 1.0 - abs(fi - 0.8)),
          smoothstep(0.0, 0.6, 1.0 - abs(fi - 0.5)),
          smoothstep(0.0, 0.6, 1.0 - abs(fi - 0.2))
        );
        chromaAccum += mix(iceBase, uAccentColor * spectralColor * 1.6, fresnel + shift);
      }
      vec3 finalColor = chromaAccum / float(CA_ITERATIONS);

      // Blue noise dither injection
      float dither = (ditherNoise(gl_FragCoord.xy) - 0.5) * 0.025;
      finalColor += vec3(dither);

      // Internal frost veins
      float veins = smoothstep(0.44, 0.5, abs(fract(vFacetNoise * 7.5 + uTime * 0.15) - 0.5));
      finalColor += uAccentColor * veins * 0.85;

      // Specular crystal facet sparkle
      float glint = pow(max(0.0, dot(reflect(-viewDir, vNormal), vec3(0.0, 1.0, 0.5))), 18.0);
      finalColor += vec3(glint * 0.95);

      // X-Ray Reverse-Engineering Mode (The Other Side of Truth: UV wireframe & noise grain)
      if (uXRayMode > 0.5) {
        vec2 grid = abs(fract(vUv * 24.0 - 0.5) - 0.5) / fwidth(vUv * 24.0);
        float line = min(grid.x, grid.y);
        float wire = 1.0 - min(line, 1.0);
        
        // Procedural grain from other-side-of-truth-analysis
        float noiseGrain = (ditherNoise(vUv * 120.0 + uTime * 0.1) - 0.5) * 0.12;
        vec3 wireColor = mix(vec3(0.02, 0.03, 0.05), uAccentColor * 2.4, wire);
        finalColor = wireColor + noiseGrain;
      }

      // Proximity melting: outer crystal becomes glassy/translucent when within 18 units
      float alpha = mix(0.86, 0.18, uProximityMelt);
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);
