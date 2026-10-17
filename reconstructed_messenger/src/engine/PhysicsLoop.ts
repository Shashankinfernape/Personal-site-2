// reconstructed_messenger/src/engine/PhysicsLoop.ts
import * as THREE from 'three';
import { acceleratedRaycast } from 'three-mesh-bvh';

// Install acceleratedRaycast onto THREE.Mesh.prototype for O(log N) BVH raycasts
if ((THREE.Mesh.prototype as any).raycast !== acceleratedRaycast) {
  (THREE.Mesh.prototype as any).raycast = acceleratedRaycast;
}

export interface CharacterPhysicsState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  quaternion: THREE.Quaternion;
  heading: number;
  isGrounded: boolean;
  capsuleRadius: number;
  capsuleHeight: number;
}

export class SphericalPlayerController {
  // Town spawn coordinates from presentScene in App3D.js
  public position = new THREE.Vector3(5.81095, 5.80205, 25.7794);
  public velocity = new THREE.Vector3();
  public quaternion = new THREE.Quaternion();
  public currentRadius = 27.05;
  public isGrounded = true;
  public walkPhase = 0;
  public idleTime = 0;
  public speedRatio = 0;
  public airBlend = 0;
  public radialSpeed = 0;
  public turnLean = 0;
  public forwardLean = 0;
  public landingSquash = 0;

  public readonly capsuleRadius = 0.38;
  public readonly capsuleHeight = 1.7;

  private groundedTimer = 0.15;
  private jumpCooldown = 0;
  private keys = new Set<string>();
  private raycaster = new THREE.Raycaster();
  private wallRaycaster = new THREE.Raycaster();
  private camRaycaster = new THREE.Raycaster();

  private readonly wallRadius = 0.42;
  private readonly maxStepHeight = 0.52;

  private readonly _up = new THREE.Vector3();
  private readonly _forward = new THREE.Vector3();
  private readonly _right = new THREE.Vector3();
  private readonly _moveDir = new THREE.Vector3();
  private readonly _prevForward = new THREE.Vector3(0, 0, 1);
  private readonly _rayOrigin = new THREE.Vector3();
  private readonly _rayDir = new THREE.Vector3();

