// src/components/BrawlProjectModal.tsx
import React, { useState } from 'react';
import { useWorldStore } from '../store/useWorldStore';
import { DevLogComment } from '../config/projects.config';
import { ExternalLink, ChevronDown, ChevronRight, ArrowUp, Star, GitFork, Cpu, ShieldCheck } from 'lucide-react';
import { GithubIcon } from './Icons';

/**
 * Embodying the reverse-engineered systems:
 * - Brawl Stars (brawl-stars-analysis/DESIGN-SYSTEM.md):
 *   Lilita One / Supercell-Magic 900 text outlines, chunky beveled squircles,
 *   4px bottom lip press-down feedback, verified color_gradients.csv stops.
 * - Reddit (reddit-engineering-template):
 *   Nested comment hierarchy, optimistic upvote state caching, and flair badges.
 */

interface CommentItemProps {
  comment: DevLogComment;
}

const DevLogCommentNode: React.FC<CommentItemProps> = ({ comment }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [upvotes, setUpvotes] = useState(comment.upvotes);
  const [hasVoted, setHasVoted] = useState(false);

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasVoted) {
      setUpvotes((v: number) => v + 1);
      setHasVoted(true);
    } else {
      setUpvotes((v: number) => v - 1);
      setHasVoted(false);
    }
  };

  return (
    <div className="mt-3 border-l-2 border-zinc-700/80 pl-3 transition-colors hover:border-[#00F5D4]">
      {/* Reddit Comment Header */}
      <div className="flex items-center gap-2 text-[11px] text-zinc-400">
        <button
          onClick={handleUpvote}
          className={`flex items-center gap-0.5 rounded px-1.5 py-0.5 font-bold transition ${
            hasVoted ? 'bg-[#FF5500] text-white shadow-sm' : 'hover:bg-white/10 text-[#FF5500]'
          }`}
          title="Upvote post-mortem insight"
        >
          <ArrowUp className="h-3 w-3" />
          <span>{upvotes}</span>
        </button>

        <span className="font-bold text-white">u/{comment.author}</span>
        <span className="rounded bg-white/10 px-1.5 py-0.2 text-[9px] text-[#00F5D4]">
          {comment.flair}
        </span>

        {comment.children && comment.children.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto text-zinc-400 hover:text-white"
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        )}
      </div>

      {/* Comment Title & Body */}
      <div className="mt-1 font-bold text-xs text-white tracking-wide">
        {comment.title}
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">
        {comment.body}
      </p>

      {/* Nested Replies */}
      {isExpanded && comment.children && comment.children.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.children.map((child: DevLogComment) => (
            <DevLogCommentNode key={child.id} comment={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export const BrawlProjectModal: React.FC = () => {
  const { selectedProject, selectProject, setCameraMode } = useWorldStore();
  const [activeTab, setActiveTab] = useState<'brawl' | 'reddit'>('brawl');

  if (!selectedProject) return null;

  const handleClose = () => {
    selectProject(null);
    setCameraMode('SPLINE_WALKTHROUGH');
  };

  // Brawl Stars Verified Rarity Gradients from color_gradients.csv
  const getRarityBadgeStyle = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'bg-gradient-to-r from-[#FFFABC] via-[#FFD12E] to-[#F29928] text-black border-b-2 border-[#D69B00]';
      case 'MYTHIC':
        return 'bg-gradient-to-r from-[#FF2A2A] to-[#F931A3] text-white border-b-2 border-[#800020]';
      case 'EPIC':
        return 'bg-gradient-to-r from-[#FABCFF] via-[#D12EFF] to-[#9928F2] text-white border-b-2 border-[#5B108B]';
      case 'SUPER RARE':
      default:
        return 'bg-gradient-to-r from-[#20FBFF] via-[#00D0FA] to-[#359EFF] text-black border-b-2 border-[#0070B8]';
    }
  };

  return (
    <aside className="pointer-events-auto my-auto ml-auto w-full max-w-xl border-3 border-black bg-[#10131F]/95 p-6 shadow-[10px_10px_0px_#FFD12E] backdrop-blur-2xl transition-all duration-300 animate-in fade-in slide-in-from-right font-mono">
      {/* Top Header with Brawl Stars Styling */}
      <div className="flex items-start justify-between border-b border-[#353B5A] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block -skew-x-12 px-3 py-0.8 text-[11px] font-black uppercase tracking-wider rounded-sm ${getRarityBadgeStyle(
                selectedProject.rarity
              )}`}
              style={{
                textShadow: '-1px -1px 0 rgba(0,0,0,0.4), 1px 1px 0 rgba(0,0,0,0.4)',
              }}
            >
              ★ {selectedProject.rarity}
            </span>
            <span className="text-[10px] font-bold text-[#F29928] uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              LVL {selectedProject.buildingLevel} · {selectedProject.buildingTitle}
            </span>
          </div>

          {/* Brawl Stars Text Outline Headline */}
          <h2
            className="mt-2 text-2xl font-black uppercase tracking-tight text-white"
            style={{
              textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0px 4px 0 #000',
              letterSpacing: '0.04em',
            }}
          >
            {selectedProject.title}
          </h2>
          <p className="mt-1 text-xs text-zinc-300 leading-snug">
            {selectedProject.tagline}
          </p>
        </div>

        {/* Tactile Close Button */}
        <button
          onClick={handleClose}
          className="border-2 border-black bg-[#FF2A2A] px-3 py-1.5 text-xs font-black uppercase text-white shadow-[0_3px_0_#990000] transition active:translate-y-1 active:shadow-none hover:brightness-110"
          title="Return to spline flight [ESC]"
        >
          ESC ✕
        </button>
      </div>

      {/* Brawl Stars Currency & GitHub Telemetry Bar */}
      <div className="mt-3 flex items-center justify-between border-b border-[#353B5A] pb-3 text-xs">
        <div className="flex items-center gap-3">
          {/* Gem-Green Stars Pill */}
          <div className="flex items-center gap-1.5 rounded-full bg-[#10131F] border border-[#00C74B]/40 px-2.5 py-1 text-white shadow-inner">
            <Star className="h-3.5 w-3.5 text-[#00C74B] fill-[#00C74B]" />
            <span className="font-bold">{selectedProject.githubStats?.stars ?? 0}</span>
            <span className="text-[9px] text-[#00C74B] uppercase font-bold">Stars</span>
          </div>

          {/* Power-Pink Forks Pill */}
          <div className="flex items-center gap-1.5 rounded-full bg-[#10131F] border border-[#F931A3]/40 px-2.5 py-1 text-white shadow-inner">
            <GitFork className="h-3.5 w-3.5 text-[#F931A3]" />
            <span className="font-bold">{selectedProject.githubStats?.forks ?? 0}</span>
            <span className="text-[9px] text-[#F931A3] uppercase font-bold">Forks</span>
          </div>

          {/* Coin-Gold Engine Pill */}
          <div className="flex items-center gap-1.5 rounded-full bg-[#10131F] border border-[#F29928]/40 px-2.5 py-1 text-white shadow-inner">
            <Cpu className="h-3.5 w-3.5 text-[#F29928]" />
            <span className="text-[10px] text-zinc-200 font-bold">{selectedProject.githubStats?.language || 'Engine'}</span>
          </div>
        </div>

        <div className="text-[10px] text-zinc-400 font-bold">
          SECTOR: <span className="text-[#20FBFF]">{selectedProject.sectorCode}</span>
        </div>
      </div>

      {/* Tab Switcher: Brawl Loadout vs Reddit Post-Mortem */}
      <div className="mt-4 flex border-b-2 border-[#353B5A] text-xs">
        <button
          onClick={() => setActiveTab('brawl')}
          className={`flex-1 py-2.5 font-black uppercase tracking-wider transition ${
            activeTab === 'brawl'
              ? 'border-b-3 border-[#FFD12E] text-[#FFD12E] bg-[#23273D]/60'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          ⚔ Brawl Stars Loadout
        </button>
        <button
          onClick={() => setActiveTab('reddit')}
          className={`flex-1 py-2.5 font-black uppercase tracking-wider transition ${
            activeTab === 'reddit'
              ? 'border-b-3 border-[#FF5500] text-[#FF5500] bg-[#23273D]/60'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          💬 r/ShashankBuilds Dev-Log ({selectedProject.devLogThread.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'brawl' ? (
        <div className="mt-4 space-y-4">
          {/* Skewed Stat Bars with Supercell Bevel */}
          <div className="grid grid-cols-2 gap-3.5">
            {Object.entries(selectedProject.stats).map(([statName, val]) => (
              <div key={statName}>
                <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-300">
                  <span>{statName.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-black text-[#FFD12E]">{val}/100</span>
                </div>
                {/* 3D Inset Progress Bar */}
                <div className="mt-1 h-3 w-full -skew-x-12 overflow-hidden bg-[#10131F] border-2 border-black rounded-sm shadow-inner">
                  <div
                    className="h-full transition-all duration-700 ease-out relative"
                    style={{
                      width: `${val}%`,
                      backgroundColor: selectedProject.accentColor,
                    }}
                  >
                    {/* Gloss Highlight Overlay (from common_progress_bars.json) */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/40" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tech Stack Pills */}
          <div className="pt-2">
            <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold mb-2">
              Verified Architecture Stack
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedProject.stack.map((tech) => (
                <span
                  key={tech}
                  className="border border-[#353B5A] bg-[#23273D] px-2.5 py-1 text-[10px] text-zinc-200 font-bold rounded-sm transition hover:border-[#20FBFF] hover:text-[#20FBFF]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Reddit Nested Architecture Thread */
        <div className="mt-4 max-h-60 overflow-y-auto pr-1">
          <div className="mb-2 flex items-center justify-between text-[10px] text-zinc-400 font-bold">
            <span className="text-[#FF5500]">
              r/ShashankBuilds · REVERSE-ENGINEERED THREAD
            </span>
            <span>SORT: TOP RATED</span>
          </div>

          <div className="space-y-3">
            {selectedProject.devLogThread.map((comment) => (
              <DevLogCommentNode key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      )}

      {/* Tactile Brawl Stars CTA Buttons */}
      <div className="mt-6 flex gap-3 pt-3 border-t border-[#353B5A]">
        {/* Primary Action Button (Brawl Stars Yellow CTA) */}
        <a
          href={selectedProject.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-black bg-gradient-to-b from-[#FFE866] via-[#FFD12E] to-[#D69B00] py-2.5 text-center text-xs font-black uppercase text-black shadow-[0_4px_0_#996F00] transition active:translate-y-1 active:shadow-none hover:brightness-105"
        >
          <GithubIcon className="h-4 w-4" />
          <span>Inspect GitHub Repo</span>
        </a>

        {/* Live Deploy CTA */}
        {selectedProject.liveUrl && (
          <a
            href={selectedProject.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg border-2 border-black bg-gradient-to-b from-[#20FBFF] via-[#00D0FA] to-[#008BB8] px-4 py-2.5 text-xs font-black uppercase text-black shadow-[0_4px_0_#005573] transition active:translate-y-1 active:shadow-none hover:brightness-105"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Live Deploy</span>
          </a>
        )}
      </div>
    </aside>
  );
};
