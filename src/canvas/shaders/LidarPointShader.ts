// src/canvas/shaders/LidarPointShader.ts
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

export const LidarPointMaterial = shaderMaterial(
  {
    uTime: 0,
    uPointSize: 2.2,
    uScanlineZ: 0.0,
    uLidarMode: 1.0,
    uColorA: new THREE.Color('#FFD800'), // Into the Amazon LiDAR Gold
    uColorB: new THREE.Color('#00F5D4'), // Cyber Cyan
    uColorC: new THREE.Color('#FF2A85'), // Pulse Accent
  },
  // VERTEX SHADER
  /* glsl */ `
    uniform float uTime;
    uniform float uPointSize;
    uniform float uScanlineZ;
    attribute vec3 aElevationColor;
    varying vec3 vColor;
    varying float vDistFromScan;
    varying vec3 vWorldPos;

    void main() {
      vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      
      // Undulating subtle wave
      vec3 pos = position;
      float wave = sin(pos.x * 0.05 + uTime * 1.5) * cos(pos.z * 0.04 + uTime * 1.2) * 0.45;
      pos.y += wave;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Distance from camera for perspective point sizing
      gl_PointSize = uPointSize * (80.0 / -mvPosition.z);
      gl_PointSize = clamp(gl_PointSize, 1.0, 16.0);

      // Distance to radar scanline sweep
      vDistFromScan = abs(vWorldPos.z - uScanlineZ);
      vColor = aElevationColor;
    }
  `,
  // FRAGMENT SHADER
  /* glsl */ `
    uniform float uTime;
    uniform float uLidarMode;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    varying vec3 vColor;
    varying float vDistFromScan;
    varying vec3 vWorldPos;

    void main() {
      // Make points circular instead of square
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) discard;

      // Soft circular alpha falloff
      float pointGlow = smoothstep(0.5, 0.05, dist);

      // Radar scan pulse effect
      float scanPulse = smoothstep(12.0, 0.0, vDistFromScan);
      vec3 baseCol = vColor;
      if (scanPulse > 0.01) {
        baseCol = mix(baseCol, uColorC, scanPulse * 0.85);
      }

      float baseAlpha = mix(0.12, 0.75, uLidarMode);
      float finalAlpha = pointGlow * (baseAlpha + scanPulse * 0.4);

      gl_FragColor = vec4(baseCol * (1.0 + scanPulse * 1.2), finalAlpha);
    }
  `
);
