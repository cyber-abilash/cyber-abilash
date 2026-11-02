"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const terminalMessages = [
  "INITIALIZING SECURITY PROTOCOL...",
  "SCANNING GLOBAL NETWORK...",
  "ANALYZING NETWORK NODES...",
  "MONITORING SYSTEM TRAFFIC...",
  "THREAT DETECTION: ACTIVE",
  "SECURITY STATUS: OPERATIONAL",
];

function GlobeModel() {
  const globeRef = useRef<THREE.Group>(null);

  const nodeGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const count = 320;
    const radius = 1.22;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const ringRadius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;

      points.push(
        new THREE.Vector3(
          Math.cos(theta) * ringRadius * radius,
          y * radius,
          Math.sin(theta) * ringRadius * radius
        )
      );
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useFrame((state, delta) => {
    if (!globeRef.current) return;

    globeRef.current.rotation.y += delta * 0.12;
    globeRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
  });

  return (
    <group ref={globeRef}>
      <mesh>
        <sphereGeometry args={[1.2, 48, 48]} />
        <meshStandardMaterial
          color="#10050a"
          emissive="#450014"
          emissiveIntensity={0.7}
          roughness={0.75}
          metalness={0.3}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.215, 48, 48]} />
        <meshBasicMaterial
          color="#ff2d55"
          wireframe
          transparent
          opacity={0.32}
        />
      </mesh>

      <points geometry={nodeGeometry}>
        <pointsMaterial
          color="#ff5575"
          size={0.027}
          sizeAttenuation
          transparent
          opacity={0.95}
        />
      </points>

      <mesh rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[1.48, 0.009, 8, 140]} />
        <meshBasicMaterial
          color="#ff2d55"
          transparent
          opacity={0.75}
        />
      </mesh>

      <mesh rotation={[0.5, 0.3, Math.PI / 2.8]}>
        <torusGeometry args={[1.58, 0.005, 8, 140]} />
        <meshBasicMaterial
          color="#ff5575"
          transparent
          opacity={0.4}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.72, 0.004, 8, 140]} />
        <meshBasicMaterial
          color="#a8002b"
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

function HudCorner({ className }: { className: string }) {
  return (
    <div
      className={`pointer-events-none absolute h-7 w-7 border-[#ff2d55]/60 ${className}`}
    />
  );
}

