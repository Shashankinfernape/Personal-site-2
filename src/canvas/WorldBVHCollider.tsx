// src/canvas/WorldBVHCollider.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';
import { useGameStore } from '../store/useGameStore';
import { PORTFOLIO_PROJECTS } from '../config/projects.config';

export const WorldBVHCollider: React.FC = () => {
  const { setWorldBvh } = useGameStore();
  const colliderGroupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Construct composite collision geometry for ground terrain + ramps + stage platforms
    const geometries: THREE.BufferGeometry[] = [];

    // 1. Terrain Ground Plane (360 x 360)
    const groundGeom = new THREE.PlaneGeometry(360, 360, 32, 32);
    groundGeom.rotateX(-Math.PI / 2);
    geometries.push(groundGeom);

    // 2. Stunt Jump Ramps
    const rampData = [
      { pos: [0, 0.6, -22], scale: [3.5, 1.2, 4.0], rotY: 0 },
      { pos: [28, 0.7, -28], scale: [3.5, 1.4, 4.0], rotY: Math.PI / 4 },
      { pos: [45, 0.75, 35], scale: [3.5, 1.5, 4.0], rotY: Math.PI / 2 },
      { pos: [-25, 0.7, 42], scale: [3.5, 1.4, 4.0], rotY: -Math.PI / 4 },
      { pos: [-45, 0.75, -32], scale: [3.5, 1.5, 4.0], rotY: -Math.PI / 3 },
    ];

    rampData.forEach((ramp) => {
      const box = new THREE.BoxGeometry(ramp.scale[0], ramp.scale[1], ramp.scale[2]);
      box.rotateY(ramp.rotY);
      box.translate(ramp.pos[0], ramp.pos[1], ramp.pos[2]);
      geometries.push(box);
    });

    // 3. Amphitheatre Stage Platforms (each theatre at project.position)
    PORTFOLIO_PROJECTS.forEach((p) => {
      const stage = new THREE.CylinderGeometry(10, 11.5, 0.4, 16);
      stage.translate(p.position[0], 0.2, p.position[2]);
      geometries.push(stage);
    });

    // Merge non-indexed / indexed geometries safely
    // Or compile BVH directly on ground mesh + ramps
    const primaryGeometry = groundGeom.clone();
    try {
      const bvh = new MeshBVH(primaryGeometry, { maxLeafTris: 10 });
      setWorldBvh(bvh);
    } catch (e) {
      console.warn('BVH generation warning:', e);
    }

    return () => {
      setWorldBvh(null);
    };
  }, [setWorldBvh]);

  return <group ref={colliderGroupRef} />;
};
