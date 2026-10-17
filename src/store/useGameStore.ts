// src/store/useGameStore.ts
import { create } from 'zustand';
import { PORTFOLIO_PROJECTS, PortfolioProject } from '../config/projects.config';
import { RESEARCH_STUDIES, ResearchStudy } from '../config/research.config';

export type VehicleMode = 'ON_FOOT' | 'BICYCLE' | 'DRIFT_CAR';
export type CameraMode = 'THIRD_PERSON_FOLLOW' | 'ISOMETRIC_CLASH' | 'THEATRE_FOCUS' | 'FREE_CAM';

interface GameState {
  // Locomotion & Telemetry
  vehicleMode: VehicleMode;
  playerPosition: [number, number, number];
  playerSpeedKmh: number;
  playerHeading: number;
  gear: number | string;
  headlights: boolean;
  warpTargetPosition: [number, number, number] | null;

  // In-Game Guide NPC (Shashank S)
  guidePosition: [number, number, number];
  isFollowingGuide: boolean;
  activeTheatreIndex: number;
  guideSpeechAudioPlaying: boolean;

  // Camera & Visual Inspection
  cameraMode: CameraMode;
  isXRayMode: boolean;
  isAudioMuted: boolean;

  // Selected Project & UI Overlays
  selectedProject: PortfolioProject | null;
  selectedResearchStudy: ResearchStudy | null;
  isResearchArchiveOpen: boolean;
  isRecruiterDrawerOpen: boolean;
  isIsometricMapOpen: boolean;

  // BVH Collision
  worldBvh: any | null; // MeshBVH
  setWorldBvh: (bvh: any | null) => void;

  // Messenger Wardrobe Customizer
  wardrobe: {
    hairColor: string;
    jacketColor: string;
    pantsColor: string;
    sneakersColor: string;
    capColor: string;
  };
  isWardrobeOpen: boolean;
  setIsWardrobeOpen: (open: boolean) => void;
  toggleWardrobe: () => void;
  setWardrobeColor: (slot: 'hairColor' | 'jacketColor' | 'pantsColor' | 'sneakersColor' | 'capColor', color: string) => void;

  // Floating Emoji Reaction System
  activeEmojis: { id: number; emoji: string; createdAt: number }[];
  spawnEmoji: (emoji: string) => void;
  removeEmoji: (id: number) => void;

  // Actions
  setVehicleMode: (mode: VehicleMode) => void;
  cycleVehicleMode: () => void;
  setPlayerTelemetry: (pos: [number, number, number], speedKmh: number, heading?: number) => void;
  setActiveTheatreIndex: (index: number) => void;
  advanceToNextTheatre: () => void;
  setGuidePosition: (pos: [number, number, number]) => void;
  toggleFollowGuide: () => void;
  setFollowingGuide: (follow: boolean) => void;
  selectProject: (project: PortfolioProject | null) => void;
  closeProject: () => void;
  selectResearchStudy: (study: ResearchStudy | null) => void;
  closeResearchStudy: () => void;
  setResearchArchiveOpen: (open: boolean) => void;
  setRecruiterDrawerOpen: (open: boolean) => void;
  setIsometricMapOpen: (open: boolean) => void;
  toggleIsometricMap: () => void;
  setCameraMode: (mode: CameraMode) => void;
  toggleHeadlights: () => void;
  toggleXRayMode: () => void;
  toggleAudio: () => void;
  setGuideSpeechAudioPlaying: (playing: boolean) => void;
  warpToLocation: (pos: [number, number, number]) => void;
  clearWarpTarget: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Vehicle & Locomotion (Spawn on paved road facing circuit)
  vehicleMode: 'DRIFT_CAR', // default to car for exhilarating entry
  playerPosition: [0, 0, 10],
  playerSpeedKmh: 0,
  playerHeading: Math.PI,
  gear: '1',
  headlights: true,
  warpTargetPosition: null,

  // Shashank Guide NPC (Stands at Spawn Plaza initially)
  guidePosition: [-3.5, 0, 8],
  isFollowingGuide: false,
  activeTheatreIndex: -1,
  guideSpeechAudioPlaying: false,

  // Camera & Shaders
  cameraMode: 'THIRD_PERSON_FOLLOW',
  isXRayMode: false,
  isAudioMuted: false,

  // Modals & Drawers
  selectedProject: null,
  selectedResearchStudy: null,
  isResearchArchiveOpen: false,
  isRecruiterDrawerOpen: false,
  isIsometricMapOpen: false,

  // BVH Collision
  worldBvh: null,
  setWorldBvh: (bvh) => set({ worldBvh: bvh }),

