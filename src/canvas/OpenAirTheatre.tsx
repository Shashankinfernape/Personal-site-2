// src/canvas/OpenAirTheatre.tsx
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { PortfolioProject } from '../config/projects.config';
import { useGameStore } from '../store/useGameStore';

export const OpenAirTheatre: React.FC<{ project: PortfolioProject; index: number }> = ({
  project,
  index,
}) => {
  const screenMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const crystalPillarL = useRef<THREE.Mesh>(null);
  const crystalPillarR = useRef<THREE.Mesh>(null);

  const { playerPosition, setActiveTheatreIndex, selectProject, activeTheatreIndex } =
    useGameStore();

  // Create a dynamic canvas texture that simulates live code/stream previews on the giant screen
  const { canvasTexture, updateCanvas } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 280;
    const ctx = canvas.getContext('2d');
    const texture = new THREE.CanvasTexture(canvas);

    const update = (time: number, isInside: boolean) => {
      if (!ctx) return;
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 512, 280);
      grad.addColorStop(0, '#090D0B');
      grad.addColorStop(1, '#111A15');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 280);

      // Terminal header bar
      ctx.fillStyle = '#18241E';
      ctx.fillRect(0, 0, 512, 36);

      // Status indicator dots
      ctx.fillStyle = '#FF5F56';
      ctx.beginPath(); ctx.arc(20, 18, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#FFBD2E';
      ctx.beginPath(); ctx.arc(40, 18, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#27C93F';
      ctx.beginPath(); ctx.arc(60, 18, 6, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`${project.sectorCode} // LIVE INFERENCE PIPELINE`, 85, 22);

      // Animated streaming code lines
      ctx.font = '11px monospace';
      const lines = [
        `> repo: github.com/Shashankinfernape/${project.repoName}`,
        `> stack: ${project.stack.slice(0, 4).join(', ')}`,
        `> status: [ONLINE 24/7] · stars: ${project.githubStats?.stars ?? 12} · forks: ${project.githubStats?.forks ?? 4}`,
        `> architecture_rating: ${project.stats.architecture}/100 [SUPERCELL CERTIFIED]`,
        `> telemetry_pulse: ${Math.sin(time * 3).toFixed(4)} latency < 16ms`,
        `> prompt: "Explain ${project.title} reverse-engineered architecture..."`,
        `[CLICK SCREEN OR PRESS ENTER TO INSPECT FULL BRAWL/REDDIT DOSSIER]`,
      ];

      lines.forEach((l, idx) => {
        ctx.fillStyle = idx === lines.length - 1 ? (isInside ? project.accentColor : '#A1A1AA') : '#E4E4E7';
        ctx.fillText(l, 25, 65 + idx * 28);
      });

      // Animated sound / signal wave bars at bottom
      const barCount = 32;
      for (let b = 0; b < barCount; b++) {
        const h = Math.abs(Math.sin(time * 4 + b * 0.4)) * 24 + 4;
        ctx.fillStyle = project.accentColor;
        ctx.fillRect(25 + b * 14.5, 260 - h, 9, h);
      }

      texture.needsUpdate = true;
    };

    return { canvasTexture: texture, updateCanvas: update };
  }, [project]);

  useFrame((state) => {
    const dist = Math.hypot(
      playerPosition[0] - project.position[0],
      playerPosition[2] - project.position[2]
    );
    const isPlayerInside = dist < 18;

    if (isPlayerInside && activeTheatreIndex !== index) {
      setActiveTheatreIndex(index);
    }

    // Update screen canvas texture
    updateCanvas(state.clock.elapsedTime, isPlayerInside);

    // Emissive pulse on screen
    if (screenMatRef.current) {
      screenMatRef.current.emissiveIntensity = isPlayerInside
        ? 1.8 + Math.sin(state.clock.elapsedTime * 3) * 0.35
        : 0.55;
    }

    // Rotate glowing perimeter drive-in ring
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }

    // Igloo Inc. Voronoi crystal stage pillars bobbing
    if (crystalPillarL.current && crystalPillarR.current) {
      crystalPillarL.current.rotation.y = state.clock.elapsedTime * 0.5;
      crystalPillarR.current.rotation.y = -state.clock.elapsedTime * 0.5;
    }
  });

  const isActiveTheatre = activeTheatreIndex === index;

  return (
    <group position={project.position}>
      {/* Amphitheatre Tiered Seating Platform */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[10, 11.5, 0.4, 32]} />
        <meshStandardMaterial color="#11151A" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.5, 0]} receiveShadow>
        <cylinderGeometry args={[7.5, 8.5, 0.3, 32]} />
        <meshStandardMaterial color="#181F26" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Glowing Drive-In / Walk-In Trigger Ring */}
      <mesh ref={ringRef} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[13.5, 14.2, 64]} />
        <meshBasicMaterial color={project.accentColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Igloo Inc. Inspired Crystal Stage Pillars flanking the screen */}
      <mesh ref={crystalPillarL} position={[-7.5, 4.5, -3.5]} castShadow>
        <octahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial
          color={project.accentColor}
          emissive={project.accentColor}
          emissiveIntensity={isActiveTheatre ? 1.5 : 0.4}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      <mesh ref={crystalPillarR} position={[7.5, 4.5, -3.5]} castShadow>
        <octahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial
          color={project.accentColor}
          emissive={project.accentColor}
          emissiveIntensity={isActiveTheatre ? 1.5 : 0.4}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Giant Open-Air Streaming Curved Screen */}
      <mesh
        position={[0, 5.4, -3.5]}
        onClick={(e) => {
          e.stopPropagation();
          selectProject(project);
        }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        castShadow
      >
        <planeGeometry args={[13.5, 7.5, 32, 16]} />
        <meshStandardMaterial
          ref={screenMatRef}
          map={canvasTexture}
          emissive={project.accentColor}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Screen Frame Border */}
      <mesh position={[0, 5.4, -3.6]}>
        <boxGeometry args={[14.0, 8.0, 0.2]} />
        <meshStandardMaterial color="#0A0E12" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Theatre Marquee Header */}
      <Text position={[0, 10.2, -3.5]} fontSize={0.8} color="#FFFFFF" anchorX="center">
        {`${project.sectorCode} // ${project.title.toUpperCase()}`}
      </Text>
      <Text position={[0, 9.3, -3.5]} fontSize={0.4} color={project.accentColor} anchorX="center">
        {`${project.buildingTitle} · LVL ${project.buildingLevel} CITADEL`}
      </Text>

      {/* Proximity Spotlight when active (The Drop Store effect) */}
      {isActiveTheatre && (
        <spotLight
          position={[0, 18, 4]}
          target-position={[0, 0, 0]}
          angle={0.65}
          penumbra={0.5}
          intensity={5}
          color={project.accentColor}
          distance={40}
        />
      )}
    </group>
  );
};
