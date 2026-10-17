// src/canvas/OpenWorldScene.tsx
import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { PlayerVehicleController } from './PlayerVehicleController';
import { ShashankGuideNPC } from './ShashankGuideNPC';
import { OpenAirTheatre } from './OpenAirTheatre';
import { InteractiveArtProps } from './InteractiveArtProps';
import { WorldBVHCollider } from './WorldBVHCollider';
import { PORTFOLIO_PROJECTS } from '../config/projects.config';
import { useGameStore } from '../store/useGameStore';

export const OpenWorldScene: React.FC = () => {
  const { isXRayMode } = useGameStore();

  // Procedural tree cluster distribution across the open world
  const environmentTrees = useMemo(() => {
    const list: [number, number, number][] = [];
    for (let i = 0; i < 110; i++) {
      const x = (Math.random() - 0.5) * 220;
      const z = (Math.random() - 0.5) * 220;

      // Don't place tree in center of plazas or roads
      const distFromCenter = Math.hypot(x, z);
      let nearTheatre = false;
      for (const p of PORTFOLIO_PROJECTS) {
        if (Math.hypot(x - p.position[0], z - p.position[2]) < 22) {
          nearTheatre = true;
          break;
        }
      }

      if (distFromCenter > 20 && !nearTheatre) {
        list.push([x, 0, z]);
      }
    }
    return list;
  }, []);

  // Road circuit connecting Spawn (0,0) -> Handesk (0, -45) -> Slidepaper (55, -55) -> Examinar (70, 15) -> Franky (20, 65) -> Territory (-50, 55) -> SSTRAESS (-70, -10) -> Chatflix (-40, -65) -> Spawn
  const roadWaypoints = useMemo(() => {
    return [
      [0, 0, 0],
      [0, 0, -45],
      [55, 0, -55],
      [70, 0, 15],
      [20, 0, 65],
      [-50, 0, 55],
      [-70, 0, -10],
      [-40, 0, -65],
      [0, 0, 0],
    ] as [number, number, number][];
  }, []);

  return (
    <div className="fixed inset-0 bg-[#070B09]">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 8, 14], fov: 48, near: 0.1, far: 500 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        {/* World Cel-Shaded Sky & Fog */}
        <color attach="background" args={[isXRayMode ? '#020406' : '#0B130E']} />
        <fog attach="fog" args={[isXRayMode ? '#020406' : '#0B130E', 50, 220]} />

        {/* Ambient & Warm Cel-Shaded Sunlight */}
        <ambientLight intensity={0.7} color="#D8FCE8" />
        <directionalLight
          position={[60, 80, 50]}
          intensity={2.2}
          color="#FFF2DC"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={320}
          shadow-camera-left={-95}
          shadow-camera-right={95}
          shadow-camera-top={95}
          shadow-camera-bottom={-95}
        />
        <directionalLight position={[-50, 40, -40]} intensity={0.6} color="#7ED4BE" />

        <Suspense fallback={null}>
          <Stars radius={180} depth={80} count={4000} factor={3} fade speed={0.6} />

          {/* Master Terrain Base */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
            <planeGeometry args={[360, 360, 64, 64]} />
            <meshStandardMaterial
              color={isXRayMode ? '#050D15' : '#14261D'}
              wireframe={isXRayMode}
              roughness={0.8}
            />
          </mesh>

          {/* Continuous Loopable Asphalt Drift Roads */}
          {roadWaypoints.map((pt, i) => {
            if (i === roadWaypoints.length - 1) return null;
            const nextPt = roadWaypoints[i + 1];
            const dx = nextPt[0] - pt[0];
            const dz = nextPt[2] - pt[2];
            const length = Math.hypot(dx, dz);
            const midX = (pt[0] + nextPt[0]) / 2;
            const midZ = (pt[2] + nextPt[2]) / 2;
            const angle = Math.atan2(dx, dz);

            return (
              <group key={i} position={[midX, 0.02, midZ]} rotation={[0, angle, 0]}>
                {/* Dark Paved Road Surface */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                  <planeGeometry args={[11, length]} />
                  <meshStandardMaterial color="#1E232A" roughness={0.6} />
                </mesh>
                {/* Yellow Dashed Centerline */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                  <planeGeometry args={[0.3, length * 0.95]} />
                  <meshBasicMaterial color="#FFD800" />
                </mesh>
                {/* White Road Edge Lines */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.2, 0.01, 0]}>
                  <planeGeometry args={[0.2, length]} />
                  <meshBasicMaterial color="#FFFFFF" />
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.2, 0.01, 0]}>
                  <planeGeometry args={[0.2, length]} />
                  <meshBasicMaterial color="#FFFFFF" />
                </mesh>
              </group>
            );
          })}

          {/* Low-Poly Trees */}
          {environmentTrees.map((treePos, i) => (
            <group key={i} position={treePos}>
              {/* Trunk */}
              <mesh position={[0, 1.2, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.45, 2.4, 8]} />
                <meshStandardMaterial color="#4A2E1A" roughness={0.8} />
              </mesh>
              {/* Cel-shaded Pine Cones */}
              <mesh position={[0, 2.8, 0]} castShadow>
                <coneGeometry args={[2.0, 3.2, 8]} />
                <meshToonMaterial color={i % 2 === 0 ? '#1B4734' : '#235D44'} />
              </mesh>
              <mesh position={[0, 4.4, 0]} castShadow>
                <coneGeometry args={[1.5, 2.4, 8]} />
                <meshToonMaterial color={i % 2 === 0 ? '#266349' : '#307A5A'} />
              </mesh>
            </group>
          ))}

          {/* World BVH Spatial Collision Tree */}
          <WorldBVHCollider />

          {/* Interactive 3D Street Art, 17 Totems, Jump Ramps & Bowling Pins */}
          <InteractiveArtProps />

          {/* 7 Open-Air Streaming Project Theatres */}
          {PORTFOLIO_PROJECTS.map((proj, idx) => (
            <OpenAirTheatre key={proj.id} project={proj} index={idx} />
          ))}

          {/* In-Game Guide NPC: Shashank S */}
          <ShashankGuideNPC />

          {/* Playable Multi-Vehicle Controller (On-Foot, Bicycle, Drift Car) */}
          <PlayerVehicleController />
        </Suspense>
      </Canvas>
    </div>
  );
};