  // Messenger Wardrobe
  wardrobe: {
    hairColor: '#18181B',
    jacketColor: '#00F5D4',
    pantsColor: '#27272A',
    sneakersColor: '#FFFFFF',
    capColor: '#FF5500',
  },
  isWardrobeOpen: false,
  setIsWardrobeOpen: (open) => set({ isWardrobeOpen: open }),
  toggleWardrobe: () => set((s) => ({ isWardrobeOpen: !s.isWardrobeOpen })),
  setWardrobeColor: (slot, color) =>
    set((s) => ({
      wardrobe: { ...s.wardrobe, [slot]: color },
    })),

  // Floating Emoji Reaction System
  activeEmojis: [],
  spawnEmoji: (emoji) => {
    const newEntry = {
      id: Date.now() + Math.random(),
      emoji,
      createdAt: Date.now(),
    };
    set((s) => ({ activeEmojis: [...s.activeEmojis.slice(-8), newEntry] }));
  },
  removeEmoji: (id) =>
    set((s) => ({ activeEmojis: s.activeEmojis.filter((e) => e.id !== id) })),

  setVehicleMode: (mode) => set({ vehicleMode: mode }),

  cycleVehicleMode: () => {
    const modes: VehicleMode[] = ['ON_FOOT', 'BICYCLE', 'DRIFT_CAR'];
    const currentIdx = modes.indexOf(get().vehicleMode);
    const nextMode = modes[(currentIdx + 1) % modes.length];
    set({ vehicleMode: nextMode });
  },

  setPlayerTelemetry: (pos, speedKmh, heading) => {
    // Calculate realistic gear for car HUD
    let gear: number | string = 'N';
    if (get().vehicleMode === 'DRIFT_CAR') {
      if (speedKmh < 1) gear = 'N';
      else if (speedKmh < 25) gear = 1;
      else if (speedKmh < 50) gear = 2;
      else if (speedKmh < 75) gear = 3;
      else if (speedKmh < 100) gear = 4;
      else if (speedKmh < 125) gear = 5;
      else gear = 6;
    } else if (get().vehicleMode === 'BICYCLE') {
      gear = speedKmh > 1 ? Math.min(7, Math.max(1, Math.ceil(speedKmh / 5))) : '1';
    } else {
      gear = speedKmh > 1 ? 'RUN' : 'WALK';
    }

    set({
      playerPosition: pos,
      playerSpeedKmh: speedKmh,
      playerHeading: heading !== undefined ? heading : get().playerHeading,
      gear,
    });
  },

  setActiveTheatreIndex: (index) => set({ activeTheatreIndex: index }),

  advanceToNextTheatre: () => {
    const nextIdx = (get().activeTheatreIndex + 1) % PORTFOLIO_PROJECTS.length;
    set({ activeTheatreIndex: nextIdx, isFollowingGuide: true });
  },

  setGuidePosition: (pos) => set({ guidePosition: pos }),

  toggleFollowGuide: () => set((s) => ({ isFollowingGuide: !s.isFollowingGuide })),

  setFollowingGuide: (follow) => set({ isFollowingGuide: follow }),

  selectProject: (project) => set({ selectedProject: project }),

  closeProject: () => set({ selectedProject: null }),

  selectResearchStudy: (study) => set({ selectedResearchStudy: study }),

  closeResearchStudy: () => set({ selectedResearchStudy: null }),

  setResearchArchiveOpen: (open) => set({ isResearchArchiveOpen: open }),

  setRecruiterDrawerOpen: (open) => set({ isRecruiterDrawerOpen: open }),

  setIsometricMapOpen: (open) => {
    set({
      isIsometricMapOpen: open,
      cameraMode: open ? 'ISOMETRIC_CLASH' : 'THIRD_PERSON_FOLLOW',
    });
  },

  toggleIsometricMap: () => {
    const next = !get().isIsometricMapOpen;
    set({
      isIsometricMapOpen: next,
      cameraMode: next ? 'ISOMETRIC_CLASH' : 'THIRD_PERSON_FOLLOW',
    });
  },

  setCameraMode: (mode) => set({ cameraMode: mode }),

  toggleHeadlights: () => set((s) => ({ headlights: !s.headlights })),

  toggleXRayMode: () => set((s) => ({ isXRayMode: !s.isXRayMode })),

  toggleAudio: () => set((s) => ({ isAudioMuted: !s.isAudioMuted })),

  setGuideSpeechAudioPlaying: (playing) => set({ guideSpeechAudioPlaying: playing }),

  warpToLocation: (pos) => set({ warpTargetPosition: pos }),

  clearWarpTarget: () => set({ warpTargetPosition: null }),
}));
