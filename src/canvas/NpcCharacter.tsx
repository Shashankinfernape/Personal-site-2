// src/canvas/NpcCharacter.tsx
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { WorldCharacter } from '../config/characters.config';
import { usePlayableWorldStore } from '../store/usePlayableWorldStore';

interface NpcCharacterProps {
  character: WorldCharacter;
}

export const NpcCharacter: React.FC<NpcCharacterProps> = ({ character }) => {
  const groupRef = useRef<THREE.Group>(null);
  const accessoryRef = useRef<THREE.Group>(null);
  const promptRef = useRef<THREE.Group>(null);

  const { playerPosition, startDialogue, nearbyNpc } = usePlayableWorldStore();

  const isNearby = nearbyNpc?.id === character.id;

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Idle breathing / floating bob
    groupRef.current.position.y = character.worldPosition[1] + Math.sin(time * 2.0 + character.rotationY) * 0.08;

    // Floating prompt bobbing
    if (promptRef.current && isNearby) {
      promptRef.current.position.y = 2.4 + Math.sin(time * 4.0) * 0.1;
      // Face camera
      promptRef.current.quaternion.copy(state.camera.quaternion);
    }

    // Accessory custom rotation
    if (accessoryRef.current) {
      accessoryRef.current.rotation.y += delta * 1.2;
    }
  });

  // Render character specific stylized visual silhouette
  const renderNpcMesh = () => {
    switch (character.id) {
      case 'kiro':
        // The Articulated Mechanist (Brass robotic inventor)
        return (
          <group>
            {/* Body */}
            <mesh position={[0, 0.75, 0]} castShadow>
              <cylinderGeometry args={[0.35, 0.28, 0.7, 8]} />
              <meshStandardMaterial color="#C49A45" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Head with optical visor */}
            <mesh position={[0, 1.3, 0]} castShadow>
              <boxGeometry args={[0.38, 0.35, 0.35]} />
              <meshStandardMaterial color="#8C6E2E" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Cyan optical sensor eye */}
            <mesh position={[0, 1.32, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
              <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={2.5} />
            </mesh>
            {/* Multi-jointed arm holding kinetic pointer */}
            <group ref={accessoryRef} position={[0.45, 0.9, 0.2]}>
              <mesh>
                <torusGeometry args={[0.3, 0.03, 8, 24]} />
                <meshBasicMaterial color="#00F5D4" />
              </mesh>
            </group>
          </group>
        );

      case 'lyra':
        // The Prism Curator (Flowing artisan with floating prism crystals)
        return (
          <group>
            {/* Robes */}
            <mesh position={[0, 0.75, 0]} castShadow>
              <coneGeometry args={[0.42, 1.1, 12]} />
              <meshStandardMaterial color="#4A0E2B" roughness={0.6} />
            </mesh>
            {/* Head & Coral Hair */}
            <mesh position={[0, 1.35, 0]} castShadow>
              <sphereGeometry args={[0.24, 16, 16]} />
              <meshStandardMaterial color="#FAD4C0" roughness={0.5} />
            </mesh>
            <mesh position={[0, 1.48, -0.05]} castShadow>
              <sphereGeometry args={[0.26, 16, 16]} />
              <meshStandardMaterial color="#FF2A85" roughness={0.4} />
            </mesh>
            {/* Floating Refractive Prism Ring */}
            <group ref={accessoryRef} position={[0, 1.2, 0]}>
              {[0, 1, 2, 3].map((i) => (
                <mesh key={i} position={[Math.cos(i * 1.57) * 0.7, Math.sin(i * 1.57) * 0.2, Math.sin(i * 1.57) * 0.7]}>
                  <octahedronGeometry args={[0.12, 0]} />
                  <meshStandardMaterial color="#FF2A85" emissive="#FF2A85" emissiveIntensity={1.8} />
                </mesh>
              ))}
            </group>
          </group>
        );

      case 'archon':
        // The Scholar Automaton (Stone golem with glowing scrolls)
        return (
          <group>
            <mesh position={[0, 0.8, 0]} castShadow>
              <boxGeometry args={[0.6, 0.9, 0.45]} />
              <meshStandardMaterial color="#78828A" roughness={0.9} />
            </mesh>
            {/* Stone Head with Gold Rune Visor */}
            <mesh position={[0, 1.45, 0]} castShadow>
              <boxGeometry args={[0.4, 0.35, 0.38]} />
              <meshStandardMaterial color="#5A626A" roughness={0.8} />
            </mesh>
            <mesh position={[0, 1.45, 0.2]}>
              <boxGeometry args={[0.25, 0.08, 0.04]} />
              <meshStandardMaterial color="#FFD800" emissive="#FFD800" emissiveIntensity={2.0} />
            </mesh>
            {/* Floating Syllabus Question Pages */}
            <group ref={accessoryRef} position={[0, 1.1, 0]}>
              {[0, 1, 2].map((idx) => {
                const angle = (idx * Math.PI * 2) / 3;
                return (
                  <mesh key={idx} position={[Math.cos(angle) * 0.75, 0, Math.sin(angle) * 0.75]}>
                    <planeGeometry args={[0.22, 0.3]} />
                    <meshStandardMaterial color="#FFF5DE" side={THREE.DoubleSide} />
                  </mesh>
                );
              })}
            </group>
          </group>
        );

      case 'echo':
        // The Resonance Synthesizer (Acoustic core with soundwave rings)
        return (
          <group>
            <mesh position={[0, 0.9, 0]}>
              <icosahedronGeometry args={[0.38, 1]} />
              <meshStandardMaterial color="#FF5500" emissive="#FF5500" emissiveIntensity={2.2} metalness={0.9} />
            </mesh>
            <group ref={accessoryRef}>
              <mesh rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[0.65, 0.03, 16, 32]} />
                <meshBasicMaterial color="#FFD800" />
              </mesh>
              <mesh rotation={[-Math.PI / 4, 0, 0]}>
                <torusGeometry args={[0.85, 0.02, 16, 32]} />
                <meshBasicMaterial color="#FF2A00" />
              </mesh>
            </group>
          </group>
        );

      case 'vance':
        // Vance the Cartographer
        return (
          <group>
            <mesh position={[0, 0.75, 0]} castShadow>
              <capsuleGeometry args={[0.3, 0.55, 8, 16]} />
              <meshStandardMaterial color="#1E3A5F" roughness={0.7} />
            </mesh>
            <mesh position={[0, 1.35, 0]} castShadow>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color="#F5D0B5" roughness={0.6} />
            </mesh>
            {/* Explorer Brimmed Hat */}
            <mesh position={[0, 1.48, 0]} castShadow>
              <cylinderGeometry args={[0.38, 0.38, 0.06, 16]} />
              <meshStandardMaterial color="#8B5A2B" roughness={0.8} />
            </mesh>
            {/* Brass Telescope in Hand */}
            <group ref={accessoryRef} position={[0.35, 0.9, 0.2]}>
              <mesh rotation={[0.4, 0, 0]}>
                <cylinderGeometry args={[0.04, 0.06, 0.45, 12]} />
                <meshStandardMaterial color="#E6B800" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          </group>
        );

      case 'cipher':
        // Cipher the Sentinel
        return (
          <group>
            <mesh position={[0, 0.8, 0]} castShadow>
              <cylinderGeometry args={[0.4, 0.45, 0.85, 6]} />
              <meshStandardMaterial color="#2C0F4A" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Rotating Cryptographic Ring */}
            <group ref={accessoryRef} position={[0, 0.8, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.65, 0.04, 8, 6]} />
                <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={1.8} />
              </mesh>
            </group>
          </group>
        );

      case 'iris':
        // Iris the Signal Transceiver
        return (
          <group>
            <mesh position={[0, 0.75, 0]} castShadow>
              <capsuleGeometry args={[0.28, 0.45, 8, 16]} />
              <meshStandardMaterial color="#0A3B18" roughness={0.7} />
            </mesh>
            {/* Radio Antenna on Head */}
            <mesh position={[0, 1.3, 0]} castShadow>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color="#F4D0B8" roughness={0.6} />
            </mesh>
            <mesh position={[0, 1.62, 0]}>
              <cylinderGeometry args={[0.015, 0.02, 0.38, 8]} />
              <meshStandardMaterial color="#22C55E" emissive="#22C55E" emissiveIntensity={2.0} />
            </mesh>
          </group>
        );

      case 'thorne':
        // Master Thorne the Grand Reverse-Engineer
        return (
          <group>
            {/* Distinguished Scholar Coat */}
            <mesh position={[0, 0.8, 0]} castShadow>
              <capsuleGeometry args={[0.34, 0.6, 8, 16]} />
              <meshStandardMaterial color="#2E3812" roughness={0.7} />
            </mesh>
            <mesh position={[0, 1.4, 0]} castShadow>
              <sphereGeometry args={[0.24, 16, 16]} />
              <meshStandardMaterial color="#EED8C6" roughness={0.5} />
            </mesh>
            {/* Brass Goggles / Spectacles */}
            <mesh position={[0, 1.42, 0.22]}>
              <boxGeometry args={[0.32, 0.08, 0.05]} />
              <meshStandardMaterial color="#CCFF00" emissive="#CCFF00" emissiveIntensity={1.5} />
            </mesh>
            {/* Floating Architectural Blueprint Scroll */}
            <group ref={accessoryRef} position={[0.42, 1.0, 0.2]}>
              <mesh rotation={[0, 0, Math.PI / 4]}>
                <cylinderGeometry args={[0.07, 0.07, 0.45, 12]} />
                <meshStandardMaterial color="#FFE866" roughness={0.6} />
              </mesh>
            </group>
          </group>
        );

      case 'shashank':
      default:
        // Shashank S sitting by the cozy stone campfire
        return (
          <group>
            {/* Campfire Stone Ring */}
            <group position={[0, 0.05, 0.6]}>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                const a = (i * Math.PI * 2) / 7;
                return (
                  <mesh key={i} position={[Math.cos(a) * 0.45, 0.06, Math.sin(a) * 0.45]}>
                    <sphereGeometry args={[0.08, 8, 8]} />
                    <meshStandardMaterial color="#555555" roughness={0.9} />
                  </mesh>
                );
              })}
              {/* Fire Flame Core */}
              <mesh position={[0, 0.2, 0]}>
                <coneGeometry args={[0.18, 0.38, 8]} />
                <meshStandardMaterial color="#FF5500" emissive="#FF9776" emissiveIntensity={3.0} />
              </mesh>
              <pointLight color="#FF8C1A" intensity={3.5} distance={8} />
            </group>

            {/* Shashank sitting on log */}
            <mesh position={[0, 0.25, -0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 1.0, 12]} />
              <meshStandardMaterial color="#4A2E18" roughness={0.9} />
            </mesh>
            {/* Character Body */}
            <mesh position={[0, 0.72, -0.1]} castShadow>
              <capsuleGeometry args={[0.3, 0.45, 8, 16]} />
              <meshStandardMaterial color="#1E293B" roughness={0.7} />
            </mesh>
            <mesh position={[0, 1.25, -0.1]} castShadow>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color="#F4D0B8" roughness={0.6} />
            </mesh>
          </group>
        );
    }
  };

  return (
    <group
      ref={groupRef}
      position={character.worldPosition}
      rotation={[0, character.rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        startDialogue(character);
      }}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* 3D Character Mesh */}
      {renderNpcMesh()}

      {/* Floating Talk Prompt when nearby */}
      {isNearby && (
        <group ref={promptRef} position={[0, 2.4, 0]}>
          <mesh>
            <planeGeometry args={[2.2, 0.65]} />
            <meshBasicMaterial color="#10131F" transparent opacity={0.9} />
          </mesh>
          {/* Border line */}
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[2.3, 0.75]} />
            <meshBasicMaterial color={character.primaryColor} />
          </mesh>
          <Text
            position={[0, 0.08, 0.02]}
            fontSize={0.2}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.woff"
          >
            {`[E] TALK TO ${character.name.toUpperCase()}`}
          </Text>
          <Text
            position={[0, -0.16, 0.02]}
            fontSize={0.12}
            color={character.primaryColor}
            anchorX="center"
            anchorY="middle"
          >
            {character.title}
          </Text>
        </group>
      )}

      {/* Soft Contact Shadow beneath NPC */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 16]} />
        <meshBasicMaterial color="#050C0A" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};
