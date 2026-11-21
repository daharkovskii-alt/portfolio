"use client";

import { useEffect, useRef } from "react";

export function Grain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 200;
    canvas.width = SIZE;
    canvas.height = SIZE;

    function generateNoise() {
      const imageData = ctx!.createImageData(SIZE, SIZE);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.floor(Math.random() * 255);
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 255;
      }

      ctx!.putImageData(imageData, 0, 0);
    }

    let lastTime = 0;
    function loop(time: number) {
      if (time - lastTime > 50) {
        generateNoise();
        lastTime = time;
      }
      frameRef.current = requestAnimationFrame(loop);
    }

    frameRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9000] pointer-events-none w-full h-full"
      style={{
        opacity: 0.055,
        mixBlendMode: "overlay",
        imageRendering: "pixelated",
        backgroundRepeat: "repeat",
      }}
    />
  );
}
