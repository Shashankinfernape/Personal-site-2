// src/canvas/shaders/AbetoCelShader.ts
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

export const AbetoCelShaderMaterial = shaderMaterial(
  {
    uBaseColor: new THREE.Color('#81BFBC'),
    uShadeColor: new THREE.Color('#3A6B68'),
    uRimColor: new THREE.Color('#FFF8D6'),
    uLightDir: new THREE.Vector3(0.6, 0.8, 0.4).normalize(),
  },
  // Vertex Shader
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vViewDir = normalize(cameraPosition - worldPos.xyz);
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  // Fragment Shader (Stepped 2-band Cel-Shading + Warm Sun Rim like Messenger by Abeto)
  /* glsl */ `
    uniform vec3 uBaseColor;
    uniform vec3 uShadeColor;
    uniform vec3 uRimColor;
    uniform vec3 uLightDir;

    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying vec2 vUv;

    void main() {
      float ndotl = dot(vNormal, uLightDir);

      // 2-step soft cel band
      float toonStep = smoothstep(-0.05, 0.08, ndotl);
      vec3 color = mix(uShadeColor, uBaseColor, toonStep);

      // Stylized rim highlight on sunlit edges
      float rim = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 3.2);
      float sunlitRim = smoothstep(0.1, 0.4, rim * max(ndotl, 0.0));
      color = mix(color, uRimColor, sunlitRim * 0.65);

      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// Register with R3F
extend({ AbetoCelShaderMaterial });

// Inverted Hull Outline Material for comic ink contours (THREE.BackSide normal push)
export const createInvertedHullMaterial = (color: string = '#222222', thickness: number = 0.025) => {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      uOutlineColor: { value: new THREE.Color(color) },
      uThickness: { value: thickness },
    },
    vertexShader: /* glsl */ `
      uniform float uThickness;
      void main() {
        vec3 transformed = position + normal * uThickness;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uOutlineColor;
      void main() {
        gl_FragColor = vec4(uOutlineColor, 1.0);
      }
    `,
  });
};