export default function CyberGlobe() {
  const [terminalIndex, setTerminalIndex] = useState(0);
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const terminalTimer = window.setInterval(() => {
      setTerminalIndex((current) => (current + 1) % terminalMessages.length);
    }, 2400);

    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour12: false,
          timeZone: "UTC",
        })
      );
    };

    updateTime();
    const clockTimer = window.setInterval(updateTime, 1000);

    return () => {
      window.clearInterval(terminalTimer);
      window.clearInterval(clockTimer);
    };
  }, []);

  return (
    <div className="relative mx-auto h-[470px] w-full max-w-[650px] overflow-hidden sm:h-[540px] md:h-[620px]">

      {/* ATMOSPHERIC GLOW */}
      <div className="pointer-events-none absolute inset-10 rounded-full bg-[#ff2d55]/10 blur-[100px]" />

      {/* SCANNING GRID */}
      <div className="classified-grid pointer-events-none absolute inset-0 opacity-30" />

      {/* 3D GLOBE */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.8} />

          <pointLight
            position={[3, 3, 4]}
            intensity={18}
            color="#ff2d55"
          />

          <pointLight
            position={[-3, -2, -3]}
            intensity={8}
            color="#a8002b"
          />

          <GlobeModel />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableDamping
            dampingFactor={0.06}
            rotateSpeed={0.55}
          />
        </Canvas>
      </div>

      {/* RADAR SCAN */}
      <div className="pointer-events-none absolute inset-[12%] flex items-center justify-center">
        <div className="absolute h-[85%] w-[85%] rounded-full border border-[#ff2d55]/15" />
        <div className="absolute h-[70%] w-[70%] rounded-full border border-dashed border-[#ff2d55]/20" />

        <div className="absolute h-[90%] w-[90%] animate-spin rounded-full border-t border-[#ff2d55]/50 [animation-duration:12s]" />

        <div className="absolute h-[45%] w-[45%] animate-ping rounded-full border border-[#ff2d55]/20 [animation-duration:4s]" />
      </div>

      {/* FLOATING NETWORK NODES */}
      <div className="pointer-events-none absolute left-[17%] top-[28%]">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff2d55] opacity-70" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-[#ff5575]" />
        </span>
      </div>

      <div className="pointer-events-none absolute right-[17%] top-[35%]">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff2d55] opacity-70" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-[#ff5575]" />
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-[27%] left-[23%]">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff2d55] opacity-70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#ff5575]" />
        </span>
      </div>

      {/* HUD CORNERS */}
      <HudCorner className="left-4 top-4 border-l border-t" />
      <HudCorner className="right-4 top-4 border-r border-t" />
      <HudCorner className="bottom-4 left-4 border-b border-l" />
      <HudCorner className="bottom-4 right-4 border-b border-r" />

      {/* TOP STATUS */}
      <div className="absolute left-8 top-8 flex items-center gap-2 text-[9px] tracking-[0.2em] text-[#ff5575] sm:text-[10px]">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff2d55]" />
        SYSTEM ONLINE
      </div>

      <div className="absolute right-8 top-8 text-[9px] tracking-[0.15em] text-gray-500 sm:text-[10px]">
        UTC {time}
      </div>

      {/* LEFT DATA PANEL */}
      <div className="absolute left-5 top-1/2 hidden -translate-y-1/2 space-y-5 text-[9px] tracking-wider sm:block">
        <div>
          <p className="text-gray-600">NETWORK</p>
          <p className="mt-1 text-[#ff5575]">GLOBAL / SECURE</p>
        </div>

        <div>
          <p className="text-gray-600">ENCRYPTION</p>
          <p className="mt-1 text-[#ff5575]">AES-256</p>
        </div>

        <div>
          <p className="text-gray-600">PROTOCOL</p>
          <p className="mt-1 text-[#ff5575]">TLS 1.3</p>
        </div>
      </div>

      {/* RIGHT DATA PANEL */}
      <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 space-y-5 text-right text-[9px] tracking-wider sm:block">
        <div>
          <p className="text-gray-600">THREAT MONITOR</p>
          <p className="mt-1 text-[#ff5575]">ACTIVE</p>
        </div>

        <div>
          <p className="text-gray-600">FIREWALL</p>
          <p className="mt-1 text-[#ff5575]">ENABLED</p>
        </div>

        <div>
          <p className="text-gray-600">NODE STATUS</p>
          <p className="mt-1 text-[#ff5575]">CONNECTED</p>
        </div>
      </div>

      {/* TERMINAL */}
      <div className="absolute bottom-12 left-1/2 w-[82%] max-w-[350px] -translate-x-1/2 rounded-lg border border-[#ff2d55]/25 bg-black/80 p-3 shadow-[0_0_35px_rgba(255,45,85,0.12)] backdrop-blur-xl sm:bottom-10">
        <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-[9px] tracking-[0.2em] text-gray-400">
            ROOT / SECURITY TERMINAL
          </span>

          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          </span>
        </div>

        <div className="flex min-h-5 items-center gap-2 font-mono text-[9px] text-[#ff5575] sm:text-[10px]">
          <span className="text-gray-500">&gt;_</span>
          <span>{terminalMessages[terminalIndex]}</span>
          <span className="h-3 w-1 animate-pulse bg-[#ff2d55]" />
        </div>
      </div>

      {/* BOTTOM LABEL */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#ff2d55]/25 bg-black/80 px-4 py-1.5 text-[8px] tracking-[0.25em] text-[#ff5575] sm:text-[9px]">
        CLASSIFIED NETWORK // CYBER ABILASH
      </div>

    </div>
  );
}