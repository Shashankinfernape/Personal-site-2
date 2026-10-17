// src/store/usePlayableWorldStore.ts
import { create } from 'zustand';
import { WORLD_CHARACTERS, WorldCharacter } from '../config/characters.config';
import { WORLD_DISTRICTS, WorldDistrict } from '../config/world.config';
import { PORTFOLIO_PROJECTS, PortfolioProject } from '../config/projects.config';
import { RESEARCH_STUDIES, ResearchStudy } from '../config/research.config';

interface ActiveDialogueState {
  character: WorldCharacter;
  currentNodeIndex: number;
}

interface PlayableWorldState {
  // Player Locomotion
  playerPosition: [number, number, number];
  playerTargetPosition: [number, number, number] | null;
  playerRotationY: number;
  isMoving: boolean;
  isSprinting: boolean;

  // World Context
  activeDistrict: WorldDistrict;
  nearbyNpc: WorldCharacter | null;

  // Modals & Dialogue Overlays
  activeDialogue: ActiveDialogueState | null;
  openedProjectDossier: PortfolioProject | null;
  openedResearchStudy: ResearchStudy | null;
  isResearchArchiveOpen: boolean;
  isRecruiterDrawerOpen: boolean;
  isTeleportMapOpen: boolean;

  // Settings & Accessibility
  isStorybook2DMode: boolean;
  isAudioMuted: boolean;
  controlsHintDismissed: boolean;

  // Actions
  updatePlayerMovement: (pos: [number, number, number], rotY: number, moving: boolean, sprinting?: boolean) => void;
  setPlayerTargetPosition: (pos: [number, number, number] | null) => void;
  startDialogue: (character: WorldCharacter) => void;
  advanceDialogue: () => void;
  closeDialogue: () => void;
  openProjectDossierById: (id: string) => void;
  openProjectDossier: (project: PortfolioProject) => void;
  closeProjectDossier: () => void;
  openResearchStudyById: (id: string) => void;
  openResearchStudy: (study: ResearchStudy) => void;
  closeResearchStudy: () => void;
  setResearchArchiveOpen: (open: boolean) => void;
  setRecruiterDrawerOpen: (open: boolean) => void;
  setTeleportMapOpen: (open: boolean) => void;
  teleportToDistrict: (districtId: string) => void;
  teleportToNpc: (characterId: string) => void;
  toggleStorybook2DMode: () => void;
  toggleAudio: () => void;
  dismissControlsHint: () => void;
}

export const usePlayableWorldStore = create<PlayableWorldState>((set, get) => ({
  // Spawn in The Haven Courtyard
  playerPosition: [0, 0, 5],
  playerTargetPosition: null,
  playerRotationY: 0,
  isMoving: false,
  isSprinting: false,

  activeDistrict: WORLD_DISTRICTS[0],
  nearbyNpc: null,

  activeDialogue: null,
  openedProjectDossier: null,
  openedResearchStudy: null,
  isResearchArchiveOpen: false,
  isRecruiterDrawerOpen: false,
  isTeleportMapOpen: false,

  isStorybook2DMode: false,
  isAudioMuted: false,
  controlsHintDismissed: false,

  updatePlayerMovement: (pos, rotY, moving, sprinting = false) => {
    // Determine closest district
    let closestDist = Infinity;
    let closestDistrict = get().activeDistrict;

    for (const district of WORLD_DISTRICTS) {
      const dx = pos[0] - district.center[0];
      const dz = pos[2] - district.center[2];
      const distSq = dx * dx + dz * dz;
      if (distSq < closestDist) {
        closestDist = distSq;
        closestDistrict = district;
      }
    }

    // Determine if near any NPC (threshold: 4.2 units)
    let closestNpc: WorldCharacter | null = null;
    let npcMinDist = 4.2 * 4.2;

    for (const npc of WORLD_CHARACTERS) {
      const dx = pos[0] - npc.worldPosition[0];
      const dz = pos[2] - npc.worldPosition[2];
      const distSq = dx * dx + dz * dz;
      if (distSq < npcMinDist) {
        npcMinDist = distSq;
        closestNpc = npc;
      }
    }

    set({
      playerPosition: pos,
      playerRotationY: rotY,
      isMoving: moving,
      isSprinting: sprinting,
      activeDistrict: closestDistrict,
      nearbyNpc: closestNpc,
    });
  },

  setPlayerTargetPosition: (pos) => set({ playerTargetPosition: pos }),

  startDialogue: (character) => {
    set({
      activeDialogue: {
        character,
        currentNodeIndex: 0,
      },
      playerTargetPosition: null, // stop walking on talk
    });
  },

  advanceDialogue: () => {
    const dialog = get().activeDialogue;
    if (!dialog) return;

    const nextIndex = dialog.currentNodeIndex + 1;
    if (nextIndex < dialog.character.initialDialogue.length) {
      set({
        activeDialogue: {
          ...dialog,
          currentNodeIndex: nextIndex,
        },
      });
    } else {
      // Check if there is an action prompt on the final dialogue node
      const currentNode = dialog.character.initialDialogue[dialog.currentNodeIndex];
      if (currentNode?.relatedProjectId) {
        get().openProjectDossierById(currentNode.relatedProjectId);
      } else if (currentNode?.relatedResearchId) {
        get().setResearchArchiveOpen(true);
      }
      set({ activeDialogue: null });
    }
  },

  closeDialogue: () => set({ activeDialogue: null }),

  openProjectDossierById: (id: string) => {
    const project = PORTFOLIO_PROJECTS.find((p) => p.id === id);
    if (project) {
      set({ openedProjectDossier: project, activeDialogue: null });
    }
  },

  openProjectDossier: (project) => set({ openedProjectDossier: project, activeDialogue: null }),

  closeProjectDossier: () => set({ openedProjectDossier: null }),

  openResearchStudyById: (id: string) => {
    const study = RESEARCH_STUDIES.find((s) => s.id === id || s.folderName === id);
    if (study) {
      set({ openedResearchStudy: study, isResearchArchiveOpen: false });
    }
  },

  openResearchStudy: (study) => set({ openedResearchStudy: study, isResearchArchiveOpen: false }),

  closeResearchStudy: () => set({ openedResearchStudy: null }),

  setResearchArchiveOpen: (open) => set({ isResearchArchiveOpen: open, activeDialogue: null }),

  setRecruiterDrawerOpen: (open) => set({ isRecruiterDrawerOpen: open }),

  setTeleportMapOpen: (open) => set({ isTeleportMapOpen: open }),

  teleportToDistrict: (districtId) => {
    const district = WORLD_DISTRICTS.find((d) => d.id === districtId);
    if (district) {
      set({
        playerPosition: [district.center[0], district.center[1], district.center[2] + 4],
        playerTargetPosition: null,
        activeDistrict: district,
        isTeleportMapOpen: false,
      });
    }
  },

  teleportToNpc: (characterId) => {
    const npc = WORLD_CHARACTERS.find((c) => c.id === characterId);
    if (npc) {
      set({
        playerPosition: [npc.worldPosition[0], npc.worldPosition[1], npc.worldPosition[2] + 3],
        playerTargetPosition: null,
        isTeleportMapOpen: false,
      });
    }
  },

  toggleStorybook2DMode: () => set((s) => ({ isStorybook2DMode: !s.isStorybook2DMode })),

  toggleAudio: () => set((s) => ({ isAudioMuted: !s.isAudioMuted })),

  dismissControlsHint: () => set({ controlsHintDismissed: true }),
}));
