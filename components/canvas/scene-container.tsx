"use client";

import { Suspense, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import CameraController from "./camera-controller";
import ParticleField from "./particle-field";
import ThreatMatrix3D from "./threat-matrix-3d";
import HologramShield from "./hologram-shield";
import { useReducedMotionPreference } from "@/lib/motion";

const emptySubscribe = () => () => {};

function getMountedSnapshot() {
  return true;
}

function getMountedServerSnapshot() {
  return false;
}

function isWebGLSupported(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export default function SceneContainer() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    getMountedSnapshot,
    getMountedServerSnapshot
  );

  const reducedMotion = useReducedMotionPreference();

  if (!isMounted) {
    return null;
  }

  // Graceful fallback for environments lacking WebGL support
  const webGLAvailable = isWebGLSupported();
  if (!webGLAvailable) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,45,85,0.12),rgba(5,5,7,0))]"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 7], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
        >
          {/* Ambient & cinematic key lighting */}
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 4, 4]} intensity={14} color="#FF2D55" />
          <pointLight position={[-5, -4, -2]} intensity={7} color="#A8002B" />

          {/* Synchronized 3D Camera Rig */}
          <CameraController reducedMotion={reducedMotion} />

          {/* Global Ambient Cyber Particle Field (1,500 particles) */}
          <ParticleField reducedMotion={reducedMotion} />

          {/* Interactive 3D Holographic Shield in Hero Sector */}
          <HologramShield reducedMotion={reducedMotion} />

          {/* 3D Threat Telemetry Matrix & Cyber Rings */}
          <ThreatMatrix3D reducedMotion={reducedMotion} />
        </Canvas>
      </Suspense>
    </div>
  );
}
