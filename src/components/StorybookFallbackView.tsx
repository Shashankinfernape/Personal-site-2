// src/components/StorybookFallbackView.tsx
import React, { useState } from 'react';
import { usePlayableWorldStore } from '../store/usePlayableWorldStore';
import { WORLD_DISTRICTS } from '../config/world.config';
import { WORLD_CHARACTERS } from '../config/characters.config';
import { PORTFOLIO_PROJECTS } from '../config/projects.config';
import { RESEARCH_STUDIES } from '../config/research.config';
import { SHASHANK_PROFILE } from '../config/projects.config';
import {
  Compass,
  BookOpen,
  Box,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Star,
  GitFork,
  ArrowRight,
  FileText,
  User,
  Layers,
  Award,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

export const StorybookFallbackView: React.FC = () => {
  const {
    toggleStorybook2DMode,
    openProjectDossier,
    openResearchStudy,
    setResearchArchiveOpen,
    setRecruiterDrawerOpen,
  } = usePlayableWorldStore();

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const activeDistrict = WORLD_DISTRICTS[activeChapterIndex] || WORLD_DISTRICTS[0];
  const activeCharacter = WORLD_CHARACTERS.find((c) => c.id === activeDistrict.characterId);
  const activeProject = PORTFOLIO_PROJECTS.find(
    (p) =>
      p.id === activeCharacter?.assignedProjectOrTopicId ||
      p.sectorCode.toLowerCase() === activeDistrict.id.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-20 flex flex-col bg-[#0B1410] text-[#F4F4ED] font-mono overflow-hidden select-none">
      {/* Top Navigation Bar */}
      <header className="flex flex-wrap items-center justify-between border-b border-white/10 bg-[#0E1B15] px-6 py-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00F5D4] text-black font-black">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-black uppercase text-white tracking-wider">
              The Reverse-Engineered Realm
            </h1>
            <p className="text-[11px] text-zinc-400">
              Illustrated 2D Storybook Edition · Shashank S
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Recruiter 60s Fast-Path */}
          <button
            onClick={() => setRecruiterDrawerOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#00F5D4] px-3.5 py-2 text-xs font-black uppercase text-black hover:bg-[#3bf9df] transition shadow"
          >
            <FileText className="h-4 w-4" />
            <span>Field Notebook</span>
          </button>

          {/* Research Archive */}
          <button
            onClick={() => setResearchArchiveOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-bold uppercase text-white hover:bg-white hover:text-black transition"
          >
            <Layers className="h-4 w-4 text-[#FFD800]" />
            <span className="hidden sm:inline">17 Research Studies</span>
          </button>

          {/* Switch to 3D Realm */}
          <button
            onClick={toggleStorybook2DMode}
            className="flex items-center gap-1.5 rounded-xl border border-[#00F5D4] bg-[#00F5D4]/15 px-3.5 py-2 text-xs font-black uppercase text-[#00F5D4] hover:bg-[#00F5D4] hover:text-black transition shadow"
          >
            <Box className="h-4 w-4" />
            <span>Enter 3D Realm</span>
          </button>
        </div>
      </header>

      {/* Main Chapter Content Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Chapters Index */}
        <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-[#09110D] overflow-y-auto p-4 space-y-1.5">
          <div className="text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-2 px-3">
            Storybook Chapters
          </div>
          {WORLD_DISTRICTS.map((d, idx) => {
            const isSelected = activeChapterIndex === idx;
            return (
              <button
                key={d.id}
                onClick={() => setActiveChapterIndex(idx)}
                className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition ${
                  isSelected
                    ? 'bg-[#152720] border border-[#00F5D4] text-white shadow-sm'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                }`}
              >
                <div className="truncate">
                  <div className="text-[10px] text-zinc-500 font-bold">
                    CHAPTER {idx + 1}
                  </div>
                  <div className="text-xs font-bold truncate text-white">
                    {d.name}
                  </div>
                </div>
                <div
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: d.color }}
                />
              </button>
            );
          })}
        </aside>

        {/* Center / Right: Chapter Narrative & Artifact Showcase */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
          {/* Chapter Header */}
          <div className="max-w-4xl space-y-3">
            <div className="flex items-center gap-2">
              <span
                className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase text-black"
                style={{ backgroundColor: activeDistrict.color }}
              >
                CHAPTER {activeChapterIndex + 1} // {activeDistrict.landmarkTitle}
              </span>
              <span className="text-xs text-zinc-400 uppercase">
                {activeDistrict.theme}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              {activeDistrict.name}
            </h2>

            <p className="text-sm text-zinc-300 font-sans leading-relaxed">
              {activeDistrict.description}
            </p>
          </div>

          {/* Character Guide Voice Card */}
          {activeCharacter && (
            <div className="max-w-4xl rounded-2xl border border-white/15 bg-[#121F19] p-6 shadow-xl">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl font-black text-black shadow-md"
                  style={{ backgroundColor: activeCharacter.primaryColor }}
                >
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black uppercase text-white">
                      {activeCharacter.name}
                    </span>
                    <span
                      className="rounded px-2 py-0.5 text-[10px] font-bold uppercase text-black"
                      style={{ backgroundColor: activeCharacter.primaryColor }}
                    >
                      {activeCharacter.title}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 font-sans mt-0.5">
                    {activeCharacter.personality}
                  </div>
                </div>
              </div>

              {/* Character Spoken Narrative */}
              <div className="space-y-3 font-sans text-sm sm:text-base text-[#F4F4ED] leading-relaxed">
                {activeCharacter.initialDialogue.map((line, i) => (
                  <p key={i} className="pl-3 border-l-2 border-white/20">
                    &ldquo;{line.text}&rdquo;
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Featured Software Project Card if attached */}
          {activeProject && (
            <div className="max-w-4xl rounded-2xl border-2 border-[#00F5D4]/40 bg-[#0E1914] p-6 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded px-2 py-0.5 text-[10px] font-black uppercase text-black"
                      style={{ backgroundColor: activeProject.accentColor }}
                    >
                      {activeProject.sectorCode}
                    </span>
                    <span className="text-xs text-zinc-400 font-bold uppercase">
                      {activeProject.buildingTitle} (LVL {activeProject.buildingLevel})
                    </span>
                  </div>
                  <h3 className="mt-1 text-2xl font-black text-white uppercase tracking-tight">
                    {activeProject.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-white font-bold">
                    <Star className="h-4 w-4 text-[#FFD800]" /> {activeProject.githubStats?.stars ?? 0}
                  </span>
                  <span className="flex items-center gap-1 text-white font-bold">
                    <GitFork className="h-4 w-4 text-[#00F5D4]" /> {activeProject.githubStats?.forks ?? 0}
                  </span>
                </div>
              </div>

              <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                {activeProject.tagline}
              </p>

              {/* Stack Badges */}
              <div className="flex flex-wrap gap-2">
                {activeProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200 font-bold"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <button
                  onClick={() => openProjectDossier(activeProject)}
                  className="flex items-center gap-2 rounded-xl bg-[#00F5D4] px-5 py-2.5 text-xs font-black uppercase text-black hover:bg-[#3bf9df] transition shadow"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Open Full Engineering Dossier</span>
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={activeProject.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase text-white hover:bg-white hover:text-black transition"
                  >
                    <GithubIcon className="h-4 w-4" />
                    <span>Source</span>
                  </a>
                  {activeProject.liveUrl && (
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase text-white hover:bg-[#00F5D4] hover:text-black transition"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Grand Archives Highlight if Chapter 9 (Grand Archives) */}
          {activeDistrict.id === 'grand-archives' && (
            <div className="max-w-4xl rounded-2xl border border-[#CCFF00]/40 bg-[#0E1914] p-6 space-y-4">
              <h3 className="text-xl font-black uppercase text-white">
                The 17 Deconstructed App & Website Studies
              </h3>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Forensic teardowns covering Brawl Stars, Clash of Clans, Reddit, Instagram, Abeto Messenger, Lusion, Into the Amazon, Lando Norris, Pixelflakes, and more.
              </p>
              <button
                onClick={() => setResearchArchiveOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-[#CCFF00] px-5 py-2.5 text-xs font-black uppercase text-black hover:bg-[#d8ff33] transition shadow"
              >
                <Layers className="h-4 w-4" />
                <span>Explore Full 17 Studies Archive</span>
              </button>
            </div>
          )}

          {/* Chapter Step Controller (Prev / Next) */}
          <div className="max-w-4xl flex items-center justify-between border-t border-white/10 pt-6">
            <button
              onClick={() => setActiveChapterIndex((p) => Math.max(0, p - 1))}
              disabled={activeChapterIndex === 0}
              className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase text-white hover:bg-white hover:text-black transition disabled:opacity-30 disabled:pointer-events-none"
            >
              ← Previous Chapter
            </button>

            <span className="text-xs text-zinc-400">
              {activeChapterIndex + 1} of {WORLD_DISTRICTS.length} Chapters
            </span>

            <button
              onClick={() =>
                setActiveChapterIndex((p) => Math.min(WORLD_DISTRICTS.length - 1, p + 1))
              }
              disabled={activeChapterIndex === WORLD_DISTRICTS.length - 1}
              className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase text-white hover:bg-white hover:text-black transition disabled:opacity-30 disabled:pointer-events-none"
            >
              Next Chapter →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
