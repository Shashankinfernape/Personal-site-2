<!-- reconstructed_messenger/src/App.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { PlanetScene } from './engine/PlanetScene';
  import { EngineRenderer } from './engine/Renderer';
  import { MultiplayerClient } from './network/MultiplayerClient';
  import { QuestEngine } from './engine/QuestEngine';
  import { AssetManager } from './engine/AssetManager';
  import HudOverlay from './ui/HudOverlay.svelte';
  import WardrobeModal from './ui/WardrobeModal.svelte';
  import QuestNotebook from './ui/QuestNotebook.svelte';
  import DialogBubble from './ui/DialogBubble.svelte';

  let canvasContainer: HTMLDivElement;
  let planetScene: PlanetScene;
  let engineRenderer: EngineRenderer;
  let multiplayerClient: MultiplayerClient;
  let questEngine: QuestEngine;
  let animId: number;

  // Runes for reactive UI state
  let isInIntro = $state(true);
  let peerCount = $state(1);
  let isMuted = $state(false);
  let isWardrobeOpen = $state(false);
  let isQuestsOpen = $state(false);
  let nearbyNPCName = $state<string | null>(null);

  // Dialogue state
  let isDialogVisible = $state(false);
  let dialogSpeaker = $state('');
  let dialogText = $state('');
  let dialogScreenPos = $state({ x: 0, y: 0 });

  let wardrobe = $state({
    hairId: 6,
    topId: 8,
    bottomId: 6,
    shoesId: 3,
    hairColor: '#FF5500',
    jacketColor: '#00F5D4',
    pantsColor: '#27272A',
    sneakersColor: '#FFFFFF',
  });

  const keys: Record<string, boolean> = {};

  function handleKeyDown(e: KeyboardEvent) {
    keys[e.key.toLowerCase()] = true;
    keys[e.code] = true;

    if (isInIntro) {
      if (e.key === ' ' || e.key === 'Enter' || e.code === 'Space') {
        startGameplay();
      }
      return;
    }

    if (e.key.toLowerCase() === 'c' || e.code === 'KeyC') isWardrobeOpen = !isWardrobeOpen;
    if (e.key.toLowerCase() === 'q' || e.code === 'KeyQ') isQuestsOpen = !isQuestsOpen;
    if (e.key.toLowerCase() === 'm' || e.code === 'KeyM') {
      isMuted = !isMuted;
      AssetManager.getInstance().setMuted(isMuted);
    }

    // Interaction key E
    if (e.key.toLowerCase() === 'e' || e.code === 'KeyE') {
      const npc = planetScene?.npcManager.activeNPC;
      if (npc) {
        questEngine.interactWithNPC(npc.id, npc.name, npc.texts);
      }
    }
  }

  function handleKeyUp(e: KeyboardEvent) {
    keys[e.key.toLowerCase()] = false;
    keys[e.code] = false;
  }

  function startGameplay() {
    isInIntro = false;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    planetScene.startTour();
  }

  function handleDialogNext() {
    const npc = planetScene?.npcManager.activeNPC;
    if (npc) {
      questEngine.advanceDialogue(npc.id, npc.name);
    } else {
      isDialogVisible = false;
    }
  }

  onMount(async () => {
    // 1. Initialize 3D Engine Systems
    planetScene = new PlanetScene();
    engineRenderer = new EngineRenderer(planetScene.scene, planetScene.camera, {
      container: canvasContainer,
      shadows: true,
    });
    (window as any).engineRenderer = engineRenderer;

    // 2. Initialize Quest Engine with authentic Abeto voice & bubble audio
    questEngine = new QuestEngine();
    questEngine.onDialogueChange = (speaker, text, visible) => {
      dialogSpeaker = speaker;
      dialogText = text;
      isDialogVisible = visible;

      if (visible) {
        AssetManager.getInstance().playSound('character/bubble-starts.ogg', 0.5);
        const active = planetScene?.npcManager.activeNPC;
        const voice = active?.voice || 'male1';
        AssetManager.getInstance().playSound(`dialogues/${voice}.ogg`, 0.6);
      } else {
        AssetManager.getInstance().playSound('character/bubble-ends.ogg', 0.5);
      }
    };
    questEngine.onAttachDeliveryModel = (modelUrl) => {
      planetScene.setDeliveryItem(modelUrl);
    };

    // 3. Initialize Multiplayer Client on Port 8085
    multiplayerClient = new MultiplayerClient('ws://localhost:8085');
    multiplayerClient.connect().then((connected) => {
      console.log('[Multiplayer] Connected to local server:', connected);
    });

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 4. Main Animation Loop
    let lastTime = performance.now();
    const tick = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Input polling
      const moveX = (keys['d'] || keys['arrowright'] ? 1 : 0) - (keys['a'] || keys['arrowleft'] ? 1 : 0);
      const moveY = (keys['w'] || keys['arrowup'] ? 1 : 0) - (keys['s'] || keys['arrowdown'] ? 1 : 0);
      const jump = !!keys[' '];
      const sprint = !!keys['shift'];

      // Update 3D scene physics, camera, and live NPCs
      planetScene.update(delta, { x: moveX, y: moveY, jump, sprint });

      if (!isInIntro) {
        // Check nearby NPC prompt
        const activeNPC = planetScene.npcManager.activeNPC;
        nearbyNPCName = activeNPC ? activeNPC.name : null;

        // Update dialog bubble 2D screen coordinate projection
        if (isDialogVisible && activeNPC) {
          const headPos = activeNPC.position.clone().addScaledVector(activeNPC.upVector, 1.6);
          const projected = headPos.project(planetScene.camera);
          dialogScreenPos = {
            x: (projected.x * 0.5 + 0.5) * window.innerWidth,
            y: (-projected.y * 0.5 + 0.5) * window.innerHeight,
          };
        }

        // Synchronize with multiplayer
        if (multiplayerClient.isConnected) {
          multiplayerClient.syncLocalState({
            position: planetScene.characterState.position,
            rotation: new THREE.Euler().setFromQuaternion(planetScene.characterState.quaternion),
            animation: moveY !== 0 || moveX !== 0 ? (sprint ? 2 : 1) : 0,
            medium: 0,
            wardrobe,
          });
          multiplayerClient.updateRemotePlayers(delta);
          peerCount = multiplayerClient.remotePlayers.size + 1;
        }
      }

      // Render WebGL2 G-Buffer normal pass + 5-tap comic outline beauty frame
      engineRenderer.render(delta);

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
  });

  onDestroy(() => {
    cancelAnimationFrame(animId);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    if (multiplayerClient) multiplayerClient.disconnect();
    if (engineRenderer) engineRenderer.dispose();
  });

  function handleSpawnEmoji(emoji: string) {
    if (multiplayerClient) {
      multiplayerClient.syncLocalState({
        position: planetScene.characterState.position,
        rotation: new THREE.Euler().setFromQuaternion(planetScene.characterState.quaternion),
        animation: 0,
        medium: 0,
        wardrobe,
        networkEvent: `emoji:${emoji}`,
      });
    }
  }

  function handleUpdateWardrobeColors(updated: any) {
    wardrobe = updated;
    if (planetScene) {
      planetScene.updateWardrobeColors(updated);
    }
  }

  function handleSelectWardrobeMesh(category: 'hair' | 'top' | 'bottom' | 'shoes', id: number) {
    const key = `${category}Id` as keyof typeof wardrobe;
    wardrobe[key] = id as any;
    if (planetScene) {
      planetScene.setWardrobeMesh(category, id);
    }
  }
