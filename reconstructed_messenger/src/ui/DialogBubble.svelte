<!-- reconstructed_messenger/src/ui/DialogBubble.svelte -->
<script lang="ts">
  let {
    visible = false,
    speaker = 'Dave the Musician',
    text = 'Hey there messenger! Can you deliver these acoustic strings downstream?',
    screenPos = { x: 0, y: 0 },
    onNext = () => {},
  } = $props<{
    visible?: boolean;
    speaker?: string;
    text?: string;
    screenPos?: { x: number; y: number };
    onNext?: () => void;
  }>();
</script>

{#if visible}
  <div
    class="dialog-bubble"
    style="left: {screenPos.x}px; top: {screenPos.y - 80}px;"
  >
    <div class="speaker-name">{speaker}</div>
    <div class="dialog-text">{text}</div>
    <div class="dialog-arrow"></div>
    <button class="dialog-btn" onclick={onNext}>&rarr;</button>
  </div>
{/if}

<style>
  .dialog-bubble {
    position: fixed;
    transform: translate(-50%, -100%);
    background: #ffffff;
    border: 2px solid #373f42;
    border-radius: 18px;
    padding: 14px 18px;
    max-width: 280px;
    box-shadow: 0 6px 0 #373f42;
    pointer-events: auto;
    font-family: monospace;
    z-index: 40;
  }

  .speaker-name {
    font-size: 10px;
    font-weight: 900;
    color: #00F5D4;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }

  .dialog-text {
    font-size: 12px;
    line-height: 1.4;
    color: #373f42;
  }

  .dialog-arrow {
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 10px solid #373f42;
  }

  .dialog-btn {
    position: absolute;
    bottom: -12px;
    right: 12px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #00F5D4;
    border: 2px solid #373f42;
    font-weight: 900;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 0 #373f42;
  }
</style>
