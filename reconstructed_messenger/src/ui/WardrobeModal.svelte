<!-- reconstructed_messenger/src/ui/WardrobeModal.svelte -->
<script lang="ts">
  let {
    isOpen = false,
    wardrobe = {
      hairId: 6,
      topId: 8,
      bottomId: 6,
      shoesId: 3,
      hairColor: '#FF5500',
      jacketColor: '#00F5D4',
      pantsColor: '#27272A',
      sneakersColor: '#FFFFFF',
    },
    onClose = () => {},
    onUpdateWardrobeColors = (updated: any) => {},
    onSelectMesh = (category: 'hair' | 'top' | 'bottom' | 'shoes', id: number) => {},
  } = $props<{
    isOpen?: boolean;
    wardrobe?: {
      hairId: number;
      topId: number;
      bottomId: number;
      shoesId: number;
      hairColor: string;
      jacketColor: string;
      pantsColor: string;
      sneakersColor: string;
    };
    onClose?: () => void;
    onUpdateWardrobeColors?: (updated: any) => void;
    onSelectMesh?: (category: 'hair' | 'top' | 'bottom' | 'shoes', id: number) => void;
  }>();

  const palette = [
    '#00F5D4', '#CCFF00', '#FF5500', '#FF2A85', '#A855F7',
    '#38BDF8', '#FFFFFF', '#A1A1AA', '#27272A', '#09090B'
  ];

  function setColor(slot: string, color: string) {
    const updated = { ...wardrobe, [slot]: color };
    onUpdateWardrobeColors(updated);
  }

  function cycleMesh(category: 'hair' | 'top' | 'bottom' | 'shoes', delta: number) {
    const maxMap = { hair: 7, top: 9, bottom: 7, shoes: 7 };
    const key = `${category}Id` as keyof typeof wardrobe;
    const current = Number(wardrobe[key]);
    const max = maxMap[category];
    let next = current + delta;
    if (next < 1) next = max;
    if (next > max) next = 1;

    onSelectMesh(category, next);
  }
</script>

{#if isOpen}
  <div class="modal-backdrop" role="dialog" aria-modal="true" tabindex="-1" onclick={onClose} onkeydown={(e) => { if (e.key === 'Escape') onClose(); }}>
    <div class="wardrobe-card" role="document" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
      <div class="card-header">
        <div class="title">3D MESSENGER WARDROBE</div>
        <button class="close-btn" aria-label="Close wardrobe" onclick={onClose}>&times;</button>
      </div>

      <div class="slots-container">
        <!-- Hair / Headwear -->
        <div class="slot-block">
          <div class="mesh-row">
            <span class="slot-label">💇 HAIR / CAP</span>
            <div class="mesh-stepper">
              <button class="step-btn" onclick={() => cycleMesh('hair', -1)}>&larr;</button>
              <span class="mesh-name">Style {wardrobe.hairId} / 7</span>
              <button class="step-btn" onclick={() => cycleMesh('hair', 1)}>&rarr;</button>
            </div>
          </div>
          <div class="swatches">
            {#each palette as hex}
              <button
                class="swatch {wardrobe.hairColor === hex ? 'active' : ''}"
                style="background: {hex};"
                aria-label="Select hair color {hex}"
                title={hex}
                onclick={() => setColor('hairColor', hex)}
              ></button>
            {/each}
          </div>
        </div>

        <!-- Jacket / Top -->
        <div class="slot-block">
          <div class="mesh-row">
            <span class="slot-label">🧥 HOODIE / TOP</span>
            <div class="mesh-stepper">
              <button class="step-btn" onclick={() => cycleMesh('top', -1)}>&larr;</button>
              <span class="mesh-name">Top {wardrobe.topId} / 9</span>
              <button class="step-btn" onclick={() => cycleMesh('top', 1)}>&rarr;</button>
            </div>
          </div>
          <div class="swatches">
            {#each palette as hex}
              <button
                class="swatch {wardrobe.jacketColor === hex ? 'active' : ''}"
                style="background: {hex};"
                aria-label="Select jacket color {hex}"
                title={hex}
                onclick={() => setColor('jacketColor', hex)}
              ></button>
            {/each}
          </div>
        </div>

        <!-- Pants / Bottom -->
        <div class="slot-block">
          <div class="mesh-row">
            <span class="slot-label">👖 PANTS / CARGO</span>
            <div class="mesh-stepper">
              <button class="step-btn" onclick={() => cycleMesh('bottom', -1)}>&larr;</button>
              <span class="mesh-name">Bottom {wardrobe.bottomId} / 7</span>
              <button class="step-btn" onclick={() => cycleMesh('bottom', 1)}>&rarr;</button>
            </div>
          </div>
          <div class="swatches">
            {#each palette as hex}
              <button
                class="swatch {wardrobe.pantsColor === hex ? 'active' : ''}"
                style="background: {hex};"
                aria-label="Select pants color {hex}"
                title={hex}
                onclick={() => setColor('pantsColor', hex)}
              ></button>
            {/each}
          </div>
        </div>

        <!-- Shoes -->
        <div class="slot-block">
          <div class="mesh-row">
            <span class="slot-label">👟 SNEAKERS / SOLES</span>
            <div class="mesh-stepper">
              <button class="step-btn" onclick={() => cycleMesh('shoes', -1)}>&larr;</button>
              <span class="mesh-name">Shoes {wardrobe.shoesId} / 7</span>
              <button class="step-btn" onclick={() => cycleMesh('shoes', 1)}>&rarr;</button>
            </div>
          </div>
          <div class="swatches">
            {#each palette as hex}
              <button
                class="swatch {wardrobe.sneakersColor === hex ? 'active' : ''}"
                style="background: {hex};"
                aria-label="Select shoes color {hex}"
                title={hex}
                onclick={() => setColor('sneakersColor', hex)}
              ></button>
            {/each}
          </div>
        </div>
      </div>

      <div class="card-footer">
        <button class="confirm-btn" onclick={onClose}>CONFIRM & RIDE</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    font-family: monospace;
  }

  .wardrobe-card {
    background: #ffffff;
    border: 3px solid #373f42;
    border-radius: 24px;
    padding: 22px;
    width: 90%;
    max-width: 440px;
    box-shadow: 0 10px 0 #373f42;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px dashed #ddd;
    padding-bottom: 12px;
    margin-bottom: 16px;
  }

  .title {
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

  .slots-container {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .slot-block {
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: #faf8f4;
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid #e8e3d8;
  }

  .mesh-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .slot-label {
    font-size: 10px;
    font-weight: 900;
    color: #373f42;
  }

  .mesh-stepper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .step-btn {
    background: #ffffff;
    border: 1.5px solid #373f42;
    border-radius: 6px;
    width: 24px;
    height: 24px;
    font-weight: 900;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mesh-name {
    font-size: 10px;
    font-weight: 800;
    color: #555;
  }

  .swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
  }

  .swatch {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: 2px solid #ccc;
    cursor: pointer;
    transition: transform 0.1s;
  }

  .swatch.active {
    border-color: #373f42;
    transform: scale(1.15);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .card-footer {
    margin-top: 18px;
  }

  .confirm-btn {
    width: 100%;
    padding: 12px;
    background: #00F5D4;
    border: 2px solid #373f42;
    border-radius: 12px;
    font-weight: 900;
    font-size: 12px;
    cursor: pointer;
    box-shadow: 0 4px 0 #373f42;
  }

  .confirm-btn:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #373f42;
  }
</style>
