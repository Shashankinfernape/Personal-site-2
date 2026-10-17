// src/canvas/Experience.tsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { CameraRig } from './CameraRig';
import { LidarTerrain } from './LidarTerrain';
import { ProjectMonolith } from './ProjectMonolith';
import { ParticleFooter } from './ParticleFooter';
import { useWorldStore } from '../store/useWorldStore';

export const Experience: React.FC = () => {
  const projects = useWorldStore((s) => s.projects);

  return (
    <div className="fixed inset-0 bg-[#05060A]">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 3, 12], fov: 50, near: 0.1, far: 450 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#05060A']} />
        <fog attach="fog" args={['#05060A', 25, 140]} />

        <ambientLight intensity={0.65} />
        <directionalLight position={[20, 45, 15]} intensity={1.8} color="#FFFFFF" />
        <pointLight position={[0, 15, -40]} intensity={2.5} color="#00F5D4" distance={90} />
        <pointLight position={[0, 15, -130]} intensity={2.5} color="#FF2A85" distance={90} />
        <pointLight position={[0, 15, -210]} intensity={2.5} color="#22C55E" distance={90} />

        <Suspense fallback={null}>
          <Stars radius={160} depth={90} count={5000} factor={3.5} fade speed={1.2} />
          <CameraRig />
          <LidarTerrain />

          {/* All 7 Interactive Voronoi Procedural Crystal Monoliths */}
          {projects.map((project) => (
            <ProjectMonolith key={project.id} project={project} />
          ))}

          {/* Igloo Inc. Velocity-Reactive Morphing Particle Footer at Spline Terminus */}
          <ParticleFooter />
        </Suspense>
      </Canvas>
    </div>
  );
};
