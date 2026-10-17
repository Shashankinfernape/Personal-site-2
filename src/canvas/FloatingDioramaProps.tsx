// src/canvas/FloatingDioramaProps.tsx
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';

export const FloatingDioramaProps: React.FC = () => {
  const gyroRef = useRef<THREE.Group>(null);
  const prismRef = useRef<THREE.Group>(null);
  const radarRef = useRef<THREE.Group>(null);
  const vaultRingsRef = useRef<THREE.Group>(null);
  const antennaRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (gyroRef.current) gyroRef.current.rotation.y += delta * 0.8;
    if (prismRef.current) prismRef.current.rotation.y += delta * 0.4;
    if (radarRef.current) radarRef.current.rotation.y += delta * 1.5;
    if (vaultRingsRef.current) vaultRingsRef.current.rotation.z += delta * 0.6;
    if (antennaRef.current) antennaRef.current.rotation.y -= delta * 0.5;
  });

  return (
    <group>
      {/* 1. Haven Courtyard: Wayfinder Spire */}
      <group position={[0, 0, 5]}>
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.35, 3.6, 8]} />
          <meshStandardMaterial color="#354A3E" roughness={0.7} />
        </mesh>
        <mesh position={[0, 3.8, 0]}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={1.8} />
        </mesh>
        <pointLight color="#00F5D4" intensity={3} distance={12} position={[0, 3.8, 0]} />
        <Text
          position={[0, 4.6, 0]}
          fontSize={0.32}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          THE HAVEN COURTYARD
        </Text>
      </group>

      {/* 2. Touchless Workshop: Kinetic Gimbal */}
      <group position={[12, 0, -8]}>
        <group ref={gyroRef} position={[0, 2.2, 0]}>
          <mesh>
            <torusGeometry args={[1.5, 0.04, 16, 32]} />
            <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={1.2} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.2, 0.035, 16, 32]} />
            <meshStandardMaterial color="#FFE866" />
          </mesh>
        </group>
        <Text position={[0, 4.2, 0]} fontSize={0.28} color="#FFFFFF" anchorX="center">
          TOUCHLESS WORKSHOP // HANDESK
        </Text>
      </group>

      {/* 3. Prism Spire: Crystal Multi-Ratio Monument */}
      <group position={[24, 1.2, -26]}>
        <Float speed={2} floatIntensity={0.6}>
          <group ref={prismRef} position={[0, 2.8, 0]}>
            <mesh>
              <octahedronGeometry args={[1.2, 0]} />
              <meshStandardMaterial
                color="#FF2A85"
                emissive="#FF2A85"
                emissiveIntensity={1.6}
                roughness={0.1}
                metalness={0.9}
              />
            </mesh>
          </group>
        </Float>
        <Text position={[0, 4.6, 0]} fontSize={0.28} color="#FFFFFF" anchorX="center">
          PRISM SPIRE // SLIDEPAPER
        </Text>
      </group>

      {/* 4. Scholar's Cloister: Isar Archive Dais */}
      <group position={[-16, 0.5, -18]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[1.8, 1.8, 1.8]} />
          <meshStandardMaterial color="#5A626A" roughness={0.8} />
        </mesh>
        <mesh position={[0, 2.2, 0]}>
          <boxGeometry args={[1.2, 0.2, 1.2]} />
          <meshStandardMaterial color="#FFD800" emissive="#FFD800" emissiveIntensity={1.5} />
        </mesh>
        <Text position={[0, 3.4, 0]} fontSize={0.28} color="#FFFFFF" anchorX="center">
          SCHOLAR'S CLOISTER // EXAMINAR
        </Text>
      </group>

      {/* 5. Resonance Caldera: Soundwave Core */}
      <group position={[16, -0.5, -45]}>
        <mesh position={[0, 1.5, 0]}>
          <torusKnotGeometry args={[0.9, 0.3, 64, 16]} />
          <meshStandardMaterial color="#FF5500" emissive="#FF5500" emissiveIntensity={2.0} />
        </mesh>
        <Text position={[0, 3.2, 0]} fontSize={0.28} color="#FFFFFF" anchorX="center">
          RESONANCE CALDERA // FRANKY
        </Text>
      </group>

      {/* 6. Radar Lookout: Geospatial Tower */}
      <group position={[-22, 1.8, -48]}>
        <mesh position={[0, 2.0, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.5, 4.0, 8]} />
          <meshStandardMaterial color="#2B3A4A" roughness={0.8} />
        </mesh>
        <group ref={radarRef} position={[0, 4.2, 0]}>
          <mesh rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[1.1, 0.1, 0.15, 16]} />
            <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={1.2} />
          </mesh>
        </group>
        <Text position={[0, 5.2, 0]} fontSize={0.28} color="#FFFFFF" anchorX="center">
          RADAR LOOKOUT // TERRITORY
        </Text>
      </group>

      {/* 7. Cryptographic Vault: Obsidian Lock Archway */}
      <group position={[10, 0, -70]}>
        <mesh position={[-1.2, 2.2, 0]} castShadow>
          <boxGeometry args={[0.6, 4.4, 0.6]} />
          <meshStandardMaterial color="#1C102A" roughness={0.7} />
        </mesh>
        <mesh position={[1.2, 2.2, 0]} castShadow>
          <boxGeometry args={[0.6, 4.4, 0.6]} />
          <meshStandardMaterial color="#1C102A" roughness={0.7} />
        </mesh>
        <mesh position={[0, 4.4, 0]} castShadow>
          <boxGeometry args={[3.0, 0.6, 0.6]} />
          <meshStandardMaterial color="#1C102A" roughness={0.7} />
        </mesh>
        <group ref={vaultRingsRef} position={[0, 2.4, 0]}>
          <mesh>
            <torusGeometry args={[0.9, 0.04, 16, 32]} />
            <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={2.0} />
          </mesh>
        </group>
        <Text position={[0, 5.2, 0]} fontSize={0.28} color="#FFFFFF" anchorX="center">
          CRYPTOGRAPHIC VAULT // SSTRAESS
        </Text>
      </group>

      {/* 8. Signal Relay: Broadcast Radio Mast */}
      <group position={[-8, 1.0, -82]}>
        <group ref={antennaRef} position={[0, 2.5, 0]}>
          <mesh position={[0, 1.0, 0]}>
            <cylinderGeometry args={[0.08, 0.18, 4.2, 6]} />
            <meshStandardMaterial color="#0A3B18" roughness={0.6} />
          </mesh>
          <mesh position={[0, 3.2, 0]}>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshStandardMaterial color="#22C55E" emissive="#22C55E" emissiveIntensity={2.2} />
          </mesh>
        </group>
        <Text position={[0, 6.2, 0]} fontSize={0.28} color="#FFFFFF" anchorX="center">
          SIGNAL RELAY // CHATFLIX & NLP
        </Text>
      </group>

      {/* 9. Grand Archives of Reverse-Engineering: Museum Portico */}
      <group position={[0, 2.0, -108]}>
        {/* Classical / Tech Museum Columns */}
        {[-3, -1, 1, 3].map((x, i) => (
          <mesh key={i} position={[x, 2.2, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.35, 4.4, 12]} />
            <meshStandardMaterial color="#222B14" roughness={0.7} />
          </mesh>
        ))}
        {/* Architrave Beam */}
        <mesh position={[0, 4.5, 0]} castShadow>
          <boxGeometry args={[7.5, 0.6, 1.2]} />
          <meshStandardMaterial color="#2E3812" roughness={0.8} />
        </mesh>
        {/* Glowing Archive Crystal Core */}
        <mesh position={[0, 2.2, -0.6]}>
          <octahedronGeometry args={[1.0, 0]} />
          <meshStandardMaterial color="#CCFF00" emissive="#CCFF00" emissiveIntensity={2.2} />
        </mesh>
        <pointLight color="#CCFF00" intensity={3} distance={15} position={[0, 2.2, 0]} />
        <Text position={[0, 5.4, 0]} fontSize={0.34} color="#CCFF00" anchorX="center">
          THE GRAND ARCHIVES // 17 REVERSE-ENGINEERED STUDIES
        </Text>
      </group>

      {/* 10. The Wayfarer's Hearth: Summit Campfire Lookout */}
      <group position={[0, 0.5, -135]}>
        <Text position={[0, 3.2, 0]} fontSize={0.32} color="#FFFFFF" anchorX="center">
          THE WAYFARER'S HEARTH // SHASHANK S
        </Text>
      </group>
    </group>
  );
};
