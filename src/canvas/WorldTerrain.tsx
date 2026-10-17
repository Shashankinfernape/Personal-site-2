// src/canvas/WorldTerrain.tsx
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { WORLD_DISTRICTS } from '../config/world.config';
import { usePlayableWorldStore } from '../store/usePlayableWorldStore';

export const WorldTerrain: React.FC = () => {
  const { setPlayerTargetPosition, playerTargetPosition } = usePlayableWorldStore();

  // Procedural tree cluster placements along terrain
  const trees = useMemo(() => {
    const list: { position: [number, number, number]; scale: number; color: string }[] = [];
    const treePalette = ['#1C4839', '#2E5A44', '#1E3E2F', '#3B6B50'];

    // Plant trees outside main pathway corridors
    for (let i = 0; i < 90; i++) {
      const x = (Math.random() - 0.5) * 85;
      const z = -Math.random() * 155 + 15;

      // Avoid blocking district centers
      let nearDistrict = false;
      for (const d of WORLD_DISTRICTS) {
        const dx = x - d.center[0];
        const dz = z - d.center[2];
        if (dx * dx + dz * dz < 35) {
          nearDistrict = true;
          break;
        }
      }

      if (!nearDistrict) {
        list.push({
          position: [x, 0, z],
          scale: 0.7 + Math.random() * 0.7,
          color: treePalette[Math.floor(Math.random() * treePalette.length)],
        });
      }
    }
    return list;
  }, []);

  // Pathway lanterns
  const lanterns = useMemo(() => {
    return [
      [0, 0, 0],
      [6, 0, -5],
      [-8, 0, -10],
      [18, 0, -20],
      [-12, 0, -32],
      [12, 0, -40],
      [-18, 0, -50],
      [6, 0, -62],
      [-4, 0, -75],
      [0, 0, -95],
      [0, 0, -125],
    ] as [number, number, number][];
  }, []);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    // Only register clicks on the ground
    if (e.point) {
      setPlayerTargetPosition([e.point.x, 0, e.point.z]);
    }
  };

  return (
    <group onPointerDown={handlePointerDown}>
      {/* Main Ground Island (Warm Earth & Mossy Meadow) */}
      <mesh receiveShadow position={[0, -0.25, -65]}>
        <boxGeometry args={[110, 0.5, 185]} />
        <meshStandardMaterial
          color="#1A2E26" // Rich Moss Meadow
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Cobblestone Winding Pathway Ribbon */}
      <mesh receiveShadow position={[0, 0.02, -65]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 175]} />
        <meshStandardMaterial
          color="#354A3E"
          roughness={0.9}
        />
      </mesh>

      {/* District Plazas / Stone Circular clearings */}
      {WORLD_DISTRICTS.map((d) => (
        <group key={d.id} position={d.center}>
          {/* Stone courtyard circle */}
          <mesh receiveShadow position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[4.2, 32]} />
            <meshStandardMaterial color="#243830" roughness={0.8} />
          </mesh>
          {/* Accent boundary ring */}
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[4.0, 4.25, 32]} />
            <meshBasicMaterial color={d.color} />
          </mesh>
        </group>
      ))}

      {/* Pathway Lanterns */}
      {lanterns.map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Wooden post */}
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 1.8, 8]} />
            <meshStandardMaterial color="#4A2E18" roughness={0.8} />
          </mesh>
          {/* Brass lantern housing */}
          <mesh position={[0, 1.85, 0]} castShadow>
            <octahedronGeometry args={[0.18, 0]} />
            <meshStandardMaterial color="#C8963E" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Warm light source */}
          <pointLight color="#FFE866" intensity={1.8} distance={8} position={[0, 1.85, 0]} />
        </group>
      ))}

      {/* Stylized Low-Poly Pine & Forest Trees */}
      {trees.map((tree, idx) => (
        <group key={idx} position={tree.position} scale={tree.scale}>
          {/* Trunk */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.25, 1.6, 6]} />
            <meshStandardMaterial color="#3E2714" roughness={0.9} />
          </mesh>
          {/* Foliage tier 1 */}
          <mesh position={[0, 2.0, 0]} castShadow>
            <coneGeometry args={[1.4, 2.2, 6]} />
            <meshStandardMaterial color={tree.color} roughness={0.8} />
          </mesh>
          {/* Foliage tier 2 */}
          <mesh position={[0, 3.2, 0]} castShadow>
            <coneGeometry args={[1.0, 1.8, 6]} />
            <meshStandardMaterial color={tree.color} roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Click-to-Move Target Indicator Ring */}
      {playerTargetPosition && (
        <group position={[playerTargetPosition[0], 0.08, playerTargetPosition[2]]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.4, 0.5, 32]} />
            <meshBasicMaterial color="#00F5D4" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.15, 16]} />
            <meshBasicMaterial color="#00F5D4" />
          </mesh>
        </group>
      )}
    </group>
  );
};
