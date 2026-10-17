// src/canvas/ParticleAtmosphere.tsx
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const ParticleAtmosphere: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const warmGold = new THREE.Color('#FFE866');
    const softMint = new THREE.Color('#D4F6EB');
    const fireflyCyan = new THREE.Color('#00F5D4');
    const tempCol = new THREE.Color();

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 9 + 0.5;
      pos[i * 3 + 2] = -Math.random() * 160 + 15;

      const pick = Math.random();
      if (pick < 0.5) {
        tempCol.copy(warmGold);
      } else if (pick < 0.8) {
        tempCol.copy(softMint);
      } else {
        tempCol.copy(fireflyCyan);
      }

      col[i * 3] = tempCol.r;
      col[i * 3 + 1] = tempCol.g;
      col[i * 3 + 2] = tempCol.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < arr.length / 3; i++) {
      // Gentle floating wander
      arr[i * 3 + 1] += Math.sin(time * 1.5 + i) * 0.006;
      arr[i * 3] += Math.cos(time * 0.8 + i) * 0.004;
    }
    posAttr.needsUpdate = true;
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
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        vertexColors
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
