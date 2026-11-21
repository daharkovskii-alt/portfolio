"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Proximity radius in px — how close the cursor must be to the cross center
const PROXIMITY_PX = 320;

const state = {
  // raw mouse in viewport px
  mx: 0,
  my: 0,
  // normalized influence [-1..1], fades to 0 outside radius
  raw: { x: 0, y: 0 },
  smooth: { x: 0, y: 0 },
  cam: { x: 0, y: 0 },
  // canvas center in px (updated on mousemove)
  cx: 0,
  cy: 0,
};

function ChromeCross({ scale, offsetY }: { scale: number; offsetY: number }) {
  const { scene } = useGLTF("/assets/cross.glb");
  const groupRef = useRef<THREE.Group>(null);

  const chromeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        metalness: 1.0,
        roughness: 0.04,
        color: new THREE.Color("#b8b8b8"),
        envMapIntensity: 3.5,
      }),
    []
  );

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center);

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = chromeMaterial;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene, chromeMaterial]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // Smooth lerp toward target influence
    state.smooth.x += (state.raw.x - state.smooth.x) * 0.07;
    state.smooth.y += (state.raw.y - state.smooth.y) * 0.07;

    const sx = state.smooth.x;
    const sy = state.smooth.y;

    groupRef.current.rotation.y =
      clock.elapsedTime * 0.52 + sx * 0.38;

    groupRef.current.rotation.x =
      sy * -0.24 + Math.sin(clock.elapsedTime * 0.3) * 0.04;

    groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.2) * 0.02;

    groupRef.current.scale.setScalar(scale);
    groupRef.current.position.x = sx * -0.15;
    groupRef.current.position.y = offsetY + sy * -0.1;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

function CameraParallax() {
  const { camera } = useThree();

  useFrame(() => {
    state.cam.x += (state.smooth.x * 1.1 - state.cam.x) * 0.09;
    state.cam.y += (state.smooth.y * 0.75 - state.cam.y) * 0.09;
    camera.position.x = state.cam.x;
    camera.position.y = state.cam.y;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function SceneLoader() {
  return (
    <mesh>
      <boxGeometry args={[0.01, 0.01, 0.01]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

export function CrossScene({
  scale = 0.26,
  offsetY = 0.22,
}: {
  scale?: number;
  offsetY?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      state.mx = e.clientX;
      state.my = e.clientY;

      // Get canvas center in viewport coords
      const el = containerRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        state.cx = rect.left + rect.width / 2;
        state.cy = rect.top + rect.height / 2;
      }

      const dx = state.mx - state.cx;
      const dy = state.my - state.cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Smooth falloff: 1 at center, 0 at PROXIMITY_PX
      const influence = Math.max(0, 1 - dist / PROXIMITY_PX);
      // Ease the falloff curve
      const eased = influence * influence;

      state.raw.x = (dx / PROXIMITY_PX) * eased * 2;
      state.raw.y = -(dy / PROXIMITY_PX) * eased * 2;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45, near: 0.1, far: 100 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 1.5]}
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <ambientLight intensity={0.04} />
        <directionalLight
          position={[8, 14, 6]}
          intensity={5}
          color="#ffffff"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.1}
          shadow-camera-far={50}
        />
        <directionalLight position={[-7, -3, -5]} intensity={1.2} color="#1a3a8a" />
        <pointLight position={[4, 6, 4]} intensity={2.5} color="#ffffff" />
        <spotLight
          position={[0, 10, 2]}
          angle={0.35}
          penumbra={0.9}
          intensity={4}
          color="#ffffff"
          castShadow
        />
        <pointLight position={[-3, 2, 2]} intensity={0.8} color="#8899cc" />
        <Environment preset="warehouse" />
        <Suspense fallback={<SceneLoader />}>
          <ChromeCross scale={scale} offsetY={offsetY} />
        </Suspense>
        <CameraParallax />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/assets/cross.glb");
