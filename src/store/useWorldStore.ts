// src/store/useWorldStore.ts
import { create } from 'zustand';
import { PORTFOLIO_PROJECTS, PortfolioProject, GitHubStats } from '../config/projects.config';

export type CameraMode = 'SPLINE_WALKTHROUGH' | 'CLASH_ISOMETRIC_BASE' | 'DROP_STORE_PEDESTAL';

interface WorldState {
  cameraMode: CameraMode;
  scrollProgress: number;       // Normalized 0.0 -> 1.0 along CatmullRomCurve3
  scrollVelocity: number;       // Used for Lando Norris km/h HUD & chromatic aberration
  activeSectorIndex: number;
  selectedProject: PortfolioProject | null;
  isXRayReverseMode: boolean;   // "The Other Side of Truth" wireframe/shader debug toggle
  isLidarMode: boolean;         // "Into the Amazon" point-cloud terrain toggle
  isAudioMuted: boolean;
  projects: PortfolioProject[];
  isLoaded: boolean;
  footerShapeTarget: 'GALAXY' | 'GITHUB' | 'LINKEDIN' | 'RESUME';
  
  // Actions
  setCameraMode: (mode: CameraMode) => void;
  setScrollData: (progress: number, velocity: number) => void;
  selectProject: (project: PortfolioProject | null) => void;
  jumpToSector: (index: number) => void;
  toggleXRayMode: () => void;
  toggleLidarMode: () => void;
  toggleAudio: () => void;
  setIsLoaded: (loaded: boolean) => void;
  setFooterShapeTarget: (target: 'GALAXY' | 'GITHUB' | 'LINKEDIN' | 'RESUME') => void;
  updateProjectGitHubStats: (repoName: string, stats: GitHubStats) => void;
  setProjects: (projects: PortfolioProject[]) => void;
}

export const useWorldStore = create<WorldState>((set, get) => ({
  cameraMode: 'SPLINE_WALKTHROUGH',
  scrollProgress: 0,
  scrollVelocity: 0,
  activeSectorIndex: 0,
  selectedProject: null,
  isXRayReverseMode: false,
  isLidarMode: true,
  isAudioMuted: false,
  projects: PORTFOLIO_PROJECTS,
  isLoaded: false,
  footerShapeTarget: 'GALAXY',

  setCameraMode: (cameraMode) =>
    set((state) => ({
      cameraMode,
      selectedProject: cameraMode === 'DROP_STORE_PEDESTAL' ? state.selectedProject : null,
    })),

  setScrollData: (scrollProgress, scrollVelocity) => {
    const projectsList = get().projects;
    const total = projectsList.length;
    // Map progress smoothly across sectors
    const activeSectorIndex = Math.min(
      total - 1,
      Math.max(0, Math.floor(scrollProgress * total))
    );
    set({ scrollProgress, scrollVelocity, activeSectorIndex });
  },

  selectProject: (project) =>
    set({
      selectedProject: project,
      cameraMode: project ? 'DROP_STORE_PEDESTAL' : 'SPLINE_WALKTHROUGH',
    }),

  jumpToSector: (index) => {
    const projectsList = get().projects;
    const progress = Math.max(0, Math.min(1, index / Math.max(1, projectsList.length - 1)));
    set({
      activeSectorIndex: index,
      scrollProgress: progress,
      cameraMode: 'SPLINE_WALKTHROUGH',
      selectedProject: null,
    });
  },

  toggleXRayMode: () => set((s) => ({ isXRayReverseMode: !s.isXRayReverseMode })),

  toggleLidarMode: () => set((s) => ({ isLidarMode: !s.isLidarMode })),

  toggleAudio: () => set((s) => ({ isAudioMuted: !s.isAudioMuted })),

  setIsLoaded: (isLoaded) => set({ isLoaded }),

  setFooterShapeTarget: (footerShapeTarget) => set({ footerShapeTarget }),

  updateProjectGitHubStats: (repoName, stats) =>
    set((state) => ({
      projects: state.projects.map((p) => {
        if (p.repoName.toLowerCase() === repoName.toLowerCase()) {
          return {
            ...p,
            githubStats: {
              ...(p.githubStats || { stars: 0, forks: 0 }),
              ...stats,
            },
          };
        }
        return p;
      }),
      selectedProject:
        state.selectedProject?.repoName.toLowerCase() === repoName.toLowerCase()
          ? {
              ...state.selectedProject,
              githubStats: {
                ...(state.selectedProject.githubStats || { stars: 0, forks: 0 }),
                ...stats,
              },
            }
          : state.selectedProject,
    })),

  setProjects: (projects) => set({ projects }),
}));
