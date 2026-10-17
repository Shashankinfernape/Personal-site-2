// src/components/WardrobeCustomizerModal.tsx
import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { X, Sparkles, Shuffle, Check, Shirt, User, Footprints } from 'lucide-react';

interface ColorPreset {
  name: string;
  badge: string;
  cap: string;
  hair: string;
  jacket: string;
  pants: string;
  sneakers: string;
}

const PRESET_OUTFITS: ColorPreset[] = [
  {
    name: 'CYBER COURIER',
    badge: 'DEFAULT',
    cap: '#FF5500',
    hair: '#18181B',
    jacket: '#00F5D4',
    pants: '#27272A',
    sneakers: '#FFFFFF',
  },
  {
    name: 'ABETO SUNSET',
    badge: 'MESSENGER',
    cap: '#81BFBC',
    hair: '#4A2E1A',
    jacket: '#FF5C77',
    pants: '#E5D9C5',
    sneakers: '#F3EFE0',
  },
  {
    name: 'TOKYO DRIFT',
    badge: 'ACID',
    cap: '#0B130E',
    hair: '#18181B',
    jacket: '#CCFF00',
    pants: '#0F172A',
    sneakers: '#FFE600',
  },
  {
    name: 'STEALTH RUNNER',
    badge: 'SHADOW',
    cap: '#3F3F46',
    hair: '#09090B',
    jacket: '#27272A',
    pants: '#18181B',
    sneakers: '#52525B',
  },
  {
    name: 'LUSION SYNTH',
    badge: 'SPECIMEN',
    cap: '#FFFFFF',
    hair: '#38BDF8',
    jacket: '#A855F7',
    pants: '#1E293B',
    sneakers: '#C084FC',
  },
  {
    name: 'F1 SPEEDSTER',
    badge: 'RACING',
    cap: '#FFE600',
    hair: '#27272A',
    jacket: '#EF4444',
    pants: '#18181B',
    sneakers: '#FFFFFF',
  },
];

const SWATCH_PALETTE = [
  '#00F5D4', // Neon Cyan
  '#CCFF00', // Acid Lime
  '#FF5500', // Blaze Orange
  '#FF2A85', // Neon Pink
  '#A855F7', // Cyber Purple
  '#38BDF8', // Sky Blue
  '#EF4444', // Crimson Red
  '#FFE600', // Solar Yellow
  '#FFFFFF', // Pure White
  '#A1A1AA', // Slate Grey
  '#27272A', // Dark Charcoal
  '#09090B', // Pitch Black
  '#E5D9C5', // Abeto Sand
  '#81BFBC', // Abeto Seafoam
  '#4A2E1A', // Warm Leather
];

