// src/components/InstagramStoryBar.tsx
import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { PORTFOLIO_PROJECTS } from '../config/projects.config';
import { Sparkles, Compass } from 'lucide-react';

export const InstagramStoryBar: React.FC = () => {
  const { activeTheatreIndex, setActiveTheatreIndex, warpToLocation } = useGameStore();

  const storyNodes = [
    {
      id: 'spawn',
      name: 'Spawn Plaza',
      code: 'HUB',
      accentColor: '#CCFF00',
      pos: [0, 0, 0] as [number, number, number],
      index: -1,
    },
    ...PORTFOLIO_PROJECTS.map((p, idx) => ({
      id: p.id,
      name: p.title,
      code: p.sectorCode,
      accentColor: p.accentColor,
      pos: p.position,
      index: idx,
    })),
  ];

  return (
    <div className="pointer-events-none fixed top-4 left-1/2 z-35 -translate-x-1/2 font-mono select-none">
      <div className="pointer-events-auto flex items-center gap-3 overflow-x-auto rounded-3xl border border-white/20 bg-[#0B130E]/90 px-4 py-2 shadow-2xl backdrop-blur-md max-w-[94vw] scrollbar-none">
        <div className="hidden md:flex items-center gap-1.5 text-xs font-black uppercase text-zinc-400 border-r border-white/10 pr-3">
          <Compass className="h-4 w-4 text-[#00F5D4]" />
          <span>WARP</span>
        </div>

        {storyNodes.map((node) => {
          const isActive =
            node.index === -1
              ? activeTheatreIndex === -1
              : activeTheatreIndex === node.index;

          return (
            <button
              key={node.id}
              onClick={() => {
                warpToLocation([node.pos[0], 0, node.pos[2]]);
                if (node.index >= 0) setActiveTheatreIndex(node.index);
              }}
              className="group flex flex-col items-center gap-1 transition active:scale-90"
              title={`Warp to ${node.name}`}
            >
              {/* Instagram Gradient Ring */}
              <div
                className={`relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full p-[2px] transition ${
                  isActive
                    ? 'ring-2 ring-white scale-105'
                    : 'opacity-75 group-hover:opacity-100 group-hover:scale-105'
                }`}
                style={{
                  background: isActive
                    ? 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
                    : `${node.accentColor}40`,
                }}
              >
                <div
                  className="flex h-full w-full items-center justify-center rounded-full bg-[#0E1712] text-[10px] sm:text-xs font-black text-white"
                  style={{
                    color: node.accentColor,
                  }}
                >
                  {node.code}
                </div>
              </div>

              <span className="text-[9px] font-bold uppercase text-zinc-400 truncate max-w-[54px] text-center group-hover:text-white transition">
                {node.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
