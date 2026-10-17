// src/canvas/LidarTerrain.tsx
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { extend, useFrame } from '@react-three/fiber';
import { useWorldStore } from '../store/useWorldStore';
import { LidarPointMaterial } from './shaders/LidarPointShader';

// Extend R3F with custom shader
extend({ LidarPointMaterial });

// Add custom JSX element type
declare global {
  namespace JSX {
    interface IntrinsicElements {
      lidarPointMaterial: any;
    }
  }
}

export const LidarTerrain: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const shaderMatRef = useRef<any>(null);
  const isLidarMode = useWorldStore((s) => s.isLidarMode);
  const scrollProgress = useWorldStore((s) => s.scrollProgress);

  const { positions, colors } = useMemo(() => {
    const count = 28000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorA = new THREE.Color('#FFD800'); // Into the Amazon LiDAR Gold
    const colorB = new THREE.Color('#00F5D4'); // Cyber Cyan
    const tempColor = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Spread across x from -75 to 75
      const x = (Math.random() - 0.5) * 150;
      // Spread down spline from z = +30 to z = -250
      const z = -Math.random() * 280 + 30;

      // Canyon valley along the central camera spline path
      const canyonHeight = Math.pow(Math.abs(x) * 0.075, 1.8) + Math.sin(z * 0.08) * 2.5 - 5.0;
      const y = canyonHeight + (Math.random() - 0.5) * 0.9;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color lerp based on height
      const mixRatio = THREE.MathUtils.clamp((y + 6) / 16, 0, 1);
      tempColor.lerpColors(colorB, colorA, mixRatio);

      col[i * 3] = tempColor.r;
      col[i * 3 + 1] = tempColor.g;
      col[i * 3 + 2] = tempColor.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame(({ clock }) => {
    if (!shaderMatRef.current) return;
    const time = clock.elapsedTime;
    shaderMatRef.current.uTime = time;
    // Radar beam sweeps back and forth along the spline based on time and scroll
    const sweepZ = -((time * 35) % 270) + 20;
    shaderMatRef.current.uScanlineZ = sweepZ;
    shaderMatRef.current.uLidarMode = isLidarMode ? 1.0 : 0.15;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aElevationColor"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <lidarPointMaterial
        ref={shaderMatRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