  constructor() {
    this.raycaster.firstHitOnly = true;
    this.wallRaycaster.firstHitOnly = true;
    this.camRaycaster.firstHitOnly = true;
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        this.keys.add(e.code);
        this.keys.add(e.key.toLowerCase());
        if (e.code === 'Space' || e.key === ' ') {
          e.preventDefault();
        }
      });
      window.addEventListener('keyup', (e) => {
        this.keys.delete(e.code);
        this.keys.delete(e.key.toLowerCase());
      });
      window.addEventListener('blur', () => this.keys.clear());
    }
  }

  public update(
    dt: number,
    camera: THREE.Camera,
    colliders: THREE.Object3D[],
    controlsLocked = false
  ): void {
    const safeDt = Math.min(dt, 0.04);
    const wasGrounded = this.isGrounded;
    this.idleTime += safeDt;
    this._up.copy(this.position).normalize();
    if (this._up.lengthSq() < 0.001) this._up.set(0, 1, 0);

    if (this.jumpCooldown > 0) this.jumpCooldown -= safeDt;
    if (this.landingSquash > 0.001) {
      this.landingSquash *= Math.exp(-18.0 * safeDt);
    } else {
      this.landingSquash = 0;
    }

    if (this.isGrounded) {
      this.groundedTimer = 0.14;
      this.airBlend = THREE.MathUtils.damp(this.airBlend, 0, 18, safeDt);
    } else {
      this.groundedTimer = Math.max(0, this.groundedTimer - safeDt);
      this.airBlend = THREE.MathUtils.damp(this.airBlend, 1, 15, safeDt);
    }

    // 1. Read WASD / Arrow input
    let moveX = 0;
    let moveZ = 0;
    if (!controlsLocked) {
      if (this.keys.has('KeyW') || this.keys.has('w') || this.keys.has('ArrowUp')) moveZ += 1;
      if (this.keys.has('KeyS') || this.keys.has('s') || this.keys.has('ArrowDown')) moveZ -= 1;
      if (this.keys.has('KeyD') || this.keys.has('d') || this.keys.has('ArrowRight')) moveX += 1;
      if (this.keys.has('KeyA') || this.keys.has('a') || this.keys.has('ArrowLeft')) moveX -= 1;
    }

    const isSprinting =
      this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') || this.keys.has('shift');
    const hasInput = moveX !== 0 || moveZ !== 0;

    // 2. Camera-relative spherical tangent basis
    camera.getWorldDirection(this._forward);
    this._forward.addScaledVector(this._up, -this._forward.dot(this._up)).normalize();
    this._right.crossVectors(this._forward, this._up).normalize();

    let radialSpeed = this.velocity.dot(this._up);
    const radialVel = this._up.clone().multiplyScalar(radialSpeed);
    const tangentVel = this.velocity.clone().sub(radialVel);

    // Current facing direction before rotation update (to compute turn banking)
    this._prevForward.set(0, 0, 1).applyQuaternion(this.quaternion);
    this._prevForward.addScaledVector(this._up, -this._prevForward.dot(this._up)).normalize();

    if (hasInput) {
      this._moveDir
        .set(0, 0, 0)
        .addScaledVector(this._forward, moveZ)
        .addScaledVector(this._right, moveX)
        .normalize();

      // Compute signed turn angle for lateral body banking (roll)
      const crossY = new THREE.Vector3()
        .crossVectors(this._prevForward, this._moveDir)
        .dot(this._up);
      const targetTurnLean = THREE.MathUtils.clamp(-crossY * 0.45, -0.26, 0.26);
      this.turnLean = THREE.MathUtils.damp(this.turnLean, targetTurnLean, 12, safeDt);

      // Face +Z forward into movement direction
      const lookMat = new THREE.Matrix4().lookAt(
        this._moveDir,
        new THREE.Vector3(0, 0, 0),
        this._up
      );
      const targetQuat = new THREE.Quaternion().setFromRotationMatrix(lookMat);
      this.quaternion.slerp(targetQuat, 1.0 - Math.exp(-16.0 * safeDt));

      // Default movement in messenger.abeto.co is a lively run (7.2 m/s), Shift sprints (10.2 m/s)
      const targetSpeed = isSprinting ? 10.2 : 7.2;
      const accel = this.isGrounded ? 36.0 : 18.0;
      const desiredTangent = this._moveDir.clone().multiplyScalar(targetSpeed);
      tangentVel.lerp(desiredTangent, 1.0 - Math.exp(-accel * safeDt));

      const targetRatio = isSprinting ? 1.0 : 0.76;
      this.speedRatio = THREE.MathUtils.damp(this.speedRatio, targetRatio, 12, safeDt);
      this.forwardLean = THREE.MathUtils.damp(
        this.forwardLean,
        isSprinting ? 0.24 : 0.16,
        12,
        safeDt
      );

      if (this.isGrounded) {
        this.walkPhase += safeDt * (isSprinting ? 16.5 : 12.8);
      } else {
        this.walkPhase += safeDt * 5.0;
      }
    } else {
      const friction = this.isGrounded ? 16.0 : 4.0;
      tangentVel.multiplyScalar(Math.exp(-friction * safeDt));
      this.speedRatio = THREE.MathUtils.damp(this.speedRatio, 0, 14, safeDt);
      this.turnLean = THREE.MathUtils.damp(this.turnLean, 0, 14, safeDt);
      this.forwardLean = THREE.MathUtils.damp(this.forwardLean, 0, 14, safeDt);

      if (this._prevForward.lengthSq() > 0.001) {
        const lookMat = new THREE.Matrix4().lookAt(
          this._prevForward,
          new THREE.Vector3(0, 0, 0),
          this._up
        );
        this.quaternion.setFromRotationMatrix(lookMat);
      }
    }

    // 3. Snappy Arcade Jump (8.4 m/s impulse + strong -38 / -56 m/s^2 gravity -> zero moon-floating!)
    const holdingJump =
      !controlsLocked &&
      (this.keys.has('Space') || this.keys.has(' ') || this.keys.has('KeyJ'));
    if (holdingJump && this.groundedTimer > 0 && this.jumpCooldown <= 0) {
      radialSpeed = 8.4;
      this.isGrounded = false;
      this.groundedTimer = 0;
      this.jumpCooldown = 0.24;
    }

    const gravity =
      radialSpeed > 0 ? (holdingJump ? -38.0 : -48.0) : -56.0;
    radialSpeed = Math.max(radialSpeed + gravity * safeDt, -24.0);
    this.radialSpeed = radialSpeed;

    this.velocity.copy(tangentVel).addScaledVector(this._up, radialSpeed);

    // 4. Sub-stepped integration with 3D Wall Collision + Hip-Height Ground Raycast
    const subSteps = 2;
    const subDt = safeDt / subSteps;

    for (let s = 0; s < subSteps; s++) {
      const prevPos = this.position.clone();
      const prevRadius = prevPos.length();

      this.position.addScaledVector(this.velocity, subDt);
      this._up.copy(this.position).normalize();

      // A. Horizontal 8-Ray Wall Bumper at Knee (+0.42m) & Chest (+1.05m) Height
      this.resolveHorizontalWallCollisions(colliders);

      const newRadius = this.position.length();
      const curRadialSpeed = this.velocity.dot(this._up);

      // B. Overhead Ceiling Check While Rising
      if (curRadialSpeed > 0 && colliders.length > 0) {
        this._rayOrigin.copy(this.position).addScaledVector(this._up, 0.5);
        this.raycaster.set(this._rayOrigin, this._up);
        this.raycaster.near = 0.05;
        this.raycaster.far = 0.95;
        const ceilingHits = this.raycaster.intersectObjects(colliders, true);
        if (ceilingHits.length > 0) {
          this.velocity.addScaledVector(this._up, -curRadialSpeed);
        }
        this.currentRadius = this.position.length();
        this.isGrounded = false;
        continue;
      }

      // C. Downward Ground Raycast from Hip Height (+0.72m above feet, NEVER from sky!)
      if (colliders.length > 0) {
        const probeHeight = 0.72;
        this._rayOrigin.copy(this.position).addScaledVector(this._up, probeHeight);
        this._rayDir.copy(this._up).negate();
        this.raycaster.set(this._rayOrigin, this._rayDir);
        this.raycaster.near = 0.05;
        this.raycaster.far = probeHeight + 0.45;

        const hits = this.raycaster.intersectObjects(colliders, true);
        if (hits.length > 0) {
          const groundRadius = hits[0].point.length();
          const stepUp = groundRadius - prevRadius;

          if (stepUp > this.maxStepHeight) {
            this.position.copy(prevPos);
            this._up.copy(this.position).normalize();
            continue;
          }

          const snapTolerance = this.isGrounded ? 0.22 : 0.06;
          if (curRadialSpeed <= 0.05 && newRadius <= groundRadius + snapTolerance) {
            this.currentRadius = groundRadius;
            this.position.copy(this._up).multiplyScalar(groundRadius);
            const vDot = this.velocity.dot(this._up);
            if (vDot < 0) {
              this.velocity.addScaledVector(this._up, -vDot);
            }
            this.isGrounded = true;
            continue;
          }
        }
      }

      if (newRadius < 25.5) {
        this.currentRadius = 25.5;
        this.position.copy(this._up).multiplyScalar(25.5);
        const vDot = this.velocity.dot(this._up);
        if (vDot < 0) this.velocity.addScaledVector(this._up, -vDot);
        this.isGrounded = true;
      } else {
        this.currentRadius = newRadius;
        this.isGrounded = false;
      }
    }

    // Trigger elastic landing squash when touching down from a jump
    if (!wasGrounded && this.isGrounded) {
      this.landingSquash = 1.0;
    }
    this.radialSpeed = this.velocity.dot(this._up);
  }

  private resolveHorizontalWallCollisions(colliders: THREE.Object3D[]): void {
    if (colliders.length === 0) return;

    const t1 = new THREE.Vector3(1, 0, 0);
    if (Math.abs(t1.dot(this._up)) > 0.9) t1.set(0, 0, 1);
    t1.addScaledVector(this._up, -t1.dot(this._up)).normalize();
    const t2 = new THREE.Vector3().crossVectors(this._up, t1).normalize();

    const heights = [0.42, 1.05];
    const angles = [
      0,
      Math.PI * 0.25,
      Math.PI * 0.5,
      Math.PI * 0.75,
      Math.PI,
      -Math.PI * 0.75,
      -Math.PI * 0.5,
      -Math.PI * 0.25,
    ];

    for (const h of heights) {
      this._rayOrigin.copy(this.position).addScaledVector(this._up, h);
      for (const ang of angles) {
        this._rayDir
          .copy(t1)
          .multiplyScalar(Math.cos(ang))
          .addScaledVector(t2, Math.sin(ang));
        this.wallRaycaster.set(this._rayOrigin, this._rayDir);
        this.wallRaycaster.near = 0.02;
        this.wallRaycaster.far = this.wallRadius;

        const hits = this.wallRaycaster.intersectObjects(colliders, true);
        if (hits.length > 0 && hits[0].distance < this.wallRadius) {
          const pushDist = this.wallRadius - hits[0].distance;
          this.position.addScaledVector(this._rayDir, -pushDist);
          this._rayOrigin.addScaledVector(this._rayDir, -pushDist);

          const velIntoWall = this.velocity.dot(this._rayDir);
          if (velIntoWall > 0) {
            this.velocity.addScaledVector(this._rayDir, -velIntoWall);
          }
        }
      }
    }
  }

  public resolveCameraCollision(
    desiredCamPos: THREE.Vector3,
    colliders: THREE.Object3D[]
  ): THREE.Vector3 {
    const headPivot = this.position.clone().addScaledVector(this._up, 1.25);
    const camVec = desiredCamPos.clone().sub(headPivot);
    const maxDist = camVec.length();
    if (maxDist < 0.1 || colliders.length === 0) return desiredCamPos;

    camVec.divideScalar(maxDist);
    this.camRaycaster.set(headPivot, camVec);
    this.camRaycaster.near = 0.2;
    this.camRaycaster.far = maxDist;

    const hits = this.camRaycaster.intersectObjects(colliders, true);
    if (hits.length > 0 && hits[0].distance < maxDist) {
      const safeDist = Math.max(hits[0].distance - 0.35, 1.15);
      return headPivot.addScaledVector(camVec, safeDist);
    }
    return desiredCamPos;
  }
}

