// src/components/TeleportMapModal.tsx
import React, { useEffect } from 'react';
import { usePlayableWorldStore } from '../store/usePlayableWorldStore';
import { WORLD_DISTRICTS } from '../config/world.config';
import { WORLD_CHARACTERS } from '../config/characters.config';
import { X, MapPin, Compass, Navigation, MessageSquare, Check, Sparkles } from 'lucide-react';

export const TeleportMapModal: React.FC = () => {
  const {
    isTeleportMapOpen,
    setTeleportMapOpen,
    activeDistrict,
    teleportToDistrict,
    teleportToNpc,
    startDialogue,
  } = usePlayableWorldStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTeleportMapOpen) {
        setTeleportMapOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTeleportMapOpen, setTeleportMapOpen]);

  if (!isTeleportMapOpen) return null;

  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl animate-in fade-in font-mono select-none">
      <div className="flex h-full max-h-[88vh] w-full max-w-5xl flex-col rounded-2xl border-2 border-white/20 bg-[#101915] text-[#F4F4ED] shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0A120E] p-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#FF9776] px-3 py-0.5 text-[10px] font-black uppercase text-black">
                REALM COMPASS
              </span>
              <span className="text-xs text-zinc-400">10 EXPLORABLE DISTRICTS</span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Instant Fast-Travel Map
            </h2>
            <p className="mt-0.5 text-xs text-zinc-300 font-sans">
              Select any district or resident storyteller to instantly traverse the realm.
            </p>
          </div>

          <button
            onClick={() => setTeleportMapOpen(false)}
            className="rounded-lg border border-white/20 bg-white/5 p-2 text-zinc-400 transition hover:bg-white hover:text-black"
            title="Close [ESC]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* District Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WORLD_DISTRICTS.map((district) => {
              const isCurrent = activeDistrict.id === district.id;
              const character = WORLD_CHARACTERS.find((c) => c.id === district.characterId);

              return (
                <div
                  key={district.id}
                  className={`group relative rounded-xl border p-5 transition flex flex-col justify-between ${
                    isCurrent
                      ? 'border-[#00F5D4] bg-[#142620] shadow-[0_0_20px_rgba(0,245,212,0.15)]'
                      : 'border-white/10 bg-[#0B130F] hover:border-white/30 hover:bg-[#121B17]'
                  }`}
                >
                  <div>
                    {/* Header info */}
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className="rounded-md px-2 py-0.5 text-[10px] font-black uppercase text-black"
                        style={{ backgroundColor: district.color }}
                      >
                        {district.landmarkTitle}
                      </span>

                      {isCurrent ? (
                        <span className="flex items-center gap-1 rounded bg-[#00F5D4]/20 px-2 py-0.5 text-[10px] font-bold text-[#00F5D4]">
                          <Check className="h-3 w-3" /> HERE
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-500">
                          [{district.center[0]}, {district.center[2]}]
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2.5 text-lg font-black uppercase text-white group-hover:text-[#00F5D4] transition">
                      {district.name}
                    </h3>

                    <div className="text-[11px] font-bold text-[#00F5D4] mt-0.5">
                      {district.theme}
                    </div>

                    <p className="mt-2 text-xs text-zinc-400 font-sans leading-relaxed">
                      {district.description}
                    </p>

                    {character && (
                      <div className="mt-3 flex items-center gap-2 rounded-lg bg-black/30 p-2 text-xs border border-white/5">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: character.primaryColor }}
                        />
                        <div className="truncate">
                          <span className="text-zinc-400 text-[11px]">Guide: </span>
                          <span className="font-bold text-white text-[11px]">{character.name}</span>
                          <span className="text-zinc-500 text-[10px]"> — {character.title}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Teleport Actions */}
                  <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
                    <button
                      onClick={() => teleportToDistrict(district.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold uppercase transition ${
                        isCurrent
                          ? 'bg-white/10 text-zinc-400 cursor-default'
                          : 'bg-white text-black hover:bg-[#00F5D4] active:scale-95 shadow'
                      }`}
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      <span>{isCurrent ? 'Current Position' : 'Warp Here'}</span>
                    </button>

                    {character && (
                      <button
                        onClick={() => {
                          teleportToNpc(character.id);
                          startDialogue(character);
                        }}
                        className="flex items-center gap-1 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-xs font-bold uppercase text-white hover:bg-white hover:text-black transition"
                        title={`Warp & speak with ${character.name}`}
                      >
                        <MessageSquare className="h-3.5 w-3.5 text-[#00F5D4]" />
                        <span>Talk</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#0A120E] px-6 py-3 text-xs text-zinc-400">
          <div>Tip: Press <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-white">M</kbd> anytime to open or close the map</div>
          <div>Press <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-white">ESC</kbd> to return</div>
        </div>
      </div>
    </div>
  );
};
