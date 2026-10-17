import questsData from '../data/quests.json';
import { AssetManager } from './AssetManager';

export interface QuestStep {
  id: string; // NPC id required for step
  texts: string[];
  extraData?: {
    uiTitle?: string;
    uiText?: string;
    uiColor?: string;
    receiveModel?: string;
  };
}

export interface QuestDefinition {
  id: string;
  description: string;
  steps: QuestStep[];
}

export class QuestEngine {
  public quests: QuestDefinition[];
  public activeQuestIndex: number = 0;
  public activeStepIndex: number = 0;
  public currentTextIndex: number = 0;
  public completedQuestIds = new Set<string>();

  public onDialogueChange?: (speaker: string, text: string, visible: boolean) => void;
  public onQuestStateChange?: () => void;
  public onAttachDeliveryModel?: (modelUrl: string | null) => void;

  constructor() {
    this.quests = questsData.quests as QuestDefinition[];
  }

  public get activeQuest(): QuestDefinition | null {
    return this.quests[this.activeQuestIndex] || null;
  }

  public get currentStep(): QuestStep | null {
    if (!this.activeQuest) return null;
    return this.activeQuest.steps[this.activeStepIndex] || null;
  }

  /**
   * Called when player presses interact near an NPC.
   */
  public interactWithNPC(npcId: string, npcName: string, fallbackTexts: string[]): boolean {
    const step = this.currentStep;

    AssetManager.getInstance().playSound('character/bubble-starts.ogg', 0.5);

    // Check if this NPC advances the active quest
    if (step && step.id === npcId) {
      const text = step.texts[this.currentTextIndex];
      if (this.onDialogueChange) {
        this.onDialogueChange(npcName, text, true);
      }
      return true;
    }

    // Default conversational dialogue
    const text = fallbackTexts[0] || 'Hello courier! Fine day on the planet.';
    if (this.onDialogueChange) {
      this.onDialogueChange(npcName, text, true);
    }
    return false;
  }

  /**
   * Advances dialogue text or marks quest step completed.
   */
  public advanceDialogue(npcId: string, npcName: string): boolean {
    const step = this.currentStep;
    if (!step || step.id !== npcId) {
      if (this.onDialogueChange) {
        this.onDialogueChange(npcName, '', false);
      }
      AssetManager.getInstance().playSound('character/bubble-ends.ogg', 0.4);
      return false;
    }

    this.currentTextIndex++;
    if (this.currentTextIndex < step.texts.length) {
      const nextText = step.texts[this.currentTextIndex];
      if (this.onDialogueChange) {
        this.onDialogueChange(npcName, nextText, true);
      }
      AssetManager.getInstance().playSound('ui/click2.ogg', 0.4);
      return true;
    }

    // Step completed!
    this.currentTextIndex = 0;
    if (this.onDialogueChange) {
      this.onDialogueChange(npcName, '', false);
    }
    AssetManager.getInstance().playSound('ui/quest-complete.ogg', 0.8);

    // Check if delivery item received
    if (step.extraData?.receiveModel && this.onAttachDeliveryModel) {
      this.onAttachDeliveryModel(`geometries/${step.extraData.receiveModel}`);
    }

    this.activeStepIndex++;
    if (this.activeStepIndex >= this.activeQuest!.steps.length) {
      // Quest completed!
      this.completedQuestIds.add(this.activeQuest!.id);
      if (this.onAttachDeliveryModel) {
        this.onAttachDeliveryModel(null);
      }
      this.activeQuestIndex = Math.min(this.activeQuestIndex + 1, this.quests.length - 1);
      this.activeStepIndex = 0;
    }

    if (this.onQuestStateChange) {
      this.onQuestStateChange();
    }

    return false;
  }
}