export class PhysicsLoop {
  public controller: SphericalPlayerController;
  public isColliderReady: boolean = false;
  private colliders: THREE.Object3D[] = [];

  constructor(colliderMesh?: THREE.Mesh) {
    this.controller = new SphericalPlayerController();
    if (colliderMesh) {
      this.setCollider(colliderMesh);
    }
  }

  public setCollider(mesh: THREE.Mesh) {
    if (!this.colliders.includes(mesh)) {
      this.colliders.push(mesh);
    }
    this.isColliderReady = true;
  }

  public addCollider(object: THREE.Object3D) {
    if (!this.colliders.includes(object)) {
      this.colliders.push(object);
    }
  }

  public getColliders(): THREE.Object3D[] {
    return this.colliders;
  }

  public snapToGround(character: CharacterPhysicsState): boolean {
    this.controller.position.copy(character.position);
    this.controller.currentRadius = character.position.length();

    const up = character.position.clone().normalize();
    if (up.lengthSq() < 0.001) up.set(0, 1, 0);

    const collider = this.colliders[0] as THREE.Mesh | undefined;
    if (collider) {
      const rayOrigin = character.position.clone().addScaledVector(up, 3.0);
      const raycaster = new THREE.Raycaster(rayOrigin, up.clone().negate(), 0, 15);
      const hits = raycaster.intersectObject(collider, true);
      if (hits.length > 0) {
        const hitPoint = hits[0].point;
        character.position.copy(hitPoint);
        character.velocity.set(0, 0, 0);
        character.isGrounded = true;

        this.controller.position.copy(hitPoint);
        this.controller.currentRadius = hitPoint.length();
        this.controller.velocity.set(0, 0, 0);
        this.controller.isGrounded = true;
        this.controller.airBlend = 0;
        return true;
      } else if (collider.geometry && (collider.geometry as any).boundsTree) {
        const closest = (collider.geometry as any).boundsTree.closestPointToPoint(character.position);
        if (closest && closest.point) {
          character.position.copy(closest.point);
          character.velocity.set(0, 0, 0);
          character.isGrounded = true;

          this.controller.position.copy(closest.point);
          this.controller.currentRadius = closest.point.length();
          this.controller.velocity.set(0, 0, 0);
          this.controller.isGrounded = true;
          this.controller.airBlend = 0;
          return true;
        }
      }
    }
    return false;
  }

  public update(
    delta: number,
    character: CharacterPhysicsState,
    _input: { x: number; y: number; jump: boolean; sprint: boolean },
    camera?: THREE.Camera
  ) {
    if (camera) {
      this.controller.update(delta, camera, this.colliders, false);
      character.position.copy(this.controller.position);
      character.quaternion.copy(this.controller.quaternion);
      character.isGrounded = this.controller.isGrounded;
      character.velocity.copy(this.controller.velocity);
    }
  }
}
