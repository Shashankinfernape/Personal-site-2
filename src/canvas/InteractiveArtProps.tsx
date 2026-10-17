// src/canvas/InteractiveArtProps.tsx
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Billboard } from '@react-three/drei';
import { useGameStore } from '../store/useGameStore';
import { RESEARCH_STUDIES } from '../config/research.config';

export const InteractiveArtProps: React.FC = () => {
  const { playerPosition, selectResearchStudy, setVehicleMode } = useGameStore();

  const vaultRingsRef = useRef<THREE.Group>(null);
  const handTrackerRef = useRef<THREE.Group>(null);
  const soundWaveRingsRef = useRef<THREE.Group>(null);

  // 17 Totems arranged radially around Spawn Plaza (radius = 16)
  const totemLayout = useMemo(() => {
    return RESEARCH_STUDIES.map((study, idx) => {
      const angle = (idx / RESEARCH_STUDIES.length) * Math.PI * 2;
      const radius = 17;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      return {
        study,
        position: [x, 0, z] as [number, number, number],
        rotationY: angle + Math.PI,
      };
    });
  }, []);

  // Bowling pins at Spawn Plaza for bowling with car/bike
  const bowlingPins = useMemo(() => {
    const pins: [number, number, number][] = [
      [0, 0, -10],
      [-1.2, 0, -11.5],
      [1.2, 0, -11.5],
      [-2.4, 0, -13],
      [0, 0, -13],
      [2.4, 0, -13],
      [-3.6, 0, -14.5],
      [-1.2, 0, -14.5],
      [1.2, 0, -14.5],
      [3.6, 0, -14.5],
    ];
    return pins;
  }, []);

  // Jump ramps across the world
  const jumpRamps = useMemo(() => {
    return [
      { pos: [0, 0, -22], rot: [0, 0, 0], scale: [3.5, 1.2, 4.0] },
      { pos: [28, 0, -28], rot: [0, Math.PI / 4, 0], scale: [3.5, 1.4, 4.0] },
      { pos: [45, 0, 35], rot: [0, Math.PI / 2, 0], scale: [3.5, 1.5, 4.0] },
      { pos: [-25, 0, 42], rot: [0, -Math.PI / 4, 0], scale: [3.5, 1.4, 4.0] },
      { pos: [-45, 0, -32], rot: [0, -Math.PI / 3, 0], scale: [3.5, 1.5, 4.0] },
    ] as { pos: [number, number, number]; rot: [number, number, number]; scale: [number, number, number] }[];
  }, []);

  useFrame((state) => {
    // Rotate cryptographic vault rings at SSTRAESS (-70, 0, -10)
    if (vaultRingsRef.current) {
      vaultRingsRef.current.children.forEach((child, i) => {
        child.rotation.z = state.clock.elapsedTime * (0.2 + i * 0.15) * (i % 2 === 0 ? 1 : -1);
      });
    }

    // Articulated hand at Handesk (0, 0, -45) points toward player
    if (handTrackerRef.current) {
      const dx = playerPosition[0] - 0;
      const dz = playerPosition[2] - (-45);
      const angle = Math.atan2(dx, dz);
      handTrackerRef.current.rotation.y = THREE.MathUtils.lerp(
        handTrackerRef.current.rotation.y,
        angle,
        0.05
      );
    }

    // Pulsing soundwave rings at Franky (20, 0, 65)
    if (soundWaveRingsRef.current) {
      soundWaveRingsRef.current.children.forEach((ring, i) => {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 4 + i) * 0.12;
        ring.scale.set(scale, scale, scale);
      });
    }
  });

  return (
    <group>
      {/* ========================================================
          1. SPAWN PLAZA (0, 0, 0): 17-TEMPLATE TOTEM SCULPTURE PARK
         ======================================================== */}
      <group position={[0, 0, 0]}>
        {/* Central Fountain / Hub Monument */}
        <mesh position={[0, 0.4, 0]} receiveShadow>
          <cylinderGeometry args={[5, 6, 0.8, 32]} />
          <meshStandardMaterial color="#18181B" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[1.5, 2.2, 1.6, 16]} />
          <meshStandardMaterial color="#27272A" metalness={0.7} />
        </mesh>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[0, 3.8, 0]}>
            <octahedronGeometry args={[1.4, 0]} />
            <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={1.2} />
          </mesh>
        </Float>

        {/* 17 Interactive Reverse-Engineering Totems */}
        {totemLayout.map(({ study, position, rotationY }) => {
          const dist = Math.hypot(playerPosition[0] - position[0], playerPosition[2] - position[2]);
          const isNear = dist < 4;

          return (
            <group
              key={study.id}
              position={position}
              rotation={[0, rotationY, 0]}
              onClick={(e) => {
                e.stopPropagation();
                selectResearchStudy(study);
              }}
              onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
              onPointerOut={() => { document.body.style.cursor = 'auto'; }}
            >
              {/* Pedestal */}
              <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.2, 1.2, 1.2]} />
                <meshStandardMaterial color="#22262B" roughness={0.3} />
              </mesh>

              {/* Glowing Hologram Prism */}
              <mesh position={[0, 1.8, 0]} castShadow>
                <boxGeometry args={[0.7, 1.0, 0.7]} />
                <meshStandardMaterial
                  color={isNear ? '#CCFF00' : '#00F5D4'}
                  emissive={isNear ? '#CCFF00' : '#00F5D4'}
                  emissiveIntensity={isNear ? 2.5 : 0.8}
                  roughness={0.1}
                />
              </mesh>

              {/* Floating Totem Label */}
              <Billboard position={[0, 2.6, 0]}>
                <Text
                  fontSize={0.28}
                  color="#FFFFFF"
                  anchorX="center"
                >
                  {study.title.toUpperCase()}
                </Text>
              </Billboard>
            </group>
          );
        })}

        {/* Vehicle Garage Bays at Spawn (Parked Car + Bicycle Rack) */}
        <group position={[-8, 0, 4]}>
          <Billboard position={[0, 1.8, 0]}>
            <Text fontSize={0.35} color="#FFD800" anchorX="center">
              [1] ON FOOT · [2] BICYCLE · [3] DRIFT CAR
            </Text>
          </Billboard>

          {/* Bike Rack Trigger */}
          <group
            position={[-2.5, 0, 0]}
            onClick={() => setVehicleMode('BICYCLE')}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
          >
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[1.4, 0.8, 0.3]} />
              <meshStandardMaterial color="#FF2A85" />
            </mesh>
            <Billboard position={[0, 1.0, 0]}>
              <Text fontSize={0.25} color="#FFFFFF">
                CLICK FOR BICYCLE [2]
              </Text>
            </Billboard>
          </group>

          {/* Car Garage Trigger */}
          <group
            position={[2.5, 0, 0]}
            onClick={() => setVehicleMode('DRIFT_CAR')}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
          >
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[2.0, 0.8, 1.0]} />
              <meshStandardMaterial color="#FF5500" />
            </mesh>
            <Billboard position={[0, 1.0, 0]}>
              <Text fontSize={0.25} color="#FFFFFF">
                CLICK FOR DRIFT CAR [3]
              </Text>
            </Billboard>
          </group>
        </group>

        {/* Interactive Bowling Pins */}
        <group>
          {bowlingPins.map((pinPos, i) => (
            <mesh key={i} position={pinPos} castShadow>
              <cylinderGeometry args={[0.2, 0.32, 1.2, 12]} />
              <meshToonMaterial color="#FFFFFF" />
            </mesh>
          ))}
        </group>
      </group>

      {/* ========================================================
          2. STUNT JUMP RAMPS SPREAD ACROSS WORLD
         ======================================================== */}
      {jumpRamps.map((ramp, i) => (
        <group key={i} position={ramp.pos} rotation={ramp.rot}>
          <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
            <boxGeometry args={ramp.scale} />
            <meshStandardMaterial color="#FF5500" metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.61, 0]}>
            <planeGeometry args={[ramp.scale[0] * 0.8, ramp.scale[2] * 0.9]} />
            <meshBasicMaterial color="#FFE600" />
          </mesh>
        </group>
      ))}

      {/* ========================================================
          3. THEATRE 01: HANDESK ARTICULATED CYBER-HAND & KEYCAPS (0, 0, -45)
         ======================================================== */}
      <group position={[0, 0, -45]}>
        {/* Giant Articulated Cyber-Hand Sculpture */}
        <group ref={handTrackerRef} position={[0, 4.5, 8]}>
          <mesh castShadow>
            <boxGeometry args={[2.4, 3.2, 0.8]} />
            <meshStandardMaterial color="#0E2F2B" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Fingers */}
          {[-0.9, -0.3, 0.3, 0.9].map((fx, fi) => (
            <mesh key={fi} position={[fx, 2.2, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.22, 1.6, 12]} />
              <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={0.6} />
            </mesh>
          ))}
        </group>

        {/* Drive-Across Giant Physics Keycaps */}
        {[-4, -1.3, 1.3, 4].map((kx, ki) => (
          <group key={ki} position={[kx, 0.35, -2]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2.2, 0.7, 2.2]} />
              <meshStandardMaterial color="#1E293B" roughness={0.5} />
            </mesh>
            <Text position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.6} color="#00F5D4">
              {['ONE-€', 'PINCH', 'CV', '16MS'][ki]}
            </Text>
          </group>
        ))}
      </group>

      {/* ========================================================
          4. THEATRE 02: SLIDEPAPER PANORAMIC DRIVE-IN ARCHES (55, 0, -55)
         ======================================================== */}
      <group position={[55, 0, -55]}>
        {/* Drive-in Neon Prism Arches */}
        {[-10, 0, 10].map((ax, ai) => (
          <mesh key={ai} position={[ax, 4, 12]} castShadow>
            <torusGeometry args={[4.5, 0.25, 12, 32, Math.PI]} />
            <meshStandardMaterial color="#FF2A85" emissive="#FF2A85" emissiveIntensity={1.5} />
          </mesh>
        ))}
      </group>

      {/* ========================================================
          5. THEATRE 03: EXAMINAR FLOATING PAPER AIRPLANES (70, 0, 15)
         ======================================================== */}
      <group position={[70, 0, 15]}>
        {/* Floating Paper Airplanes */}
        <Float speed={3} rotationIntensity={1} floatIntensity={1.5}>
          <mesh position={[-6, 6, 4]} rotation={[0.4, 0.8, -0.2]} castShadow>
            <coneGeometry args={[1.5, 3.5, 3]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
        </Float>
        <Float speed={2.5} rotationIntensity={1.2} floatIntensity={2}>
          <mesh position={[6, 7.5, 2]} rotation={[-0.3, -0.6, 0.4]} castShadow>
            <coneGeometry args={[1.2, 2.8, 3]} />
            <meshStandardMaterial color="#FFE600" roughness={0.3} />
          </mesh>
        </Float>
      </group>

      {/* ========================================================
          6. THEATRE 04: FRANKY FERROFLUID SOUNDSTAGE (20, 0, 65)
         ======================================================== */}
      <group position={[20, 0, 65]}>
        {/* Pulsing Acoustic Rings */}
        <group ref={soundWaveRingsRef} position={[0, 2.5, 0]}>
          {[4, 6.5, 9, 11.5].map((rad, ri) => (
            <mesh key={ri} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[rad, rad + 0.35, 64]} />
              <meshBasicMaterial color="#FF5500" side={THREE.DoubleSide} transparent opacity={0.65} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ========================================================
          7. THEATRE 05: TERRITORY MINIATURE POP-UP CITY (-50, 0, 55)
         ======================================================== */}
      <group position={[-50, 0, 55]}>
        {/* Miniature 3D Pop-Up Buildings */}
        {[-8, -4, 0, 4, 8].map((bx, bi) => (
          <mesh key={bi} position={[bx, (bi % 3 + 1) * 1.2, 8]} castShadow>
            <boxGeometry args={[2.4, (bi % 3 + 1) * 2.4, 2.4]} />
            <meshStandardMaterial color="#38BDF8" roughness={0.3} metalness={0.7} />
          </mesh>
        ))}
      </group>

      {/* ========================================================
          8. THEATRE 06: SSTRAESS CRYPTOGRAPHIC VAULT RINGS (-70, 0, -10)
         ======================================================== */}
      <group position={[-70, 0, -10]}>
        <group ref={vaultRingsRef} position={[0, 5, 0]}>
          {[4.5, 6.8, 9.2].map((r, ri) => (
            <mesh key={ri} rotation={[0, 0, 0]}>
              <torusGeometry args={[r, 0.22, 12, 48]} />
              <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={1.2} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ========================================================
          9. THEATRE 07: CHATFLIX POPCORN & CLAPPERBOARDS (-40, 0, -65)
         ======================================================== */}
      <group position={[-40, 0, -65]}>
        {/* Giant Popcorn Bucket */}
        <mesh position={[-6, 2.5, 6]} castShadow>
          <cylinderGeometry args={[2.0, 1.4, 4.0, 16]} />
          <meshToonMaterial color="#EF4444" />
        </mesh>
        {/* Clapperboard Ramp */}
        <mesh position={[6, 1.8, 6]} rotation={[0.4, 0.2, 0]} castShadow>
          <boxGeometry args={[4.2, 2.8, 0.4]} />
          <meshStandardMaterial color="#18181B" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};
