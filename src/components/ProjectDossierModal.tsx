// src/components/ProjectDossierModal.tsx
import React, { useEffect } from 'react';
import { usePlayableWorldStore } from '../store/usePlayableWorldStore';
import { ExternalLink, Star, GitFork, Cpu, X, CheckCircle, Code2, Sparkles, BookOpen } from 'lucide-react';
import { GithubIcon } from './Icons';

export const ProjectDossierModal: React.FC = () => {
  const { openedProjectDossier, closeProjectDossier } = usePlayableWorldStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openedProjectDossier) {
        closeProjectDossier();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openedProjectDossier, closeProjectDossier]);

  if (!openedProjectDossier) return null;

  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl animate-in fade-in font-mono">
      <div className="flex h-full max-h-[88vh] w-full max-w-4xl flex-col rounded-2xl border-2 border-white/20 bg-[#121B17] text-[#F4F4ED] shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Dossier Header */}
        <div className="flex items-start justify-between border-b border-white/10 bg-[#0E1613] p-6">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase text-black"
                style={{ backgroundColor: openedProjectDossier.accentColor }}
              >
                PROJECT DOSSIER
              </span>
              <span className="text-xs text-zinc-400">
                {openedProjectDossier.sectorCode} // {openedProjectDossier.buildingTitle}
              </span>
            </div>

            <h2 className="mt-2 text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              {openedProjectDossier.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-300 max-w-2xl font-sans">
              {openedProjectDossier.tagline}
            </p>
          </div>

          <button
            onClick={closeProjectDossier}
            className="rounded-lg border border-white/20 bg-white/5 p-2 text-zinc-400 transition hover:bg-white hover:text-black"
            title="Close [ESC]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live GitHub Stats Strip */}
        <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-[#15201B] px-6 py-3 text-xs text-zinc-300">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-white">
              <Star className="h-4 w-4 text-[#FFD800]" />
              <span className="font-bold">{openedProjectDossier.githubStats?.stars ?? 0}</span>
              <span className="text-[10px] text-zinc-400">Stars</span>
            </div>
            <div className="flex items-center gap-1.5 text-white">
              <GitFork className="h-4 w-4 text-[#00F5D4]" />
              <span className="font-bold">{openedProjectDossier.githubStats?.forks ?? 0}</span>
              <span className="text-[10px] text-zinc-400">Forks</span>
            </div>
            <div className="flex items-center gap-1.5 text-white">
              <Cpu className="h-4 w-4 text-[#FF2A85]" />
              <span className="font-bold">{openedProjectDossier.githubStats?.language || 'Engine'}</span>
            </div>
          </div>

          <div className="text-[11px] text-zinc-400">
            Repo: <code className="text-[#00F5D4] font-bold">github.com/Shashankinfernape/{openedProjectDossier.repoName}</code>
          </div>
        </div>

        {/* Dossier Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Tech Stack Pills */}
          <div>
            <div className="text-xs uppercase font-bold text-zinc-400 mb-2">
              Technology Stack & Architecture
            </div>
            <div className="flex flex-wrap gap-2">
              {openedProjectDossier.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-200 font-bold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Architecture Insights / Dev-Log Notes */}
          <div>
            <div className="text-xs uppercase font-bold text-[#00F5D4] mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Engineering Notes & Architecture Decisions</span>
            </div>

            <div className="space-y-3">
              {openedProjectDossier.devLogThread.map((note) => (
                <div key={note.id} className="rounded-xl border border-white/10 bg-[#0E1613] p-4 text-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="font-bold text-white text-sm">{note.title}</span>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-[#FF9776]">
                      {note.flair}
                    </span>
                  </div>
                  <p className="mt-2 text-zinc-300 font-sans leading-relaxed text-sm">
                    {note.body}
                  </p>

                  {note.children && note.children.length > 0 && (
                    <div className="mt-3 border-l-2 border-[#00F5D4]/40 pl-3 space-y-2">
                      {note.children.map((child) => (
                        <div key={child.id}>
                          <span className="font-bold text-[#00F5D4]">{child.title}: </span>
                          <span className="text-zinc-300 font-sans">{child.body}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Footer Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#0E1613] p-5">
          <div className="text-xs text-zinc-400">
            Press <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-white">ESC</kbd> to return to exploring the realm
          </div>

          <div className="flex items-center gap-3">
            <a
              href={openedProjectDossier.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-black uppercase text-black transition hover:bg-[#00F5D4] shadow-md"
            >
              <GithubIcon className="h-4 w-4" />
              <span>Inspect Source Repo</span>
            </a>

            {openedProjectDossier.liveUrl && (
              <a
                href={openedProjectDossier.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold uppercase text-white transition hover:bg-white/20"
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
