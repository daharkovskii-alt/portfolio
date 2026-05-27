"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function ChromeCrossV2() {
  const { scene } = useGLTF("/assets/cross.glb", "/draco/");
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
    // continuous spin on Y axis
    groupRef.current.rotation.y = clock.elapsedTime * 0.8;
    groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.08;
  });

  return (
    <group ref={groupRef} scale={1.4} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

export function CrossSceneV2() {
  return (
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
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.04} />
      <directionalLight position={[8, 14, 6]} intensity={5} color="#ffffff" castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-7, -3, -5]} intensity={1.2} color="#1a3a8a" />
      <pointLight position={[4, 6, 4]} intensity={2.5} color="#ffffff" />
      <spotLight position={[0, 10, 2]} angle={0.35} penumbra={0.9} intensity={4} color="#ffffff" castShadow />
      <pointLight position={[-3, 2, 2]} intensity={0.8} color="#8899cc" />
      <Environment preset="warehouse" />
      <Suspense fallback={null}>
        <ChromeCrossV2 />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/assets/cross.glb", "/draco/");
