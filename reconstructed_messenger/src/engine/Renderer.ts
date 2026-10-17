// reconstructed_messenger/src/engine/Renderer.ts
import * as THREE from 'three';
import { EffectComposer, RenderPass, ShaderPass, SMAAPass } from 'three/examples/jsm/Addons.js';
import { AbetoComicOutlineShader, createInfoGBufferMaterial } from './ToonMaterials';

export interface RendererOptions {
  container: HTMLElement;
  shadows?: boolean;
}

export class EngineRenderer {
  public renderer: THREE.WebGLRenderer;
  public composer: EffectComposer;
  public renderPass: RenderPass;
  public outlinePass: ShaderPass;
  public smaaPass: SMAAPass;

  // WebGL2 G-Buffer pass for spheremap normals + linear depth
  public infoRenderTarget: THREE.WebGLRenderTarget;
  public infoMaterial: THREE.ShaderMaterial;

  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private container: HTMLElement;

  constructor(scene: THREE.Scene, camera: THREE.Camera, options: RendererOptions) {
    this.scene = scene;
    this.camera = camera;
    this.container = options.container;

    // 1. WebGL2 Context with high-performance power preference
    this.renderer = new THREE.WebGLRenderer({
      antialias: false, // Antialiasing handled in post-processing via SMAA
      powerPreference: 'high-performance',
      alpha: false,
      stencil: false,
      depth: true,
      precision: 'highp',
    });
    this.renderer.debug.checkShaderErrors = false;

    this.renderer.setClearColor(new THREE.Color('#f4efe6'), 1.0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;

    // 2. Cascaded Shadow Map (PCFSoft)
    if (options.shadows !== false) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    // 3. Adaptive DPR Clamping (Messenger standard: desktop max 1.5, mobile 1.15)
    const dpr = this.getTargetDPR();
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height);
    this.container.appendChild(this.renderer.domElement);

    // 4. Dedicated G-Buffer Normal & Depth Target (tInfo)
    this.infoRenderTarget = new THREE.WebGLRenderTarget(
      width * dpr,
      height * dpr,
      {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        depthBuffer: true,
      }
    );
    this.infoMaterial = createInfoGBufferMaterial(camera);

    // 5. Post-Processing Pipeline
    const renderTarget = new THREE.WebGLRenderTarget(
      width * dpr,
      height * dpr,
      {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
      }
    );

    this.composer = new EffectComposer(this.renderer, renderTarget);

    // Pass 1: Scene Color Pass
    this.renderPass = new RenderPass(scene, camera);
    this.composer.addPass(this.renderPass);

    // Pass 2: 5-Tap Comic Ink Outline Pass
    this.outlinePass = new ShaderPass(AbetoComicOutlineShader);
    this.outlinePass.uniforms.uResolution.value.set(width * dpr, height * dpr);
    this.outlinePass.uniforms.tInfo.value = this.infoRenderTarget.texture;
    this.composer.addPass(this.outlinePass);

    // Pass 3: High-Quality SMAA
    this.smaaPass = new SMAAPass(width * dpr, height * dpr);
    this.composer.addPass(this.smaaPass);

    this.resizeObserver = new ResizeObserver(() => this.updateSize());
    this.resizeObserver.observe(this.container);
    window.addEventListener('resize', this.updateSize);
    this.updateSize();
  }

  private resizeObserver: ResizeObserver;

  private getTargetDPR(): number {
    if (typeof window === 'undefined') return 1;
    const raw = window.devicePixelRatio || 1;
    return raw <= 2 ? Math.min(raw, 1.15) : Math.min(raw, 1.5);
  }

  private updateSize = () => {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    const dpr = this.getTargetDPR();

    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
    this.composer.setSize(width, height);
    this.infoRenderTarget.setSize(Math.floor(width * dpr), Math.floor(height * dpr));

    if ((this.camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const persCam = this.camera as THREE.PerspectiveCamera;
      persCam.aspect = width / height;
      persCam.updateProjectionMatrix();
    }

    this.outlinePass.uniforms.uResolution.value.set(width * dpr, height * dpr);
    this.smaaPass.setSize(width * dpr, height * dpr);
  };

  public render(delta?: number) {
    try {
      // 1. Render Normal + Depth G-Buffer Pass into tInfo with zero alpha (empty sky)
      // Bypass shadow map generation on normal/depth pass to save GPU draw calls
      const prevShadowAuto = this.renderer.shadowMap.autoUpdate;
      this.renderer.shadowMap.autoUpdate = false;

      this.scene.overrideMaterial = this.infoMaterial;
      this.renderer.setClearColor(0x000000, 0.0);
      this.renderer.setRenderTarget(this.infoRenderTarget);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);

      // 2. Restore normal materials and render post-processed beauty frame
      this.renderer.shadowMap.autoUpdate = prevShadowAuto;
      this.scene.overrideMaterial = null;
      this.renderer.setClearColor(0xf4efe6, 1.0);
      this.renderer.setRenderTarget(null);
      this.outlinePass.uniforms.tInfo.value = this.infoRenderTarget.texture;

      this.composer.render(delta);
    } catch (e) {
      // Direct WebGL render fallback to guarantee screen is never blank
      this.scene.overrideMaterial = null;
      this.renderer.setClearColor(0xf4efe6, 1.0);
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.scene, this.camera);
    }
  }

  public dispose() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    window.removeEventListener('resize', this.updateSize);
    this.composer.dispose();
    this.infoRenderTarget.dispose();
    this.infoMaterial.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
