// src/canvas/PlayerVehicleController.tsx
import React, { useRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useGameStore, VehicleMode } from '../store/useGameStore';

// Pre-allocate math objects outside useFrame (Slow Roads / Messenger zero-GC rule)
const tempBox = new THREE.Box3();
const tempSegment = new THREE.Line3();
const tempVector = new THREE.Vector3();
const tempVector2 = new THREE.Vector3();
const camTargetVec = new THREE.Vector3();
const camLookVec = new THREE.Vector3();

// Capsule collider specification (Line segment + radius)
const capsuleInfo = {
  radius: 0.45,
  segment: new THREE.Line3(new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0, 1.45, 0)),
};

export const PlayerVehicleController: React.FC = () => {
  const playerGroup = useRef<THREE.Group>(null);
  const chassisRef = useRef<THREE.Group>(null);
  const headBoneRef = useRef<THREE.Group>(null);

  // Limbs for articulated walking / running / pedaling
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  // Bicycle & car animated parts
  const wheelFL = useRef<THREE.Mesh>(null);
  const wheelFR = useRef<THREE.Mesh>(null);
  const wheelRL = useRef<THREE.Mesh>(null);
  const wheelRR = useRef<THREE.Mesh>(null);
  const bikeWheelF = useRef<THREE.Mesh>(null);
  const bikeWheelR = useRef<THREE.Mesh>(null);
  const handlebarsRef = useRef<THREE.Group>(null);
  const headlightL = useRef<THREE.SpotLight>(null);
  const headlightR = useRef<THREE.SpotLight>(null);

  const {
    vehicleMode,
    setVehicleMode,
    setPlayerTelemetry,
    isFollowingGuide,
    guidePosition,
    headlights,
    toggleHeadlights,
    warpTargetPosition,
    clearWarpTarget,
    cameraMode,
    worldBvh,
    wardrobe,
    toggleWardrobe,
    spawnEmoji,
    activeEmojis,
    removeEmoji,
  } = useGameStore();

  const keys = useRef<{ [key: string]: boolean }>({});
  const velocity = useRef(0);
  const heading = useRef(Math.PI);
  const verticalY = useRef(0);
  const verticalVel = useRef(0);
  const driftFactor = useRef(0);
  const walkCadence = useRef(0);
  const isOnGround = useRef(true);

  // Emoji key mappings: 4, 5, 6, 7, 8, 9
  const emojiMap: { [k: string]: string } = {
    '4': '🚀',
    '5': '🔥',
    '6': '⚡',
    '7': '✨',
    '8': '💬',
    '9': '🎉',
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys.current[k] = true;

      // Hotkey vehicle switching or mounting
      if (k === '1') setVehicleMode('ON_FOOT');
      if (k === '2') setVehicleMode('BICYCLE');
      if (k === '3') setVehicleMode('DRIFT_CAR');
      if (k === 'e') {
        // Toggle mount/dismount
        if (vehicleMode === 'ON_FOOT') setVehicleMode('DRIFT_CAR');
        else setVehicleMode('ON_FOOT');
      }
      if (k === 'h') toggleHeadlights();
      if (k === 'c') toggleWardrobe();

      // Messenger Social Emojis: 4–9
      if (emojiMap[e.key]) {
        spawnEmoji(emojiMap[e.key]);
      }

      // Jump / Bunny-hop / Hydraulic bounce
      if (e.code === 'Space' && verticalY.current <= 0.05) {
        verticalVel.current = vehicleMode === 'BICYCLE' ? 8.5 : vehicleMode === 'ON_FOOT' ? 7.2 : 5.0;
        isOnGround.current = false;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [vehicleMode, setVehicleMode, toggleHeadlights, toggleWardrobe, spawnEmoji]);

  useFrame((state, delta) => {
    if (!playerGroup.current) return;
    const dt = Math.min(delta, 0.05);

    // Instant Warp Handling (e.g. from Teleport Map or Instagram Stories ring)
    if (warpTargetPosition) {
      playerGroup.current.position.set(warpTargetPosition[0], warpTargetPosition[1], warpTargetPosition[2]);
      velocity.current = 0;
      verticalY.current = 0;
      verticalVel.current = 0;
      clearWarpTarget();
      return;
    }

    // Top speed & acceleration parameters per mode
    const isNitroBoosting = keys.current['shift'] === true;
    const maxSpeed =
      vehicleMode === 'DRIFT_CAR'
        ? isNitroBoosting
          ? 38
          : 25
        : vehicleMode === 'BICYCLE'
        ? isNitroBoosting
          ? 20
          : 15
        : isNitroBoosting
        ? 12
        : 7.5;

    const accel = vehicleMode === 'DRIFT_CAR' ? (isNitroBoosting ? 32 : 22) : vehicleMode === 'BICYCLE' ? 16 : 19;
    const turnRate = vehicleMode === 'DRIFT_CAR' ? 2.5 : vehicleMode === 'BICYCLE' ? 3.2 : 4.0;

    // Autopilot follow mode when cruising with Shashank (Guide NPC)
    if (isFollowingGuide) {
      const targetVec = new THREE.Vector3(...guidePosition).add(new THREE.Vector3(2.5, 0, 2.5));
      playerGroup.current.position.lerp(targetVec, dt * 3.0);
      const dx = guidePosition[0] - playerGroup.current.position.x;
      const dz = guidePosition[2] - playerGroup.current.position.z;
      heading.current = Math.atan2(dx, dz);
      playerGroup.current.rotation.y = heading.current;
      velocity.current = 10;
    } else {
      // Manual WASD / Arrow Controls
      const forward =
        (keys.current['w'] || keys.current['arrowup'] ? 1 : 0) -
        (keys.current['s'] || keys.current['arrowdown'] ? 1 : 0);
      const steer =
        (keys.current['a'] || keys.current['arrowleft'] ? 1 : 0) -
        (keys.current['d'] || keys.current['arrowright'] ? 1 : 0);

      // Acceleration and braking
      if (forward !== 0) {
        velocity.current = THREE.MathUtils.clamp(
          velocity.current + forward * accel * dt,
          -maxSpeed * 0.4,
          maxSpeed
        );
      } else {
        velocity.current = THREE.MathUtils.lerp(velocity.current, 0, dt * 5.5);
      }

      // Steering with drift dynamics
      if (Math.abs(velocity.current) > 0.2) {
        const dir = velocity.current >= 0 ? 1 : -1;
        const driftBoost = keys.current[' '] && vehicleMode === 'DRIFT_CAR' ? 1.6 : 1.0;
        heading.current += steer * turnRate * dt * dir * driftBoost;
        driftFactor.current = THREE.MathUtils.lerp(driftFactor.current, (steer * Math.abs(velocity.current)) / maxSpeed, dt * 6);
      } else {
        driftFactor.current = THREE.MathUtils.lerp(driftFactor.current, 0, dt * 8);
      }

      // Gravity & bunny-hop / jump physics
      verticalY.current += verticalVel.current * dt;
      if (verticalY.current > 0) {
        verticalVel.current -= 24 * dt;
        isOnGround.current = false;
      } else {
        verticalY.current = 0;
        verticalVel.current = 0;
        isOnGround.current = true;
      }

      playerGroup.current.position.x += Math.sin(heading.current) * velocity.current * dt;
      playerGroup.current.position.z += Math.cos(heading.current) * velocity.current * dt;
      playerGroup.current.position.y = verticalY.current;
      playerGroup.current.rotation.y = heading.current;

      // ========================================================
      // three-mesh-bvh Capsule Collision Resolution
      // ========================================================
      if (worldBvh) {
        tempSegment.copy(capsuleInfo.segment);
        tempSegment.start.add(playerGroup.current.position);
        tempSegment.end.add(playerGroup.current.position);

        tempBox.makeEmpty();
        tempBox.expandByPoint(tempSegment.start);
        tempBox.expandByPoint(tempSegment.end);
        tempBox.min.addScalar(-capsuleInfo.radius);
        tempBox.max.addScalar(capsuleInfo.radius);

        worldBvh.shapecast({
          intersectsBounds: (box: any) => box.intersectsBox(tempBox),
          intersectsTriangle: (tri: any) => {
            const dist = tri.closestPointToSegment(tempSegment, tempVector, tempVector2);
            if (dist < capsuleInfo.radius) {
              const depth = capsuleInfo.radius - dist;
              const direction = tempVector2.sub(tempVector).normalize();
              tempSegment.start.addScaledVector(direction, depth);
              tempSegment.end.addScaledVector(direction, depth);
            }
          },
        });

        // Align floor height
        if (tempSegment.start.y > playerGroup.current.position.y) {
          playerGroup.current.position.y = THREE.MathUtils.lerp(
            playerGroup.current.position.y,
            tempSegment.start.y - capsuleInfo.segment.start.y,
            dt * 12
          );
        }
      }

      // Lean bicycle or roll car chassis into turns
      if (chassisRef.current) {
        const targetLean =
          vehicleMode === 'BICYCLE'
            ? -steer * 0.42 * (Math.abs(velocity.current) / maxSpeed)
            : vehicleMode === 'DRIFT_CAR'
            ? steer * 0.14 * (Math.abs(velocity.current) / maxSpeed)
            : 0;

        chassisRef.current.rotation.z = THREE.MathUtils.lerp(
          chassisRef.current.rotation.z,
          targetLean,
          dt * 8
        );

        // Pitch up on jump, pitch down on hard braking
        const pitchTarget = verticalVel.current > 0 ? -0.15 : forward < 0 ? 0.08 : 0;
        chassisRef.current.rotation.x = THREE.MathUtils.lerp(chassisRef.current.rotation.x, pitchTarget, dt * 6);
      }

      // Handlebar steering rotation for bicycle
      if (handlebarsRef.current) {
        handlebarsRef.current.rotation.y = THREE.MathUtils.lerp(
          handlebarsRef.current.rotation.y,
          steer * 0.4,
          dt * 10
        );
      }
    }

    // ========================================================
    // Articulated Human Procedural Kinematics
    // ========================================================
    const speed = Math.abs(velocity.current);
    walkCadence.current += dt * speed * (vehicleMode === 'BICYCLE' ? 4.5 : 5.5);

    if (vehicleMode === 'ON_FOOT') {
      const swing = Math.sin(walkCadence.current);
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = speed > 0.3 ? swing * 0.75 : 0;
        rightLegRef.current.rotation.x = speed > 0.3 ? -swing * 0.75 : 0;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = speed > 0.3 ? -swing * 0.65 : 0;
        rightArmRef.current.rotation.x = speed > 0.3 ? swing * 0.65 : 0;
      }
    } else if (vehicleMode === 'BICYCLE') {
      // Circular pedaling cadence
      const pedalAngle = walkCadence.current;
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(pedalAngle) * 0.5 + 0.4;
        rightLegRef.current.rotation.x = Math.sin(pedalAngle + Math.PI) * 0.5 + 0.4;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = 0.6;
        rightArmRef.current.rotation.x = 0.6;
      }
    } else if (vehicleMode === 'DRIFT_CAR') {
      // Seated in driver seat
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 1.35;
        rightLegRef.current.rotation.x = 1.35;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = 0.85;
        rightArmRef.current.rotation.x = 0.85;
      }
    }

    // ========================================================
    // Lusion "Synthetic Human" Procedural Head/Spine Cursor Look-At
    // ========================================================
    if (headBoneRef.current) {
      headBoneRef.current.rotation.y = THREE.MathUtils.lerp(
        headBoneRef.current.rotation.y,
        state.pointer.x * 0.45,
        dt * 6
      );
      headBoneRef.current.rotation.x = THREE.MathUtils.lerp(
        headBoneRef.current.rotation.x,
        -state.pointer.y * 0.32,
        dt * 6
      );
    }

    // Spin car wheels
    if (wheelFL.current && wheelRL.current && wheelFR.current && wheelRR.current) {
      const wheelSpin = velocity.current * dt * 2.2;
      wheelFL.current.rotation.x += wheelSpin;
      wheelFR.current.rotation.x += wheelSpin;
      wheelRL.current.rotation.x += wheelSpin;
      wheelRR.current.rotation.x += wheelSpin;
    }

    // Spin bike wheels
    if (bikeWheelF.current && bikeWheelR.current) {
      const bikeSpin = velocity.current * dt * 2.8;
      bikeWheelF.current.rotation.x += bikeSpin;
      bikeWheelR.current.rotation.x += bikeSpin;
    }

    // Update F1 Telemetry HUD (Speed in KM/H, Heading, Coordinates)
    setPlayerTelemetry(
      [playerGroup.current.position.x, playerGroup.current.position.y, playerGroup.current.position.z],
      Math.abs(velocity.current) * 3.6,
      heading.current
    );

    // Dynamic third-person spring camera follow
    if (cameraMode === 'THIRD_PERSON_FOLLOW') {
      const dist = vehicleMode === 'DRIFT_CAR' ? 11.5 : vehicleMode === 'BICYCLE' ? 9.0 : 8.0;
      const height = vehicleMode === 'DRIFT_CAR' ? 5.2 : vehicleMode === 'BICYCLE' ? 4.5 : 4.0;

      camTargetVec.set(
        playerGroup.current.position.x - Math.sin(heading.current) * dist,
        playerGroup.current.position.y + height,
        playerGroup.current.position.z - Math.cos(heading.current) * dist
      );

      state.camera.position.lerp(camTargetVec, dt * 5.5);
      camLookVec.copy(playerGroup.current.position).add(new THREE.Vector3(0, 1.4, 0));
      state.camera.lookAt(camLookVec);
    } else if (cameraMode === 'ISOMETRIC_CLASH') {
      camTargetVec.set(
        playerGroup.current.position.x + 35,
        48,
        playerGroup.current.position.z + 35
      );
      state.camera.position.lerp(camTargetVec, dt * 4.0);
      camLookVec.copy(playerGroup.current.position);
      state.camera.lookAt(camLookVec);
    }
  });

  return (
    <group ref={playerGroup} position={[0, 0, 10]}>
      {/* Floating Messenger Emoji Bubbles Overhead */}
      {activeEmojis.map((e) => (
        <Html key={e.id} position={[0, 3.0, 0]} center>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-[#101915]/95 shadow-[0_4px_16px_rgba(0,0,0,0.8)] text-2xl animate-bounce">
            {e.emoji}
          </div>
        </Html>
      ))}

      <group ref={chassisRef}>
        {/* ========================================================
            ARTICULATED 3D HUMAN COURIER (Modular Wardrobe + Lusion Head IK)
           ======================================================== */}
        <group
          position={
            vehicleMode === 'ON_FOOT'
              ? [0, 0, 0]
              : vehicleMode === 'BICYCLE'
              ? [0, 0.45, -0.2] // Mounted on saddle
              : [0, 0.42, 0.2] // Mounted in car cockpit
          }
        >
          {/* Pelvis / Hip Core */}
          <mesh position={[0, 0.9, 0]} castShadow>
            <boxGeometry args={[0.38, 0.2, 0.24]} />
            <meshToonMaterial color={wardrobe.pantsColor} />
          </mesh>

          {/* Torso & Messenger Jacket */}
          <mesh position={[0, 1.25, 0]} castShadow>
            <boxGeometry args={[0.42, 0.5, 0.28]} />
            <meshToonMaterial color={wardrobe.jacketColor} />
          </mesh>

          {/* Messenger Satchel Sling */}
          <mesh position={[0, 1.15, -0.16]} castShadow>
            <boxGeometry args={[0.34, 0.38, 0.16]} />
            <meshStandardMaterial color="#8C532E" roughness={0.7} />
          </mesh>

          {/* Lusion Head & Spine Cursor-Tracking Neck */}
          <group ref={headBoneRef} position={[0, 1.55, 0]}>
            {/* Neck */}
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.08, 0.09, 0.12, 12]} />
              <meshToonMaterial color="#FFE6C7" />
            </mesh>
            {/* Head */}
            <mesh position={[0, 0.22, 0]} castShadow>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshToonMaterial color="#FFE6C7" />
            </mesh>
            {/* Cap / Hairstyle */}
            <mesh position={[0, 0.32, 0.05]} castShadow>
              <boxGeometry args={[0.32, 0.12, 0.36]} />
              <meshToonMaterial color={wardrobe.capColor} />
            </mesh>
            {/* Visor Brim */}
            <mesh position={[0, 0.26, 0.22]}>
              <boxGeometry args={[0.26, 0.03, 0.14]} />
              <meshToonMaterial color={wardrobe.capColor} />
            </mesh>
          </group>

          {/* Articulated Left & Right Arms */}
          <group ref={leftArmRef} position={[0.28, 1.45, 0]}>
            <mesh position={[0, -0.22, 0]} castShadow>
              <capsuleGeometry args={[0.07, 0.35, 8, 12]} />
              <meshToonMaterial color={wardrobe.jacketColor} />
            </mesh>
          </group>
          <group ref={rightArmRef} position={[-0.28, 1.45, 0]}>
            <mesh position={[0, -0.22, 0]} castShadow>
              <capsuleGeometry args={[0.07, 0.35, 8, 12]} />
              <meshToonMaterial color={wardrobe.jacketColor} />
            </mesh>
          </group>

          {/* Articulated Left & Right Legs + Sneakers */}
          <group ref={leftLegRef} position={[0.12, 0.82, 0]}>
            <mesh position={[0, -0.32, 0]} castShadow>
              <capsuleGeometry args={[0.09, 0.45, 8, 12]} />
              <meshToonMaterial color={wardrobe.pantsColor} />
            </mesh>
            {/* Left Sneaker */}
            <mesh position={[0, -0.62, 0.06]} castShadow>
              <boxGeometry args={[0.13, 0.12, 0.25]} />
              <meshStandardMaterial color={wardrobe.sneakersColor} roughness={0.3} />
            </mesh>
          </group>
          <group ref={rightLegRef} position={[-0.12, 0.82, 0]}>
            <mesh position={[0, -0.32, 0]} castShadow>
              <capsuleGeometry args={[0.09, 0.45, 8, 12]} />
              <meshToonMaterial color={wardrobe.pantsColor} />
            </mesh>
            {/* Right Sneaker */}
            <mesh position={[0, -0.62, 0.06]} castShadow>
              <boxGeometry args={[0.13, 0.12, 0.25]} />
              <meshStandardMaterial color={wardrobe.sneakersColor} roughness={0.3} />
            </mesh>
          </group>
        </group>

        {/* ========================================================
            MODE 2: PLAYABLE BICYCLE
           ======================================================== */}
        {vehicleMode === 'BICYCLE' && (
          <group position={[0, 0, 0]}>
            {/* Bicycle Frame */}
            <mesh position={[0, 0.75, 0]} castShadow>
              <boxGeometry args={[0.12, 0.65, 1.6]} />
              <meshToonMaterial color="#FF2A85" />
            </mesh>

            {/* Crossbar & Saddle */}
            <mesh position={[0, 0.95, -0.3]} castShadow>
              <boxGeometry args={[0.25, 0.1, 0.35]} />
              <meshStandardMaterial color="#18181B" roughness={0.5} />
            </mesh>

            {/* Steering Handlebars */}
            <group ref={handlebarsRef} position={[0, 1.15, 0.65]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.035, 0.035, 0.95]} />
                <meshStandardMaterial color="#E4E4E7" metalness={0.8} />
              </mesh>
              {/* Bike Bell */}
              <mesh position={[0.25, 0.08, 0]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color="#FFD800" metalness={0.9} />
              </mesh>
            </group>

            {/* Front & Rear Spoked Wheels */}
            <mesh ref={bikeWheelF} position={[0, 0.45, 0.8]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.42, 0.055, 12, 24]} />
              <meshStandardMaterial color="#18181B" roughness={0.8} />
            </mesh>
            <mesh ref={bikeWheelR} position={[0, 0.45, -0.8]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.42, 0.055, 12, 24]} />
              <meshStandardMaterial color="#18181B" roughness={0.8} />
            </mesh>
          </group>
        )}

        {/* ========================================================
            MODE 3: PLAYABLE DRIFT CAR (Franky #95 / Papaya Spec)
           ======================================================== */}
        {vehicleMode === 'DRIFT_CAR' && (
          <group position={[0, 0, 0]}>
            {/* Aerodynamic Lower Body Chassis */}
            <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.0, 0.62, 4.0]} />
              <meshToonMaterial color="#FF5500" />
            </mesh>

            {/* Cockpit Canopy */}
            <mesh position={[0, 1.08, -0.15]} castShadow>
              <boxGeometry args={[1.5, 0.58, 2.0]} />
              <meshStandardMaterial color="#0A0A0C" metalness={0.95} roughness={0.1} />
            </mesh>

            {/* Front Air Dam & Splitter */}
            <mesh position={[0, 0.28, 2.05]} castShadow>
              <boxGeometry args={[2.08, 0.15, 0.4]} />
              <meshStandardMaterial color="#18181B" metalness={0.7} />
            </mesh>

            {/* Neon Accent Side Skirts */}
            <mesh position={[1.02, 0.35, 0]}>
              <boxGeometry args={[0.08, 0.15, 3.4]} />
              <meshBasicMaterial color="#CCFF00" />
            </mesh>
            <mesh position={[-1.02, 0.35, 0]}>
              <boxGeometry args={[0.08, 0.15, 3.4]} />
              <meshBasicMaterial color="#CCFF00" />
            </mesh>

            {/* High-Downforce GT Rear Wing Spoiler */}
            <mesh position={[0, 1.25, -1.85]} castShadow>
              <boxGeometry args={[2.15, 0.08, 0.45]} />
              <meshToonMaterial color="#CCFF00" />
            </mesh>
            <mesh position={[0.65, 0.95, -1.85]}>
              <cylinderGeometry args={[0.04, 0.04, 0.6]} />
              <meshStandardMaterial color="#27272A" />
            </mesh>
            <mesh position={[-0.65, 0.95, -1.85]}>
              <cylinderGeometry args={[0.04, 0.04, 0.6]} />
              <meshStandardMaterial color="#27272A" />
            </mesh>

            {/* Twin Turbo Boost Exhaust Pipes */}
            <mesh position={[0.45, 0.42, -2.05]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
              <meshStandardMaterial color="#71717A" metalness={0.9} />
            </mesh>
            <mesh position={[-0.45, 0.42, -2.05]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
              <meshStandardMaterial color="#71717A" metalness={0.9} />
            </mesh>

            {/* Glowing Boost Flame Core */}
            {keys.current['shift'] && (
              <mesh position={[0, 0.42, -2.25]}>
                <sphereGeometry args={[0.22, 12, 12]} />
                <meshBasicMaterial color="#00F5D4" />
              </mesh>
            )}

            {/* 4 Wide Arcade Wheels */}
            <mesh ref={wheelFL} position={[1.05, 0.4, 1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.42, 0.42, 0.35, 24]} />
              <meshStandardMaterial color="#18181B" roughness={0.7} />
            </mesh>
            <mesh ref={wheelFR} position={[-1.05, 0.4, 1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.42, 0.42, 0.35, 24]} />
              <meshStandardMaterial color="#18181B" roughness={0.7} />
            </mesh>
            <mesh ref={wheelRL} position={[1.08, 0.4, -1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.46, 0.46, 0.42, 24]} />
              <meshStandardMaterial color="#18181B" roughness={0.7} />
            </mesh>
            <mesh ref={wheelRR} position={[-1.08, 0.4, -1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.46, 0.46, 0.42, 24]} />
              <meshStandardMaterial color="#18181B" roughness={0.7} />
            </mesh>

            {/* Functional Night Headlights */}
            {headlights && (
              <>
                <spotLight
                  ref={headlightL}
                  position={[0.7, 0.6, 2.1]}
                  target-position={[0.7, 0, 14]}
                  angle={0.65}
                  penumbra={0.3}
                  intensity={4.5}
                  color="#FFECC7"
                  distance={35}
                />
                <spotLight
                  ref={headlightR}
                  position={[-0.7, 0.6, 2.1]}
                  target-position={[-0.7, 0, 14]}
                  angle={0.65}
                  penumbra={0.3}
                  intensity={4.5}
                  color="#FFECC7"
                  distance={35}
                />
              </>
            )}
          </group>
        )}
      </group>
    </group>
  );
};
