import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { SHASHANK_PROFILE, PORTFOLIO_PROJECTS, PortfolioProject } from '../config/projects.config';
import { RESEARCH_STUDIES, ResearchStudy } from '../config/research.config';
import {
  X,
  FileText,
  ExternalLink,
  Star,
  GitFork,
  BookOpen,
  Award,
  GraduationCap,
  Layers,
  Sparkles,
  ChevronRight,
  Mail,
  MapPin,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

export const RecruiterFastDrawer: React.FC = () => {
  const {
    isRecruiterDrawerOpen,
    setRecruiterDrawerOpen,
    selectProject,
    selectResearchStudy,
    warpToLocation,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'RESEARCH' | 'CREDENTIALS'>('PROJECTS');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isRecruiterDrawerOpen) {
        setRecruiterDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRecruiterDrawerOpen, setRecruiterDrawerOpen]);

  if (!isRecruiterDrawerOpen) return null;

  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-md animate-in fade-in font-mono select-none">
      <div className="flex h-full w-full max-w-3xl flex-col border-l-2 border-white/20 bg-[#101915] text-[#F4F4ED] shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header Strip */}
        <div className="border-b border-white/10 bg-[#0A120E] p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#00F5D4] px-2.5 py-0.5 text-[10px] font-black uppercase text-black">
                  RECRUITER 60S FAST-PATH
                </span>
                <span className="text-xs text-zinc-400">SHASHANK S // CANDIDATE DOSSIER</span>
              </div>
              <h2 className="mt-2 text-2xl font-black uppercase text-white tracking-tight">
                {SHASHANK_PROFILE.name}{' '}
                <span className="text-sm font-normal text-[#00F5D4]">{SHASHANK_PROFILE.handle}</span>
              </h2>
              <p className="text-xs text-zinc-300 font-sans mt-0.5">
                {SHASHANK_PROFILE.role} · {SHASHANK_PROFILE.education}
              </p>
            </div>

            <button
              onClick={() => setRecruiterDrawerOpen(false)}
              className="rounded-lg border border-white/20 bg-white/5 p-2 text-zinc-400 hover:bg-white hover:text-black transition"
              title="Close Drawer [ESC]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Action Badges */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <a
              href={SHASHANK_PROFILE.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-[#FFE600] px-3 py-1.5 text-xs font-black uppercase text-black transition hover:bg-[#fff066] shadow-sm"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Resume PDF</span>
            </a>

            <a
              href={SHASHANK_PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase text-white transition hover:bg-white hover:text-black"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>

            <a
              href={SHASHANK_PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase text-white transition hover:bg-[#0077B5] hover:border-[#0077B5]"
            >
              <LinkedinIcon className="h-3.5 w-3.5" />
              <span>LinkedIn</span>
            </a>

            <a
              href={`mailto:${SHASHANK_PROFILE.email}`}
              className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase text-white transition hover:bg-white hover:text-black"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Email</span>
            </a>

            <button
              onClick={() => {
                warpToLocation([0, 0, -5]);
                setRecruiterDrawerOpen(false);
              }}
              className="flex items-center gap-1 rounded-lg border border-[#FF5500]/50 bg-[#FF5500]/20 px-2.5 py-1.5 text-xs font-bold uppercase text-[#FF9776] hover:bg-[#FF5500] hover:text-black transition"
              title="Teleport to Shashank in 3D Realm"
            >
              <Flame className="h-3.5 w-3.5" />
              <span>Meet in 3D</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 bg-[#0E1612] px-6 text-xs">
          {[
            { id: 'PROJECTS', label: '7 Production Projects' },
            { id: 'RESEARCH', label: '17 Reverse-Engineering Studies' },
            { id: 'CREDENTIALS', label: 'Education & Certifications' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`border-b-2 py-3 px-3 font-bold uppercase tracking-wider transition ${
                activeTab === tab.id
                  ? 'border-[#00F5D4] text-[#00F5D4]'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: 7 PRODUCTION PROJECTS */}
          {activeTab === 'PROJECTS' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-300 font-sans">
                Real, production-grade applications engineered by Shashank. Click any project to inspect the full architecture dossier or view source repositories directly.
              </p>

              {PORTFOLIO_PROJECTS.map((project) => (
                <div
                  key={project.id}
                  className="rounded-xl border border-white/10 bg-[#0B130F] p-4 transition hover:border-[#00F5D4]/60 hover:bg-[#121B17]"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded px-2 py-0.5 text-[10px] font-black uppercase text-black"
                        style={{ backgroundColor: project.accentColor }}
                      >
                        {project.sectorCode}
                      </span>
                      <h3 className="font-black text-white text-base uppercase">
                        {project.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
                      <span className="flex items-center gap-1 text-white">
                        <Star className="h-3 w-3 text-[#FFD800]" /> {project.githubStats?.stars ?? 0}
                      </span>
                      <span className="flex items-center gap-1 text-white">
                        <GitFork className="h-3 w-3 text-[#00F5D4]" /> {project.githubStats?.forks ?? 0}
                      </span>
                    </div>
                  </div>

                  <p className="mt-1.5 text-xs text-zinc-300 font-sans leading-relaxed">
                    {project.tagline}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                    <button
                      onClick={() => {
                        selectProject(project);
                        setRecruiterDrawerOpen(false);
                      }}
                      className="flex items-center gap-1 font-bold text-[#00F5D4] hover:underline"
                    >
                      <span>Read Engineering Dossier</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-white hover:text-black transition"
                      >
                        <GithubIcon className="h-3 w-3" />
                        <span>Source</span>
                      </a>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 rounded bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#00F5D4] hover:text-black transition"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: 17 REVERSE-ENGINEERING STUDIES */}
          {activeTab === 'RESEARCH' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-300 font-sans">
                Forensic architectural deconstructions from local project templates in <code className="text-[#00F5D4]">Git-repos/</code>. Each study analyzes state architecture, motion curves, shaders, design tokens, and engineering plans.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {RESEARCH_STUDIES.map((study) => (
                  <div
                    key={study.id}
                    onClick={() => {
                      selectResearchStudy(study);
                      setRecruiterDrawerOpen(false);
                    }}
                    className="cursor-pointer rounded-xl border border-white/10 bg-[#0B130F] p-4 transition hover:border-[#FFD800] hover:bg-[#121B17]"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#FFD800]">📁 {study.folderName}</span>
                      <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-zinc-400">
                        {study.category.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="mt-1 font-bold text-white uppercase text-sm">
                      {study.title}
                    </h4>
                    <p className="mt-1 text-xs text-zinc-300 font-sans line-clamp-2">
                      {study.summary}
                    </p>

                    <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[11px]">
                      <span className="text-zinc-400">
                        Target: <strong className="text-white">{study.targetAppOrSite}</strong>
                      </span>
                      <span className="font-bold text-[#00F5D4] flex items-center gap-1">
                        View Forensic Blueprint <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CREDENTIALS, EDUCATION & SKILLS */}
          {activeTab === 'CREDENTIALS' && (
            <div className="space-y-6">
              {/* Education */}
              <div className="rounded-xl border border-white/10 bg-[#0B130F] p-5">
                <div className="flex items-center gap-2 text-[#00F5D4] font-bold uppercase text-xs">
                  <GraduationCap className="h-4 w-4" />
                  <span>Formal Education</span>
                </div>
                <h4 className="mt-2 text-base font-bold text-white">
                  Bachelor of Engineering (B.E.) in Computer Science & Engineering
                </h4>
                <div className="text-xs text-zinc-400 mt-0.5">
                  Priyadarshini Engineering College · Anna University, Chennai (2023 – 2027)
                </div>
                <p className="mt-2 text-xs text-zinc-300 font-sans leading-relaxed">
                  Focus on Operating Systems, Distributed Systems, Data Structures & Algorithms, Network Protocols, and Compiler Design. Active creator of campus syllabus tooling (Examinar).
                </p>
              </div>

              {/* Verified Certifications */}
              <div className="rounded-xl border border-white/10 bg-[#0B130F] p-5">
                <div className="flex items-center gap-2 text-[#FFD800] font-bold uppercase text-xs">
                  <Award className="h-4 w-4" />
                  <span>Certifications & Industry Credentials</span>
                </div>
                <div className="mt-3 space-y-2.5">
                  {SHASHANK_PROFILE.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0 mt-0.5" />
                      <span className="text-zinc-200 font-sans">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Skill Matrix */}
              <div className="rounded-xl border border-white/10 bg-[#0B130F] p-5">
                <div className="flex items-center gap-2 text-[#FF9776] font-bold uppercase text-xs mb-3">
                  <Layers className="h-4 w-4" />
                  <span>Technical Proficiencies</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-white">Languages: </span>
                    <span className="text-zinc-300">
                      Python, Dart, TypeScript, JavaScript, SQL, C++, HTML5/CSS3
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-white">Frontend & 3D: </span>
                    <span className="text-zinc-300">
                      Flutter, React, Three.js, React Three Fiber (R3F), GLSL Shaders, Tailwind CSS, GSAP
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-white">Backend & Databases: </span>
                    <span className="text-zinc-300">
                      Node.js, Express.js, FastAPI, MongoDB Atlas (Geospatial $geoWithin), Isar NoSQL, Firebase, REST/WebSockets
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-white">AI & Machine Learning: </span>
                    <span className="text-zinc-300">
                      PyTorch, Qwen2.5-7B, F5-TTS, MediaPipe, OpenCV, Scikit-Learn, BERT Transformers, Hugging Face
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-white">DevOps & Cloud: </span>
                    <span className="text-zinc-300">
                      Docker, Git, Render, Vercel, Google Cloud Platform (GCP), Oracle Cloud (OCI)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#0A120E] p-4 text-xs text-zinc-400">
          <div>Press <kbd className="rounded border border-white/20 bg-white/10 px-1 py-0.5 text-white">ESC</kbd> to return</div>
          <div className="flex items-center gap-2">
            <a
              href={SHASHANK_PROFILE.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#00F5D4] font-bold hover:underline"
            >
              Download Full Resume PDF →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
