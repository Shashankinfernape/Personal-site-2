<!-- reconstructed_messenger/src/ui/QuestNotebook.svelte -->
<script lang="ts">
  let {
    isOpen = false,
    onClose = () => {},
  } = $props<{
    isOpen?: boolean;
    onClose?: () => void;
  }>();

  const quests = [
    { id: 'quest-employee', title: 'Smelly Falls Courier', desc: 'Deliver urgent notice to the park ranger', done: true },
    { id: 'quest-caveman', title: 'Primitive Warmth', desc: 'Carry hand-woven clothes up the north mountain', done: false },
    { id: 'quest-scientists', title: 'Observatory Logs', desc: 'Hand over astronomical telemetry to Dr. Aris', done: false },
    { id: 'quest-temple', title: 'Ancient Glyphs', desc: 'Transport the stone monolith tablet to the shrine', done: false },
    { id: 'quest-musician', title: 'Dave’s Jam Session', desc: 'Deliver spare strings to Dave by the riverbank', done: false },
  ];
</script>

{#if isOpen}
  <div class="modal-backdrop" role="dialog" aria-modal="true" tabindex="-1" onclick={onClose} onkeydown={(e) => { if (e.key === 'Escape') onClose(); }}>
    <div class="notebook-card" role="document" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
      <div class="notebook-header">
        <div class="notebook-title">DELIVERY CHECKLIST</div>
        <button class="close-btn" aria-label="Close checklist" onclick={onClose}>&times;</button>
      </div>

      <div class="quests-list">
        {#each quests as q}
          <div class="quest-item {q.done ? 'completed' : ''}">
            <div class="quest-checkbox">{q.done ? '✓' : '○'}</div>
            <div class="quest-info">
              <div class="q-title">{q.title}</div>
              <div class="q-desc">{q.desc}</div>
            </div>
          </div>
        {/each}
      </div>

      <div class="notebook-footer">
        1 of 5 Parcels Delivered
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    font-family: monospace;
  }

  .notebook-card {
    background: #fffdf8;
    border: 3px solid #373f42;
    border-radius: 20px;
    padding: 24px;
    width: 90%;
    max-width: 440px;
    box-shadow: 0 10px 0 #373f42;
  }

  .notebook-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #eee;
    padding-bottom: 12px;
    margin-bottom: 16px;
  }

  .notebook-title {
    font-size: 13px;
    font-weight: 900;
    color: #373f42;
    letter-spacing: 1px;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #888;
  }

  .quests-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .quest-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px;
    border-radius: 10px;
    background: #f7f5ed;
    border: 1px solid #e2ddd3;
  }

  .quest-item.completed {
    background: #eefbf4;
    border-color: #a7dfc0;
  }

  .quest-checkbox {
    font-size: 16px;
    font-weight: 900;
    color: #00F5D4;
  }

  .q-title {
    font-size: 12px;
    font-weight: 800;
    color: #373f42;
  }

  .q-desc {
    font-size: 10px;
    color: #666;
    margin-top: 2px;
  }

  .notebook-footer {
    margin-top: 18px;
    text-align: center;
    font-size: 10px;
    color: #888;
    font-weight: 700;
  }
</style>
