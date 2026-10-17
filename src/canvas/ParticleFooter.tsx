// src/canvas/ParticleFooter.tsx
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useWorldStore } from '../store/useWorldStore';

const PARTICLE_COUNT = 3600;

export const ParticleFooter: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { footerShapeTarget, scrollVelocity, isXRayReverseMode } = useWorldStore();

  // Pre-generate target shapes
  const shapes = useMemo(() => {
    const galaxy = new Float32Array(PARTICLE_COUNT * 3);
    const github = new Float32Array(PARTICLE_COUNT * 3);
    const linkedin = new Float32Array(PARTICLE_COUNT * 3);
    const resume = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    const colorCyan = new THREE.Color('#00F5D4');
    const colorPink = new THREE.Color('#FF2A85');
    const colorGold = new THREE.Color('#FFD800');
    const tempCol = new THREE.Color();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // 1. GALAXY: Two-arm spiral
      const r = Math.pow(Math.random(), 1.6) * 12;
      const armAngle = ((i % 2) * Math.PI) + (r * 0.8) + (Math.random() - 0.5) * 0.4;
      galaxy[i3] = Math.cos(armAngle) * r;
      galaxy[i3 + 1] = (Math.random() - 0.5) * (1.8 - r * 0.1);
      galaxy[i3 + 2] = Math.sin(armAngle) * r;

      // 2. GITHUB: Octocat head with ears silhouette
      const angle = Math.random() * Math.PI * 2;
      const isEar = Math.random() > 0.75;
      if (isEar) {
        // Left or right cat ear
        const side = Math.random() > 0.5 ? 1 : -1;
        github[i3] = side * (2.0 + Math.random() * 1.5);
        github[i3 + 1] = 2.2 + Math.random() * 2.5;
        github[i3 + 2] = (Math.random() - 0.5) * 1.2;
      } else {
        // Head sphere
        const rad = 2.8 + Math.random() * 0.8;
        github[i3] = Math.cos(angle) * rad;
        github[i3 + 1] = Math.sin(angle) * rad * 0.85;
        github[i3 + 2] = (Math.random() - 0.5) * 1.5;
      }

      // 3. LINKEDIN: Rounded square icon frame
      const t = Math.random() * 4;
      let lx = 0, ly = 0;
      if (t < 1) {
        lx = (Math.random() - 0.5) * 6;
        ly = 3;
      } else if (t < 2) {
        lx = 3;
        ly = (Math.random() - 0.5) * 6;
      } else if (t < 3) {
        lx = (Math.random() - 0.5) * 6;
        ly = -3;
      } else {
        lx = -3;
        ly = (Math.random() - 0.5) * 6;
      }
      linkedin[i3] = lx + (Math.random() - 0.5) * 0.5;
      linkedin[i3 + 1] = ly + (Math.random() - 0.5) * 0.5;
      linkedin[i3 + 2] = (Math.random() - 0.5) * 1.2;

      // 4. RESUME: Angled document sheet with data grid
      const sheetX = (Math.random() - 0.5) * 5.5;
      const sheetY = (Math.random() - 0.5) * 7.5;
      resume[i3] = sheetX;
      resume[i3 + 1] = sheetY;
      resume[i3 + 2] = Math.sin(sheetX * 0.5) * 0.6 + (Math.random() - 0.5) * 0.3;

      // Colors: Cyan to Pink to Gold gradient
      const mixRatio = Math.random();
      if (mixRatio < 0.5) {
        tempCol.lerpColors(colorCyan, colorPink, mixRatio * 2);
      } else {
        tempCol.lerpColors(colorPink, colorGold, (mixRatio - 0.5) * 2);
      }
      colors[i3] = tempCol.r;
      colors[i3 + 1] = tempCol.g;
      colors[i3 + 2] = tempCol.b;
    }

    return { galaxy, github, linkedin, resume, colors };
  }, []);

  // Initialize current positions array
  const currentPositions = useMemo(() => new Float32Array(shapes.galaxy), [shapes]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    let targetArray = shapes.galaxy;
    if (footerShapeTarget === 'GITHUB') targetArray = shapes.github;
    else if (footerShapeTarget === 'LINKEDIN') targetArray = shapes.linkedin;
    else if (footerShapeTarget === 'RESUME') targetArray = shapes.resume;

    const lerpSpeed = delta * 4.0;
    const velFactor = Math.min(scrollVelocity * 0.0008, 0.45);
    const time = state.clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const tx = targetArray[i3];
      const ty = targetArray[i3 + 1];
      const tz = targetArray[i3 + 2];

      // Add turbulence when scrolling fast
      const turbulence = Math.sin(time * 3.0 + i) * velFactor;

      array[i3] = THREE.MathUtils.lerp(array[i3], tx + turbulence, lerpSpeed);
      array[i3 + 1] = THREE.MathUtils.lerp(array[i3 + 1], ty + turbulence, lerpSpeed);
      array[i3 + 2] = THREE.MathUtils.lerp(array[i3 + 2], tz + turbulence, lerpSpeed);
    }

    posAttr.needsUpdate = true;

    // Slowly rotate particle cloud
    pointsRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group position={[0, 2.5, -235]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={currentPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={PARTICLE_COUNT}
            array={shapes.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          vertexColors
          transparent
          opacity={isXRayReverseMode ? 0.35 : 0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Floating Terminus Label */}
      <pointLight color="#FF2A85" intensity={3.5} distance={25} />
    </group>
  );
};
