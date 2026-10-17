// src/components/ResearchArchiveModal.tsx
import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { RESEARCH_STUDIES, ResearchStudy } from '../config/research.config';
import { Terminal, Code2, Layers, Palette, Activity, ChevronRight, X, Sparkles, FolderGit2 } from 'lucide-react';

export const ResearchArchiveModal: React.FC = () => {
  const {
    isResearchArchiveOpen,
    setResearchArchiveOpen,
    selectedResearchStudy,
    selectResearchStudy,
    closeResearchStudy,
  } = useGameStore();

  const [activeCategory, setActiveCategory] = useState<'ALL' | 'GAME_APP' | 'INTERACTIVE_WEB' | 'WEB_ARCHITECTURE'>('ALL');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedResearchStudy) {
          closeResearchStudy();
        } else if (isResearchArchiveOpen) {
          setResearchArchiveOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isResearchArchiveOpen, selectedResearchStudy, closeResearchStudy, setResearchArchiveOpen]);

  if (!isResearchArchiveOpen && !selectedResearchStudy) return null;

  const filteredStudies = activeCategory === 'ALL'
    ? RESEARCH_STUDIES
    : RESEARCH_STUDIES.filter((s) => s.category === activeCategory);

  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl animate-in fade-in font-mono">
      <div className="flex h-full max-h-[90vh] w-full max-w-6xl flex-col rounded-2xl border-2 border-white/20 bg-[#121B17] text-[#F4F4ED] shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0E1613] p-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#CCFF00] px-3 py-0.5 text-[10px] font-black uppercase text-black">
                RESEARCH ARCHIVE
              </span>
              <span className="text-xs text-zinc-400">
                17 DECONSTRUCTED APPS & WEBSITES
              </span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              The Grand Archives of Reverse-Engineering
            </h2>
            <p className="mt-0.5 text-xs text-zinc-300 font-sans">
              Curated field studies analyzing design systems, interaction patterns, motion physics, and architecture across 17 production codebases.
            </p>
          </div>

          <button
            onClick={() => {
              closeResearchStudy();
              setResearchArchiveOpen(false);
            }}
            className="rounded-lg border border-white/20 bg-white/5 p-2 text-zinc-400 transition hover:bg-white hover:text-black"
            title="Close [ESC]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 bg-[#15201B] px-6 py-2.5 text-xs">
          {[
            { id: 'ALL', label: 'All 17 Field Studies' },
            { id: 'GAME_APP', label: 'Games & Major Apps (6)' },
            { id: 'INTERACTIVE_WEB', label: 'Interactive & Web (8)' },
            { id: 'WEB_ARCHITECTURE', label: 'Architecture & Shaders (3)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`rounded-lg px-3.5 py-1.5 font-bold transition ${
                activeCategory === tab.id
                  ? 'bg-[#00F5D4] text-black shadow-sm font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content: Either List View or Deep Study View */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedResearchStudy ? (
            /* Deep Study View */
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#00F5D4] px-2 py-0.5 text-[10px] font-black uppercase text-black">
                      {selectedResearchStudy.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-zinc-400">
                      Folder: <code className="text-[#FFD800]">Git-repos/{selectedResearchStudy.folderName}/</code>
                    </span>
                  </div>
                  <h3 className="mt-2 text-2xl font-black text-white uppercase">
                    {selectedResearchStudy.title}
                  </h3>
                  <p className="text-xs text-zinc-300 mt-1 font-sans">
                    Target: <strong className="text-white">{selectedResearchStudy.targetAppOrSite}</strong> · Domain: {selectedResearchStudy.subjectDomain}
                  </p>
                </div>

                <button
                  onClick={closeResearchStudy}
                  className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase text-white hover:bg-white hover:text-black transition"
                >
                  ← Back to Archive
                </button>
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-white/10 bg-[#0E1613] p-4 text-xs font-sans text-zinc-200 leading-relaxed">
                {selectedResearchStudy.summary}
              </div>

              {/* Core Insights */}
              <div>
                <div className="text-xs font-bold uppercase text-[#00F5D4] mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  <span>Key Reverse-Engineering Discoveries</span>
                </div>
                <div className="space-y-2">
                  {selectedResearchStudy.coreInsights.map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 rounded-lg border border-white/10 bg-[#15201B] p-3 text-xs">
                      <span className="text-[#00F5D4] font-bold">•</span>
                      <span className="font-sans text-zinc-300 leading-relaxed">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Design Tokens Swatches */}
              <div>
                <div className="text-xs font-bold uppercase text-[#FFD800] mb-2 flex items-center gap-1.5">
                  <Palette className="h-4 w-4" />
                  <span>Extracted Design Tokens & Palette</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {Object.entries(selectedResearchStudy.extractedTokens).map(([name, val]) => (
                    <div key={name} className="rounded-lg border border-white/10 bg-[#0E1613] p-2.5 text-xs">
                      <div
                        className="h-6 w-full rounded border border-black shadow-inner mb-1.5"
                        style={{ backgroundColor: val }}
                      />
                      <div className="text-[10px] text-zinc-400 truncate">{name}</div>
                      <div className="text-[10px] font-bold text-white truncate">{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Motion & Shaders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-[#0E1613] p-4 text-xs space-y-2">
                  <div className="font-bold text-[#FF9776] uppercase flex items-center gap-1.5">
                    <Activity className="h-4 w-4" />
                    <span>Motion & Physics Specifications</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Orchestrator: </span>
                    <span className="font-bold text-white">{selectedResearchStudy.motionSpecs.engine}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Easings: </span>
                    <span className="text-[#FFD800]">{selectedResearchStudy.motionSpecs.easings.join(', ')}</span>
                  </div>
                  {selectedResearchStudy.motionSpecs.physicsRule && (
                    <div className="text-zinc-300 font-sans">
                      <span className="text-zinc-400">Physics Rule: </span>
                      {selectedResearchStudy.motionSpecs.physicsRule}
                    </div>
                  )}
                </div>

                {selectedResearchStudy.shaderSpecs && (
                  <div className="rounded-xl border border-white/10 bg-[#0E1613] p-4 text-xs space-y-2">
                    <div className="font-bold text-[#00F5D4] uppercase flex items-center gap-1.5">
                      <Layers className="h-4 w-4" />
                      <span>WebGL & Shader Pipeline</span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Type: </span>
                      <span className="font-bold text-white">{selectedResearchStudy.shaderSpecs.type}</span>
                    </div>
                    <p className="text-zinc-300 font-sans">
                      {selectedResearchStudy.shaderSpecs.technique}
                    </p>
                  </div>
                )}
              </div>

              {/* Implementation Blueprints */}
              <div>
                <div className="text-xs font-bold uppercase text-[#22C55E] mb-2 flex items-center gap-1.5">
                  <Code2 className="h-4 w-4" />
                  <span>Blueprints from IMPLEMENTATION-PLAN.md & PROMPTS.md</span>
                </div>
                <div className="space-y-1.5">
                  {selectedResearchStudy.blueprintChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 rounded-lg bg-[#0E1613] px-3 py-2 text-xs text-zinc-300">
                      <span className="text-[#22C55E] font-bold">✔</span>
                      <span>{item}</span>
                    </div>
                  ))}
                  <div className="mt-2 rounded-lg bg-[#15201B] p-3 text-xs text-[#FFE866] border border-white/10">
                    <span className="font-bold text-white">Sample Verification Prompt: </span>
                    &gt; {selectedResearchStudy.samplePrompt}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Grid List View of Studies */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudies.map((study) => (
                <div
                  key={study.id}
                  onClick={() => selectResearchStudy(study)}
                  className="cursor-pointer rounded-xl border border-white/10 bg-[#0E1613] p-5 transition hover:border-[#00F5D4] hover:bg-[#15201B] group shadow-sm"
                >
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="font-bold text-[#FFD800] uppercase">
                      📁 {study.folderName}
                    </span>
                    <span className="rounded bg-white/10 px-1.5 py-0.5">
                      {study.category.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="mt-2 text-base font-black uppercase text-white group-hover:text-[#00F5D4] transition">
                    {study.title}
                  </h3>

                  <p className="mt-1 text-xs text-zinc-400 font-sans line-clamp-2">
                    {study.summary}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px]">
                    <span className="text-zinc-500 font-mono">
                      {study.motionSpecs.engine.split(' ')[0]}
                    </span>
                    <span className="font-bold text-[#00F5D4] flex items-center gap-1 group-hover:translate-x-1 transition">
                      Inspect Study <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#0E1613] px-6 py-3 text-xs text-zinc-400">
          <div>
            Showing <strong className="text-white">{filteredStudies.length}</strong> verified forensic research studies
          </div>
          <div>
            Press <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-white">ESC</kbd> to return to realm
          </div>
        </div>
      </div>
    </div>
  );
};
