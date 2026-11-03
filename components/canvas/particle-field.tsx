"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  reducedMotion?: boolean;
}

// Deterministic pseudo-random number generator ensuring React 19 purity
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed + 1.234) * 43758.5453123;
  return x - Math.floor(x);
}

// Procedural soft glowing circular particle texture
function createParticleTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.25, "rgba(255, 45, 85, 0.85)");
  gradient.addColorStop(0.6, "rgba(255, 45, 85, 0.25)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function ParticleField({
  reducedMotion = false,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const particleTexture = useMemo(() => createParticleTexture(), []);

  // Adaptive particle count based on screen width
  const count = useMemo(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return 500;
    }
    return 1500;
  }, []);

  const [positions, colors, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    const crimson = new THREE.Color("#FF2D55");
    const crimsonLight = new THREE.Color("#FF5575");
    const crimsonDark = new THREE.Color("#A8002B");
    const whiteSpark = new THREE.Color("#FFFFFF");

    for (let i = 0; i < count; i++) {
      // Deterministically spread across 3D cyber tunnel
      const rX = pseudoRandom(i * 3 + 1);
      const rY = pseudoRandom(i * 3 + 2);
      const rZ = pseudoRandom(i * 3 + 3);
      const rColor = pseudoRandom(i * 3 + 4);
      const rSpeed = pseudoRandom(i * 3 + 5);

      pos[i * 3] = (rX - 0.5) * 18;
      pos[i * 3 + 1] = rY * 14 - 10; // -10 to +4 along scroll height
      pos[i * 3 + 2] = (rZ - 0.5) * 12;

      // Color variation
      let chosenColor: THREE.Color;
      if (rColor < 0.65) {
        chosenColor = crimson;
      } else if (rColor < 0.85) {
        chosenColor = crimsonLight;
      } else if (rColor < 0.96) {
        chosenColor = crimsonDark;
      } else {
        chosenColor = whiteSpark;
      }

      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;

      // Drift speed
      spd[i] = 0.15 + rSpeed * 0.35;
    }

    return [pos, col, spd];
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  useFrame((state, delta) => {
    if (!pointsRef.current || reducedMotion) return;

    // Slow ambient rotation of entire galaxy
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;

    // Upward particle drift
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3 + 1; // y coordinate
      array[idx] += delta * speeds[i];

      // Wrap around top boundary
      if (array[idx] > 4.5) {
        array[idx] = -10.5;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.12}
        map={particleTexture ?? undefined}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
