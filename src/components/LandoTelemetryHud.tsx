// src/components/LandoTelemetryHud.tsx
import React, { useEffect } from 'react';
import { useGameStore, VehicleMode } from '../store/useGameStore';
import {
  Gauge,
  Zap,
  Lightbulb,
  Map,
  Compass,
  FileText,
  Layers,
  Volume2,
  VolumeX,
  Eye,
  Radio,
  Shirt,
  Smile,
} from 'lucide-react';

export const LandoTelemetryHud: React.FC = () => {
  const {
    vehicleMode,
    setVehicleMode,
    playerSpeedKmh,
    playerPosition,
    gear,
    headlights,
    toggleHeadlights,
    isFollowingGuide,
    toggleFollowGuide,
    toggleIsometricMap,
    isIsometricMapOpen,
    isXRayMode,
    toggleXRayMode,
    isAudioMuted,
    toggleAudio,
    setRecruiterDrawerOpen,
    setResearchArchiveOpen,
    selectedProject,
    toggleWardrobe,
    isWardrobeOpen,
    spawnEmoji,
  } = useGameStore();

  // Keyboard shortcuts for mode toggling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProject) return;

      const k = e.key.toLowerCase();
      if (k === 'g') toggleFollowGuide();
      if (k === 'm') toggleIsometricMap();
      if (k === 'r') toggleXRayMode();
      if (k === 'n') setRecruiterDrawerOpen(true);
      if (k === 'c') toggleWardrobe();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, toggleFollowGuide, toggleIsometricMap, toggleXRayMode, setRecruiterDrawerOpen, toggleWardrobe]);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-4 sm:p-6 font-mono select-none">
      {/* Top Left: F1 Telemetry Speedometer & Gear Display */}
      <div className="pointer-events-auto flex items-center gap-3">
        {/* Speed & Gear Pod */}
        <div className="flex items-center gap-3 rounded-2xl border-2 border-white/20 bg-[#0B130E]/90 px-4 py-2.5 shadow-2xl backdrop-blur-md">
          {/* Gear Digit */}
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#CCFF00] px-3.5 py-1 text-black font-black">
            <span className="text-[10px] uppercase font-bold text-black/70">GEAR</span>
            <span className="text-xl sm:text-2xl leading-none">{gear}</span>
          </div>

          {/* Speedometer KM/H */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tight">
                {Math.round(playerSpeedKmh)}
              </span>
              <span className="text-xs font-bold text-[#00F5D4]">KM/H</span>
            </div>
            <div className="text-[10px] text-zinc-400">
              POS: [{Math.round(playerPosition[0])}, {Math.round(playerPosition[2])}]
            </div>
          </div>
        </div>

        {/* Vehicle Mode Switcher Buttons */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-2xl border border-white/15 bg-[#0B130E]/80 p-1.5 backdrop-blur-md">
          {(
            [
              { id: 'ON_FOOT', label: '[1] FOOT' },
              { id: 'BICYCLE', label: '[2] BIKE' },
              { id: 'DRIFT_CAR', label: '[3] CAR' },
            ] as { id: VehicleMode; label: string }[]
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => setVehicleMode(m.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                vehicleMode === m.id
                  ? 'bg-[#FF5500] text-black font-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Messenger Wardrobe Customizer Button */}
        <button
          onClick={toggleWardrobe}
          className={`flex items-center gap-1.5 rounded-2xl border px-3.5 py-2.5 text-xs font-bold uppercase backdrop-blur-md transition active:scale-95 shadow-md ${
            isWardrobeOpen
              ? 'border-[#00F5D4] bg-[#00F5D4] text-black font-black'
              : 'border-white/15 bg-[#0B130E]/80 text-zinc-300 hover:bg-white hover:text-black'
          }`}
          title="Open Messenger Wardrobe Customizer [C]"
        >
          <Shirt className="h-4 w-4 text-[#00F5D4]" />
          <span className="hidden md:inline">Wardrobe [C]</span>
        </button>

        {/* Messenger Floating Emoji Reaction Quickbar */}
        <div className="hidden lg:flex items-center gap-1 rounded-2xl border border-white/15 bg-[#0B130E]/80 p-1.5 backdrop-blur-md">
          {[
            { key: '4', emoji: '🚀' },
            { key: '5', emoji: '🔥' },
            { key: '6', emoji: '⚡' },
            { key: '7', emoji: '✨' },
            { key: '8', emoji: '💬' },
            { key: '9', emoji: '🎉' },
          ].map((e) => (
            <button
              key={e.key}
              onClick={() => spawnEmoji(e.emoji)}
              className="group relative flex h-7 w-7 items-center justify-center rounded-xl hover:bg-white/15 transition active:scale-125"
              title={`React ${e.emoji} [${e.key}]`}
            >
              <span className="text-sm">{e.emoji}</span>
              <span className="absolute -bottom-1 -right-0.5 text-[8px] font-mono text-zinc-400 group-hover:text-[#00F5D4]">
                {e.key}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Control Bar & Action Helpers */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        {/* Driving Action Pills */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          {/* Guide Tour Follow Button */}
          <button
            onClick={toggleFollowGuide}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold uppercase backdrop-blur-md transition active:scale-95 shadow-md ${
              isFollowingGuide
                ? 'border-[#FF2A85] bg-[#FF2A85] text-white font-black animate-pulse'
                : 'border-white/20 bg-[#0B130E]/85 text-zinc-200 hover:bg-white hover:text-black'
            }`}
            title="Toggle Autopilot Tour with Shashank [G]"
          >
            <Radio className="h-4 w-4 text-[#CCFF00]" />
            <span>{isFollowingGuide ? 'Following Shashank ✓' : 'Follow Guide [G]'}</span>
          </button>

          {/* Clash Isometric Map Toggle */}
          <button
            onClick={toggleIsometricMap}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold uppercase backdrop-blur-md transition active:scale-95 ${
              isIsometricMapOpen
                ? 'border-[#FFE600] bg-[#FFE600] text-black font-black'
                : 'border-white/20 bg-[#0B130E]/85 text-zinc-200 hover:bg-white hover:text-black'
            }`}
            title="Toggle Clash of Clans Isometric Village Overview [M]"
          >
            <Map className="h-4 w-4" />
            <span className="hidden sm:inline">Clash Base [M]</span>
          </button>

          {/* Headlights Toggle */}
          <button
            onClick={toggleHeadlights}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold uppercase backdrop-blur-md transition active:scale-95 ${
              headlights
                ? 'border-[#00F5D4] bg-[#00F5D4]/20 text-[#00F5D4]'
                : 'border-white/20 bg-[#0B130E]/85 text-zinc-400'
            }`}
            title="Toggle Headlights [H]"
          >
            <Lightbulb className="h-4 w-4" />
          </button>

          {/* X-Ray Wireframe Debug Toggle */}
          <button
            onClick={toggleXRayMode}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold uppercase backdrop-blur-md transition active:scale-95 ${
              isXRayMode
                ? 'border-[#00F5D4] bg-[#00F5D4] text-black font-black'
                : 'border-white/20 bg-[#0B130E]/85 text-zinc-300 hover:bg-white hover:text-black'
            }`}
            title="Toggle X-Ray Wireframe Mode [R]"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">X-Ray [R]</span>
          </button>
        </div>

        {/* Recruiter & Research Studies Badges */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Field Notebook / 60s Recruiter View */}
          <button
            onClick={() => setRecruiterDrawerOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#00F5D4] px-4 py-2 text-xs font-black uppercase text-black shadow-lg hover:bg-[#3bf9df] transition active:scale-95"
          >
            <FileText className="h-4 w-4" />
            <span>Field Notebook</span>
            <span className="rounded bg-black/15 px-1.5 py-0.5 text-[9px] font-bold">
              60s Recruiter
            </span>
          </button>

          {/* 17 Studies Archive */}
          <button
            onClick={() => setResearchArchiveOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-[#0B130E]/85 px-3.5 py-2 text-xs font-bold uppercase text-white shadow-md backdrop-blur-md hover:bg-white hover:text-black transition active:scale-95"
          >
            <Layers className="h-4 w-4 text-[#FFD800]" />
            <span className="hidden md:inline">17 Research Studies</span>
          </button>

          {/* Sound Mute */}
          <button
            onClick={toggleAudio}
            className="rounded-xl border border-white/20 bg-[#0B130E]/85 p-2 text-zinc-300 hover:bg-white hover:text-black transition"
            title="Toggle Audio"
          >
            {isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
