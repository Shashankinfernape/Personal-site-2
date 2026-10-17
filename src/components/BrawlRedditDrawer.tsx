// src/components/BrawlRedditDrawer.tsx
import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import {
  X,
  ExternalLink,
  Star,
  GitFork,
  BookOpen,
  Sparkles,
  ArrowUp,
  MessageSquare,
  Shield,
  Zap,
} from 'lucide-react';
import { GithubIcon } from './Icons';

export const BrawlRedditDrawer: React.FC = () => {
  const { selectedProject, closeProject } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        closeProject();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, closeProject]);

  if (!selectedProject) return null;

  const getRarityBadgeBg = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'bg-[#FF5500] text-black';
      case 'MYTHIC':
        return 'bg-[#FF2A85] text-white';
      case 'EPIC':
        return 'bg-[#A855F7] text-white';
      default:
        return 'bg-[#00F5D4] text-black';
    }
  };

  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl animate-in fade-in font-mono select-none">
      <div className="flex h-full max-h-[92vh] w-full max-w-5xl flex-col rounded-3xl border-4 border-black bg-[#101915] text-[#F4F4ED] shadow-[12px_12px_0px_#00F5D4] overflow-hidden">
        {/* Brawl Stars Neo-Brutalist Header */}
        <div className="flex items-start justify-between border-b-4 border-black bg-[#0C1410] p-6">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-lg px-3 py-1 text-xs font-black uppercase tracking-wider shadow-sm ${getRarityBadgeBg(
                  selectedProject.rarity
                )}`}
              >
                ★ {selectedProject.rarity} BRAWLER TIER
              </span>
              <span className="rounded-lg bg-black px-2.5 py-1 text-xs font-bold text-[#CCFF00] border border-white/20">
                {selectedProject.sectorCode} // {selectedProject.buildingTitle} (LVL {selectedProject.buildingLevel})
              </span>
            </div>

            <h2 className="mt-2 text-2xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[2px_2px_0px_#000]">
              {selectedProject.title}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-300 font-sans max-w-2xl leading-relaxed">
              {selectedProject.tagline}
            </p>
          </div>

          <button
            onClick={closeProject}
            className="rounded-2xl border-2 border-black bg-white p-2.5 text-black hover:bg-[#FF5500] hover:text-white transition shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
            title="Close [ESC]"
          >
            <X className="h-6 w-6 stroke-[3]" />
          </button>
        </div>

        {/* Live GitHub Stats & Rarity Strip */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-black bg-[#16221D] px-6 py-2.5 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Star className="h-4 w-4 text-[#FFD800] fill-[#FFD800]" />
              <span>{selectedProject.githubStats?.stars ?? 0}</span>
              <span className="text-[10px] text-zinc-400">Stars</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-white">
              <GitFork className="h-4 w-4 text-[#00F5D4]" />
              <span>{selectedProject.githubStats?.forks ?? 0}</span>
              <span className="text-[10px] text-zinc-400">Forks</span>
            </div>
            <div className="flex items-center gap-1 text-[#CCFF00] font-bold">
              <span>Lang: {selectedProject.githubStats?.language || 'Engine'}</span>
            </div>
          </div>

          <div className="text-[11px] text-zinc-400">
            Repo: <strong className="text-white">github.com/Shashankinfernape/{selectedProject.repoName}</strong>
          </div>
        </div>

        {/* Body Layout: Brawl Stat Bars on Left, Reddit Thread on Right */}
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          {/* Left Column: Brawl Stars Stat Bars & Tech Stack */}
          <div className="w-full md:w-80 border-b-2 md:border-b-0 md:border-r-2 border-black bg-[#0C1511] p-6 space-y-6 overflow-y-auto">
            {/* Brawl Stars Skewed Animated Stat Bars */}
            <div>
              <div className="text-xs font-black uppercase text-[#CCFF00] mb-3 flex items-center gap-1.5">
                <Zap className="h-4 w-4" />
                <span>Brawler Combat Metrics</span>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Architecture', val: selectedProject.stats.architecture, color: '#00F5D4' },
                  { label: 'Complexity', val: selectedProject.stats.complexity, color: '#FF5500' },
                  { label: 'AI Integration', val: selectedProject.stats.aiIntegration, color: '#FF2A85' },
                  { label: 'UX Polish', val: selectedProject.stats.uxPolish, color: '#FFD800' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-300 mb-1">
                      <span>{stat.label}</span>
                      <span className="text-white">{stat.val}/100</span>
                    </div>
                    {/* Skewed Stat Bar Container */}
                    <div className="h-3.5 w-full -skew-x-12 overflow-hidden rounded bg-black/60 border border-white/20 p-0.5">
                      <div
                        className="h-full rounded-sm transition-all duration-700 shadow-sm"
                        style={{
                          width: `${stat.val}%`,
                          backgroundColor: stat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Badges */}
            <div>
              <div className="text-xs font-black uppercase text-zinc-400 mb-2">
                Tech Stack & Libraries
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-white/20 bg-white/5 px-2.5 py-1 text-xs font-bold text-zinc-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Reddit r/ShashankBuilds Nested Engineering Post-Mortem */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#111C17]">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded bg-[#FF4500] px-2 py-0.5 font-black text-white">
                  r/ShashankBuilds
                </span>
                <span className="text-zinc-400">· Posted by u/{selectedProject.devLogThread[0]?.author || 'Shashankinfernape'}</span>
              </div>
              <div className="text-xs text-[#00F5D4] font-bold">
                ENGINEERING POST-MORTEM THREAD
              </div>
            </div>

            {/* Reddit Thread Nodes */}
            <div className="space-y-4">
              {selectedProject.devLogThread.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-2xl border-2 border-black bg-[#0C1511] p-4 text-xs shadow-[4px_4px_0px_#000]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">u/{comment.author}</span>
                      <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold text-[#FF9776]">
                        {comment.flair}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[#FF4500] font-black">
                      <ArrowUp className="h-3.5 w-3.5" />
                      <span>{comment.upvotes}</span>
                    </div>
                  </div>

                  <h4 className="mt-2 text-sm font-black text-white">
                    {comment.title}
                  </h4>
                  <p className="mt-1.5 font-sans text-xs text-zinc-300 leading-relaxed">
                    {comment.body}
                  </p>

                  {/* Nested Child Replies */}
                  {comment.children && comment.children.length > 0 && (
                    <div className="mt-3 border-l-2 border-[#00F5D4]/40 pl-3 space-y-2">
                      {comment.children.map((child) => (
                        <div key={child.id} className="rounded-xl bg-black/40 p-2.5 border border-white/5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-[#00F5D4]">u/{child.author} ({child.flair})</span>
                            <span className="text-zinc-500">▲ {child.upvotes}</span>
                          </div>
                          <h5 className="font-bold text-white text-xs mt-1">{child.title}</h5>
                          <p className="font-sans text-zinc-300 text-xs mt-0.5 leading-relaxed">{child.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t-4 border-black bg-[#0C1410] p-4">
          <div className="text-xs text-zinc-400">
            Press <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-white">ESC</kbd> to return to open world
          </div>

          <div className="flex items-center gap-3">
            <a
              href={selectedProject.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-black uppercase text-black transition hover:bg-[#00F5D4] shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
            >
              <GithubIcon className="h-4 w-4" />
              <span>Inspect Source Repo</span>
            </a>

            {selectedProject.liveUrl && (
              <a
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl border-2 border-white bg-white/10 px-5 py-2.5 text-xs font-bold uppercase text-white hover:bg-white hover:text-black transition"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Live Deploy</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
