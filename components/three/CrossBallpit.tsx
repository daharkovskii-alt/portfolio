"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// ─── Physics ──────────────────────────────────────────────────────────────────

interface PhysicsConfig {
  count: number;
  gravity: number;
  friction: number;
  wallBounce: number;
  maxVelocity: number;
  maxX: number;
  maxYTop: number;
  maxYBottom: number;
  maxZ: number;
  minSize: number;
  maxSize: number;
}

// reusable vectors — allocated once, never inside loops
const _pos  = new THREE.Vector3();
const _vel  = new THREE.Vector3();
const _posB = new THREE.Vector3();
const _velB = new THREE.Vector3();
const _diff = new THREE.Vector3();
const _imp  = new THREE.Vector3();

class CrossPhysics {
  config: PhysicsConfig;
  positionData: Float32Array;
  velocityData: Float32Array;
  sizeData: Float32Array;

  constructor(config: PhysicsConfig) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count).fill(0);
    this.velocityData = new Float32Array(3 * config.count).fill(0);
    this.sizeData = new Float32Array(config.count).fill(1);
    this.#init();
  }

  #init() {
    const { config: c, positionData: p } = this;
    for (let i = 0; i < c.count; i++) {
      const b = 3 * i;
      p[b]     = (Math.random() - 0.5) * 2 * c.maxX;
      p[b + 1] = c.maxYBottom + Math.random() * (c.maxYTop - c.maxYBottom);
      p[b + 2] = (Math.random() - 0.5) * 2 * c.maxZ;
      this.sizeData[i] = c.minSize + Math.random() * (c.maxSize - c.minSize);
    }
  }

  pushFromCursor(cursorWorld: THREE.Vector3, radius: number, strength: number) {
    const { positionData: p, velocityData: v, sizeData: s, config: c } = this;
    for (let i = 0; i < c.count; i++) {
      const b = 3 * i;
      _pos.fromArray(p, b);
      _diff.copy(_pos).sub(cursorWorld);
      _diff.z = 0; // push only in XY plane
      const dist = _diff.length();
      const pushRadius = radius + s[i];
      if (dist < pushRadius && dist > 0.001) {
        const force = (1 - dist / pushRadius) * strength;
        _vel.fromArray(v, b);
        _vel.addScaledVector(_diff.normalize(), force);
        _vel.clampLength(0, c.maxVelocity * 3);
        _vel.toArray(v, b);
      }
    }
  }

  update(delta: number) {
    const { config: c, positionData: p, velocityData: v, sizeData: s } = this;

    // integrate velocity
    for (let i = 0; i < c.count; i++) {
      const b = 3 * i;
      _pos.fromArray(p, b);
      _vel.fromArray(v, b);

      _vel.y -= delta * c.gravity * s[i];
      _vel.multiplyScalar(c.friction);
      _vel.clampLength(0, c.maxVelocity);
      _pos.add(_vel);

      _pos.toArray(p, b);
      _vel.toArray(v, b);
    }

    // collisions
    for (let i = 0; i < c.count; i++) {
      const bi = 3 * i;
      _pos.fromArray(p, bi);
      _vel.fromArray(v, bi);
      const ri = s[i];

      for (let j = i + 1; j < c.count; j++) {
        const bj = 3 * j;
        _posB.fromArray(p, bj);
        _velB.fromArray(v, bj);
        const rj = s[j];

        _diff.copy(_posB).sub(_pos);
        const dist = _diff.length();
        const minDist = ri + rj;

        if (dist < minDist && dist > 0.0001) {
          const overlap = (minDist - dist) * 0.5;
          _imp.copy(_diff).normalize().multiplyScalar(overlap);

          _pos.sub(_imp);
          _posB.add(_imp);

          const push  = Math.max(_vel.length(),  0.5);
          const pushB = Math.max(_velB.length(), 0.5);
          _vel.addScaledVector(_imp.clone().normalize(), -push);
          _velB.addScaledVector(_imp.clone().normalize(),  pushB);

          _pos.toArray(p, bi);
          _vel.toArray(v, bi);
          _posB.toArray(p, bj);
          _velB.toArray(v, bj);
        }
      }

      // walls
      if (Math.abs(_pos.x) + ri > c.maxX) {
        _pos.x = Math.sign(_pos.x) * (c.maxX - ri);
        _vel.x = -_vel.x * c.wallBounce;
      }
      if (_pos.y + ri > c.maxYTop) {
        _pos.y = c.maxYTop - ri;
        _vel.y = -_vel.y * c.wallBounce;
      }
      if (_pos.y - ri < c.maxYBottom) {
        _pos.y = c.maxYBottom + ri;
        _vel.y = -_vel.y * c.wallBounce;
      }
      if (Math.abs(_pos.z) + ri > c.maxZ) {
        _pos.z = Math.sign(_pos.z) * (c.maxZ - ri);
        _vel.z = -_vel.z * c.wallBounce;
      }

      _pos.toArray(p, bi);
      _vel.toArray(v, bi);
    }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CrossBallpitProps {
  count?: number;
  photoFraction?: number;
}

export function CrossBallpit({ count = 20, photoFraction = 0.56 }: CrossBallpitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const el = canvas; // stable ref for closures

    const parent = canvas.parentElement!;
    let width  = parent.offsetWidth;
    let height = parent.offsetHeight;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.shadowMap.enabled = false;

    // ── Scene / camera ──
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 20);

    // ── Environment (chrome reflections) ──
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // ── Static fill lights ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    const rimLight = new THREE.DirectionalLight(0xffffff, 3);
    rimLight.position.set(-6, 8, -4);
    scene.add(rimLight);

    const backLight = new THREE.DirectionalLight(0x3355aa, 1.5);
    backLight.position.set(6, -4, -6);
    scene.add(backLight);

    // ── Cursor follow light — this reflects in the chrome ──
    const cursorLight = new THREE.PointLight(0xffffff, 0, 18);
    cursorLight.position.set(0, 0, 6);
    scene.add(cursorLight);

    // secondary warm light, offset slightly
    const cursorLight2 = new THREE.PointLight(0xffe8c0, 0, 12);
    cursorLight2.position.set(0, 0, 5);
    scene.add(cursorLight2);

    // ── World bounds ──
    function getWorldBounds() {
      const fov  = (camera.fov * Math.PI) / 180;
      const dist = camera.position.z;
      const wH   = 2 * Math.tan(fov / 2) * dist;
      const wW   = wH * (width / height);
      return {
        maxX:      wW / 2 - 0.3,
        maxYTop:   wH / 2 - 0.1,
        maxYBottom: wH / 2 - wH * (1 - photoFraction),
        maxZ: 1.2,
      };
    }

    let wb = getWorldBounds();

    // ── Physics ──
    const physicsConfig: PhysicsConfig = {
      count,
      gravity:     0.3,
      friction:    0.994,
      wallBounce:  0.6,
      maxVelocity: 0.12,
      maxX:        wb.maxX,
      maxYTop:     wb.maxYTop,
      maxYBottom:  wb.maxYBottom,
      maxZ:        wb.maxZ,
      minSize:     0.6,
      maxSize:     1.1,
    };

    const physics = new CrossPhysics(physicsConfig);

    // ── Chrome material ──
    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      metalness:         1.0,
      roughness:         0.03,
      color:             new THREE.Color("#c0c0c0"),
      envMapIntensity:   5.0,
      clearcoat:         1.0,
      clearcoatRoughness: 0.05,
      reflectivity:      1.0,
    });

    // ── Load GLB ──
    const dummy = new THREE.Object3D();
    let instancedMesh: THREE.InstancedMesh | null = null;

    const loader = new GLTFLoader();
    loader.load("/assets/cross.glb", (gltf) => {
      const geos: THREE.BufferGeometry[] = [];
      gltf.scene.updateMatrixWorld(true);
      gltf.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const g = mesh.geometry.clone();
          g.applyMatrix4(mesh.matrixWorld);
          geos.push(g);
        }
      });

      const geometry = geos.length > 1 ? mergeGeometries(geos) : geos[0];
      geometry.computeBoundingBox();
      const sz = new THREE.Vector3();
      geometry.boundingBox!.getSize(sz);
      const maxDim = Math.max(sz.x, sz.y, sz.z);
      geometry.scale(1 / maxDim, 1 / maxDim, 1 / maxDim);
      geometry.center();

      instancedMesh = new THREE.InstancedMesh(geometry, chromeMaterial, count);
      scene.add(instancedMesh);
    });

    // ── Per-cross rotation state ──
    const rotations = new Float32Array(count * 3);
    const rotVels   = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const b = 3 * i;
      rotations[b]     = Math.random() * Math.PI * 2;
      rotations[b + 1] = Math.random() * Math.PI * 2;
      rotations[b + 2] = Math.random() * Math.PI * 2;
      rotVels[b]     = (Math.random() - 0.5) * 0.025;
      rotVels[b + 1] = (Math.random() - 0.5) * 0.025;
      rotVels[b + 2] = (Math.random() - 0.5) * 0.012;
    }

    // ── Cursor tracking ──
    const mouse2d   = new THREE.Vector2(-9999, -9999);
    const cursorWorld = new THREE.Vector3(0, 0, 0);
    const raycaster  = new THREE.Raycaster();
    const cursorPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const _hit = new THREE.Vector3();

    // smooth cursor world position
    const cursorWorldTarget = new THREE.Vector3(0, 0, 0);
    let cursorInside = false;
    let cursorLightTarget = 0;

    function onMouseMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      mouse2d.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse2d.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      cursorInside = true;
      cursorLightTarget = 220;

      raycaster.setFromCamera(mouse2d, camera);
      if (raycaster.ray.intersectPlane(cursorPlane, _hit)) {
        cursorWorldTarget.copy(_hit);
      }
    }

    function onMouseLeave() {
      cursorInside = false;
      cursorLightTarget = 0;
    }

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    // ── Animate ──
    let rafId: number;
    let lastTime = performance.now();
    let visible  = true;

    const visObs = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    visObs.observe(el);

    function animate() {
      rafId = requestAnimationFrame(animate);
      if (!visible) return;

      const now   = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // smooth cursor light follow
      cursorWorld.lerp(cursorWorldTarget, 0.12);
      cursorLight.position.set(cursorWorld.x, cursorWorld.y, 6);
      cursorLight2.position.set(cursorWorld.x + 1.5, cursorWorld.y - 1, 5);

      // animate light intensity
      cursorLight.intensity  += (cursorLightTarget - cursorLight.intensity)  * 0.08;
      cursorLight2.intensity += (cursorLightTarget * 0.5 - cursorLight2.intensity) * 0.08;

      // push crosses away from cursor
      if (cursorInside) {
        physics.pushFromCursor(cursorWorld, 2.5, 0.18);
      }

      physics.update(delta);

      if (instancedMesh) {
        for (let i = 0; i < count; i++) {
          const b = 3 * i;
          rotations[b]     += rotVels[b];
          rotations[b + 1] += rotVels[b + 1];
          rotations[b + 2] += rotVels[b + 2];

          dummy.position.fromArray(physics.positionData, b);
          dummy.rotation.set(rotations[b], rotations[b + 1], rotations[b + 2]);
          dummy.scale.setScalar(physics.sizeData[i]);
          dummy.updateMatrix();
          instancedMesh.setMatrixAt(i, dummy.matrix);
        }
        instancedMesh.instanceMatrix.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }

    animate();

    // ── Resize ──
    const ro = new ResizeObserver(() => {
      width  = parent.offsetWidth;
      height = parent.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      wb = getWorldBounds();
      physicsConfig.maxX       = wb.maxX;
      physicsConfig.maxYTop    = wb.maxYTop;
      physicsConfig.maxYBottom = wb.maxYBottom;
    });
    ro.observe(parent);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      visObs.disconnect();
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      renderer.dispose();
      chromeMaterial.dispose();
      instancedMesh?.geometry.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
