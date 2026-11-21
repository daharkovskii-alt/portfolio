"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const scrollProgress = { value: 0 };

const mouseV1 = {
  raw: { x: 0, y: 0 },
  smooth: { x: 0, y: 0 },
  cam: { x: 0, y: 0 },
};

function ChromeCrossV1() {
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
    const p = scrollProgress.value;

    mouseV1.smooth.x += (mouseV1.raw.x - mouseV1.smooth.x) * 0.07;
    mouseV1.smooth.y += (mouseV1.raw.y - mouseV1.smooth.y) * 0.07;

    const idleRock = Math.sin(clock.elapsedTime * 0.18) * 0.04;
    const mouseTiltY = mouseV1.smooth.x * 0.38;
    const mouseTiltX = mouseV1.smooth.y * -0.24;

    groupRef.current.rotation.y =
      idleRock + mouseTiltY + THREE.MathUtils.lerp(-0.15, Math.PI * 1.25, p);
    groupRef.current.rotation.x =
      mouseTiltX + THREE.MathUtils.lerp(0.08, Math.PI * 0.08, p);
    groupRef.current.rotation.z =
      Math.sin(clock.elapsedTime * 0.12) * 0.02 * (1 - p);

    groupRef.current.position.x = mouseV1.smooth.x * -0.2 * (1 - p);

    const scale = THREE.MathUtils.lerp(1.85, 0.45, p);
    groupRef.current.scale.setScalar(scale);

    groupRef.current.position.z = THREE.MathUtils.lerp(0, -6, p);
    groupRef.current.position.y =
      mouseV1.smooth.y * -0.12 * (1 - p) +
      THREE.MathUtils.lerp(0.1, -0.6, p);
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

function CameraParallaxV1() {
  const { camera } = useThree();

  useFrame(() => {
    mouseV1.cam.x += (mouseV1.raw.x * 1.1 - mouseV1.cam.x) * 0.09;
    mouseV1.cam.y += (mouseV1.raw.y * 0.75 - mouseV1.cam.y) * 0.09;
    camera.position.x = mouseV1.cam.x;
    camera.position.y = mouseV1.cam.y;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function CrossSceneV1({
  heroRef,
}: {
  heroRef: React.RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseV1.raw.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseV1.raw.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to(scrollProgress, {
        value: 1,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
        },
      });
    });

    return () => ctx.revert();
  }, [heroRef]);

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
        <ChromeCrossV1 />
      </Suspense>
      <CameraParallaxV1 />
    </Canvas>
  );
}

useGLTF.preload("/assets/cross.glb");
