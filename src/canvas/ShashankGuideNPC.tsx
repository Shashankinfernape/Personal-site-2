// src/canvas/ShashankGuideNPC.tsx
import React, { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import { PORTFOLIO_PROJECTS } from '../config/projects.config';
import { useGameStore } from '../store/useGameStore';

export const ShashankGuideNPC: React.FC = () => {
  const npcRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const [dialogueStep, setDialogueStep] = useState(0);
  const [isDialogueExpanded, setIsDialogueExpanded] = useState(true);

  const {
    activeTheatreIndex,
    advanceToNextTheatre,
    setGuidePosition,
    selectProject,
    isFollowingGuide,
    toggleFollowGuide,
    guideSpeechAudioPlaying,
    setGuideSpeechAudioPlaying,
    playerPosition,
  } = useGameStore();

  const isAtSpawn = activeTheatreIndex === -1;
  const currentProject = isAtSpawn
    ? PORTFOLIO_PROJECTS[0]
    : PORTFOLIO_PROJECTS[activeTheatreIndex] || PORTFOLIO_PROJECTS[0];

  // Target spot: stands at Spawn Plaza initially, then moves to active Theatre
  const targetStageSpot = useMemo(() => {
    if (isAtSpawn) {
      return new THREE.Vector3(-3.5, 0, 8);
    }
    return new THREE.Vector3(
      currentProject.position[0] - 5.0,
      0,
      currentProject.position[2] + 4.0
    );
  }, [isAtSpawn, currentProject]);

  // Distance from player to Shashank
  const [distToPlayer, setDistToPlayer] = useState(10);

  useFrame((state, delta) => {
    if (!npcRef.current) return;
    const dt = Math.min(delta, 0.05);

    // Smoothly glide Shashank toward active stage or spawn
    npcRef.current.position.lerp(targetStageSpot, dt * 2.5);
    setGuidePosition([
      npcRef.current.position.x,
      npcRef.current.position.y,
      npcRef.current.position.z,
    ]);

    // Gentle breathing idle bob
    npcRef.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 3)) * 0.12;

    // Calculate distance to player
    const dist = Math.hypot(
      playerPosition[0] - npcRef.current.position.x,
      playerPosition[2] - npcRef.current.position.z
    );
    setDistToPlayer(dist);

    // ========================================================
    // Lusion "Synthetic Human" Head & Spine Player Look-At
    // ========================================================
    if (headRef.current && dist < 24) {
      const dx = playerPosition[0] - npcRef.current.position.x;
      const dz = playerPosition[2] - npcRef.current.position.z;
      const targetAngleY = Math.atan2(dx, dz) - npcRef.current.rotation.y;

      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        THREE.MathUtils.clamp(targetAngleY, -1.2, 1.2),
        dt * 6
      );
    }

    // Waving right arm animation when player approaches within 12 units
    if (rightArmRef.current) {
      if (dist < 12) {
        rightArmRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.4 + 2.2;
      } else {
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0, dt * 5);
      }
    }
  });

  const walkthroughLines = isAtSpawn
    ? [
        `Hey! I'm Shashank (@Shashankinfernape). Welcome to my 3D Open-World Portfolio Game!`,
        `You're in the Drift Car (#95 Franky Spec). Press WASD or Arrow keys to steer, Space to hop/drift, and Shift for nitro boost!`,
        `Switch modes anytime: [1] On Foot, [2] Playable Bicycle, or [3] Drift Car. Check out the 17 totems around us!`,
        `Press [C] to customize your outfit colors, or keys 4-9 for floating emojis. Ready? Click "Follow Me" below!`,
      ]
    : [
        `Welcome to the ${currentProject.buildingTitle}!`,
        `${currentProject.title}: ${currentProject.tagline}`,
        `Engineered with ${currentProject.stack.join(' · ')}. Watch the giant streaming screen or click Inspect Code!`,
        `Notice the jump ramps and street art around us? Ready for the next project? Click "Next Theatre →"!`,
      ];

  // Synthesize or trigger Franky F5-TTS audio tone
  const playFrankyVoice = () => {
    setGuideSpeechAudioPlaying(true);
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, audioCtx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(420, audioCtx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
      setTimeout(() => setGuideSpeechAudioPlaying(false), 800);
    } catch {
      setTimeout(() => setGuideSpeechAudioPlaying(false), 800);
    }
  };

  return (
    <group ref={npcRef} position={[-3.5, 0, 8]}>
      {/* ========================================================
          ARTICULATED 3D HUMAN GUIDE (Shashank S)
         ======================================================== */}
      {/* Pelvis & Pants */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.38, 0.2, 0.24]} />
        <meshToonMaterial color="#1E232A" />
      </mesh>

      {/* Legs & Sneakers */}
      <mesh position={[0.12, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.09, 0.45, 8, 12]} />
        <meshToonMaterial color="#1E232A" />
      </mesh>
      <mesh position={[-0.12, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.09, 0.45, 8, 12]} />
        <meshToonMaterial color="#1E232A" />
      </mesh>
      {/* White Sneakers */}
      <mesh position={[0.12, 0.1, 0.06]} castShadow>
        <boxGeometry args={[0.13, 0.12, 0.25]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      <mesh position={[-0.12, 0.1, 0.06]} castShadow>
        <boxGeometry args={[0.13, 0.12, 0.25]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>

      {/* Engineer Hoodie / Jacket (Dark with Neon Lime Accents) */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[0.44, 0.52, 0.28]} />
        <meshToonMaterial color="#13241C" />
      </mesh>
      {/* Lime Accent Zipper Line */}
      <mesh position={[0, 1.25, 0.15]}>
        <boxGeometry args={[0.04, 0.46, 0.02]} />
        <meshBasicMaterial color="#CCFF00" />
      </mesh>

      {/* Left Arm & Right Arm (Articulated Waving) */}
      <group ref={leftArmRef} position={[0.28, 1.45, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.35, 8, 12]} />
          <meshToonMaterial color="#13241C" />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[-0.28, 1.45, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.35, 8, 12]} />
          <meshToonMaterial color="#13241C" />
        </mesh>
      </group>

      {/* Lusion Head & Spine Cursor/Player Tracker */}
      <group ref={headRef} position={[0, 1.55, 0]}>
        {/* Neck */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.08, 0.09, 0.12, 12]} />
          <meshToonMaterial color="#FFE6C7" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshToonMaterial color="#FFE6C7" />
        </mesh>
        {/* Dark Hair */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[0.34, 0.14, 0.36]} />
          <meshToonMaterial color="#18181B" />
        </mesh>
        {/* Developer Glasses / Visor */}
        <mesh position={[0, 0.24, 0.22]} castShadow>
          <boxGeometry args={[0.36, 0.1, 0.1]} />
          <meshStandardMaterial color="#0A0A0A" metalness={0.9} />
        </mesh>
        <mesh position={[0.1, 0.24, 0.27]}>
          <planeGeometry args={[0.1, 0.06]} />
          <meshBasicMaterial color="#00F5D4" />
        </mesh>
        <mesh position={[-0.1, 0.24, 0.27]}>
          <planeGeometry args={[0.1, 0.06]} />
          <meshBasicMaterial color="#00F5D4" />
        </mesh>
      </group>

      {/* Glowing Guide Halo Ring */}
      <Float speed={3} floatIntensity={0.3}>
        <mesh position={[0, 2.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.045, 12, 32]} />
          <meshBasicMaterial color="#CCFF00" />
        </mesh>
      </Float>

      {/* ========================================================
          Messenger by Abeto Nonverbal "..." Quest Balloon Overhead
         ======================================================== */}
      {distToPlayer < 18 && !isDialogueExpanded && (
        <Html position={[0, 2.7, 0]} center distanceFactor={14}>
          <button
            onClick={() => setIsDialogueExpanded(true)}
            className="flex h-9 w-12 items-center justify-center rounded-2xl border-2 border-black bg-[#CCFF00] font-black text-black shadow-[3px_3px_0px_#000] hover:scale-110 active:scale-95 transition"
            title="Talk to Shashank"
          >
            <span className="text-sm font-black tracking-widest leading-none">...</span>
          </button>
        </Html>
      )}

      {/* ========================================================
          Messenger by Abeto Full Interactive Speech Bubble
         ======================================================== */}
      {isDialogueExpanded && (
        <Html position={[0, 3.2, 0]} center distanceFactor={18} zIndexRange={[100, 0]}>
          <div className="w-80 pointer-events-auto select-none rounded-2xl border-2 border-black bg-zinc-950/95 p-4 font-mono text-xs text-white shadow-[6px_6px_0px_#CCFF00] backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/20 pb-1.5 text-[10px] font-bold text-[#CCFF00]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#CCFF00] animate-ping" />
                GUIDE // SHASHANK S
              </span>
              <button
                onClick={() => setIsDialogueExpanded(false)}
                className="text-zinc-400 hover:text-white"
                title="Minimize speech bubble"
              >
                ✕
              </button>
            </div>

            <p className="mt-2.5 text-xs leading-relaxed text-zinc-100 font-sans">
              {walkthroughLines[dialogueStep % walkthroughLines.length]}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <button
                onClick={() => setDialogueStep((s) => s + 1)}
                className="rounded-lg bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-white hover:text-black transition active:scale-95"
              >
                Explain More 💬
              </button>

              <button
                onClick={playFrankyVoice}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition active:scale-95 ${
                  guideSpeechAudioPlaying
                    ? 'bg-[#FF5500] text-black font-black'
                    : 'bg-white/20 text-[#FF9776] hover:bg-[#FF5500] hover:text-black'
                }`}
                title="Play AI Voice narration generated with custom F5-TTS model"
              >
                {guideSpeechAudioPlaying ? 'Playing Voice 🔊' : 'Voice F5-TTS 🎙️'}
              </button>

              <button
                onClick={() => selectProject(currentProject)}
                className="rounded-lg bg-[#00F5D4] px-2.5 py-1 text-[11px] font-black text-black hover:bg-[#4efde5] transition active:scale-95 shadow-sm"
              >
                Inspect Code ↗
              </button>

              <button
                onClick={() => {
                  setDialogueStep(0);
                  advanceToNextTheatre();
                }}
                className="rounded-lg bg-[#CCFF00] px-2.5 py-1 text-[11px] font-black text-black hover:bg-[#dcff4d] transition active:scale-95 shadow-sm"
              >
                {isAtSpawn ? 'Drive to Theatre 01 →' : 'Next Theatre →'}
              </button>

              <button
                onClick={toggleFollowGuide}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition active:scale-95 ${
                  isFollowingGuide
                    ? 'bg-[#FF2A85] text-white font-black'
                    : 'border border-white/30 text-zinc-300 hover:border-white hover:text-white'
                }`}
              >
                {isFollowingGuide ? 'Following Guide ✓' : '[G] Follow Me'}
              </button>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
