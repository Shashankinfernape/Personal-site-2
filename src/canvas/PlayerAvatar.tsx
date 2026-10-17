// src/canvas/PlayerAvatar.tsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { usePlayableWorldStore } from '../store/usePlayableWorldStore';

export const PlayerAvatar: React.FC = () => {
  const avatarGroupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const lanternRef = useRef<THREE.Group>(null);
  const capeRef = useRef<THREE.Mesh>(null);

  const {
    playerPosition,
    playerTargetPosition,
    updatePlayerMovement,
    setPlayerTargetPosition,
    startDialogue,
    nearbyNpc,
    activeDialogue,
  } = usePlayableWorldStore();

  // Input state
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;

      // Talk to nearby NPC shortcut
      if ((e.key.toLowerCase() === 'e' || e.key === ' ') && nearbyNpc && !activeDialogue) {
        startDialogue(nearbyNpc);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyNpc, activeDialogue, startDialogue]);

  const currentPos = useRef(new THREE.Vector3(...playerPosition));
  const currentRotY = useRef(0);
  const walkTime = useRef(0);

  useFrame((state, delta) => {
    if (!avatarGroupRef.current) return;
    const dt = Math.min(delta, 0.1);

    // Don't move if dialogue or dossier modal is open
    const isInteracting = activeDialogue !== null;

    let moveX = 0;
    let moveZ = 0;
    let isRunning = keysPressed.current['shift'] === true;
    let isMoving = false;

    if (!isInteracting) {
      // 1. Keyboard Controls
      if (keysPressed.current['w'] || keysPressed.current['arrowup']) moveZ -= 1;
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) moveZ += 1;
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) moveX -= 1;
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) moveX += 1;

      // 2. Click-to-Move Target
      if (playerTargetPosition) {
        const dx = playerTargetPosition[0] - currentPos.current.x;
        const dz = playerTargetPosition[2] - currentPos.current.z;
        const distToTarget = Math.sqrt(dx * dx + dz * dz);

        if (distToTarget > 0.4) {
          moveX = dx / distToTarget;
          moveZ = dz / distToTarget;
        } else {
          setPlayerTargetPosition(null);
        }
      }
    }

    const moveLength = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (moveLength > 0.05) {
      isMoving = true;
      const speed = isRunning ? 11.0 : 7.0;
      const dirX = moveX / moveLength;
      const dirZ = moveZ / moveLength;

      currentPos.current.x += dirX * speed * dt;
      currentPos.current.z += dirZ * speed * dt;

      // Rotate towards movement angle
      const targetAngle = Math.atan2(dirX, dirZ);
      currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, targetAngle, dt * 14);

      // Walk cycle phase
      walkTime.current += dt * (isRunning ? 16 : 10);
    } else {
      // Idle breathing phase
      walkTime.current += dt * 3;
    }

    // Keep avatar on ground plane (subtle terrain contour y)
    const groundY = 0.5;
    currentPos.current.y = groundY;

    // Apply avatar transform
    avatarGroupRef.current.position.copy(currentPos.current);
    avatarGroupRef.current.rotation.y = currentRotY.current;

    // Procedural limb animation
    if (isMoving) {
      const legAngle = Math.sin(walkTime.current) * 0.65;
      if (leftLegRef.current) leftLegRef.current.rotation.x = legAngle;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legAngle;

      const armAngle = Math.cos(walkTime.current) * 0.45;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -armAngle;
      if (rightArmRef.current) rightArmRef.current.rotation.x = armAngle;

      // Bobbing body
      avatarGroupRef.current.position.y += Math.abs(Math.sin(walkTime.current)) * 0.08;

      // Cape flutter
      if (capeRef.current) {
        capeRef.current.rotation.x = 0.4 + Math.sin(walkTime.current * 1.5) * 0.2;
      }
    } else {
      // Idle gentle sway
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(walkTime.current * 0.8) * 0.05;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(walkTime.current * 0.8) * 0.05;
      if (capeRef.current) {
        capeRef.current.rotation.x = 0.15 + Math.sin(walkTime.current * 0.6) * 0.04;
      }
    }

    // Lantern swing
    if (lanternRef.current) {
      lanternRef.current.rotation.z = Math.sin(walkTime.current * 0.8) * 0.15;
      lanternRef.current.rotation.x = Math.cos(walkTime.current * 0.8) * 0.1;
    }

    // Sync position with global store
    updatePlayerMovement(
      [currentPos.current.x, currentPos.current.y, currentPos.current.z],
      currentRotY.current,
      isMoving,
      isRunning
    );

    // Smoothly lead camera behind and above the player
    const camTarget = new THREE.Vector3(
      currentPos.current.x,
      currentPos.current.y + 11.5,
      currentPos.current.z + 13.5
    );
    const lookTarget = new THREE.Vector3(
      currentPos.current.x,
      currentPos.current.y + 1.2,
      currentPos.current.z
    );

    state.camera.position.lerp(camTarget, dt * 5.0);
    state.camera.lookAt(lookTarget);
  });

  return (
    <group ref={avatarGroupRef} castShadow>
      {/* Traveler Body & Tunic */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.5, 8, 16]} />
        <meshStandardMaterial
          color="#2C4A3E" // Forest Sage Coat
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Explorer Scarf */}
      <mesh position={[0, 1.05, 0.05]} castShadow>
        <torusGeometry args={[0.26, 0.08, 8, 16]} />
        <meshStandardMaterial color="#FF9776" roughness={0.8} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color="#F4D0B8" roughness={0.6} />
      </mesh>

      {/* Feathered Traveler Cap */}
      <mesh position={[0, 1.5, 0]} rotation={[-0.1, 0, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.26, 0.14, 16]} />
        <meshStandardMaterial color="#1C3026" roughness={0.8} />
      </mesh>
      {/* Golden Feather */}
      <mesh position={[0.22, 1.62, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.04, 0.22, 0.08]} />
        <meshStandardMaterial color="#FFD800" emissive="#FFD800" emissiveIntensity={0.6} />
      </mesh>

      {/* Backpack & Bedroll */}
      <group position={[0, 0.78, -0.28]}>
        {/* Leather satchel */}
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.38, 0.22]} />
          <meshStandardMaterial color="#5C381E" roughness={0.8} />
        </mesh>
        {/* Bedroll on top */}
        <mesh position={[0, 0.25, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.48, 12]} />
          <meshStandardMaterial color="#8C9A86" roughness={0.9} />
        </mesh>
      </group>

      {/* Flowing Cloak / Cape */}
      <mesh ref={capeRef} position={[0, 0.95, -0.18]} rotation={[0.2, 0, 0]} castShadow>
        <planeGeometry args={[0.55, 0.8]} />
        <meshStandardMaterial
          color="#3A6352"
          side={THREE.DoubleSide}
          roughness={0.8}
        />
      </mesh>

      {/* Left Arm */}
      <mesh ref={leftArmRef} position={[-0.4, 0.72, 0]} castShadow>
        <capsuleGeometry args={[0.09, 0.38, 6, 12]} />
        <meshStandardMaterial color="#2C4A3E" roughness={0.7} />
      </mesh>

      {/* Right Arm holding Lantern */}
      <group position={[0.4, 0.72, 0]}>
        <mesh ref={rightArmRef} castShadow>
          <capsuleGeometry args={[0.09, 0.38, 6, 12]} />
          <meshStandardMaterial color="#2C4A3E" roughness={0.7} />
        </mesh>

        {/* Handheld Brass Lantern */}
        <group ref={lanternRef} position={[0.05, -0.32, 0.15]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.1, 0.18, 8]} />
            <meshStandardMaterial color="#C8963E" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Luminous Core */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#FFE866" />
          </mesh>
          <pointLight color="#FFE866" intensity={2.2} distance={6} />
        </group>
      </group>

      {/* Legs & Boots */}
      <mesh ref={leftLegRef} position={[-0.15, 0.22, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.35, 6, 12]} />
        <meshStandardMaterial color="#4A3423" roughness={0.8} />
      </mesh>
      <mesh ref={rightLegRef} position={[0.15, 0.22, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.35, 6, 12]} />
        <meshStandardMaterial color="#4A3423" roughness={0.8} />
      </mesh>

      {/* Soft Contact Shadow beneath Player */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.45, 16]} />
        <meshBasicMaterial color="#050C0A" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};
