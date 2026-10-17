// src/canvas/PlayableWorldCanvas.tsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { WorldTerrain } from './WorldTerrain';
import { PlayerAvatar } from './PlayerAvatar';
import { NpcCharacter } from './NpcCharacter';
import { FloatingDioramaProps } from './FloatingDioramaProps';
import { ParticleAtmosphere } from './ParticleAtmosphere';
import { WORLD_CHARACTERS } from '../config/characters.config';

export const PlayableWorldCanvas: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#0C1A14]">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 12, 18], fov: 46, near: 0.1, far: 300 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        {/* Warm Storybook Atmosphere & Fog */}
        <color attach="background" args={['#0C1A14']} />
        <fog attach="fog" args={['#0C1A14', 30, 120]} />

        {/* Ambient & Warm Sun Lighting */}
        <ambientLight intensity={0.75} color="#D4F6EB" />
        <directionalLight
          position={[25, 40, 20]}
          intensity={1.8}
          color="#FFEACC"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={180}
          shadow-camera-left={-45}
          shadow-camera-right={45}
          shadow-camera-top={45}
          shadow-camera-bottom={-45}
        />

        {/* Secondary Fill Light */}
        <directionalLight position={[-20, 25, -30]} intensity={0.6} color="#88C2AA" />

        <Suspense fallback={null}>
          <Stars radius={120} depth={60} count={3500} factor={2.5} fade speed={0.8} />

          {/* Crafted Storybook Terrain */}
          <WorldTerrain />

          {/* District Architectural Landmarks */}
          <FloatingDioramaProps />

          {/* 9 Original Characters with Expressive Dialogues */}
          {WORLD_CHARACTERS.map((char) => (
            <NpcCharacter key={char.id} character={char} />
          ))}

          {/* Controllable Player Avatar */}
          <PlayerAvatar />

          {/* Golden Fireflies & Pollen Motes */}
          <ParticleAtmosphere />
        </Suspense>
      </Canvas>
    </div>
  );
};
