// src/components/WorldNavigationHud.tsx
import React, { useEffect } from 'react';
import { usePlayableWorldStore } from '../store/usePlayableWorldStore';
import {
  Compass,
  MapPin,
  BookOpen,
  Library,
  Volume2,
  VolumeX,
  FileText,
  MessageSquare,
  Sparkles,
  Info,
  X,
  ArrowRight,
} from 'lucide-react';

export const WorldNavigationHud: React.FC = () => {
  const {
    activeDistrict,
    nearbyNpc,
    playerPosition,
    startDialogue,
    setResearchArchiveOpen,
    setRecruiterDrawerOpen,
    setTeleportMapOpen,
    toggleStorybook2DMode,
    isStorybook2DMode,
    isAudioMuted,
    toggleAudio,
    controlsHintDismissed,
    dismissControlsHint,
    activeDialogue,
    openedProjectDossier,
    openedResearchStudy,
    isResearchArchiveOpen,
    isRecruiterDrawerOpen,
    isTeleportMapOpen,
  } = usePlayableWorldStore();

  const isAnyModalOpen =
    !!activeDialogue ||
    !!openedProjectDossier ||
    !!openedResearchStudy ||
    isResearchArchiveOpen ||
    isRecruiterDrawerOpen ||
    isTeleportMapOpen;

  // Global keyboard shortcuts for exploration HUD
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnyModalOpen) return;

      if ((e.key === 'e' || e.key === 'E') && nearbyNpc) {
        startDialogue(nearbyNpc);
      } else if (e.key === 'm' || e.key === 'M') {
        setTeleportMapOpen(true);
      } else if (e.key === 'n' || e.key === 'N') {
        setRecruiterDrawerOpen(true);
      } else if (e.key === 'h' || e.key === 'H') {
        setResearchArchiveOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnyModalOpen, nearbyNpc, startDialogue, setTeleportMapOpen, setRecruiterDrawerOpen, setResearchArchiveOpen]);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-4 sm:p-6 font-mono select-none">
      {/* Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* District & Location Pill */}
        <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/15 bg-[#121B17]/90 px-4 py-2.5 shadow-lg backdrop-blur-md">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl font-black text-black shadow-sm"
            style={{ backgroundColor: activeDistrict.color }}
          >
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                {activeDistrict.name}
              </span>
              <span
                className="rounded-full px-2 py-0.2 text-[9px] font-black uppercase text-black"
                style={{ backgroundColor: activeDistrict.color }}
              >
                {activeDistrict.landmarkTitle}
              </span>
            </div>
            <div className="text-[10px] text-zinc-400">
              Pos: [{Math.round(playerPosition[0])}, {Math.round(playerPosition[2])}] · Theme:{' '}
              <span className="text-[#00F5D4] font-bold">{activeDistrict.theme}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          {/* Recruiter Fast-Path: 60s Field Notebook */}
          <button
            onClick={() => setRecruiterDrawerOpen(true)}
            className="group flex items-center gap-2 rounded-xl bg-[#00F5D4] px-3.5 py-2 text-xs font-black uppercase text-black shadow-md transition hover:bg-[#3bf9df] active:scale-95"
            title="Inspect 60-Second Recruiter Summary [N]"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Field Notebook</span>
            <span className="rounded bg-black/15 px-1.5 py-0.5 text-[9px] font-bold">
              60s Recruiter
            </span>
          </button>

          {/* 17 Reverse-Engineering Studies */}
          <button
            onClick={() => setResearchArchiveOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-[#121B17]/90 px-3.5 py-2 text-xs font-bold uppercase text-white shadow-md backdrop-blur-md transition hover:bg-white hover:text-black active:scale-95"
            title="Browse 17 Reverse-Engineering Studies [H]"
          >
            <Library className="h-4 w-4 text-[#FFD800]" />
            <span className="hidden sm:inline">17 Research Studies</span>
          </button>

          {/* Teleport World Map */}
          <button
            onClick={() => setTeleportMapOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-[#121B17]/90 px-3.5 py-2 text-xs font-bold uppercase text-white shadow-md backdrop-blur-md transition hover:bg-white hover:text-black active:scale-95"
            title="Fast Travel World Map [M]"
          >
            <MapPin className="h-4 w-4 text-[#FF9776]" />
            <span className="hidden sm:inline">Teleport</span>
          </button>

          {/* 2D Storybook Mode Toggle */}
          <button
            onClick={toggleStorybook2DMode}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold uppercase shadow-md backdrop-blur-md transition active:scale-95 ${
              isStorybook2DMode
                ? 'border-[#00F5D4] bg-[#00F5D4] text-black font-black'
                : 'border-white/20 bg-[#121B17]/90 text-white hover:bg-white hover:text-black'
            }`}
            title="Toggle Illustrated 2D Storybook Mode"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden lg:inline">{isStorybook2DMode ? '3D Realm' : '2D Storybook'}</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleAudio}
            className="rounded-xl border border-white/20 bg-[#121B17]/90 p-2 text-zinc-300 shadow-md backdrop-blur-md transition hover:bg-white hover:text-black active:scale-95"
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Center Proximity Interaction Callout */}
      {nearbyNpc && !isAnyModalOpen && (
        <div className="pointer-events-auto mx-auto mb-4 animate-bounce">
          <button
            onClick={() => startDialogue(nearbyNpc)}
            className="flex items-center gap-2.5 rounded-full border-2 border-[#00F5D4] bg-[#121B17]/95 px-5 py-2.5 text-xs font-black uppercase text-white shadow-[0_8px_25px_rgba(0,245,212,0.4)] backdrop-blur-md transition hover:scale-105 active:scale-95"
          >
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#00F5D4] animate-ping" />
            <MessageSquare className="h-4 w-4 text-[#00F5D4]" />
            <span>
              Talk to <strong className="text-[#00F5D4]">{nearbyNpc.name}</strong>
            </span>
            <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[10px] text-white">
              [E]
            </kbd>
          </button>
        </div>
      )}

      {/* Bottom Footer & Controls Helper */}
      <div className="flex items-end justify-between">
        {/* Controls Overlay Helper Box */}
        {!controlsHintDismissed && (
          <div className="pointer-events-auto max-w-sm rounded-2xl border border-white/15 bg-[#121B17]/90 p-3.5 shadow-lg backdrop-blur-md text-xs text-zinc-300">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <span className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#FFD800]" />
                How to Explore the Realm
              </span>
              <button
                onClick={dismissControlsHint}
                className="text-zinc-500 hover:text-white"
                title="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-1 text-[11px] text-zinc-300">
              <div>
                <kbd className="rounded bg-white/10 px-1 py-0.5 text-white font-bold">W</kbd>{' '}
                <kbd className="rounded bg-white/10 px-1 py-0.5 text-white font-bold">A</kbd>{' '}
                <kbd className="rounded bg-white/10 px-1 py-0.5 text-white font-bold">S</kbd>{' '}
                <kbd className="rounded bg-white/10 px-1 py-0.5 text-white font-bold">D</kbd> or Arrows to walk
              </div>
              <div>
                <kbd className="rounded bg-white/10 px-1 py-0.5 text-white font-bold">Click Ground</kbd> to move traveler
              </div>
              <div>
                <kbd className="rounded bg-white/10 px-1 py-0.5 text-white font-bold">Shift</kbd> to sprint •{' '}
                <kbd className="rounded bg-white/10 px-1 py-0.5 text-white font-bold">E</kbd> talk to characters
              </div>
            </div>
          </div>
        )}

        {/* Author & Realm Footnote */}
        <div className="pointer-events-auto ml-auto hidden sm:block text-right text-[11px] text-zinc-400 bg-[#121B17]/80 rounded-xl px-3 py-1.5 border border-white/10 backdrop-blur-md">
          <span>The Reverse-Engineered Realm</span> ·{' '}
          <a
            href="https://github.com/Shashankinfernape"
            target="_blank"
            rel="noreferrer"
            className="text-[#00F5D4] hover:underline font-bold"
          >
            Shashank S
          </a>
        </div>
      </div>
    </div>
  );
};
