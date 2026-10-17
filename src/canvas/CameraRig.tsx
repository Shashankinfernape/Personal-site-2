// src/canvas/CameraRig.tsx
import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PORTFOLIO_PROJECTS } from '../config/projects.config';
import { useWorldStore } from '../store/useWorldStore';

/**
 * Traversal & Motion Graphics Engine:
 * - Lusion (lusion-engineering-template): Analytical Newtonian mechanics, harmonic gravity pull (-40 * p),
 *   exponential drag (0.2^dt), and unprojected mouse raycast deflections.
 * - Studio Freight Lenis & Lando Norris (landonorris-engineering-template): lerp 0.1 scroll damping,
 *   telemetry velocity tracking in KM/H.
 * - Messenger by Abeto (abeto-messenger-engineering-template): Companion cyber-drone guide with roll banking.
 * - Clash of Clans (clash-of-clans-analysis): 30°/60° isometric village overview at [75, 88, -45].
 */
export const CameraRig: React.FC = () => {
  const droneGroupRef = useRef<THREE.Group>(null);
  const droneRingsRef = useRef<THREE.Group>(null);

  const {
    cameraMode,
    scrollProgress,
    selectedProject,
    isXRayReverseMode,
    setScrollData,
    setCameraMode,
    selectProject,
    toggleXRayMode,
    toggleLidarMode,
  } = useWorldStore();

  // Build a smooth Catmull-Rom spline passing near every project monument
  const cameraSpline = useMemo(() => {
    const waypoints: THREE.Vector3[] = [
      new THREE.Vector3(0, 3, 12), // Spawn point
      ...PORTFOLIO_PROJECTS.map(
        (p) => new THREE.Vector3(p.position[0] * 0.65, p.position[1] + 1.5, p.position[2] + 10)
      ),
      new THREE.Vector3(0, 2, -235), // Particle footer destination
    ];
    return new THREE.CatmullRomCurve3(waypoints, false, 'catmullrom', 0.5);
  }, []);

  // Track virtual scroll with inertia damping
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const touchStartY = useRef(0);

  // Lusion Analytical Physics Velocity Vector
  const physicsVelocity = useRef(new THREE.Vector3(0, 0, 0));

  // Wheel listener
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (useWorldStore.getState().cameraMode !== 'SPLINE_WALKTHROUGH') return;
      targetScroll.current = THREE.MathUtils.clamp(
        targetScroll.current + e.deltaY * 0.0003,
        0,
        1
      );
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (useWorldStore.getState().cameraMode !== 'SPLINE_WALKTHROUGH') return;
      const deltaY = touchStartY.current - e.touches[0].clientY;
      touchStartY.current = e.touches[0].clientY;
      targetScroll.current = THREE.MathUtils.clamp(
        targetScroll.current + deltaY * 0.001,
        0,
        1
      );
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  // Sync external sector jumps
  useEffect(() => {
    targetScroll.current = scrollProgress;
  }, [scrollProgress]);

  // Global Keyboard shortcuts: M, R, L, Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key.toLowerCase() === 'm') {
        const currentMode = useWorldStore.getState().cameraMode;
        setCameraMode(currentMode === 'CLASH_ISOMETRIC_BASE' ? 'SPLINE_WALKTHROUGH' : 'CLASH_ISOMETRIC_BASE');
      } else if (e.key.toLowerCase() === 'r') {
        toggleXRayMode();
      } else if (e.key.toLowerCase() === 'l') {
        toggleLidarMode();
      } else if (e.key === 'Escape') {
        selectProject(null);
        setCameraMode('SPLINE_WALKTHROUGH');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setCameraMode, toggleXRayMode, toggleLidarMode, selectProject]);

  const dummyTarget = useMemo(() => new THREE.Vector3(), []);
  const dummyLookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);

    if (cameraMode === 'SPLINE_WALKTHROUGH') {
      // Lenis 0.1 smooth wheel damping
      const prev = currentScroll.current;
      currentScroll.current = THREE.MathUtils.lerp(prev, targetScroll.current, dt * 5.0);
      const velocity = Math.abs(currentScroll.current - prev) / dt;

      // Scale to Lando Norris F1 telemetry KM/H
      setScrollData(currentScroll.current, velocity * 1250);

      // Position camera along Catmull-Rom spline
      cameraSpline.getPointAt(currentScroll.current, dummyTarget);

      // Lusion Pointer Unprojected Parallax Offset
      const pointerOffsetX = state.pointer.x * 2.4;
      const pointerOffsetY = state.pointer.y * 1.5;

      // Lusion Exponential Drag: v *= 0.2^dt
      const dragFactor = Math.pow(0.2, dt);
      physicsVelocity.current.multiplyScalar(dragFactor);

      dummyTarget.x += pointerOffsetX;
      dummyTarget.y += pointerOffsetY;

      state.camera.position.lerp(dummyTarget, dt * 6.5);

      // Look slightly ahead along the spline
      const lookAheadT = Math.min(1, currentScroll.current + 0.045);
      cameraSpline.getPointAt(lookAheadT, dummyLookAt);
      state.camera.lookAt(dummyLookAt);

      // Messenger by Abeto: Guide cyber-drone flying ahead of camera
      if (droneGroupRef.current) {
        const droneT = Math.min(1, currentScroll.current + 0.024);
        const dronePos = cameraSpline.getPointAt(droneT);
        dronePos.y += Math.sin(state.clock.elapsedTime * 3.8) * 0.35 - 0.45;
        droneGroupRef.current.position.lerp(dronePos, dt * 8.5);

        // Bank-into-turn roll physics: rotZ = -pointer.x * 0.5, rotX = pointer.y * 0.3
        droneGroupRef.current.rotation.z = -state.pointer.x * 0.5;
        droneGroupRef.current.rotation.x = state.pointer.y * 0.3;

        // Spin outer gimbal rings
        if (droneRingsRef.current) {
          droneRingsRef.current.rotation.y += dt * 3.2;
          droneRingsRef.current.rotation.z += dt * 1.8;
        }
      }
    } else if (cameraMode === 'CLASH_ISOMETRIC_BASE') {
      // Clash of Clans high-altitude 30°/60° isometric overview
      dummyTarget.set(75, 88, -45);
      dummyLookAt.set(0, 0, -115);
      state.camera.position.lerp(dummyTarget, dt * 4.2);
      state.camera.lookAt(dummyLookAt);
    } else if (cameraMode === 'DROP_STORE_PEDESTAL' && selectedProject) {
      // The Drop Store for the UN: monochrome specimen pedestal orbital inspection
      const [px, py, pz] = selectedProject.position;
      const orbitAngle = state.clock.elapsedTime * 0.38 + state.pointer.x * 1.4;
      dummyTarget.set(
        px + Math.sin(orbitAngle) * 6.8,
        py + 1.2 + state.pointer.y * 1.6,
        pz + Math.cos(orbitAngle) * 6.8
      );
      dummyLookAt.set(px, py, pz);
      state.camera.position.lerp(dummyTarget, dt * 5.2);
      state.camera.lookAt(dummyLookAt);
    }
  });

  return (
    <group ref={droneGroupRef}>
      {/* Messenger by Abeto Guide Cyber-Drone */}
      <mesh castShadow>
        <octahedronGeometry args={[0.38, 1]} />
        <meshStandardMaterial
          color="#FF5500"
          emissive="#FF2A00"
          emissiveIntensity={2.6}
          roughness={0.15}
          metalness={0.92}
          wireframe={isXRayReverseMode}
        />
      </mesh>

      {/* Cyber Drone Outer Gimbal Rings */}
      <group ref={droneRingsRef}>
        <mesh>
          <torusGeometry args={[0.62, 0.022, 16, 32]} />
          <meshBasicMaterial
            color="#00F5D4"
            wireframe={isXRayReverseMode}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.78, 0.018, 16, 32]} />
          <meshBasicMaterial
            color="#FFD800"
            wireframe={isXRayReverseMode}
          />
        </mesh>
      </group>

      {/* Thruster Point Light */}
      <pointLight color="#FF5500" intensity={4.5} distance={10} />
    </group>
  );
};
