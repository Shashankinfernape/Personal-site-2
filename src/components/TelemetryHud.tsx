// src/components/TelemetryHud.tsx
import React, { useEffect, useState } from 'react';
import { useWorldStore } from '../store/useWorldStore';
import { SHASHANK_PROFILE } from '../config/projects.config';
import { BrawlProjectModal } from './BrawlProjectModal';
import { Volume2, VolumeX, Eye, Compass, Layers, Activity } from 'lucide-react';

/**
 * Embodying the reverse-engineered systems:
 * - Lando Norris (landonorris-engineering-template):
 *   F1 telemetry HUD, --color--dark-green (#282c20), --color--lime (#d2ff00),
 *   --color--orange (#ff6b00 Papaya), live KM/H speedometer, and FPS ticker.
 * - Instagram (instagram-engineering-template):
 *   Top Stories SVG gradient rings (#FFD800 -> #FF2A85 -> #00F5D4) with active pulsing.
 * - Clash of Clans (clash-of-clans-analysis):
 *   Gold CTA gradient (#FFE866 -> #B87805) with 2px bevel and Supercell-Magic text outlines.
 */
export const TelemetryHud: React.FC = () => {
  const {
    cameraMode,
    scrollProgress,
    scrollVelocity,
    activeSectorIndex,
    isXRayReverseMode,
    isLidarMode,
    isAudioMuted,
    projects,
    setCameraMode,
    selectProject,
    jumpToSector,
    toggleXRayMode,
    toggleLidarMode,
    toggleAudio,
  } = useWorldStore();

  const [fps, setFps] = useState<number>(60);

  // Measure rough client render FPS
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measure = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measure);
    };

    animId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(animId);
  }, []);

  const activeProject = projects[activeSectorIndex] || projects[0];

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-5 font-mono text-white select-none">
      {/* TOP BAR: Lando Norris F1 Telemetry + Instagram Stories Ring Switcher */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        {/* Lando Norris Racing Identity & Telemetry Box */}
        <div className="pointer-events-auto flex items-center gap-4 border border-[#3b3c38] bg-[#282c20]/90 px-4 py-2.5 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.85)]">
          <div className="h-3 w-3 animate-ping rounded-full bg-[#d2ff00]" />
          <div>
            <div className="text-[10px] tracking-widest text-[#d2ff00] uppercase font-bold flex items-center gap-1.5">
              <Activity className="h-3 w-3" />
              <span>{SHASHANK_PROFILE.handle} // F1 TELEMETRY</span>
            </div>
            <div className="text-sm font-black tracking-tight text-[#f4f4ed] uppercase">
              {SHASHANK_PROFILE.name} — REALM
            </div>
          </div>
          <div className="border-l border-[#535450] pl-4 text-xs text-[#b4b8a5] space-y-0.5">
            <div>
              VELOCITY: <span className="font-bold text-[#d2ff00]">{scrollVelocity.toFixed(0)} KM/H</span>
            </div>
            <div>
              SPLINE DEPTH: <span className="font-bold text-[#00F5D4]">{(scrollProgress * 100).toFixed(1)}%</span>
            </div>
            <div>
              FPS: <span className="font-bold text-white">{fps}</span>
            </div>
          </div>
        </div>

        {/* Instagram Stories Style Quick-Switcher (instagram-engineering-template) */}
        <nav className="pointer-events-auto flex items-center gap-2.5 overflow-x-auto rounded-full border border-white/20 bg-black/80 px-4 py-2 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          {projects.map((proj, idx) => {
            const isActive = idx === activeSectorIndex;
            return (
              <button
                key={proj.id}
                onClick={() => jumpToSector(idx)}
                className="group flex flex-col items-center gap-1 transition-transform hover:scale-110 px-1"
                title={`Warp to ${proj.title}`}
              >
                <div
                  className={`rounded-full p-[2px] transition-all ${
                    isActive
                      ? 'bg-gradient-to-tr from-[#FFD800] via-[#FF2A85] to-[#00F5D4] shadow-[0_0_15px_rgba(0,245,212,0.9)] scale-105 animate-pulse'
                      : 'bg-white/20 group-hover:bg-white/60'
                  }`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold text-white">
                    {proj.sectorCode.replace('SEC-', '')}
                  </div>
                </div>
                <span className="max-w-[58px] truncate text-[8px] text-zinc-300 font-medium">
                  {proj.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Mode Toggles: Clash Base, X-Ray Shader, LiDAR, Audio */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Clash of Clans Isometric Base Toggle */}
          <button
            onClick={() =>
              setCameraMode(
                cameraMode === 'CLASH_ISOMETRIC_BASE'
                  ? 'SPLINE_WALKTHROUGH'
                  : 'CLASH_ISOMETRIC_BASE'
              )
            }
            className={`flex items-center gap-1.5 rounded-sm border-2 px-3 py-2 text-xs font-black uppercase transition ${
              cameraMode === 'CLASH_ISOMETRIC_BASE'
                ? 'border-black bg-gradient-to-b from-[#FFE866] via-[#E6A717] to-[#B87805] text-black shadow-[0_3px_0_#5B2B04]'
                : 'border-white/20 bg-black/80 text-white hover:border-[#FEE75C]'
            }`}
          >
            <Compass className="h-3.5 w-3.5 text-inherit" />
            <span>[M] Clash Base</span>
          </button>

          {/* The Other Side of Truth X-Ray Wireframe Toggle */}
          <button
            onClick={toggleXRayMode}
            className={`flex items-center gap-1.5 rounded-sm border px-3 py-2 text-xs font-bold uppercase transition ${
              isXRayReverseMode
                ? 'border-[#00F5D4] bg-[#00F5D4] text-black shadow-[0_0_15px_rgba(0,245,212,0.6)]'
                : 'border-white/20 bg-black/80 text-white hover:border-[#00F5D4]'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>[R] X-Ray</span>
          </button>

          {/* Into The Amazon LiDAR Cloud Toggle */}
          <button
            onClick={toggleLidarMode}
            className={`flex items-center gap-1.5 rounded-sm border px-3 py-2 text-xs font-bold uppercase transition ${
              isLidarMode
                ? 'border-[#FF2A85] bg-[#FF2A85]/20 text-[#FF2A85]'
                : 'border-white/20 bg-black/80 text-zinc-400'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>[L] LiDAR</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={toggleAudio}
            className="rounded-sm border border-white/20 bg-black/80 p-2 text-zinc-300 hover:text-white transition"
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* CENTER-RIGHT: Brawl Stars Loadout Card + Reddit Dev-Log Drawer */}
      <BrawlProjectModal />

      {/* BOTTOM BAR: Active Sector Banner & Specimen Pedestal Trigger */}
      <footer className="flex flex-wrap items-end justify-between gap-4">
        {/* Active Sector Card */}
        <div className="pointer-events-auto border border-[#353B5A] bg-[#10131F]/90 px-5 py-3 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.9)]">
          <div className="text-[10px] tracking-widest text-[#F29928] uppercase font-bold">
            SECTOR DISCOVERY // {activeProject.sectorCode} ({activeProject.buildingTitle})
          </div>
          <div className="mt-1 flex items-center gap-3">
            <span
              className="text-xl font-black uppercase text-white tracking-wide"
              style={{
                textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
              }}
            >
              {activeProject.title}
            </span>
            {/* The Drop Store Specimen Inspection Button */}
            <button
              onClick={() => selectProject(activeProject)}
              className="rounded-md border-2 border-black bg-gradient-to-b from-[#FFE866] via-[#FFD12E] to-[#D69B00] px-3.5 py-1.5 text-[11px] font-black text-black uppercase shadow-[0_3px_0_#996F00] transition active:translate-y-1 active:shadow-none hover:brightness-105"
            >
              Specimen Mode ↗
            </button>
          </div>
        </div>

        {/* Tactical Keybindings & Telemetry Footer */}
        <div className="text-right text-[11px] text-[#b4b8a5] space-y-1 bg-[#282c20]/80 p-3 border border-[#3b3c38] backdrop-blur-md">
          <div>
            <span className="text-[#d2ff00] font-bold">LENIS SCROLL ENGINE</span> · Wheel & Touch Traversal Active
          </div>
          <div>
            <span className="text-[#FFE866] font-bold">[M]</span> Clash Base · <span className="text-[#00F5D4] font-bold">[R]</span> X-Ray · <span className="text-[#FF2A85] font-bold">[L]</span> LiDAR · <span className="text-white font-bold">[ESC]</span> Close
          </div>
          <div className="text-[10px] text-zinc-400">
            Sector Coords: [{activeProject.position.join(', ')}]
          </div>
        </div>
      </footer>
    </div>
  );
};
