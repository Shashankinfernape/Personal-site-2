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
  // Verbatim initial coordinates from presentScene in App3D.js
  public position = new THREE.Vector3(5.81095, 5.80205, 25.7794);
  public velocity = new THREE.Vector3();
  public quaternion = new THREE.Quaternion();
  public currentRadius = 27.05;
  public isGrounded = true;
  public walkPhase = 0;
  public speedRatio = 0;
  public airBlend = 0; // 0 = grounded, 1 = airborne (drives mid-air jump/fall pose)

  public readonly capsuleRadius = 0.38;
  public readonly capsuleHeight = 1.7;

  private groundedTimer = 0.16; // Coyote-time buffer so SPACE jump always registers
  private jumpCooldown = 0;
  private keys = new Set<string>();

  private readonly raycaster = new THREE.Raycaster();
  private readonly camRaycaster = new THREE.Raycaster();

  private readonly _up = new THREE.Vector3();
  private readonly _forward = new THREE.Vector3();
  private readonly _right = new THREE.Vector3();
  private readonly _moveDir = new THREE.Vector3();
  private readonly _rayOrigin = new THREE.Vector3();
  private readonly _rayDir = new THREE.Vector3();

  // Reusable BVH capsule collision objects (zero GC allocations per frame)
  private readonly _capsuleSeg = new THREE.Line3();
  private readonly _prevCapsuleStart = new THREE.Vector3();
  private readonly _capsuleBox = new THREE.Box3();
  private readonly _triPoint = new THREE.Vector3();
  private readonly _segPoint = new THREE.Vector3();
  private readonly _triNormal = new THREE.Vector3();
  private readonly _pushDir = new THREE.Vector3();
  private readonly _stepDisplacement = new THREE.Vector3();

  constructor() {
    this.raycaster.firstHitOnly = true;
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
    this._up.copy(this.position).normalize();
    if (this._up.lengthSq() < 0.001) this._up.set(0, 1, 0);

    if (this.jumpCooldown > 0) this.jumpCooldown -= safeDt;

    // 1. Read movement keys
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

    if (hasInput) {
      this._moveDir
        .set(0, 0, 0)
        .addScaledVector(this._forward, moveZ)
        .addScaledVector(this._right, moveX)
        .normalize();

      // Face +Z forward into movement direction
      const lookMat = new THREE.Matrix4().lookAt(
        this._moveDir,
        new THREE.Vector3(0, 0, 0),
        this._up
      );
      const targetQuat = new THREE.Quaternion().setFromRotationMatrix(lookMat);
      this.quaternion.slerp(targetQuat, 1.0 - Math.exp(-16.0 * safeDt));

      const targetSpeed = isSprinting ? 4.4 : 3.2;
      const accel = this.isGrounded ? 18.0 : 10.0;
      const desiredTangent = this._moveDir.clone().multiplyScalar(targetSpeed);
      tangentVel.lerp(desiredTangent, 1.0 - Math.exp(-accel * safeDt));

      this.speedRatio = THREE.MathUtils.damp(
        this.speedRatio,
        isSprinting ? 1.0 : 0.65,
        10,
        safeDt
      );
      this.walkPhase += safeDt * (isSprinting ? 7.6 : 5.8);
    } else {
      const friction = this.isGrounded ? 12.0 : 4.0;
      tangentVel.multiplyScalar(Math.exp(-friction * safeDt));
      this.speedRatio = THREE.MathUtils.damp(this.speedRatio, 0, 10, safeDt);

      const curForward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.quaternion);
      curForward.addScaledVector(this._up, -curForward.dot(this._up)).normalize();
      if (curForward.lengthSq() > 0.001) {
        const lookMat = new THREE.Matrix4().lookAt(
          curForward,
          new THREE.Vector3(0, 0, 0),
          this._up
        );
        this.quaternion.setFromRotationMatrix(lookMat);
      }
    }

    // 3. Natural Hop (7.2 m/s impulse + asymmetric -30 / -44 m/s^2 gravity)
    const holdingJump =
      !controlsLocked &&
      (this.keys.has('Space') || this.keys.has(' ') || this.keys.has('KeyJ'));
    if (holdingJump && this.groundedTimer > 0 && this.jumpCooldown <= 0) {
      radialSpeed = 7.2; // Natural ~0.85m hop
      this.isGrounded = false;
      this.groundedTimer = 0;
      this.jumpCooldown = 0.22;
    }

    // Asymmetric gravity: natural descent
    if (!this.isGrounded) {
      const gravity =
        radialSpeed > 0 ? (holdingJump ? -30.0 : -38.0) : -44.0;
      radialSpeed = Math.max(radialSpeed + gravity * safeDt, -20.0);
    }

    // Recombine tangent + radial velocity
    this.velocity.copy(tangentVel).addScaledVector(this._up, radialSpeed);

    // 4. Sub-stepped integration with true 3D BVH Capsule Shapecast
    const subSteps = 3;
    const subDt = safeDt / subSteps;
    const primaryCollider = colliders[0] as THREE.Mesh | undefined;
    const bvh = primaryCollider?.geometry && (primaryCollider.geometry as any).boundsTree;

    for (let s = 0; s < subSteps; s++) {
      this.position.addScaledVector(this.velocity, subDt);
      this._up.copy(this.position).normalize();

      if (bvh) {
        // Setup capsule in world space along spherical _up
        this._capsuleSeg.start.copy(this.position).addScaledVector(this._up, this.capsuleRadius);
        this._capsuleSeg.end.copy(this.position).addScaledVector(this._up, this.capsuleHeight - this.capsuleRadius);
        this._prevCapsuleStart.copy(this._capsuleSeg.start);

        this._capsuleBox.setFromPoints([this._capsuleSeg.start, this._capsuleSeg.end]).expandByScalar(this.capsuleRadius);

        let groundedThisStep = false;

        bvh.shapecast({
          intersectsBounds: (box: THREE.Box3) => box.intersectsBox(this._capsuleBox),
          intersectsTriangle: (tri: any) => {
            const dist = tri.closestPointToSegment(this._capsuleSeg, this._triPoint, this._segPoint);
            if (dist < this.capsuleRadius) {
              const penetration = this.capsuleRadius - dist;
              this._pushDir.subVectors(this._segPoint, this._triPoint);
              if (this._pushDir.lengthSq() < 1e-8) {
                tri.getNormal(this._pushDir);
              } else {
                this._pushDir.normalize();
              }
              this._capsuleSeg.start.addScaledVector(this._pushDir, penetration);
              this._capsuleSeg.end.addScaledVector(this._pushDir, penetration);

              tri.getNormal(this._triNormal);
              // Floor condition: push direction points upward, and triangle slope is walkable
              if (this._pushDir.dot(this._up) > 0.15 && this._triNormal.dot(this._up) > 0.45) {
                groundedThisStep = true;
              }
            }
            return false;
          }
        });

        // Displace position out of all collided triangles
        this._stepDisplacement.subVectors(this._capsuleSeg.start, this._prevCapsuleStart);
        this.position.add(this._stepDisplacement);
        this.currentRadius = this.position.length();

        // Tangent wall/rock velocity cancellation (slides smoothly along obstacles)
        if (this._stepDisplacement.lengthSq() > 1e-8) {
          const pushNorm = this._stepDisplacement.clone().normalize();
          const vDot = this.velocity.dot(pushNorm);
          if (vDot < 0) {
            this.velocity.addScaledVector(pushNorm, -vDot);
          }
        }

        if (groundedThisStep) {
          this.isGrounded = true;
          const vRad = this.velocity.dot(this._up);
          if (vRad < 0) {
            this.velocity.addScaledVector(this._up, -vRad);
          }
        } else {
          // Downward step-down probe to smoothly stick to ground when descending slopes/stairs
          this._rayOrigin.copy(this.position).addScaledVector(this._up, 0.1);
          this._rayDir.copy(this._up).negate();
          this.raycaster.set(this._rayOrigin, this._rayDir);
          this.raycaster.near = 0.01;
          this.raycaster.far = 0.35;
          const hits = this.raycaster.intersectObject(primaryCollider, true);
          if (hits.length > 0 && this.velocity.dot(this._up) <= 0.05) {
            this.position.copy(hits[0].point);
            this.isGrounded = true;
            const vRad = this.velocity.dot(this._up);
            if (vRad < 0) this.velocity.addScaledVector(this._up, -vRad);
          } else {
            this.isGrounded = false;
          }
        }

        // Overhead ceiling collision check while rising
        if (this.velocity.dot(this._up) > 0) {
          this._rayOrigin.copy(this.position).addScaledVector(this._up, this.capsuleHeight * 0.8);
          this.raycaster.set(this._rayOrigin, this._up);
          this.raycaster.near = 0.05;
          this.raycaster.far = 0.6;
          const ceilHits = this.raycaster.intersectObjects(colliders, true);
          if (ceilHits.length > 0) {
            const vRad = this.velocity.dot(this._up);
            if (vRad > 0) this.velocity.addScaledVector(this._up, -vRad);
          }
        }
      }
    }

    // 5. Update Coyote Time & Mid-Air Blend
    if (this.isGrounded) {
      this.groundedTimer = 0.16;
      this.airBlend = THREE.MathUtils.damp(this.airBlend, 0, 18, safeDt);
    } else {
      this.groundedTimer = Math.max(0, this.groundedTimer - safeDt);
      this.airBlend = THREE.MathUtils.damp(this.airBlend, 1, 14, safeDt);
    }
  }

  // Camera Spring-Arm Raycast: pulls camera in front of walls/rocks
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
    }
  }
}
