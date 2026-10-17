// src/canvas/ProjectMonolith.tsx
import React, { useRef } from 'react';
import * as THREE from 'three';
import { extend, useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import { PortfolioProject } from '../config/projects.config';
import { useWorldStore } from '../store/useWorldStore';
import { IceCrystalMaterial } from './shaders/IceCrystalShader';

// Register custom shader material in JSX
extend({ IceCrystalMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      iceCrystalMaterial: any;
    }
  }
}

interface ProjectMonolithProps {
  project: PortfolioProject;
}

/**
 * Embodying the reverse-engineered systems:
 * - Igloo Inc. (igloo-inc-analysis):
 *   Procedural Voronoi crystal facets with proximity melt/shatter explosion within 18 units.
 * - Clash of Clans (clash-of-clans-analysis):
 *   Town Hall level pedestals with level badge rims, gold trims, and expanding radar pulse waves.
 * - Self Aware Studio (self-aware-analysis):
 *   Tactile CAD measurement ticks, bounding-box wireframe gizmos, and tri-color sequence accents.
 */
export const ProjectMonolith: React.FC<ProjectMonolithProps> = ({ project }) => {
  const groupRef = useRef<THREE.Group>(null);
  const crystalMatRef = useRef<any>(null);
  const innerArtifactRef = useRef<THREE.Group>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const cadBoxRef = useRef<THREE.Group>(null);

  const { selectProject, scrollVelocity, isXRayReverseMode } = useWorldStore();

  useFrame((state, delta) => {
    if (!groupRef.current || !crystalMatRef.current) return;

    const cameraPos = state.camera.position;
    const monolithPos = groupRef.current.position;
    const dist = cameraPos.distanceTo(monolithPos);

    // Melt / shatter crystal enclosure as camera approaches within 18 units (Igloo Inc. formula)
    const targetMelt = THREE.MathUtils.clamp(1.0 - (dist - 8.0) / 14.0, 0, 1);

    crystalMatRef.current.uTime = state.clock.elapsedTime;
    crystalMatRef.current.uProximityMelt = THREE.MathUtils.lerp(
      crystalMatRef.current.uProximityMelt,
      targetMelt,
      delta * 4.8
    );
    crystalMatRef.current.uScrollVelocity = scrollVelocity;
    crystalMatRef.current.uXRayMode = isXRayReverseMode ? 1.0 : 0.0;

    // Rotate inner artifact with speed reactive to melt state
    if (innerArtifactRef.current) {
      innerArtifactRef.current.rotation.y += delta * (0.65 + targetMelt * 1.5);
      innerArtifactRef.current.rotation.x += delta * 0.28;
    }

    // Expand base radar pulse ring (Clash building collector tick)
    if (pulseRingRef.current) {
      const scale = 1.0 + (state.clock.elapsedTime * 0.85) % 1.6;
      pulseRingRef.current.scale.set(scale, scale, 1);
      (pulseRingRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1.0 - (scale - 1.0) / 1.6) * 0.5;
    }

    // Slowly rotate Self Aware Studio CAD bounding box gizmo
    if (cadBoxRef.current) {
      cadBoxRef.current.rotation.y -= delta * 0.2;
    }
  });

  // Render distinct custom inner 3D geometry per project
  const renderUniqueArtifact = () => {
    switch (project.id) {
      case 'handesk':
        return (
          <group>
            <mesh>
              <dodecahedronGeometry args={[0.7, 0]} />
              <meshStandardMaterial
                color={project.accentColor}
                emissive={project.accentColor}
                emissiveIntensity={1.8}
                wireframe={isXRayReverseMode}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
            <mesh rotation={[Math.PI / 4, 0, 0]}>
              <torusGeometry args={[1.3, 0.035, 16, 64]} />
              <meshBasicMaterial color={project.accentColor} wireframe={isXRayReverseMode} />
            </mesh>
            <mesh rotation={[0, Math.PI / 3, 0]}>
              <torusGeometry args={[1.55, 0.035, 16, 64]} />
              <meshBasicMaterial color="#FFFFFF" wireframe={isXRayReverseMode} />
            </mesh>
            {[0, 1, 2, 3, 4].map((i) => (
              <mesh key={i} position={[Math.cos(i * 1.25) * 1.2, Math.sin(i * 1.25) * 1.2, 0]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={2.5} />
              </mesh>
            ))}
          </group>
        );

      case 'slidepaper':
        return (
          <group>
            <mesh position={[0, 0, 0.3]}>
              <boxGeometry args={[2.2, 1.24, 0.06]} />
              <meshStandardMaterial
                color={project.accentColor}
                emissive={project.accentColor}
                emissiveIntensity={1.2}
                roughness={0.1}
                metalness={0.8}
                wireframe={isXRayReverseMode}
              />
            </mesh>
            <mesh position={[0, 0, -0.3]} rotation={[0, Math.PI / 6, 0]}>
              <boxGeometry args={[2.8, 1.2, 0.04]} />
              <meshStandardMaterial
                color="#FFFFFF"
                emissive="#FF2A85"
                emissiveIntensity={1.5}
                roughness={0.05}
                metalness={0.9}
                wireframe={isXRayReverseMode}
              />
            </mesh>
            <mesh position={[1.4, 0.8, 0.5]}>
              <octahedronGeometry args={[0.3, 0]} />
              <meshBasicMaterial color="#FF2A85" wireframe={isXRayReverseMode} />
            </mesh>
          </group>
        );

      case 'examinar':
        return (
          <group>
            <mesh>
              <boxGeometry args={[1.2, 1.2, 1.2]} />
              <meshStandardMaterial
                color={project.accentColor}
                emissive={project.accentColor}
                emissiveIntensity={1.4}
                metalness={0.85}
                roughness={0.2}
                wireframe={isXRayReverseMode}
              />
            </mesh>
            {[0, 1, 2].map((idx) => {
              const angle = (idx * Math.PI * 2) / 3;
              return (
                <group key={idx} position={[Math.cos(angle) * 1.6, Math.sin(angle) * 0.6, Math.sin(angle) * 1.6]}>
                  <mesh>
                    <boxGeometry args={[0.5, 0.7, 0.05]} />
                    <meshStandardMaterial color="#FFFFFF" emissive="#FFD800" emissiveIntensity={2.0} />
                  </mesh>
                </group>
              );
            })}
          </group>
        );

      case 'franky':
        return (
          <group>
            <mesh>
              <torusKnotGeometry args={[0.9, 0.35, 128, 32, 2, 3]} />
              <meshStandardMaterial
                color={project.accentColor}
                emissive={project.accentColor}
                emissiveIntensity={2.2}
                metalness={0.95}
                roughness={0.1}
                wireframe={isXRayReverseMode}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.4, 1.48, 64]} />
              <meshBasicMaterial color="#FF5500" side={THREE.DoubleSide} wireframe={isXRayReverseMode} />
            </mesh>
          </group>
        );

      case 'territory':
        return (
          <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[1.4, 1.4, 0.1, 32]} />
              <meshStandardMaterial
                color="#0A192F"
                emissive="#38BDF8"
                emissiveIntensity={0.8}
                wireframe={isXRayReverseMode}
              />
            </mesh>
            {[-0.6, 0, 0.6].map((x, i) => (
              <mesh key={i} position={[x, 0.7 + i * 0.3, (i % 2 === 0 ? 0.4 : -0.4)]}>
                <cylinderGeometry args={[0.08, 0.08, 1.4 + i * 0.6, 16]} />
                <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={2.4} />
              </mesh>
            ))}
          </group>
        );

      case 'sstraess':
        return (
          <group>
            <mesh>
              <icosahedronGeometry args={[0.75, 1]} />
              <meshStandardMaterial
                color={project.accentColor}
                emissive={project.accentColor}
                emissiveIntensity={2.0}
                metalness={0.9}
                roughness={0.15}
                wireframe={isXRayReverseMode}
              />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 6]}>
              <torusGeometry args={[1.35, 0.04, 16, 64]} />
              <meshBasicMaterial color="#A855F7" wireframe={isXRayReverseMode} />
            </mesh>
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[1.65, 0.03, 16, 64]} />
              <meshBasicMaterial color="#FFFFFF" wireframe={isXRayReverseMode} />
            </mesh>
          </group>
        );

      case 'chatflix-nlp':
      default:
        return (
          <group>
            <mesh>
              <torusGeometry args={[0.9, 0.3, 24, 64]} />
              <meshStandardMaterial
                color={project.accentColor}
                emissive={project.accentColor}
                emissiveIntensity={1.8}
                metalness={0.8}
                roughness={0.2}
                wireframe={isXRayReverseMode}
              />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <octahedronGeometry args={[0.5, 0]} />
              <meshStandardMaterial color="#FFFFFF" emissive="#22C55E" emissiveIntensity={2.5} />
            </mesh>
          </group>
        );
    }
  };

  return (
    <group
      ref={groupRef}
      position={project.position}
      onClick={(e) => {
        e.stopPropagation();
        selectProject(project);
      }}
    >
      {/* Clash of Clans Town Hall Pedestal Platform */}
      <group position={[0, -2.6, 0]}>
        {/* Base stone foundation */}
        <mesh receiveShadow>
          <cylinderGeometry args={[2.8, 3.2, 0.45, 8]} />
          <meshStandardMaterial
            color="#2B150A"
            roughness={0.7}
            metalness={0.3}
            wireframe={isXRayReverseMode}
          />
        </mesh>

        {/* Level & Title Gold Rim Ring */}
        <mesh position={[0, 0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 2.75, 32]} />
          <meshBasicMaterial color="#FFE866" wireframe={isXRayReverseMode} />
        </mesh>

        {/* Expanding Clash Resource Collector Pulse Wave */}
        <mesh ref={pulseRingRef} position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.75, 2.95, 32]} />
          <meshBasicMaterial
            color={project.accentColor}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Self Aware Studio CAD Bounding Box Gizmo */}
      <group ref={cadBoxRef}>
        <mesh>
          <boxGeometry args={[4.8, 4.8, 4.8]} />
          <meshBasicMaterial
            color={project.accentColor}
            wireframe
            transparent
            opacity={isXRayReverseMode ? 0.6 : 0.15}
          />
        </mesh>
      </group>

      <Float speed={2.2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Inner Project Artifact Core */}
        <group ref={innerArtifactRef}>
          {renderUniqueArtifact()}
        </group>

        {/* Outer Igloo Inc. Procedural Voronoi Crystal Enclosure */}
        <mesh scale={2.45}>
          <icosahedronGeometry args={[1, 4]} />
          <iceCrystalMaterial
            ref={crystalMatRef}
            uCrystalSeed={project.crystalSeed}
            uAccentColor={new THREE.Color(project.accentColor)}
            transparent
            depthWrite={false}
          />
        </mesh>

        {/* Floating 3D Sector Header with Supercell Text Outline Look */}
        <Text
          position={[0, 3.6, 0]}
          fontSize={0.4}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.035}
          outlineColor="#000000"
        >
          {`${project.sectorCode} // ${project.buildingTitle}`}
        </Text>

        <Text
          position={[0, 3.1, 0]}
          fontSize={0.22}
          color="#FFE866"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {`LVL ${project.buildingLevel} · ${project.rarity}`}
        </Text>
      </Float>

      {/* Radiant local beacon point light */}
      <pointLight color={project.accentColor} intensity={3.5} distance={18} />
    </group>
  );
};