export const WardrobeCustomizerModal: React.FC = () => {
  const {
    isWardrobeOpen,
    setIsWardrobeOpen,
    wardrobe,
    setWardrobeColor,
    setVehicleMode,
  } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Escape' || e.key.toLowerCase() === 'c') && isWardrobeOpen) {
        // Only close if not typing in an input
        if ((e.target as HTMLElement).tagName !== 'INPUT') {
          setIsWardrobeOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWardrobeOpen, setIsWardrobeOpen]);

  if (!isWardrobeOpen) return null;

  const randomizeWardrobe = () => {
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    setWardrobeColor('capColor', pick(SWATCH_PALETTE));
    setWardrobeColor('jacketColor', pick(SWATCH_PALETTE));
    setWardrobeColor('pantsColor', pick(SWATCH_PALETTE));
    setWardrobeColor('sneakersColor', pick(SWATCH_PALETTE));
    setWardrobeColor('hairColor', pick(SWATCH_PALETTE));
  };

  const applyPreset = (p: ColorPreset) => {
    setWardrobeColor('capColor', p.cap);
    setWardrobeColor('hairColor', p.hair);
    setWardrobeColor('jacketColor', p.jacket);
    setWardrobeColor('pantsColor', p.pants);
    setWardrobeColor('sneakersColor', p.sneakers);
  };

  const slots = [
    { id: 'capColor' as const, label: 'Cap / Headwear', current: wardrobe.capColor, icon: '🧢' },
    { id: 'jacketColor' as const, label: 'Jacket / Hoodie', current: wardrobe.jacketColor, icon: '🧥' },
    { id: 'pantsColor' as const, label: 'Pants / Cargo', current: wardrobe.pantsColor, icon: '👖' },
    { id: 'sneakersColor' as const, label: 'Kicks / Soles', current: wardrobe.sneakersColor, icon: '👟' },
    { id: 'hairColor' as const, label: 'Hair / Tint', current: wardrobe.hairColor, icon: '💇' },
  ];

  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in select-none font-mono">
      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-2 border-white/20 bg-[#0B130E] text-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#101915] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#00F5D4] text-black">
              <Shirt className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#00F5D4]">
                  MESSENGER WARDROBE
                </span>
                <span className="rounded bg-white/10 px-1.5 py-0.2 text-[9px] text-zinc-400">
                  HOTKEY: [C]
                </span>
              </div>
              <h2 className="text-lg font-black uppercase tracking-tight text-white">
                Customize 3D Player Avatar
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={randomizeWardrobe}
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-bold text-zinc-200 transition hover:bg-white hover:text-black active:scale-95"
              title="Randomize Outfit"
            >
              <Shuffle className="h-3.5 w-3.5 text-[#FFE600]" />
              <span>Remix</span>
            </button>
            <button
              onClick={() => setIsWardrobeOpen(false)}
              className="rounded-xl border border-white/20 bg-white/5 p-2 text-zinc-400 transition hover:bg-white hover:text-black active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          {/* Quick Outfit Presets */}
          <div>
            <div className="mb-2 flex items-center justify-between text-xs font-black uppercase text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#00F5D4]" />
                Curated Designer Presets
              </span>
              <span className="text-[10px] text-zinc-500">CLICK TO EQUIP</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PRESET_OUTFITS.map((p) => {
                const isActive =
                  wardrobe.jacketColor === p.jacket &&
                  wardrobe.capColor === p.cap &&
                  wardrobe.pantsColor === p.pants;
                return (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p)}
                    className={`group flex flex-col items-start rounded-2xl border p-3 text-left transition active:scale-95 ${
                      isActive
                        ? 'border-[#00F5D4] bg-[#00F5D4]/15 shadow-lg shadow-[#00F5D4]/10'
                        : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-white">
                        {p.name}
                      </span>
                      <span className="rounded bg-black/40 px-1.5 py-0.5 text-[8px] font-bold text-zinc-400">
                        {p.badge}
                      </span>
                    </div>

                    {/* Color Swatch Dots Preview */}
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: p.cap }}
                        title="Cap"
                      />
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: p.jacket }}
                        title="Jacket"
                      />
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: p.pants }}
                        title="Pants"
                      />
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: p.sneakers }}
                        title="Sneakers"
                      />
                      {isActive && (
                        <Check className="ml-auto h-3.5 w-3.5 text-[#00F5D4]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slot by Slot Fine-Tuning */}
          <div className="space-y-4">
            <div className="text-xs font-black uppercase text-zinc-400">
              Modular Slot Customizer
            </div>

            <div className="space-y-3">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3.5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{slot.icon}</span>
                      <span className="text-xs font-bold uppercase text-white">
                        {slot.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="h-5 w-5 rounded-lg border border-white/30 shadow-inner"
                        style={{ backgroundColor: slot.current }}
                      />
                      <span className="text-xs font-mono text-zinc-400 uppercase">
                        {slot.current}
                      </span>
                    </div>
                  </div>

                  {/* Swatch Picker */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {SWATCH_PALETTE.map((hex) => {
                      const isSelected = slot.current.toLowerCase() === hex.toLowerCase();
                      return (
                        <button
                          key={hex}
                          onClick={() => setWardrobeColor(slot.id, hex)}
                          className={`h-6 w-6 rounded-lg transition active:scale-90 relative ${
                            isSelected
                              ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0B130E] scale-110'
                              : 'opacity-85 hover:opacity-100 hover:scale-105'
                          }`}
                          style={{ backgroundColor: hex }}
                          title={hex}
                        >
                          {isSelected && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-black/80" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#101915] px-6 py-4">
          <div className="text-[11px] text-zinc-400">
            Changes save and render in real-time on your 3D courier.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setVehicleMode('ON_FOOT');
                setIsWardrobeOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20 transition active:scale-95"
            >
              <User className="h-3.5 w-3.5 text-[#00F5D4]" />
              <span>Step Outside [On Foot]</span>
            </button>

            <button
              onClick={() => setIsWardrobeOpen(false)}
              className="flex items-center gap-1.5 rounded-xl bg-[#00F5D4] px-4 py-2 text-xs font-black uppercase text-black hover:bg-[#3bf9df] transition active:scale-95 shadow-lg"
            >
              <Check className="h-4 w-4" />
              <span>Equip & Return [C]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
