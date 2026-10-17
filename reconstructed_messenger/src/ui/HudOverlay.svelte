<!-- reconstructed_messenger/src/ui/HudOverlay.svelte -->
<script lang="ts">
  let {
    peerCount = 1,
    isMuted = false,
    onToggleMute = () => {},
    onToggleWardrobe = () => {},
    onToggleQuests = () => {},
    onToggleEmojis = () => {},
    onSpawnEmoji = (emoji: string) => {},
  } = $props<{
    peerCount?: number;
    isMuted?: boolean;
    onToggleMute?: () => void;
    onToggleWardrobe?: () => void;
    onToggleQuests?: () => void;
    onToggleEmojis?: () => void;
    onSpawnEmoji?: (emoji: string) => void;
  }>();

  let showEmojiTray = $state(false);

  const emojis = ['🚀', '🔥', '⚡', '✨', '💬', '🎉', '💌', '🌸', '🚲', '👋'];
</script>

<div class="hud-container">
  <!-- Top Left: Title Badge & Peer Counter -->
  <div class="top-badge">
    <div class="badge-title">MESSENGER // ABETO</div>
    <div class="badge-status">
      <span class="status-dot"></span>
      <span>{peerCount} ONLINE</span>
    </div>
  </div>

  <!-- Right Side Buttons -->
  <div class="side-controls">
    <!-- Quest Notebook -->
    <button class="side-btn" onclick={onToggleQuests} title="Delivery Quests [Q]">
      📋
    </button>

    <!-- Wardrobe Customizer -->
    <button class="side-btn" onclick={onToggleWardrobe} title="Wardrobe [C]">
      🧢
    </button>

    <!-- Emoji Reactions Toggle -->
    <button class="side-btn" onclick={() => { showEmojiTray = !showEmojiTray; onToggleEmojis(); }} title="Emojis [E]">
      ✨
    </button>

    <!-- Audio Mute -->
    <button class="side-btn" onclick={onToggleMute} title="Audio [M]">
      {isMuted ? '🔇' : '🔊'}
    </button>
  </div>

  <!-- Bottom Emoji Tray Popup -->
  {#if showEmojiTray}
    <div class="emoji-tray">
      {#each emojis as emoji, i}
        <button class="emoji-btn" onclick={() => onSpawnEmoji(emoji)}>
          {emoji}
          <span class="hotkey">{i + 1}</span>
        </button>
      {/each}
    </div>
  {/if}

  <!-- Bottom Center Controls Legend -->
  <div class="controls-legend">
    <span class="key">WASD</span> MOVE &bull;
    <span class="key">SPACE</span> JUMP &bull;
    <span class="key">SHIFT</span> SPRINT &bull;
    <span class="key">C</span> WARDROBE
  </div>
</div>

<style>
  .hud-container {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 20;
    font-family: monospace;
    user-select: none;
  }

  .top-badge {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #373f42;
    border-radius: 14px;
    padding: 8px 14px;
    pointer-events: auto;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  .badge-title {
    font-size: 11px;
    font-weight: 900;
    color: #373f42;
    letter-spacing: 1px;
  }

  .badge-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    color: #666;
    margin-top: 2px;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #00F5D4;
    animation: pulse 1.8s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }

  .side-controls {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: auto;
  }

  .side-btn {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: #ffffff;
    border: 2px solid #373f42;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 0 #373f42;
    transition: transform 0.1s, box-shadow 0.1s;
  }

  .side-btn:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #373f42;
  }

  .emoji-tray {
    position: absolute;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    background: #ffffff;
    border: 2px solid #373f42;
    border-radius: 20px;
    padding: 8px 12px;
    display: flex;
    gap: 8px;
    pointer-events: auto;
    box-shadow: 0 6px 0 #373f42;
  }

  .emoji-btn {
    position: relative;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    border: 1px solid #ddd;
    background: #fdfdfd;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.15s;
  }

  .emoji-btn:hover {
    transform: scale(1.2);
    border-color: #00F5D4;
  }

  .hotkey {
    position: absolute;
    bottom: 1px;
    right: 2px;
    font-size: 8px;
    color: #999;
  }

  .controls-legend {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.85);
    border: 1.5px solid #373f42;
    border-radius: 30px;
    padding: 6px 16px;
    font-size: 10px;
    font-weight: 700;
    color: #373f42;
    letter-spacing: 0.5px;
  }

  .key {
    background: #e6e2db;
    padding: 2px 5px;
    border-radius: 4px;
    border: 1px solid #373f42;
  }
</style>
