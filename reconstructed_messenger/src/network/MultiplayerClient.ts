// reconstructed_messenger/src/network/MultiplayerClient.ts
import * as THREE from 'three';

export interface RemotePlayer {
  id: string;
  tag: string;
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  quaternion: THREE.Quaternion;
  targetQuaternion: THREE.Quaternion;
  animation: number;
  wardrobe: {
    hairColor: string;
    jacketColor: string;
    pantsColor: string;
    sneakersColor: string;
  };
  mesh?: THREE.Object3D;
}

export class MultiplayerClient {
  public socket: WebSocket | null = null;
  public localId: string = `local_${Math.floor(Math.random() * 10000)}`;
  public remotePlayers = new Map<string, RemotePlayer>();
  public isConnected: boolean = false;

  private serverUrl: string;
  private lastSendTime: number = 0;
  private readonly SEND_INTERVAL_MS = 35; // 35ms update rate (~28 updates/sec)

  constructor(serverUrl: string = 'ws://localhost:8085') {
    this.serverUrl = serverUrl;
  }

  public connect(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        this.socket = new WebSocket(this.serverUrl);
        this.socket.binaryType = 'arraybuffer';

        this.socket.onopen = () => {
          this.isConnected = true;
          // Register presence
          this.sendPacket({
            type: 'HANDSHAKE',
            id: this.localId,
            timestamp: Date.now(),
          });
          resolve(true);
        };

        this.socket.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.socket.onerror = () => {
          this.isConnected = false;
          resolve(false);
        };

        this.socket.onclose = () => {
          this.isConnected = false;
        };
      } catch (err) {
        this.isConnected = false;
        resolve(false);
      }
    });
  }

  /**
   * Broadcasts local player state if 35ms interval elapsed.
   */
  public syncLocalState(state: {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    animation: number;
    medium: number;
    wardrobe: any;
    networkEvent?: string;
  }) {
    if (!this.isConnected || !this.socket) return;

    const now = performance.now();
    if (now - this.lastSendTime < this.SEND_INTERVAL_MS && !state.networkEvent) {
      return;
    }
    this.lastSendTime = now;

    this.sendPacket({
      type: 'STATE_DELTA',
      id: this.localId,
      p: [state.position.x, state.position.y, state.position.z],
      r: [state.rotation.x, state.rotation.y, state.rotation.z],
      animation: state.animation,
      medium: state.medium,
      wardrobe: state.wardrobe,
      networkEvent: state.networkEvent || '',
      t: now,
    });
  }

  private sendPacket(data: object) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  private handleMessage(data: string | ArrayBuffer) {
    try {
      let packet: any;
      if (typeof data === 'string') {
        packet = JSON.parse(data);
      } else {
        const text = new TextDecoder().decode(data);
        packet = JSON.parse(text);
      }

      if (packet.type === 'STATE_DELTA' && packet.id !== this.localId) {
        let player = this.remotePlayers.get(packet.id);
        if (!player) {
          player = {
            id: packet.id,
            tag: packet.tag || `Courier_${packet.id.slice(-4)}`,
            position: new THREE.Vector3(...packet.p),
            targetPosition: new THREE.Vector3(...packet.p),
            quaternion: new THREE.Quaternion(),
            targetQuaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(...packet.r)),
            animation: packet.animation || 0,
            wardrobe: packet.wardrobe || {
              hairColor: '#18181B',
              jacketColor: '#00F5D4',
              pantsColor: '#27272A',
              sneakersColor: '#FFFFFF',
            },
          };
          this.remotePlayers.set(packet.id, player);
        } else {
          player.targetPosition.set(packet.p[0], packet.p[1], packet.p[2]);
          player.targetQuaternion.setFromEuler(new THREE.Euler(packet.r[0], packet.r[1], packet.r[2]));
          player.animation = packet.animation;
        }
      } else if (packet.type === 'PEER_DISCONNECTED') {
        this.remotePlayers.delete(packet.id);
      }
    } catch (e) {
      // Discard malformed packet
    }
  }

  /**
   * Updates all remote players with exponential damp smoothing.
   */
  public updateRemotePlayers(delta: number) {
    const lambda = 18.0; // Smoothing factor
    this.remotePlayers.forEach((player) => {
      // Smooth position using damp
      player.position.x = THREE.MathUtils.damp(player.position.x, player.targetPosition.x, lambda, delta);
      player.position.y = THREE.MathUtils.damp(player.position.y, player.targetPosition.y, lambda, delta);
      player.position.z = THREE.MathUtils.damp(player.position.z, player.targetPosition.z, lambda, delta);

      // Smooth rotation using slerp
      const slerpFactor = 1.0 - Math.exp(-lambda * delta);
      player.quaternion.slerp(player.targetQuaternion, slerpFactor);

      if (player.mesh) {
        player.mesh.position.copy(player.position);
        player.mesh.quaternion.copy(player.quaternion);
      }
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
    this.remotePlayers.clear();
  }
}
