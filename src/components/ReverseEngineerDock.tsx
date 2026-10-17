// src/components/ReverseEngineerDock.tsx
import React, { useState } from 'react';
import { useWorldStore } from '../store/useWorldStore';
import { SHASHANK_PROFILE } from '../config/projects.config';
import { REVERSE_ENGINEERED_TEMPLATES, EngineeringTemplate } from '../config/templates.config';
import { Terminal, FileText, Code2, Sparkles, X, ChevronRight, Activity, Layers, Palette, Play } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

export const ReverseEngineerDock: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<EngineeringTemplate | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'GAME_APP' | 'INTERACTIVE_WEB' | 'WEB_ARCHITECTURE'>('ALL');
  const { setFooterShapeTarget, scrollProgress, toggleXRayMode, isXRayReverseMode } = useWorldStore();

  const isAtEnd = scrollProgress > 0.88;

  const filteredTemplates = activeCategory === 'ALL'
    ? REVERSE_ENGINEERED_TEMPLATES
    : REVERSE_ENGINEERED_TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <>
      {/* Floating Bottom-Right Dock */}
      <div className="pointer-events-auto fixed bottom-5 right-5 z-30 flex flex-col items-end gap-2 font-mono">
        {/* Contact, Social, and Template Lab Launchers */}
        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/90 p-1.5 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.85)]">
          {/* GitHub Social Pill */}
          <a
            href={SHASHANK_PROFILE.github}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setFooterShapeTarget('GITHUB')}
            onMouseLeave={() => setFooterShapeTarget('GALAXY')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#00F5D4] hover:text-black"
            title="GitHub (@Shashankinfernape) - Morphs 3D Particle Footer to Octocat"
          >
            <GithubIcon className="h-4 w-4" />
          </a>

          {/* LinkedIn Social Pill */}
          <a
            href={SHASHANK_PROFILE.linkedin}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setFooterShapeTarget('LINKEDIN')}
            onMouseLeave={() => setFooterShapeTarget('GALAXY')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#00F5D4] hover:text-black"
            title="LinkedIn - Morphs 3D Particle Footer to LinkedIn Badge"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>

          {/* Resume PDF Pill */}
          <a
            href={SHASHANK_PROFILE.resumeUrl}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setFooterShapeTarget('RESUME')}
            onMouseLeave={() => setFooterShapeTarget('GALAXY')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#FFD800] hover:text-black"
            title="Resume PDF - Morphs 3D Particle Footer to Blueprint Document"
          >
            <FileText className="h-4 w-4" />
          </a>

          {/* 17 Reverse-Engineered Templates Master Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-black transition ${
              isOpen
                ? 'bg-gradient-to-r from-[#FFD12E] to-[#FF5500] text-black shadow-[0_0_15px_rgba(255,209,46,0.8)]'
                : 'bg-white/10 text-[#00F5D4] hover:bg-[#00F5D4] hover:text-black'
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>17 REPO TEMPLATES ({REVERSE_ENGINEERED_TEMPLATES.length})</span>
          </button>
        </div>

        {/* Terminus Particle Morphing Notification */}
        {isAtEnd && (
          <div className="rounded border border-[#FF2A85] bg-black/90 px-3 py-1 text-[10px] text-[#FF2A85] animate-pulse">
            TERMINUS REACHED // MORPHING PARTICLE FOOTER ACTIVE
          </div>
        )}
      </div>

      {/* 17 REPO TEMPLATES & MOTION GRAPHICS SUITE MODAL */}
      {isOpen && (
        <div className="pointer-events-auto fixed inset-0 z-40 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl animate-in fade-in">
          <div className="flex h-full max-h-[90vh] w-full max-w-6xl flex-col border-3 border-black bg-[#10131F] shadow-[14px_14px_0px_#00F5D4] font-mono text-white overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-[#353B5A] bg-[#0A0C14] p-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#00F5D4] px-2.5 py-0.5 text-[10px] font-black uppercase text-black">
                    REVERSE-ENGINEERED REPO SUITE
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    17 PRODUCTION TEMPLATES & ANALYSIS PACKAGES
                  </span>
                </div>
                <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">
                  Motion Graphics & UI Engineering Laboratory
                </h2>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md border-2 border-black bg-[#FF2A2A] px-3.5 py-1.5 text-xs font-black uppercase text-white shadow-[0_3px_0_#990000] transition active:translate-y-1 active:shadow-none hover:brightness-110"
              >
                CLOSE ✕
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex border-b border-[#353B5A] bg-[#161B2E] px-5 py-2 text-xs">
              {[
                { id: 'ALL', label: 'ALL 17 TEMPLATES' },
                { id: 'GAME_APP', label: '1. GAMES & APPS (6)' },
                { id: 'INTERACTIVE_WEB', label: '2. INTERACTIVE & WEB (8)' },
                { id: 'WEB_ARCHITECTURE', label: '3. ARCHITECTURE & SHADERS (3)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-3 py-1.5 font-bold transition mr-2 rounded-t ${
                    activeCategory === tab.id
                      ? 'bg-[#00F5D4] text-black shadow-sm font-black'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Main Modal Body: Split Grid (Template List + Deep Forensic Inspector) */}
            <div className="grid flex-1 grid-cols-1 md:grid-cols-12 overflow-hidden">
              {/* Left Column: Template Cards List */}
              <div className="col-span-12 md:col-span-5 overflow-y-auto border-r border-[#353B5A] p-4 space-y-3 bg-[#0D101A]">
                {filteredTemplates.map((item) => {
                  const isSelected = selectedTemplate?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedTemplate(item)}
                      className={`cursor-pointer border-2 p-3.5 transition-all rounded-sm ${
                        isSelected
                          ? 'border-[#00F5D4] bg-[#23273D] shadow-[4px_4px_0px_#00F5D4]'
                          : 'border-[#353B5A] bg-[#161B2E]/60 hover:border-white/40 hover:bg-[#161B2E]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-[#FFD12E] uppercase">
                          📂 {item.folderName}
                        </span>
                        <span className="rounded bg-black/40 px-1.5 py-0.5 text-zinc-400">
                          {item.category.replace('_', ' ')}
                        </span>
                      </div>

                      <h3 className="mt-1 text-sm font-black text-white uppercase">
                        {item.title}
                      </h3>

                      <p className="mt-0.5 text-[11px] text-zinc-400 line-clamp-2">
                        {item.subtitle}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-zinc-400">
                        <span className="text-[#00F5D4] font-bold">
                          {item.motion.engine.split(' ')[0]}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-white">
                          INSPECT FORENSICS <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Deep Forensic Inspector */}
              <div className="col-span-12 md:col-span-7 overflow-y-auto p-6 bg-[#10131F]">
                {selectedTemplate ? (
                  <div className="space-y-6 animate-in fade-in">
                    {/* Header */}
                    <div className="border-b border-[#353B5A] pb-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[#FF5500] px-2 py-0.5 text-[10px] font-black uppercase text-black">
                          {selectedTemplate.category.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-zinc-400">
                          Repo Directory: <code className="text-[#00F5D4]">Git-repos/{selectedTemplate.folderName}/</code>
                        </span>
                      </div>

                      <h2 className="mt-2 text-2xl font-black text-white uppercase">
                        {selectedTemplate.title}
                      </h2>
                      <p className="text-xs text-[#FFD12E] font-bold mt-0.5">
                        {selectedTemplate.subtitle}
                      </p>
                      <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                        {selectedTemplate.description}
                      </p>
                    </div>

                    {/* Section 1: Color Tokens & Swatches */}
                    <div>
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-[#00F5D4] mb-3">
                        <Palette className="h-4 w-4" />
                        <span>Extracted Design Tokens & Palette</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.entries(selectedTemplate.tokens.palette).map(([name, hex]) => (
                          <div
                            key={name}
                            className="flex items-center gap-2 rounded border border-[#353B5A] bg-[#161B2E] p-2 text-xs"
                          >
                            <div
                              className="h-5 w-5 rounded-sm border border-black shadow-inner shrink-0"
                              style={{ backgroundColor: hex.startsWith('linear') ? undefined : hex, backgroundImage: hex.startsWith('linear') ? hex : undefined }}
                            />
                            <div className="truncate">
                              <div className="text-[10px] text-zinc-400 truncate">{name}</div>
                              <div className="text-[10px] font-bold text-white truncate">{hex}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Typography & Outline Effects */}
                      <div className="mt-3 rounded bg-black/40 p-3 border border-[#353B5A] text-xs space-y-1">
                        <div>
                          <span className="text-zinc-400">Heading Typeface: </span>
                          <span className="font-bold text-white">{selectedTemplate.tokens.typography.heading}</span>
                        </div>
                        {selectedTemplate.tokens.typography.effects && (
                          <div>
                            <span className="text-zinc-400">Text Outline Shadow: </span>
                            <code className="text-[#FFD12E] text-[10px]">{selectedTemplate.tokens.typography.effects}</code>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section 2: Motion Graphics & Physics Engine */}
                    <div>
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-[#FF5500] mb-3">
                        <Activity className="h-4 w-4" />
                        <span>Motion Graphics, Physics & Timelines</span>
                      </div>

                      <div className="rounded border border-[#353B5A] bg-[#161B2E] p-4 text-xs space-y-2">
                        <div>
                          <span className="text-zinc-400">Orchestrator: </span>
                          <span className="font-bold text-white">{selectedTemplate.motion.engine}</span>
                        </div>
                        {selectedTemplate.motion.physicsModel && (
                          <div>
                            <span className="text-zinc-400">Physics Model: </span>
                            <span className="text-[#00F5D4] font-bold">{selectedTemplate.motion.physicsModel}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-zinc-400">Signature Curves: </span>
                          <span className="text-[#FFD12E]">{selectedTemplate.motion.easings.join(', ')}</span>
                        </div>
                        <div className="border-t border-[#353B5A] pt-2 text-zinc-300 text-[11px] leading-relaxed">
                          <span className="font-bold text-white">Choreography: </span>
                          {selectedTemplate.motion.keyChoreography}
                        </div>
                      </div>
                    </div>

                    {/* Section 3: WebGL & GLSL Shaders (if present) */}
                    {selectedTemplate.shaders && (
                      <div>
                        <div className="flex items-center gap-2 text-xs font-black uppercase text-[#20FBFF] mb-3">
                          <Layers className="h-4 w-4" />
                          <span>WebGL Pipeline & GLSL Shaders</span>
                        </div>

                        <div className="rounded border border-[#353B5A] bg-[#161B2E] p-4 text-xs space-y-2">
                          <div>
                            <span className="text-zinc-400">Shader Material: </span>
                            <span className="font-bold text-white">{selectedTemplate.shaders.type} ({selectedTemplate.shaders.precision})</span>
                          </div>
                          <div>
                            <span className="text-zinc-400">Uniforms: </span>
                            <code className="text-[#20FBFF] text-[10px]">{selectedTemplate.shaders.uniforms.join(', ')}</code>
                          </div>
                          <p className="text-[11px] text-zinc-300">
                            {selectedTemplate.shaders.technique}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Section 4: Blueprints & Prompts */}
                    <div>
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-[#68E524] mb-3">
                        <Code2 className="h-4 w-4" />
                        <span>Implementation Blueprints & Verification Prompts</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        {selectedTemplate.blueprintSummary.map((bp, i) => (
                          <div key={i} className="flex items-start gap-2 rounded bg-black/30 p-2.5 border border-[#353B5A]">
                            <span className="text-[#68E524] font-bold">✔</span>
                            <span className="text-zinc-300">{bp}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3">
                        <div className="text-[10px] text-zinc-400 uppercase font-bold mb-1">
                          PROMPTS.md Execution Directive:
                        </div>
                        {selectedTemplate.prompts.map((p, i) => (
                          <div key={i} className="rounded bg-[#23273D] p-2 text-[11px] text-[#FFD12E] border border-black font-mono mb-1">
                            &gt; {p}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center p-8 text-zinc-500">
                    <Terminal className="h-12 w-12 text-zinc-700 mb-3" />
                    <h3 className="text-base font-bold text-zinc-400 uppercase">
                      Select Any of the 17 Templates to Inspect Forensics
                    </h3>
                    <p className="text-xs max-w-sm mt-1 text-zinc-600">
                      Explore extracted color gradients, Lilita One typography rules, GLSL shaders, and Newtonian physics pipelines directly from the local Git repos.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