</script>

<div class="app-root">
  <!-- 3D Canvas Host -->
  <div class="canvas-viewport" bind:this={canvasContainer}></div>

  <!-- Intro Screen Overlay with Orbital Camera -->
  {#if isInIntro}
    <div class="intro-overlay">
      <div class="intro-box">
        <div class="intro-subtitle">A MULTIPLAYER ADVENTURE BY ABETO</div>
        <h1 class="intro-title">MESSENGER</h1>
        <p class="intro-desc">Deliver parcels across a living spherical planet, meet eccentric characters, and uncover hidden shrines.</p>
        <button class="begin-btn" onclick={startGameplay}>
          BEGIN DELIVERY
          <span class="begin-sub">OR PRESS [SPACE]</span>
        </button>
      </div>
    </div>
  {/if}

  <!-- Nearby NPC Interaction Prompt -->
  {#if nearbyNPCName && !isDialogVisible && !isInIntro}
    <div class="interaction-prompt">
      <span class="prompt-key">E</span> TALK TO {nearbyNPCName.toUpperCase()}
    </div>
  {/if}

  <!-- Svelte 5 Runes HUD Overlay -->
  {#if !isInIntro}
    <HudOverlay
      {peerCount}
      {isMuted}
      onToggleMute={() => {
        isMuted = !isMuted;
        AssetManager.getInstance().setMuted(isMuted);
      }}
      onToggleWardrobe={() => (isWardrobeOpen = !isWardrobeOpen)}
      onToggleQuests={() => (isQuestsOpen = !isQuestsOpen)}
      onSpawnEmoji={handleSpawnEmoji}
    />
  {/if}

  <!-- Wardrobe Customizer Modal with 3D Mesh Swapping -->
  <WardrobeModal
    isOpen={isWardrobeOpen}
    {wardrobe}
    onClose={() => (isWardrobeOpen = false)}
    onUpdateWardrobeColors={handleUpdateWardrobeColors}
    onSelectMesh={handleSelectWardrobeMesh}
  />

  <!-- Delivery Quests Notebook -->
  <QuestNotebook
    isOpen={isQuestsOpen}
    onClose={() => (isQuestsOpen = false)}
  />

  <!-- Hand-Drawn Comic Dialogue Bubble -->
  <DialogBubble
    visible={isDialogVisible}
    speaker={dialogSpeaker}
    text={dialogText}
    screenPos={dialogScreenPos}
    onNext={handleDialogNext}
  />
</div>

<style>
  .app-root {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #f7f3ec;
  }

  .canvas-viewport {
    width: 100vw;
    height: 100vh;
    display: block;
    overflow: hidden;
  }

  .intro-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at center, transparent 30%, rgba(247, 243, 236, 0.7) 90%);
    pointer-events: auto;
    z-index: 30;
    font-family: monospace;
    user-select: none;
  }

  .intro-box {
    text-align: center;
    background: rgba(255, 255, 255, 0.95);
    border: 3px solid #373f42;
    border-radius: 28px;
    padding: 36px 48px;
    box-shadow: 0 12px 0 #373f42;
    max-width: 520px;
    margin: 20px;
  }

  .intro-subtitle {
    font-size: 10px;
    font-weight: 900;
    color: #888;
    letter-spacing: 2px;
    margin-bottom: 8px;
  }

  .intro-title {
    font-size: 44px;
    font-weight: 900;
    color: #373f42;
    letter-spacing: 4px;
    margin-bottom: 12px;
  }

  .intro-desc {
    font-size: 13px;
    color: #555;
    line-height: 1.5;
    margin-bottom: 28px;
  }

  .begin-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 16px 24px;
    background: #00F5D4;
    border: 3px solid #373f42;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 900;
    color: #373f42;
    cursor: pointer;
    box-shadow: 0 6px 0 #373f42;
    transition: transform 0.1s, box-shadow 0.1s;
  }

  .begin-btn:hover {
    background: #22fce1;
  }

  .begin-btn:active {
    transform: translateY(3px);
    box-shadow: 0 3px 0 #373f42;
  }

  .begin-sub {
    font-size: 10px;
    color: #444;
    margin-top: 4px;
    font-weight: 700;
  }

  .interaction-prompt {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: #ffffff;
    border: 2px solid #373f42;
    border-radius: 20px;
    padding: 8px 18px;
    font-size: 11px;
    font-weight: 900;
    color: #373f42;
    box-shadow: 0 4px 0 #373f42;
    pointer-events: none;
    z-index: 30;
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: 0.5px;
    animation: bounce 1.2s infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translate(-50%, 0); }
    50% { transform: translate(-50%, -6px); }
  }

  .prompt-key {
    background: #00F5D4;
    border: 1.5px solid #373f42;
    border-radius: 6px;
    padding: 2px 7px;
    font-size: 11px;
    font-weight: 900;
  }
</style>
