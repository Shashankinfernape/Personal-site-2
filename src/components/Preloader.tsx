// src/components/Preloader.tsx
import React, { useEffect, useState } from 'react';
import { useWorldStore } from '../store/useWorldStore';

/**
 * Embodying the reverse-engineered systems:
 * - Why Zero University (why-zero-university-engineering-template/DESIGN-SYSTEM.md):
 *   Primordial Mint Radial Gradient (#D4F6EB to #1C4839) preventing initial white pre-paint flash.
 * - Pixelflakes (pixelflakes-engineering-template):
 *   Architectural blueprint sketch extrusion, CAD coordinates, and wireframe progress counter.
 * - Don't Board Me (dont-board-me-engineering-template):
 *   Signature --my-ease: cubic-bezier(0.25, 1, 0.5, 1) and staged timeline reveals.
 */
export const Preloader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [bootLog, setBootLog] = useState<string>('MOUNTING 17 GIT TEMPLATE REPOSITORIES...');
  const [isDone, setIsDone] = useState(false);
  const setIsLoaded = useWorldStore((s) => s.setIsLoaded);

  useEffect(() => {
    const logs = [
      'Git-repos/brawl-stars-analysis: INJECTING COLOR_GRADIENTS.CSV...',
      'Git-repos/clash-of-clans-analysis: COMPUTING 2.5D ISOMETRIC MATRIX...',
      'Git-repos/igloo-inc-analysis: INITIALIZING BLOCK [52] CHROMATIC ABERRATION...',
      'Git-repos/lusion-engineering-template: COMPILING NEWTONIAN GRAVITY ENGINE...',
      'Git-repos/into-the-amazon-engineering-template: ALLOCATING 28,000 LIDAR POINTS...',
      'Git-repos/landonorris-engineering-template: SYNCING LENIS 0.1 TICKER...',
      'Git-repos/why-zero-university-engineering-template: RADIATING PRIMORDIAL MINT VOID...',
      'Git-repos/reddit-engineering-template: MOUNTING OP HYSTERESIS VOTING CACHE...',
      '17 REPOSITORIES SYNCHRONIZED // REALM ONLINE',
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 14) + 6;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setBootLog(logs[logs.length - 1]);
        setProgress(100);
        setTimeout(() => {
          setIsDone(true);
          setIsLoaded(true);
        }, 650);
      } else {
        setProgress(current);
        const logIndex = Math.min(
          logs.length - 2,
          Math.floor((current / 100) * (logs.length - 1))
        );
        setBootLog(logs[logIndex]);
      }
    }, 105);

    return () => clearInterval(interval);
  }, [setIsLoaded]);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 font-mono text-white transition-opacity duration-700 ${
        progress === 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        // Why Zero University Primordial Mint Radial Gradient (#bg-gradient)
        backgroundColor: 'rgb(28, 72, 57)',
        backgroundImage: `
          radial-gradient(
            ellipse 126.7vw 143.4vh at 50% 130%,
            rgb(212, 246, 235) 15.855%,
            rgb(179, 222, 209) 26.169%,
            rgb(145, 199, 183) 36.483%,
            rgb(112, 175, 156) 46.797%,
            rgb(78, 151, 130)  57.111%,
            rgb(53, 111, 94)   78.555%,
            rgb(28, 72, 57)    100.000%
          )
        `,
      }}
    >
      {/* Pixelflakes Blueprint Background Grid */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(28, 72, 57, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(28, 72, 57, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Blueprint Viewport Crosshairs & Technical Metrics */}
      <div className="absolute top-6 left-6 text-[10px] text-[#1C4839] font-bold">
        SYS.LOC [LAT 12.9716° N / LON 80.0435° E] · WHY-ZERO MINT VOID
      </div>
      <div className="absolute top-6 right-6 text-[10px] text-[#1C4839] font-bold">
        17 GIT REPOS SYNCHRONIZED · ANNA UNIV B.E. CSE
      </div>
      <div className="absolute bottom-6 left-6 text-[10px] text-[#1C4839] font-bold">
        LUSION NEWTONIAN PHYSICS · IGLOO INC GLSL BLOCK [52]
      </div>
      <div className="absolute bottom-6 right-6 text-[10px] text-[#1C4839] font-bold">
        STAGE 0 // -100 BZ TIMELINE INITIALIZATION
      </div>

      {/* Center Blueprint Loading Box */}
      <div className="relative z-10 w-full max-w-lg border-3 border-black bg-[#10131F]/95 p-8 shadow-[12px_12px_0px_#1C4839] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b-2 border-[#353B5A] pb-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 animate-ping rounded-full bg-[#00F5D4]" />
            <span className="text-xs font-black tracking-widest text-[#00F5D4] uppercase">
              17 REPO BLUEPRINT EXTRUSION
            </span>
          </div>
          <span
            className="text-2xl font-black text-white"
            style={{
              textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, 0 3px 0 #000',
            }}
          >
            {progress}%
          </span>
        </div>

        <div className="my-6">
          <h1
            className="text-2xl font-black tracking-tight text-white uppercase"
            style={{
              textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, 0 4px 0 #000',
            }}
          >
            THE REVERSE-ENGINEERED REALM
          </h1>
          <p className="mt-1 text-xs text-[#FFD12E] font-bold">
            Shashank S (@Shashankinfernape) — 17 Reverse-Engineered Git Architectures
          </p>
        </div>

        {/* Multi-Stop Progress Bar with Brawl Stars Golden Gradient */}
        <div className="h-3.5 w-full -skew-x-12 overflow-hidden bg-black border-2 border-black rounded-sm shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#FFFABC] via-[#FFD12E] to-[#F29928] transition-all duration-150 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/50" />
          </div>
        </div>

        {/* Dynamic Terminal Boot Log */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-zinc-300">
          <span className="truncate text-[#00F5D4] font-bold">&gt; {bootLog}</span>
          <span className="animate-pulse text-[#FFD12E] font-black">_</span>
        </div>
      </div>
    </div>
  );
};
