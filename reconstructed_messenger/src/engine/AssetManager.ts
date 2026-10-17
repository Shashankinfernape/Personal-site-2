import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { CustomDRACOLoader } from './CustomDRACOLoader';

export class AssetManager {
  private static instance: AssetManager;
  public gltfLoader: GLTFLoader;
  public dracoLoader: DRACOLoader;
  public customDracoLoader: CustomDRACOLoader;
  public ktx2Loader: KTX2Loader;
  public audioListener: THREE.AudioListener;
  public audioLoader: THREE.AudioLoader;
  public audioBuffers = new Map<string, AudioBuffer>();
  public textureCache = new Map<string, THREE.Texture>();
  private geometryCache = new Map<string, THREE.BufferGeometry>();

  private isMuted: boolean = false;

  private constructor(renderer?: THREE.WebGLRenderer) {
    this.customDracoLoader = new CustomDRACOLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('/draco/');

    this.ktx2Loader = new KTX2Loader();
    this.ktx2Loader.setTranscoderPath('/basis/');
    if (renderer) {
      this.ktx2Loader.detectSupport(renderer);
    }

    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
    this.gltfLoader.setKTX2Loader(this.ktx2Loader);

    this.audioListener = new THREE.AudioListener();
    this.audioLoader = new THREE.AudioLoader();
  }

  public static getInstance(renderer?: THREE.WebGLRenderer): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager(renderer);
    }
    return AssetManager.instance;
  }

  public resolveUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const clean = path.replace(/^\/+/, '');
    if (clean.startsWith('assets/')) {
      return `/${clean}`;
    }
    return `/assets/${clean}`;
  }

  /**
   * Loads a raw Draco-compressed BufferGeometry (.drc) with local cache & CDN fallback.
   */
  public async loadDracoGeometry(path: string): Promise<THREE.BufferGeometry> {
    const primaryUrl = this.resolveUrl(path);
    if (this.geometryCache.has(primaryUrl)) {
      return this.geometryCache.get(primaryUrl)!.clone();
    }

    try {
      const geom = await this.customDracoLoader.loadAsync(primaryUrl);
      if (!geom.attributes.normal || geom.attributes.normal.count === 0) {
        geom.computeVertexNormals();
      }
      geom.computeBoundingBox();
      geom.computeBoundingSphere();
      this.geometryCache.set(primaryUrl, geom);
      return geom.clone();
    } catch (_e) {
      // Fallback to standard Three.js DRACOLoader
      return new Promise((resolve, reject) => {
        this.dracoLoader.load(
          primaryUrl,
          (geom) => {
            if (!geom.attributes.normal || geom.attributes.normal.count === 0) {
              geom.computeVertexNormals();
            }
            geom.computeBoundingBox();
            geom.computeBoundingSphere();
            this.geometryCache.set(primaryUrl, geom);
            resolve(geom);
          },
          undefined,
          (err) => {
          // CDN Fallback
          const cdnUrl = `https://messenger.abeto.co/assets/${path.replace(/^\/+/, '')}`;
          this.dracoLoader.load(
            cdnUrl,
            (cdnGeom) => {
              if (!cdnGeom.attributes.normal || cdnGeom.attributes.normal.count === 0) {
                cdnGeom.computeVertexNormals();
              }
              cdnGeom.computeBoundingBox();
              cdnGeom.computeBoundingSphere();
              this.geometryCache.set(primaryUrl, cdnGeom);
              resolve(cdnGeom);
            },
            undefined,
            (cdnErr) => reject(cdnErr)
          );
        }
      );
    });
  }
}

  /**
   * Loads an audio file into AudioBuffer cache.
   */
  public async loadAudio(path: string): Promise<AudioBuffer> {
    const url = this.resolveUrl(path);
    if (this.audioBuffers.has(url)) {
      return this.audioBuffers.get(url)!;
    }

    return new Promise((resolve, reject) => {
      this.audioLoader.load(
        url,
        (buffer) => {
          this.audioBuffers.set(url, buffer);
          resolve(buffer);
        },
        undefined,
        (err) => reject(err)
      );
    });
  }

  /**
   * Plays a 2D global sound effect.
   */
  public async playSound(path: string, volume: number = 0.6) {
    if (this.isMuted) return;
    try {
      const buffer = await this.loadAudio(path);
      const sound = new THREE.Audio(this.audioListener);
      sound.setBuffer(buffer);
      sound.setVolume(volume);
      sound.play();
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Attaches a WebAudio positional spatial audio node (HRTF).
   */
  public async createSpatialAudio(
    path: string,
    parentMesh: THREE.Object3D,
    options: { refDistance?: number; maxDistance?: number; rolloffFactor?: number; loop?: boolean; volume?: number } = {}
  ): Promise<THREE.PositionalAudio> {
    const sound = new THREE.PositionalAudio(this.audioListener);
    try {
      const buffer = await this.loadAudio(path);
      sound.setBuffer(buffer);
      sound.setRefDistance(options.refDistance || 5.0);
      sound.setMaxDistance(options.maxDistance || 45.0);
      sound.setRolloffFactor(options.rolloffFactor || 1.0);
      sound.setDistanceModel('inverse');
      sound.setLoop(options.loop ?? true);
      sound.setVolume(this.isMuted ? 0 : (options.volume ?? 1.0));
      parentMesh.add(sound);
      sound.play();
    } catch (e) {
      console.warn('Could not initialize spatial audio:', path, e);
    }
    return sound;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.audioListener.setMasterVolume(muted ? 0 : 1);
  }
}
